import pandas as pd
from typing import Dict, Any, Optional
from composer.interfaces import IDataProvider

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
            # Leemos el archivo Excel. Asegúrate de tener installados 'pandas' y 'openpyxl'.
            self._df = pd.read_excel(self.file_path)
            
            # Validamos que existan las columnas requeridas
            required_columns = {"id_sentence", "original_sentence", "id_traduction", "traduced_sentence"}
            if not required_columns.issubset(self._df.columns):
                missing = required_columns - set(self._df.columns)
                raise ValueError(f"El archivo Excel no tiene las columnas requeridas. Faltan: {missing}")
                
        except Exception as e:
            raise RuntimeError(f"Error al cargar el archivo Excel {self.file_path}: {e}")

    def get_random_sentence(self, tag: str = None) -> Dict[str, Any]:
        """
        Retorna una oración aleatoria del dataset cargado en memoria.
        El tag es ignorado por ahora ya que no hay columna de tags en esta tabla base.
        """
        if self._df is None or self._df.empty:
            raise ValueError("No hay datos disponibles en el archivo Excel.")
            
        # Tomamos una fila al azar
        row = self._df.sample(n=1).iloc[0]
        
        return {
            "id_sentence": int(row["id_sentence"]),
            "original_sentence": str(row["original_sentence"]),
            "id_traduction": int(row["id_traduction"]),
            "traduced_sentence": str(row["traduced_sentence"])
        }
