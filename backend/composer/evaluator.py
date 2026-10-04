from composer.interfaces import IEvaluator

class Evaluator(IEvaluator):
    @staticmethod
    def evaluate(user_input: str, target_word: str) -> bool:
        """
        Compara la respuesta del usuario con la palabra objetivo.
        La comparación es insensible a mayúsculas/minúsculas pero requiere coincidencia exacta de caracteres.
        """
        # Eliminar posibles espacios extra alrededor
        import re
        
        def normalize_apostrophes(text: str) -> str:
            # Reemplaza tildes, comillas anguladas o invertidas por un apóstrofe simple
            return re.sub(r"[´`’‘]", "'", text)

        # Normalizar y limpiar
        user_clean = normalize_apostrophes(user_input).strip().lower()
        target_clean = normalize_apostrophes(target_word).strip().lower()
        
        return user_clean == target_clean
