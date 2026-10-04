from composer.interfaces import IDataProvider, INLPModel, IEvaluator
from composer.factory import StrategyContext, StrategyFactory, CriteriaType
from composer.generators import ExerciseType, GeneratorFactory
from composer.exceptions import NoValidWordsError, SentenceLengthError
from composer.nlp_processor import NLPProcessor
from composer.evaluator import Evaluator

class Composer:
    def __init__(self, spacy_model, context: StrategyContext = None):
        self.nlp = NLPProcessor(spacy_model)
        self.evaluator = Evaluator()
        
        # Por defecto usar estrategia aleatoria si no se provee contexto
        if context is None:
            context = StrategyContext(CriteriaType.RANDOM_WORD)
            
        self.strategy = StrategyFactory.create(context)

    def generate_from_text(self, original_sentence: str, traduced_sentence: str = "", exercise_type: ExerciseType = ExerciseType.COMPLETE_SENTENCE) -> dict:
        """
        Procesa una oración utilizando la estrategia configurada y genera un ejercicio.
        Lanza SentenceLengthError si la oración es muy corta o muy larga.
        Lanza NoValidWordsError si la estrategia no encuentra palabras viables.
        """
        words_count = len(original_sentence.split())
        if words_count < 3:
            raise SentenceLengthError(f"La oración es demasiado corta para un ejercicio ({words_count} palabras).")
        if words_count > 25:
            raise SentenceLengthError(f"La oración es demasiado larga para un ejercicio útil ({words_count} palabras).")
            
        if exercise_type == ExerciseType.MULTI_BLANK:
            # Requerimos al menos 2 blancos, asegurarnos de que la oración tenga suficientes palabras
            if words_count < 5:
                raise SentenceLengthError(f"La oración es muy corta para modo Multi-Blank ({words_count} palabras).")
                
            targets = self.nlp.mask_multiple_words(original_sentence, self.strategy, num_blanks=2)
            generator = GeneratorFactory.get_generator(exercise_type)
            exercise_data = generator.generate(original_sentence, targets)
        else:
            # Procesar con NLP pasándole la estrategia actual (Un solo hueco)
            strict_morph = (exercise_type == ExerciseType.CONJUGATION)
            nlp_result = self.nlp.mask_word(original_sentence, self.strategy, strict_morphology=strict_morph)
            
            # Delegar la generación del formato al TypeGenerator correspondiente
            generator = GeneratorFactory.get_generator(exercise_type)
            exercise_data = generator.generate(
                original_sentence=original_sentence,
                target_word=nlp_result["target_word"],
                start_char=nlp_result["start_char"],
                end_char=nlp_result["end_char"],
                pos_tag=nlp_result["pos_tag"],
                lemma=nlp_result.get("lemma", "")
            )
        
        # Adjuntar la traducción final
        exercise_data["original_sentence"] = original_sentence
        exercise_data["traduced_sentence"] = traduced_sentence
        
        return exercise_data

    def evaluate_answer(self, user_answer: str, target_word: str) -> bool:
        """Delega la evaluación al evaluador."""
        return self.evaluator.evaluate(user_answer, target_word)
