import os
import sys
import logging
import pandas as pd
import re

# Aseguramos que Python pueda importar desde el root de backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import engine, Base, SessionLocal
from models import Sentence

# Configuración de logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Configuración de rutas
EXCEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "db", "english-spanish-sentences.xlsx"))

def extract_data(file_path: str) -> pd.DataFrame:
    """Extrae los datos desde el archivo Excel original."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"El archivo {file_path} no existe.")
    
    logger.info(f"Extrayendo datos de {file_path}...")
    df = pd.read_excel(file_path)
    logger.info(f"Se extrajeron {len(df)} filas.")
    return df

def transform_data(df: pd.DataFrame) -> pd.DataFrame:
    """Aplica curación y filtros sobre los datos extraídos."""
    logger.info("Transformando datos (Limpieza y filtrado)...")
    
    # Validar columnas
    required_cols = {"id_sentence", "original_sentence", "id_traduction", "traduced_sentence"}
    if not required_cols.issubset(df.columns):
        raise ValueError(f"Faltan columnas requeridas en el DataFrame. Esperadas: {required_cols}")

    # Filtrar nulos
    df = df.dropna(subset=["original_sentence", "traduced_sentence"])
    
    # Limpiar strings
    df["original_sentence"] = df["original_sentence"].astype(str).str.strip()
    df["traduced_sentence"] = df["traduced_sentence"].astype(str).str.strip()

    # Filtro de negocio: no cargar oraciones de 2 o 3 palabras (nos quedamos con > 3)
    # Contamos palabras usando regex para considerar solo texto alfanumérico
    def word_count(sentence):
        return len(re.findall(r'\b\w+\b', sentence))
    
    df["word_count"] = df["original_sentence"].apply(word_count)
    
    initial_count = len(df)
    df_filtered = df[df["word_count"] > 3].copy()
    
    # Asegurar unicidad del id_sentence (hay múltiples traducciones para la misma oración)
    df_filtered = df_filtered.drop_duplicates(subset=["id_sentence"])
    
    final_count = len(df_filtered)
    
    logger.info(f"Filtro aplicado: se descartaron oraciones cortas o duplicadas. Total final: {final_count} de {initial_count}.")
    
    # Limpiar columna auxiliar
    df_filtered = df_filtered.drop(columns=["word_count"])
    return df_filtered

def load_data(df: pd.DataFrame):
    """Carga los datos curados a la base de datos SQLite."""
    logger.info("Creando tablas en la base de datos si no existen...")
    Base.metadata.create_all(bind=engine)
    
    logger.info("Iniciando carga de datos a SQLite...")
    session = SessionLocal()
    try:
        # Usamos UPSERT o eliminamos e insertamos (para este script inicial, podemos limpiar y cargar)
        # Como es una tabla semilla, vamos a usar bulk_insert
        records = df.to_dict(orient="records")
        
        # Opcional: limpiar la tabla antes de cargar para idempotencia (como es el script inicial de volcado)
        session.query(Sentence).delete()
        
        # Inserción masiva
        session.bulk_insert_mappings(Sentence, records)
        session.commit()
        logger.info(f"Se cargaron exitosamente {len(records)} registros en SQLite.")
    except Exception as e:
        session.rollback()
        logger.error(f"Fallo al cargar datos en SQLite: {e}")
        raise
    finally:
        session.close()

def run_pipeline():
    try:
        logger.info("--- Iniciando ETL Pipeline ---")
        raw_data = extract_data(EXCEL_PATH)
        clean_data = transform_data(raw_data)
        load_data(clean_data)
        logger.info("--- ETL Pipeline finalizado con éxito ---")
    except Exception as e:
        logger.error(f"Pipeline abortado por error: {e}")

if __name__ == "__main__":
    run_pipeline()
