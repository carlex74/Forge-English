from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import spacy
import os

from composer.composer_engine import Composer
from composer.factory import StrategyContext, CriteriaType
from composer.generators import ExerciseType
from providers import SQLiteDataProvider

app = FastAPI(title="Forge English API")

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir todos para el MVP local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar modelo de spacy (tarda un poco la primera vez)
try:
    print("Cargando modelo de spacy (en_core_web_lg)...")
    spacy_model = spacy.load("en_core_web_lg")
    print("Modelo cargado exitosamente.")
except Exception as e:
    raise RuntimeError(f"No se pudo cargar el modelo de spacy. Asegúrate de haberlo descargado. Error: {e}")

# Inicializar el DataProvider de SQLite
try:
    print("Inicializando conexión con la base de datos SQLite...")
    data_provider = SQLiteDataProvider()
    print("Conexión inicializada.")
except Exception as e:
    print(f"Advertencia: No se pudo inicializar SQLiteDataProvider: {e}")
    data_provider = None

# Modelos Pydantic para los requests
class EvaluateRequest(BaseModel):
    user_answer: str
    target_word: str

@app.get("/exercise/random")
def get_random_exercise(difficulty: str = "sencilla"):
    """
    difficulty: "sencilla" (oculta una palabra al azar) o "dificil" (oculta la palabra más rara)
    """
    if data_provider is None:
        raise HTTPException(status_code=500, detail="Data provider no está inicializado. Verifica el archivo Excel.")
        
    try:
        # 1. Obtener oración aleatoria del dataset
        sentence_data = data_provider.get_random_sentence()
        
        # 2. Configurar estrategia de Composer según dificultad
        criteria = CriteriaType.RANDOM_WORD
        if difficulty == "dificil":
            criteria = CriteriaType.RAREST_WORD
            
        context = StrategyContext(criteria)
        composer = Composer(spacy_model, context)
        
        # 3. Generar ejercicio
        exercise = composer.generate_from_text(
            original_sentence=sentence_data["original_sentence"],
            traduced_sentence=sentence_data["traduced_sentence"],
            exercise_type=ExerciseType.COMPLETE_SENTENCE
        )
        
        return {
            "id_sentence": sentence_data["id_sentence"],
            "traduced_sentence": sentence_data["traduced_sentence"],
            "exercise": exercise
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/exercise/evaluate")
def evaluate_exercise(request: EvaluateRequest):
    """
    Evalúa si la respuesta del usuario es correcta para la palabra objetivo.
    """
    # Usamos cualquier contexto ya que el evaluador no depende de la estrategia
    context = StrategyContext(CriteriaType.RANDOM_WORD)
    composer = Composer(spacy_model, context)
    
    is_correct = composer.evaluate_answer(
        user_answer=request.user_answer,
        target_word=request.target_word
    )
    
    return {"is_correct": is_correct}
