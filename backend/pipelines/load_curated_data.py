import os
import sys
import csv
import time
import sqlite3
import logging
import argparse

# Configurar path para importar desde backend (models, database)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import engine, Base, DB_PATH
from models import Word, Tag, WordTag, Explanation

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(message)s"
)
logger = logging.getLogger(__name__)

# Rutas por defecto
DEFAULT_CURATED_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "db", "datos_curados"))


def clean_tables():
    """
    Elimina y recrea las tablas del diccionario (word_tag, explanation, word, tags)
    utilizando los metadatos de SQLAlchemy.
    No afecta a la tabla sentences ni a alembic_version.
    """
    logger.info("Limpiando y recreando tablas del diccionario...")
    tables_to_reset = [WordTag.__table__, Explanation.__table__, Word.__table__, Tag.__table__]
    
    # Desactivar temporalmente foreign keys para evitar bloqueos durante el drop
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA foreign_keys = OFF;")
    
    # Dropear tablas en orden de dependencias
    Base.metadata.drop_all(bind=engine, tables=tables_to_reset)
    logger.info("Tablas anteriores eliminadas exitosamente.")

    # Recrear tablas limpias
    Base.metadata.create_all(bind=engine, tables=[Tag.__table__, Word.__table__, WordTag.__table__, Explanation.__table__])
    logger.info("Tablas recreadas según modelos de SQLAlchemy (Tag, Word, WordTag, Explanation).")
    
    # Reactivar foreign keys
    with engine.connect() as conn:
        conn.exec_driver_sql("PRAGMA foreign_keys = ON;")


def load_tags(conn: sqlite3.Connection, file_path: str) -> int:
    """Carga datos desde tags.csv a la tabla tags."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Archivo de tags no encontrado: {file_path}")

    logger.info(f"Cargando tags desde {file_path}...")
    t0 = time.time()
    
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)  # Saltar encabezado: id,type,description
        tags_data = [(int(row[0]), row[1], row[2]) for row in reader]

    cursor = conn.cursor()
    cursor.executemany("INSERT INTO tags (id, type, description) VALUES (?, ?, ?)", tags_data)
    conn.commit()

    elapsed = time.time() - t0
    logger.info(f"Se cargaron {len(tags_data):,} tags en {elapsed:.2f}s.")
    return len(tags_data)


def load_words(conn: sqlite3.Connection, file_path: str, batch_size: int = 100000) -> int:
    """Carga datos desde words.csv a la tabla word en lotes optimizados."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Archivo de words no encontrado: {file_path}")

    logger.info(f"Cargando palabras desde {file_path} (batch_size={batch_size:,})...")
    t0 = time.time()
    cursor = conn.cursor()
    
    total_words = 0
    batch = []

    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)  # Saltar encabezado: id,word
        
        for row in reader:
            batch.append((int(row[0]), row[1]))
            total_words += 1

            if len(batch) >= batch_size:
                cursor.executemany("INSERT INTO word (id, word) VALUES (?, ?)", batch)
                conn.commit()
                batch = []
                logger.info(f"Procesadas {total_words:,} palabras...")

        if batch:
            cursor.executemany("INSERT INTO word (id, word) VALUES (?, ?)", batch)
            conn.commit()

    elapsed = time.time() - t0
    logger.info(f"Se cargaron exitosamente {total_words:,} palabras en {elapsed:.2f}s.")
    return total_words


