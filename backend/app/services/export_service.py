"""Export Service for Specifications."""
import logging
import io

try:
    from reportlab.pdfgen import canvas # type: ignore
    from reportlab.lib.pagesizes import letter # type: ignore
except ImportError:
    pass

try:
    import docx # type: ignore
except ImportError:
    pass

logger = logging.getLogger(__name__)

class ExportService:
    def export_pdf(self, spec: dict) -> bytes:
        buffer = io.BytesIO()
        try:
            c = canvas.Canvas(buffer, pagesize=letter)
            c.drawString(100, 750, f"Title: {spec.get('title', 'Specification')}")
            y = 700
            for k, v in spec.items():
                if k == 'title': continue
                c.drawString(100, y, f"{k}: {str(v)[:50]}...")
                y -= 50
            c.showPage()
            c.save()
        except Exception as e:
            logger.error(f"PDF export failed: {e}")
        return buffer.getvalue()

    def export_docx(self, spec: dict) -> bytes:
        buffer = io.BytesIO()
        try:
            doc = docx.Document()
            doc.add_heading(spec.get('title', 'Specification'), 0)
            for k, v in spec.items():
                if k == 'title': continue
                doc.add_heading(k, level=1)
                doc.add_paragraph(str(v))
            doc.save(buffer)
        except Exception as e:
            logger.error(f"DOCX export failed: {e}")
        return buffer.getvalue()
