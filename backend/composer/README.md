# English Exercise Composer

El **Composer** es una librería *Standalone* (función pura) impulsada por procesamiento de lenguaje natural (NLP) diseñada para transformar oraciones planas en ejercicios interactivos de inglés de manera pedagógica y eficiente.

Utilizando **spaCy** y frecuencias de Zipf, el Composer analiza morfológica y sintácticamente las oraciones para ocultar las palabras óptimas según la estrategia que elijas, devolviendo un ejercicio listo para ser renderizado en un Frontend.

## 🚀 Características Principales

1. **Agnóstico de Datos (Inversión de Control)**: El Composer no se conecta a bases de datos ni archivos. Tú le provees un string de texto, él te devuelve un ejercicio JSON-like.
2. **Pedagogía Inteligente**: No oculta palabras al azar ciegamente; ignora puntuaciones, espacios y nombres propios (`PROPN`). 
3. **Morfología Estricta**: En modos como Conjugación, extrae automáticamente el lema (raíz) del verbo.
4. **Múltiples Modalidades de Ejercicios**:
   - `COMPLETE_SENTENCE`: Oculta una palabra para ser completada (Fill in the blank).
   - `MULTIPLE_CHOICE`: Genera distractores inteligentes para la palabra oculta.
   - `CONJUGATION`: Muestra el lema del verbo (ej. *"(to run)"*) como pista visual en la oración.
   - `MULTI_BLANK`: Permite ocultar múltiples palabras en la misma oración.
5. **Estrategias de Ocultamiento (Masking Strategies)**:
   - `RANDOM_WORD`: Elige una palabra al azar.
   - `RAREST_WORD`: Usa la librería `wordfreq` para encontrar la palabra estadísticamente más difícil/rara en el uso común del inglés.
   - `TOPIC_WORD`: Oculta la palabra más relacionada semánticamente a un tópico específico (ej. "sports") usando Vectores de Palabras (Word2Vec).
6. **Generador de Pistas Integrado**: Devuelve pistas automáticas basadas en la categoría gramatical (verbo, sustantivo, adjetivo, etc.).

## 📦 Dependencias Requeridas

- `spacy` (con el modelo `en_core_web_lg` descargado para soporte de vectores)
- `wordfreq`

## 🛠️ Cómo Usar el Composer

### 1. Inicialización

El motor necesita un modelo de **spaCy** cargado externamente (para evitar recargas costosas en memoria) y un **Contexto de Estrategia**.

```python
import spacy
from composer.composer_engine import Composer
from composer.factory import StrategyContext, CriteriaType

# 1. Cargar modelo (Se hace UNA sola vez en tu backend)
spacy_model = spacy.load("en_core_web_lg")

# 2. Definir cómo queremos que el Composer elija la palabra a ocultar
context = StrategyContext(CriteriaType.RAREST_WORD)

# 3. Inicializar el Composer
composer = Composer(spacy_model, context)
```

### 2. Generación de Ejercicios

Como el Composer es una librería pura, le envías directamente el texto y el tipo de ejercicio que deseas generar:

```python
from composer.generators import ExerciseType

oracion_db = "The quick brown fox jumps over the lazy dog."
traduccion_db = "El rápido zorro marrón salta sobre el perro perezoso."

try:
    ejercicio = composer.generate_from_text(
        original_sentence=oracion_db,
        traduced_sentence=traduccion_db,
        exercise_type=ExerciseType.MULTIPLE_CHOICE
    )
    
    print(ejercicio["masked_sentence"]) 
    # Ej: "The quick brown fox ___ over the lazy dog."
    
    print(ejercicio["options"]) 
    # Ej: ['jumps', 'walks', 'runs', 'sleeps']

except Exception as e:
    print(f"La oración fue rechazada por el Composer: {e}")
```

### 3. Modos Avanzados (Tópicos y Multi-Blank)

**Generar filtrando por Tópicos:**
```python
context = StrategyContext(CriteriaType.TOPIC_WORD, topic="animals")
composer = Composer(spacy_model, context)
# Buscará ocultar palabras relacionadas con "animals" (ej: "fox", "dog")
```

**Generar Múltiples Huecos:**
```python
ejercicio = composer.generate_from_text(text, trad, ExerciseType.MULTI_BLANK)

print(ejercicio["masked_sentence"]) # "The ___ brown fox ___ over the lazy dog."
print(ejercicio["targets"])         # ["quick", "jumps"]
```

### 4. Evaluación de Respuestas

El Composer incluye un motor evaluador para verificar que la entrada del usuario sea correcta, quitando espacios en blanco y normalizando mayúsculas/minúsculas:

```python
is_correct = composer.evaluate_answer(user_answer="Jumps ", target_word="jumps")
# Retorna: True
```

Para ejercicios `MULTI_BLANK`, debes evaluar la lista de palabras del usuario contra la lista de `targets` proveída en el JSON.

## ⚠️ Manejo de Excepciones

Al depender del análisis natural de texto, no todas las oraciones son viables. El Composer lanza excepciones claras que tu aplicación debe atrapar para pedir una oración nueva:

- `SentenceLengthError`: Lanzado automáticamente si le envías una oración de menos de 3 palabras, o de más de 25 palabras (las cuales hacen un ejercicio muy extenso o de mala calidad).
- `NoValidWordsError`: Lanzado si la oración no tiene palabras válidas para ocultar (ej: pura puntuación) o si la estrategia `TOPIC_WORD` no encuentra ninguna palabra similar al tópico.
