import spacy
from composer.interfaces import INLPModel
from composer.exceptions import NoValidWordsError

class NLPProcessor(INLPModel):
    def __init__(self, spacy_model):
        # Inyección de dependencias pura: recibimos el modelo ya cargado
        self.nlp = spacy_model

    def mask_word(self, text: str, strategy: 'MaskingStrategy', strict_morphology: bool = False) -> dict:
        """
        Analiza la oración con spaCy, utiliza una Estrategia para seleccionar el token objetivo,
        y lo reemplaza por un espacio en blanco.
        Retorna la oración censurada y la palabra original.
        """
        doc = self.nlp(text)
        
        # Filtrar tokens que sean palabras (no puntuación ni espacios en blanco)
        # Tampoco queremos nombres propios (PROPN) porque son imposibles de adivinar sin contexto.
        valid_tokens = [token for token in doc if not token.is_punct and not token.is_space and token.pos_ != "PROPN"]
        
        # Filtro estricto para modo conjugación: descartar palabras que son idénticas a su lema
        if strict_morphology:
            valid_tokens = [token for token in valid_tokens if token.text.lower() != token.lemma_.lower()]
            
        if not valid_tokens:
            raise NoValidWordsError("No se encontraron palabras válidas en la oración para ocultar.")
        
        # Delegar la selección a la estrategia
        target_token = strategy.select_target(doc, valid_tokens)
        
        # Reconstruir la oración censurando la palabra seleccionada
        # Utilizaremos la posición del token para censurarlo de forma precisa

        # Expandir la selección para atrapar contracciones (ej. do + n't -> don't)
        # sin modificar el objeto doc (manteniendo la precisión gramatical intacta)
        
        # 1. Buscar hacia atrás si la palabra anterior está pegada a esta
        start_token = target_token
        while start_token.i > 0 and doc[start_token.i - 1].whitespace_ == "" and not doc[start_token.i - 1].is_punct:
            start_token = doc[start_token.i - 1]
            
        # 2. Buscar hacia adelante si esta palabra está pegada a la siguiente
        end_token = target_token
        while end_token.whitespace_ == "" and end_token.i < len(doc) - 1 and not doc[end_token.i + 1].is_punct:
            end_token = doc[end_token.i + 1]
            
        # Reconstruir la oración y la palabra objetivo basándonos en los caracteres reales.
        # Importante: Recortar cualquier signo de puntuación que haya quedado pegado al final.
        start_char = start_token.idx
        raw_end_char = end_token.idx + len(end_token)
        target_full_word = text[start_char:raw_end_char]
        
        # Eliminar puntuación pegada al final (ej: "I." → "I")
        target_full_word = target_full_word.rstrip('.,!?;:')
        end_char = start_char + len(target_full_word)
        
        return {
            "target_word": target_full_word,
            "start_char": start_char,
            "end_char": end_char,
            "pos_tag": target_token.pos_,
            "lemma": target_token.lemma_
        }

    def mask_multiple_words(self, text: str, strategy: 'MaskingStrategy', num_blanks: int = 2) -> list[dict]:
        doc = self.nlp(text)
        
        valid_tokens = [token for token in doc if not token.is_punct and not token.is_space and token.pos_ != "PROPN"]
        
        if not valid_tokens:
            raise NoValidWordsError("No se encontraron palabras válidas en la oración para ocultar.")
            
        target_tokens = strategy.select_multiple_targets(doc, valid_tokens, num_targets=num_blanks)
        
        results = []
        for target_token in target_tokens:
            start_token = target_token
            while start_token.i > 0 and doc[start_token.i - 1].whitespace_ == "" and not doc[start_token.i - 1].is_punct:
                start_token = doc[start_token.i - 1]
                
            end_token = target_token
            while end_token.whitespace_ == "" and end_token.i < len(doc) - 1 and not doc[end_token.i + 1].is_punct:
                end_token = doc[end_token.i + 1]
                
            start_char = start_token.idx
            raw_end_char = end_token.idx + len(end_token)
            target_full_word = text[start_char:raw_end_char]
            
            target_full_word = target_full_word.rstrip('.,!?;:')
            end_char = start_char + len(target_full_word)
            
            results.append({
                "target_word": target_full_word,
                "start_char": start_char,
                "end_char": end_char,
                "pos_tag": target_token.pos_,
                "lemma": target_token.lemma_
            })
            
        return results
