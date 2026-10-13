import os
import io
import wave
import hashlib
import logging
import urllib.request
from pathlib import Path
from typing import Optional
from piper import PiperVoice

logger = logging.getLogger(__name__)

MODELS_DIR = Path(os.path.abspath(os.path.join(os.path.dirname(__file__), "models")))
MODEL_NAME = "en_US-lessac-medium"
MODEL_PATH = MODELS_DIR / f"{MODEL_NAME}.onnx"
CONFIG_PATH = MODELS_DIR / f"{MODEL_NAME}.onnx.json"

HF_BASE_URL = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/"


class PiperAudioService:
    _instance: Optional["PiperAudioService"] = None

    def __init__(self):
        self.voice: Optional[PiperVoice] = None
        self._cache: dict[str, bytes] = {}
        self._max_cache_entries = 300
        self._ensure_model_and_load()

    @classmethod
    def get_instance(cls) -> "PiperAudioService":
        if cls._instance is None:
            cls._instance = PiperAudioService()
        return cls._instance

    def _ensure_model_and_load(self):
        """Verifica que los archivos del modelo existan y carga PiperVoice."""
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        headers = {"User-Agent": "Mozilla/5.0"}

        # 1. Config JSON
        if not CONFIG_PATH.exists():
            logger.info("Descargando configuración de Piper (%s.onnx.json)...", MODEL_NAME)
            req = urllib.request.Request(HF_BASE_URL + f"{MODEL_NAME}.onnx.json", headers=headers)
            with urllib.request.urlopen(req) as resp, open(CONFIG_PATH, "wb") as f:
                f.write(resp.read())

        # 2. Modelo ONNX (~60 MB)
        if not MODEL_PATH.exists():
            logger.info("Descargando modelo neuronal de Piper (~60 MB)...")
            req = urllib.request.Request(HF_BASE_URL + f"{MODEL_NAME}.onnx", headers=headers)
            with urllib.request.urlopen(req) as resp, open(MODEL_PATH, "wb") as f:
                f.write(resp.read())
            logger.info("Modelo de Piper descargado exitosamente.")

        logger.info("Inicializando PiperVoice (ONNX Runtime)...")
        self.voice = PiperVoice.load(MODEL_PATH, config_path=CONFIG_PATH)
        logger.info("PiperVoice cargado y listo para sintetizar voz.")

    def synthesize(self, text: str) -> bytes:
        """
        Sintetiza el texto a audio en formato WAV (bytes).
        Usa caché en memoria para respuestas instantáneas en textos repetidos.
        """
        clean_text = text.strip()
        if not clean_text:
            return b""

        # Clave de caché por hash
        cache_key = hashlib.md5(clean_text.encode("utf-8")).hexdigest()
        if cache_key in self._cache:
            return self._cache[cache_key]

        if not self.voice:
            self._ensure_model_and_load()

        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as wav_file:
            self.voice.synthesize_wav(clean_text, wav_file)

        wav_bytes = buffer.getvalue()

        # Gestión simple de tamaño de caché LRU
        if len(self._cache) >= self._max_cache_entries:
            # Eliminar la entrada más antigua
            first_key = next(iter(self._cache))
            del self._cache[first_key]

        self._cache[cache_key] = wav_bytes
        return wav_bytes
