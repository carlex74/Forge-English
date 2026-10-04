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
            "hints": HintEngine.generate_hints(target_word, pos_tag)
        }

class MultipleChoiceGenerator(TypeGenerator):
    # Diccionario estático de distractores comunes por categoría gramatical para el MVP
    DISTRACTORS = {
        "VERB": ["run", "eat", "jump", "sleep", "think", "make", "go", "take", "see", "come", "want", "look"],
        "NOUN": ["time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand", "child", "eye"],
        "ADJ": ["good", "new", "first", "last", "long", "great", "little", "own", "other", "old", "right", "big"],
        "ADV": ["up", "so", "out", "just", "now", "how", "then", "more", "also", "here", "well", "only"],
        "PRON": ["he", "they", "we", "she", "who", "them", "me", "him", "one", "her", "us", "you"],
        "ADP": ["in", "on", "at", "to", "for", "with", "by", "about", "as", "from", "into", "like"]
    }

    def generate(self, original_sentence: str, target_word: str, start_char: int, end_char: int, pos_tag: str, lemma: str = "") -> dict:
        masked_sentence = original_sentence[:start_char] + "___" + original_sentence[end_char:]
        
        options = [target_word]
        possible_distractors = self.DISTRACTORS.get(pos_tag, ["apple", "dog", "fast", "blue", "happily", "run"])
        
        # Filtrar para evitar duplicar la respuesta correcta
        valid_distractors = [d for d in possible_distractors if d.lower() != target_word.lower()]
        
        # Elegir 3 distractores (o los que haya disponibles)
        chosen_distractors = random.sample(valid_distractors, min(3, len(valid_distractors)))
        options.extend(chosen_distractors)
        
        # Mezclar opciones para que la correcta no sea siempre la primera
        random.shuffle(options)
        
        return {
            "type": ExerciseType.MULTIPLE_CHOICE.value,
            "masked_sentence": masked_sentence,
            "target_word": target_word,
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
