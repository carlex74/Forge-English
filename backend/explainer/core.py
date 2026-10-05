POS_TRANSLATIONS = {
    "ADJ": "Adjetivo",
    "ADP": "Preposición",
    "ADV": "Adverbio",
    "AUX": "Verbo auxiliar",
    "CCONJ": "Conjunción coordinante",
    "DET": "Determinante",
    "INTJ": "Interjección",
    "NOUN": "Sustantivo",
    "NUM": "Número",
    "PART": "Partícula",
    "PRON": "Pronombre",
    "PROPN": "Nombre propio",
    "PUNCT": "Puntuación",
    "SCONJ": "Conjunción subordinante",
    "SYM": "Símbolo",
    "VERB": "Verbo",
    "X": "Otro"
}

class GrammaticalExplainer:
    def __init__(self, spacy_model):
        """
        Recibe directamente el modelo cargado de spaCy,
        manteniendo este módulo independiente de 'composer'.
        """
        self.nlp = spacy_model

    def explain_sentence(self, sentence: str) -> list[dict]:
        """
        Desglosa una oración completa devolviendo la metadata gramatical de cada token.
        Traduce los POS tags de spaCy a un formato amigable en español.
        """
        doc = self.nlp(sentence)
        
        breakdown = []
        for token in doc:
            if token.is_space:
                continue
                
            breakdown.append({
                "word": token.text,
                "lemma": token.lemma_,
                "pos": token.pos_,
                "pos_es": POS_TRANSLATIONS.get(token.pos_, token.pos_),
                "dep": token.dep_,
                "is_stop": token.is_stop
            })
            
        return breakdown
