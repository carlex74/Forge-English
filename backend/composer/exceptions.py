class ComposerError(Exception):
    """Clase base para todas las excepciones del paquete Composer."""
    pass

class NoValidWordsError(ComposerError):
    """Lanzada cuando la estrategia no encuentra ninguna palabra válida en la oración para ocultar."""
    pass

class SentenceLengthError(ComposerError):
    """Lanzada cuando la oración provista es demasiado corta o demasiado larga para generar un ejercicio útil."""
    pass

class GenerationRetriesExceededError(ComposerError):
    """Lanzada cuando el orquestador agota los reintentos tratando de generar un ejercicio válido."""
    pass