def load_word_tags(conn: sqlite3.Connection, file_path: str, batch_size: int = 100000) -> int:
    """Carga datos desde word_tags.csv a la tabla word_tag en lotes optimizados."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Archivo de word_tags no encontrado: {file_path}")

    logger.info(f"Cargando relaciones word_tag desde {file_path} (batch_size={batch_size:,})...")
    t0 = time.time()
    cursor = conn.cursor()
    
    total_rel = 0
    batch = []

    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        header = next(reader)  # Saltar encabezado: id_word,id_tag
        
        for row in reader:
            batch.append((int(row[0]), int(row[1])))
            total_rel += 1

            if len(batch) >= batch_size:
                cursor.executemany("INSERT INTO word_tag (id_word, id_tag) VALUES (?, ?)", batch)
                conn.commit()
                batch = []
                logger.info(f"Procesadas {total_rel:,} relaciones word_tag...")

        if batch:
            cursor.executemany("INSERT INTO word_tag (id_word, id_tag) VALUES (?, ?)", batch)
            conn.commit()

    elapsed = time.time() - t0
    logger.info(f"Se cargaron exitosamente {total_rel:,} relaciones word_tag en {elapsed:.2f}s.")
    return total_rel


def optimize_database(conn: sqlite3.Connection):
    """
    Crea índices adicionales para acelerar búsquedas y optimiza el planificador de consultas.
    """
    logger.info("Optimizando base de datos e índices...")
    t0 = time.time()
    cursor = conn.cursor()
    
    # Índice inverso para filtrar palabras rápidamente por tag
    cursor.execute("CREATE INDEX IF NOT EXISTS ix_word_tag_id_tag ON word_tag (id_tag);")
    cursor.execute("CREATE INDEX IF NOT EXISTS ix_word_tag_id_word ON word_tag (id_word);")
    conn.commit()
    
    # Actualizar estadísticas del query planner
    cursor.execute("ANALYZE;")
    conn.commit()
    
    # Checkpoint WAL para consolidar cambios en el archivo principal
    cursor.execute("PRAGMA wal_checkpoint(TRUNCATE);")
    conn.commit()
    
    elapsed = time.time() - t0
    logger.info(f"Optimización e indexación completadas en {elapsed:.2f}s.")


def verify_loaded_data(conn: sqlite3.Connection):
    """Verifica y reporta los conteos de filas en la base de datos."""
    cursor = conn.cursor()
    tables = ["tags", "word", "word_tag", "explanation", "sentences"]
    logger.info("--- Resumen de tablas en SQLite ---")
    for tbl in tables:
        cursor.execute(f"SELECT count(*) FROM {tbl}")
        count = cursor.fetchone()[0]
        logger.info(f"  Tabla '{tbl}': {count:,} registros")


def run_pipeline(clean_db: bool = True, curated_dir: str = DEFAULT_CURATED_DIR, batch_size: int = 100000):
    """
    Ejecuta el pipeline completo de carga de datos curados.
    """
    total_start = time.time()
    logger.info("==================================================")
    logger.info("Iniciando Pipeline de Carga de Datos Curados")
    logger.info(f"Directorio de datos: {curated_dir}")
    logger.info(f"Base de datos destino: {DB_PATH}")
    logger.info(f"Limpiar tablas existentes: {clean_db}")
    logger.info("==================================================")

    tags_csv = os.path.join(curated_dir, "tags.csv")
    words_csv = os.path.join(curated_dir, "words.csv")
    word_tags_csv = os.path.join(curated_dir, "word_tags.csv")

    for f_path in [tags_csv, words_csv, word_tags_csv]:
        if not os.path.exists(f_path):
            raise FileNotFoundError(f"Falta archivo requerido: {f_path}")

    # 1. Limpiar tablas si se solicita
    if clean_db:
        clean_tables()

    # 2. Conectar directamente a SQLite para máxima velocidad de inserción
    conn = sqlite3.connect(DB_PATH)
    try:
        cursor = conn.cursor()
        # Pragmas para acelerar inserciones masivas
        cursor.execute("PRAGMA synchronous = OFF;")
        cursor.execute("PRAGMA journal_mode = WAL;")
        cursor.execute("PRAGMA cache_size = 100000;")
        cursor.execute("PRAGMA temp_store = MEMORY;")

        # 3. Cargar cada dataset
        load_tags(conn, tags_csv)
        load_words(conn, words_csv, batch_size=batch_size)
        load_word_tags(conn, word_tags_csv, batch_size=batch_size)

        # 4. Crear índices y analizar
        optimize_database(conn)

        # 5. Verificar
        verify_loaded_data(conn)

        total_elapsed = time.time() - total_start
        logger.info(f"Pipeline completado exitosamente en {total_elapsed:.2f}s.")

    except Exception as e:
        conn.rollback()
        logger.error(f"Error durante la ejecución del pipeline: {e}", exc_info=True)
        raise
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(description="Cargar datos curados a la base de datos SQLite.")
    parser.add_argument(
        "--skip-clean",
        action="store_true",
        help="Omitir el borrado/recreación de las tablas antes de cargar."
    )
    parser.add_argument(
        "--curated-dir",
        type=str,
        default=DEFAULT_CURATED_DIR,
        help="Ruta a la carpeta con los archivos .csv curados."
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=100000,
        help="Tamaño de lote para las inserciones masivas."
    )

    args = parser.parse_args()
    run_pipeline(
        clean_db=not args.skip_clean,
        curated_dir=args.curated_dir,
        batch_size=args.batch_size
    )


if __name__ == "__main__":
    main()
