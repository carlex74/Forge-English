import pandas as pd
import random
from typing import Dict, Any, Optional
from sqlalchemy.sql import func
from composer.interfaces import IDataProvider
from database import SessionLocal
from models import Sentence

class ExcelDataProvider(IDataProvider):
    """
    Proveedor de datos que lee oraciones desde un archivo Excel.
    Implementa el patrón Strategy (IDataProvider) para inyectarlo en el Composer.
    """
    def __init__(self, file_path: str):
        self.file_path = file_path
        self._df = None
        self._load_data()
        
    def _load_data(self):
        try:
            self._df = pd.read_excel(self.file_path)
            required_columns = {"id_sentence", "original_sentence", "traduced_sentence"}
            if not required_columns.issubset(self._df.columns):
                missing = required_columns - set(self._df.columns)
                raise ValueError(f"El archivo Excel no tiene las columnas requeridas. Faltan: {missing}")
        except Exception as e:
            raise RuntimeError(f"Error al cargar el archivo Excel {self.file_path}: {e}")

    def get_random_sentence(self, tag: str = None) -> Dict[str, Any]:
        """
        Retorna una oración aleatoria del dataset cargado en memoria.
        """
        if self._df is None or self._df.empty:
            raise ValueError("No hay datos disponibles en el archivo Excel.")
            
        row = self._df.sample(n=1).iloc[0]
        
        return {
            "id_sentence": int(row["id_sentence"]),
            "original_sentence": str(row["original_sentence"]),
            "traduced_sentence": str(row["traduced_sentence"])
        }

class SQLiteDataProvider(IDataProvider):
    """
    Proveedor de datos que lee oraciones desde la base de datos SQLite usando SQLAlchemy.
    """
    def get_random_sentence(self, tag: str = None) -> Dict[str, Any]:
        session = SessionLocal()
        try:
            # Selecciona un registro aleatorio de la tabla sentences
            # Para 200k+ filas en SQLite, order_by(func.random()) puede tardar unos pocos milisegundos, lo cual es aceptable.
            sentence = session.query(Sentence).order_by(func.random()).first()
            
            if not sentence:
                raise ValueError("La tabla 'sentences' de la base de datos está vacía.")
            
            return {
                "id_sentence": sentence.id_sentence,
                "original_sentence": sentence.original_sentence,
                "traduced_sentence": sentence.traduced_sentence
            }
        finally:
            session.close()
