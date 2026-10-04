from abc import ABC, abstractmethod
import random
import spacy
from composer.exceptions import NoValidWordsError

class MaskingStrategy(ABC):
    @abstractmethod
    def select_target(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token]) -> spacy.tokens.Token:
        """
        Selecciona y retorna un token objetivo de la lista de tokens válidos.
        """
        pass

    @abstractmethod
    def select_multiple_targets(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token], num_targets: int) -> list[spacy.tokens.Token]:
        pass

class RandomMaskingStrategy(MaskingStrategy):
    def select_target(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token]) -> spacy.tokens.Token:
        """Elige un token de forma completamente aleatoria."""
        if not valid_tokens:
            raise NoValidWordsError("No se encontraron tokens válidos para seleccionar.")
        return random.choice(valid_tokens)

    def select_multiple_targets(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token], num_targets: int) -> list[spacy.tokens.Token]:
        if len(valid_tokens) < num_targets:
            raise NoValidWordsError(f"No hay suficientes palabras válidas. Solicitados: {num_targets}, Disponibles: {len(valid_tokens)}")
        # Elegir sin reemplazo para no repetir el mismo token
        return random.sample(valid_tokens, num_targets)

from wordfreq import zipf_frequency

class RarestWordMaskingStrategy(MaskingStrategy):
    def select_target(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token]) -> spacy.tokens.Token:
        """
        Elige la palabra menos frecuente en el uso común del inglés 
        usando la librería wordfreq (frecuencias de Zipf).
        """
        if not valid_tokens:
            raise NoValidWordsError("No se encontraron tokens válidos para seleccionar.")
            
        # Calcular la frecuencia Zipf para cada token válido. 
        # Valores más bajos indican palabras más raras.
        # zipf_frequency devuelve un valor entre 0 y 8.
        rarest_token = None
        lowest_freq = float('inf')
        
        for token in valid_tokens:
            # Usamos token.lemma_ o token.text en minúsculas.
            # token.lemma_ agrupa conjugaciones (ej: 'jumped' -> 'jump')
            word = token.lemma_.lower() if token.lemma_ else token.text.lower()
            freq = zipf_frequency(word, 'en')
            
            if freq < lowest_freq:
                lowest_freq = freq
                rarest_token = token
                
                
        return rarest_token

    def select_multiple_targets(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token], num_targets: int) -> list[spacy.tokens.Token]:
        if len(valid_tokens) < num_targets:
            raise NoValidWordsError(f"No hay suficientes palabras válidas. Solicitados: {num_targets}, Disponibles: {len(valid_tokens)}")
        
        # Ordenamos todos los tokens válidos por frecuencia ascendente (más raros primero)
        sorted_tokens = sorted(valid_tokens, key=lambda t: zipf_frequency(t.lemma_.lower() if t.lemma_ else t.text.lower(), 'en'))
        return sorted_tokens[:num_targets]

class TopicMaskingStrategy(MaskingStrategy):
    def __init__(self, topic: str, threshold: float = 0.3):
        """
        Inicializa la estrategia con el tópico buscado y un umbral de similitud.
        El umbral de 0.3 es un buen balance para Word2Vec.
        """
        self.topic = topic
        self.threshold = threshold

    def select_target(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token]) -> spacy.tokens.Token:
        if not valid_tokens:
            raise NoValidWordsError("No se encontraron tokens válidos para seleccionar.")
            
        # Obtenemos el lexema (vocab entry) del tópico desde el modelo spaCy cargado
        topic_lexeme = doc.vocab[self.topic]
        
        # Verificamos si el tópico tiene vectores en el modelo
        if not topic_lexeme.has_vector:
            # Si el tópico en sí no tiene vector (raro en lg), caemos a fallback
            raise ValueError(f"El tópico '{self.topic}' no tiene vectores en el modelo de spaCy cargado.")

        best_token = None
        max_sim = -1.0
        
        for token in valid_tokens:
            if token.has_vector:
                sim = token.similarity(topic_lexeme)
                if sim > max_sim:
                    max_sim = sim
                    best_token = token
                    
        if best_token is None or max_sim < self.threshold:
            raise NoValidWordsError(f"No se encontró ninguna palabra en la oración con similitud >= {self.threshold} respecto al tópico '{self.topic}'. Similitud máxima: {max_sim}")
            
        return best_token

    def select_multiple_targets(self, doc: spacy.tokens.Doc, valid_tokens: list[spacy.tokens.Token], num_targets: int) -> list[spacy.tokens.Token]:
        if len(valid_tokens) < num_targets:
            raise NoValidWordsError(f"No hay suficientes palabras válidas. Solicitados: {num_targets}, Disponibles: {len(valid_tokens)}")
        
        topic_lexeme = doc.vocab[self.topic]
        if not topic_lexeme.has_vector:
            raise ValueError(f"El tópico '{self.topic}' no tiene vectores en el modelo de spaCy cargado.")
            
        # Ordenamos los tokens por similitud de mayor a menor
        tokens_sim = [(t, t.similarity(topic_lexeme)) for t in valid_tokens if t.has_vector]
        tokens_sim.sort(key=lambda x: x[1], reverse=True)
        
        # Filtramos por el threshold
        valid_sim_tokens = [t for t, sim in tokens_sim if sim >= self.threshold]
        
        if len(valid_sim_tokens) < num_targets:
            raise NoValidWordsError(f"Solo se encontraron {len(valid_sim_tokens)} palabras válidas que superen la similitud {self.threshold}.")
            
        return valid_sim_tokens[:num_targets]
