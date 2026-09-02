"""OCR Service to extract text from files."""
import logging
import io
import re
try:
    import fitz  # type: ignore # PyMuPDF
except ImportError:
    pass
try:
    import docx  # type: ignore
except ImportError:
    pass
from PIL import Image
import pytesseract

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self, tesseract_cmd: str = 'tesseract'):
        self.tesseract_cmd = tesseract_cmd
        pytesseract.pytesseract.tesseract_cmd = self.tesseract_cmd

    def extract_text(self, file_bytes: bytes, filename: str) -> str:
        ext = filename.split('.')[-1].lower()
        if ext == 'pdf':
            return self._extract_pdf(file_bytes)
        elif ext in ['docx', 'doc']:
            return self._extract_docx(file_bytes)
        elif ext in ['png', 'jpg', 'jpeg', 'tiff']:
            return self._extract_image(file_bytes)
        else:
            raise ValueError(f"Unsupported file extension: {ext}")

    def _extract_pdf(self, file_bytes: bytes) -> str:
        text = ""
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text() + "\n"
            if len(text.strip()) < 50:
                text = self._extract_pdf_ocr(file_bytes)
        except Exception as e:
            logger.error(f"PyMuPDF failed: {e}")
            text = self._extract_pdf_ocr(file_bytes)
        return self._clean_text(text)

    def _extract_pdf_ocr(self, file_bytes: bytes) -> str:
        text = ""
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                pix = page.get_pixmap()
                img_bytes = pix.tobytes("png")
                img = Image.open(io.BytesIO(img_bytes))
                text += pytesseract.image_to_string(img, lang='eng+hin') + "\n"
        except Exception as e:
            logger.error(f"OCR on PDF failed: {e}")
        return self._clean_text(text)

    def _extract_docx(self, file_bytes: bytes) -> str:
        text = ""
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            for para in doc.paragraphs:
                text += para.text + "\n"
        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")
        return self._clean_text(text)

    def _extract_image(self, file_bytes: bytes) -> str:
        text = ""
        try:
            img = Image.open(io.BytesIO(file_bytes))
            text = pytesseract.image_to_string(img, lang='eng+hin')
        except Exception as e:
            logger.error(f"Image OCR failed: {e}")
        return self._clean_text(text)

    def _clean_text(self, text: str) -> str:
        if not text:
            return ""
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
