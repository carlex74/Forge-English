import spacy
from typing import List
from wordfreq import iter_wordlist
import random

class DistractorEngine:
    _instance = None

    @classmethod
    def get_instance(cls, nlp=None):
        if cls._instance is None:
            if nlp is None:
                raise ValueError("Se debe inicializar el DistractorEngine con un modelo de spaCy válido.")
            cls._instance = cls(nlp)
        return cls._instance

    def __init__(self, nlp, pool_size=3000):
        self.nlp = nlp
        self.pool_size = pool_size
        self.pos_pools = {}
        
        self._initialize_pool()

    def _initialize_pool(self):
        """
        Carga las palabras más comunes del inglés, las procesa con spaCy
        y las agrupa por categoría gramatical (POS) para un acceso rápido.
        """
        # Obtenemos las palabras más comunes usando iter_wordlist
        word_iterator = iter_wordlist('en')
        common_words = []
        
        try:
            for _ in range(self.pool_size):
                word = next(word_iterator)
                # Filtramos palabras con números o símbolos extraños
                if word.isalpha() and len(word) > 2:
                    common_words.append(word)
        except StopIteration:
            pass
            
        # Procesamos todas las palabras juntas usando nlp.pipe para mayor eficiencia
        docs = list(self.nlp.pipe(common_words))
        
        for doc in docs:
            if len(doc) == 1:
                token = doc[0]
                pos = token.pos_
                if pos not in self.pos_pools:
                    self.pos_pools[pos] = []
                self.pos_pools[pos].append(token)

    def generate_distractors(self, target_token: spacy.tokens.Token, num_distractors: int = 3) -> List[str]:
        """
        Genera distractores usando una estrategia híbrida:
        1. Filtra palabras del mismo POS (Categoría Gramatical).
        2. Ordena por similitud semántica.
        3. Si la similitud falla, cae a una selección aleatoria del mismo POS.
        """
        target_pos = target_token.pos_
        target_text_lower = target_token.text.lower()
        target_lemma_lower = target_token.lemma_.lower()
        
        # 1. Filtramos candidatos por POS
        candidates = self.pos_pools.get(target_pos, [])
        
        # Filtramos la palabra objetivo y variaciones directas de la lista
        valid_candidates = [
            t for t in candidates 
            if t.text.lower() != target_text_lower and t.lemma_.lower() != target_lemma_lower
        ]
        
        if not valid_candidates:
            # Fallback 1: Retornar strings aleatorios genéricos si no hay nada en el pool
            return ["apple", "run", "fast", "blue", "quickly"][:num_distractors]
            
        # 2. Intentamos ordenarlos por similitud semántica
        if target_token.has_vector:
            # Calculamos similitudes
            sim_scores = []
            for t in valid_candidates:
                if t.has_vector:
                    sim_scores.append((t, target_token.similarity(t)))
            
            # Ordenar de mayor a menor similitud
            sim_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Tomamos el top N
            top_matches = [t.text for t, sim in sim_scores[:num_distractors]]
            
            # Si encontramos suficientes, los devolvemos
            if len(top_matches) >= num_distractors:
                # Opcional: mezclarlos para que no siempre el más similar esté primero
                random.shuffle(top_matches)
                return top_matches
                
        # 3. Fallback 2: Selección morfológica aleatoria si no hay vectores o no alcanzan
        chosen = random.sample(valid_candidates, min(num_distractors, len(valid_candidates)))
        return [t.text for t in chosen]
