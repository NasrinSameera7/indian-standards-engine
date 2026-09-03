from __future__ import annotations
"""Multilingual NLP: language detection and translation to English."""
import logging
from langdetect import detect, DetectorFactory
import httpx

logger = logging.getLogger(__name__)

DetectorFactory.seed = 0  # Deterministic detection

SUPPORTED_LANGUAGES = {
    'en': 'English', 'hi': 'Hindi', 'ta': 'Tamil', 'te': 'Telugu',
    'bn': 'Bengali', 'mr': 'Marathi', 'gu': 'Gujarati', 'kn': 'Kannada',
    'ml': 'Malayalam', 'pa': 'Punjabi', 'or': 'Odia', 'ur': 'Urdu'
}

class MultilingualService:
    def __init__(self, bhashini_api_key: str = '', bhashini_api_url: str = ''):
        self.api_key = bhashini_api_key
        self.api_url = bhashini_api_url

    def detect_language(self, text: str) -> str:
        try:
            lang = detect(text)
            return lang
        except Exception as e:
            logger.warning(f"Language detection failed: {e}")
            return 'en'

    async def translate_to_english(self, text: str, source_lang: str) -> str:
        if source_lang == 'en':
            return text
        try:
            if self.api_key and self.api_url:
                return await self._call_bhashini_api(text, source_lang)
            else:
                return self._call_google_translator(text, source_lang)
        except Exception as e:
            logger.warning(f"Translation failed: {e}. Returning original text.")
            return text

    def _call_google_translator(self, text: str, source_lang: str) -> str:
        from deep_translator import GoogleTranslator
        try:
            translator = GoogleTranslator(source='auto', target='en')
            return translator.translate(text)
        except Exception as e:
            logger.error(f"GoogleTranslator error: {e}")
            raise e

    async def process(self, text: str, language_hint: str | None = None) -> tuple[str, str]:
        source_lang = language_hint or self.detect_language(text)
        translated_text = await self.translate_to_english(text, source_lang)
        return translated_text, source_lang

    async def _call_bhashini_api(self, text: str, source_lang: str) -> str:
        if not self.api_key or not self.api_url:
            raise ValueError("Bhashini API credentials not provided.")
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key
        }
        payload = {
            "pipelineTasks": [
                {
                    "taskType": "translation",
                    "config": {
                        "language": {
                            "sourceLanguage": source_lang,
                            "targetLanguage": "en"
                        }
                    }
                }
            ],
            "inputData": {
                "input": [
                    {
                        "source": text
                    }
                ]
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{self.api_url}/services/inference/pipeline", json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            try:
                translated = data['pipelineResponse'][0]['output'][0]['target']
                return translated
            except (KeyError, IndexError):
                raise ValueError("Unexpected response format from Bhashini API.")
