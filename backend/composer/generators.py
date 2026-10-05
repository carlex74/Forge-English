from abc import ABC, abstractmethod
from enum import Enum
import random
from composer.hint_engine import HintEngine

class ExerciseType(Enum):
    COMPLETE_SENTENCE = "COMPLETE_SENTENCE"
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE"
    CONJUGATION = "CONJUGATION"
    MULTI_BLANK = "MULTI_BLANK"

class TypeGenerator(ABC):
    @abstractmethod
    def generate(self, original_sentence: str, target_word: str, start_char: int, end_char: int, pos_tag: str, lemma: str = "") -> dict:
        """
        Genera el formato final del ejercicio (ej. reemplazando la palabra por '___' y añadiendo opciones).
        """
        pass

class MaskedGenerator(TypeGenerator):
    def generate(self, original_sentence: str, target_word: str, start_char: int, end_char: int, pos_tag: str, lemma: str = "") -> dict:
        masked_sentence = original_sentence[:start_char] + "___" + original_sentence[end_char:]
        return {
            "type": ExerciseType.COMPLETE_SENTENCE.value,
            "masked_sentence": masked_sentence,
            "target_word": target_word,
            "start_char": start_char,
            "end_char": end_char,
            "hints": HintEngine.generate_hints(target_word, pos_tag)
        }

from composer.distractors_engine import DistractorEngine

class MultipleChoiceGenerator(TypeGenerator):
    def generate(self, original_sentence: str, target_word: str, start_char: int, end_char: int, pos_tag: str, lemma: str = "") -> dict:
        masked_sentence = original_sentence[:start_char] + "___" + original_sentence[end_char:]
        
        options = [target_word]
        
        # Obtenemos los distractores usando NLP Híbrido
        try:
            engine = DistractorEngine.get_instance()
            # SpaCy procesa la palabra para obtener el token con vectores
            target_doc = engine.nlp(target_word)
            if len(target_doc) > 0:
                target_token = target_doc[0]
                # Le forzamos el pos y el lemma original por si spaCy se confunde al analizar una sola palabra aislada
                target_token.pos_ = pos_tag
                if lemma:
                    target_token.lemma_ = lemma
                    
                chosen_distractors = engine.generate_distractors(target_token, num_distractors=3)
            else:
                chosen_distractors = ["apple", "run", "fast"]
        except Exception as e:
            # Fallback seguro
            print(f"Warning (Distractors): {e}")
            chosen_distractors = ["apple", "dog", "fast"]
            
        options.extend(chosen_distractors)
        
        # Mezclar opciones para que la correcta no sea siempre la primera
        random.shuffle(options)
        
        return {
            "type": ExerciseType.MULTIPLE_CHOICE.value,
            "masked_sentence": masked_sentence,
            "target_word": target_word,
            "start_char": start_char,
            "end_char": end_char,
            "options": options,
            "hints": HintEngine.generate_hints(target_word, pos_tag)
        }

class ConjugationGenerator(TypeGenerator):
    def generate(self, original_sentence: str, target_word: str, start_char: int, end_char: int, pos_tag: str, lemma: str = "") -> dict:
        # Pista visible en el propio texto, usando solo el lema puro
        hint_text = f" ({lemma})"
        
        masked_sentence = original_sentence[:start_char] + "___" + hint_text + original_sentence[end_char:]
        
        return {
            "type": ExerciseType.CONJUGATION.value,
            "masked_sentence": masked_sentence,
            "target_word": target_word,
            "start_char": start_char,
            "end_char": end_char,
            "hints": HintEngine.generate_hints(target_word, pos_tag)
        }

class MultiBlankGenerator:
    """Generador especial para múltiples huecos. No hereda de TypeGenerator porque su firma es diferente."""
    def generate(self, original_sentence: str, targets: list[dict]) -> dict:
        # Ordenamos los targets de derecha a izquierda para que los índices no se rompan al reemplazar
        sorted_targets = sorted(targets, key=lambda x: x["start_char"], reverse=True)
        
        masked_sentence = original_sentence
        for t in sorted_targets:
            start = t["start_char"]
            end = t["end_char"]
            masked_sentence = masked_sentence[:start] + "___" + masked_sentence[end:]
            
        # Para el evaluador, extraemos las palabras en el orden en que aparecen originalmente (de izquierda a derecha)
        words_in_order = [t["target_word"] for t in sorted(targets, key=lambda x: x["start_char"])]
        
        return {
            "type": ExerciseType.MULTI_BLANK.value,
            "masked_sentence": masked_sentence,
            "targets": words_in_order, # Lista de palabras a evaluar en orden
            "hints": [HintEngine.generate_hints(t["target_word"], t["pos_tag"]) for t in sorted(targets, key=lambda x: x["start_char"])]
        }

class GeneratorFactory:
    @staticmethod
    def get_generator(exercise_type: ExerciseType):
        if exercise_type == ExerciseType.COMPLETE_SENTENCE:
            return MaskedGenerator()
        elif exercise_type == ExerciseType.MULTIPLE_CHOICE:
            return MultipleChoiceGenerator()
        elif exercise_type == ExerciseType.CONJUGATION:
            return ConjugationGenerator()
        elif exercise_type == ExerciseType.MULTI_BLANK:
            return MultiBlankGenerator()
        raise ValueError("Tipo de ejercicio no soportado")
