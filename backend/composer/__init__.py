"""
Composer - Motor de procesamiento de lenguaje natural para generación de ejercicios educativos.
"""

from .interfaces import IDataProvider, INLPModel, IEvaluator
from .composer_engine import Composer
from .nlp_processor import NLPProcessor
from .evaluator import Evaluator
from .factory import StrategyContext, StrategyFactory, CriteriaType
from .generators import ExerciseType, GeneratorFactory, TypeGenerator
from .strategies import MaskingStrategy, RandomMaskingStrategy, RarestWordMaskingStrategy, TopicMaskingStrategy
from .exceptions import ComposerError, NoValidWordsError, GenerationRetriesExceededError

__all__ = [
    "IDataProvider",
    "INLPModel",
    "IEvaluator",
    "MaskingStrategy",
    "Composer",
    "NLPProcessor",
    "Evaluator",
    "StrategyContext",
    "StrategyFactory",
    "CriteriaType",
    "ExerciseType",
    "GeneratorFactory",
    "TypeGenerator",
    "RandomMaskingStrategy",
    "RarestWordMaskingStrategy",
    "TopicMaskingStrategy",
    "ComposerError",
    "NoValidWordsError",
    "GenerationRetriesExceededError"
]
