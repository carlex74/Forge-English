class HintEngine:
    """
    Motor para generar pistas contextuales y semánticas para los ejercicios.
    """
    
    POS_TRANSLATION = {
        "NOUN": "sustantivo",
        "VERB": "verbo",
        "ADJ": "adjetivo",
        "ADV": "adverbio",
        "PRON": "pronombre",
        "DET": "determinante (artículo)",
        "ADP": "preposición",
        "CONJ": "conjunción",
        "SCONJ": "conjunción subordinante",
        "PROPN": "nombre propio",
        "AUX": "verbo auxiliar"
    }

    @staticmethod
    def generate_hints(target_word: str, pos_tag: str) -> list[str]:
        """
        Genera un array de pistas basándose en la palabra y sus metadatos NLP.
        """
        hints = []
        
        # 1. Pista Gramatical (La más valiosa para el aprendizaje)
        if pos_tag in HintEngine.POS_TRANSLATION:
            translated_pos = HintEngine.POS_TRANSLATION[pos_tag]
            hints.append(f"Gramaticalmente es un/una {translated_pos}.")
            
        # 2. Pista de Inicial
        if len(target_word) > 0:
            first_letter = target_word[0].upper()
            hints.append(f"Empieza con la letra '{first_letter}'.")
            
        # 3. Pista de Longitud
        hints.append(f"La palabra tiene {len(target_word)} letras.")
            
        return hints
