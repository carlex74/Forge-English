from abc import ABC, abstractmethod

class IDataProvider(ABC):
    @abstractmethod
    def get_random_sentence(self, tag: str = None) -> dict:
        """
        Debe retornar un diccionario con la estructura:
        {
            "id_sentence": int,
            "original_sentence": str,
            "id_traduction": int,
            "traduced_sentence": str
        }
        """
        pass

class INLPModel(ABC):
    @abstractmethod
    def mask_word(self, text: str, strategy: 'MaskingStrategy', strict_morphology: bool = False) -> dict:
        """
        Analiza la oración, aplica la estrategia para seleccionar la palabra,
        y retorna un diccionario con target_word, start_char, end_char.
        """
        pass

    @abstractmethod
    def mask_multiple_words(self, text: str, strategy: 'MaskingStrategy', num_blanks: int = 2) -> list[dict]:
        """
        Retorna una lista de diccionarios, uno por cada palabra seleccionada.
        """
        pass

class IEvaluator(ABC):
    @abstractmethod
    def evaluate(self, user_input: str, target_word: str) -> bool:
        """
        Evalúa si la respuesta del usuario es correcta respecto a la palabra objetivo.
        """
        pass
