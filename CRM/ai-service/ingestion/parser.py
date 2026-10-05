import fitz
from docx import Document as DocxDocument
from io import BytesIO
import re

class DocumentParser:
    def parse_pdf(self, file_bytes: bytes) -> list[dict]:
        pages = []
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text()
                pages.append({"page_number": page_num + 1, "text": text, "metadata": {}})
        except Exception as e:
            print(f"Error parsing PDF: {e}")
        return pages

    def parse_docx(self, file_bytes: bytes) -> list[dict]:
        sections = []
        try:
            doc = DocxDocument(BytesIO(file_bytes))
            text = "\n".join([para.text for para in doc.paragraphs])
            sections.append({"section": "Document", "text": text, "heading_level": 0})
        except Exception as e:
            print(f"Error parsing DOCX: {e}")
        return sections

    def parse_document(self, file_bytes: bytes, file_type: str) -> dict:
        pages = []
        full_text = ""
        if file_type.lower() == "pdf":
            pages = self.parse_pdf(file_bytes)
            full_text = "\n".join([p["text"] for p in pages])
        elif file_type.lower() in ["doc", "docx"]:
            sections = self.parse_docx(file_bytes)
            full_text = "\n".join([s["text"] for s in sections])
            pages = [{"page_number": 1, "text": full_text, "metadata": {}}]
        else:
            try:
                full_text = file_bytes.decode("utf-8")
                pages = [{"page_number": 1, "text": full_text, "metadata": {}}]
            except Exception as e:
                print(f"Error parsing text: {e}")

        return {"pages": pages, "metadata": {"file_type": file_type}, "full_text": full_text}
