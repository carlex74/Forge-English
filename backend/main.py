from fastapi import FastAPI, HTTPException, Body, Depends, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
import spacy
import os

from composer.composer_engine import Composer
from composer.factory import StrategyContext, CriteriaType
from composer.generators import ExerciseType
from providers import SQLiteDataProvider
from database import get_db
from models import Word, Tag, Explanation
from explainer.core import GrammaticalExplainer
from audio.service import PiperAudioService

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

# Inicializar PiperAudioService (TTS neuronal local)
try:
    print("Inicializando servicio de audio Piper TTS...")
    audio_service = PiperAudioService.get_instance()
    print("Servicio de audio listo.")
except Exception as e:
    print(f"Advertencia: No se pudo inicializar PiperAudioService: {e}")
    audio_service = None

# Modelos Pydantic para los requests
class EvaluateRequest(BaseModel):
    user_answer: str
    target_word: str

@app.get("/exercise/random")
def get_random_exercise(difficulty: str = "sencilla", mode: str = "fill"):
    """
    difficulty: "sencilla" (oculta una palabra al azar) o "dificil" (oculta la palabra más rara)
    mode: "fill" (rellenar el hueco), "choice" (múltiple opción) o "listen" (escuchar y completar)
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
        if mode == "choice":
            ex_type = ExerciseType.MULTIPLE_CHOICE
        elif mode in ("listen", "audio"):
            ex_type = ExerciseType.AUDIO_COMPLETION
        else:
            ex_type = ExerciseType.COMPLETE_SENTENCE

        exercise = composer.generate_from_text(
            original_sentence=sentence_data["original_sentence"],
            traduced_sentence=sentence_data["traduced_sentence"],
            exercise_type=ex_type
        )
        
        return {
            "id_sentence": sentence_data["id_sentence"],
            "original_sentence": sentence_data["original_sentence"],
            "traduced_sentence": sentence_data["traduced_sentence"],
            "exercise": exercise
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audio/tts")
def text_to_speech(text: str = Query(..., min_length=1, max_length=500)):
    """
    Sintetiza texto a audio WAV utilizando Piper TTS neuronal local.
    """
    if audio_service is None:
        raise HTTPException(status_code=503, detail="Servicio de audio Piper no disponible.")
    try:
        wav_bytes = audio_service.synthesize(text)
        return Response(content=wav_bytes, media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar audio: {e}")

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

class ExplainRequest(BaseModel):
    sentence: str

@app.post("/exercise/explain")
def explain_sentence(request: ExplainRequest):
    """
    Desglosa sintácticamente una oración para dar feedback gramatical al usuario.
    """
    explainer = GrammaticalExplainer(spacy_model)
    breakdown = explainer.explain_sentence(request.sentence)
    
    return {"breakdown": breakdown}

from sqlalchemy.orm import selectinload, joinedload

# --- FASE 1.5: ENDPOINTS DE DICCIONARIO ---

@app.get("/dictionary/words")
def get_words(
    skip: int = Query(0, ge=0), 
    limit: int = Query(50, le=100), 
    search: Optional[str] = None,
    search_mode: Optional[str] = "starts", # "starts", "contains", "exact"
    tag_id: Optional[int] = None,
    tag_ids: Optional[str] = None, # "12,45"
    db: Session = Depends(get_db)
):
    query = db.query(Word).options(selectinload(Word.tags), joinedload(Word.explanation))
    
    if search:
        s = search.strip()
        if search_mode == "exact":
            query = query.filter(Word.word == s.lower())
        elif search_mode == "contains":
            query = query.filter(Word.word.ilike(f"%{s}%"))
        else: # "starts" por defecto para autocompletado ultra veloz en 1.1M palabras
            query = query.filter(Word.word.like(f"{s.lower()}%"))
    
    if tag_ids:
        try:
            ids = [int(tid.strip()) for tid in tag_ids.split(",") if tid.strip().isdigit()]
            for tid in ids:
                query = query.filter(Word.tags.any(id=tid))
        except Exception:
            pass
    elif tag_id:
        query = query.filter(Word.tags.any(id=tag_id))
        
    total = query.count()
    words = query.offset(skip).limit(limit).all()
    
    # Formatear la salida para incluir la traducción, ejemplos y tags
    result = []
    for w in words:
        result.append({
            "id": w.id,
            "word": w.word,
            "traduction": w.explanation.traduction if w.explanation else "",
            "examples": w.explanation.examples if w.explanation else "",
            "tags": [{"id": t.id, "type": t.type, "description": t.description} for t in w.tags]
        })
        
    return {
        "total": total,
        "items": result
    }

@app.get("/dictionary/tags")
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).order_by(Tag.type, Tag.description).all()
    return [{"id": t.id, "type": t.type, "description": t.description} for t in tags]

