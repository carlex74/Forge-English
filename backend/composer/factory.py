from enum import Enum
from typing import Any
from composer.strategies import (
    MaskingStrategy,
    RandomMaskingStrategy,
    RarestWordMaskingStrategy,
    TopicMaskingStrategy
)

class CriteriaType(Enum):
    RANDOM_WORD = "RANDOM_WORD"
    RAREST_WORD = "RAREST_WORD"
    TOPIC_WORD = "TOPIC_WORD"

class StrategyContext:
    """
    Objeto de Transferencia de Datos (DTO) que encapsula el tipo de estrategia
    y cualquier parámetro arbitrario que esta necesite (kwargs).
    """
    def __init__(self, criteria_type: CriteriaType, **kwargs: Any):
        self.criteria_type = criteria_type
        self.kwargs = kwargs

class StrategyFactory:
    """
    Fábrica encargada de instanciar la estrategia correcta en base al contexto provisto.
    """
    @staticmethod
    def create(context: StrategyContext) -> MaskingStrategy:
        if context.criteria_type == CriteriaType.RANDOM_WORD:
            return RandomMaskingStrategy()
            
        elif context.criteria_type == CriteriaType.RAREST_WORD:
            return RarestWordMaskingStrategy()
            
        elif context.criteria_type == CriteriaType.TOPIC_WORD:
            topic = context.kwargs.get("topic")
            threshold = context.kwargs.get("threshold", 0.3)
            
            if not topic:
                raise ValueError("Se requiere el argumento 'topic' en el StrategyContext para instanciar TOPIC_WORD.")
                
            return TopicMaskingStrategy(topic=topic, threshold=threshold)
            
        raise ValueError(f"Criterio no soportado: {context.criteria_type}")
