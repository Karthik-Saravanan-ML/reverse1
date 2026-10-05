from langchain_text_splitters import RecursiveCharacterTextSplitter

class DocumentChunker:
    def __init__(self, chunk_size: int = 512, chunk_overlap: int = 50):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    def chunk_pages(self, pages: list[dict], document_id: str, project_id: str) -> list[dict]:
        chunks = []
        chunk_idx = 0
        for page in pages:
            text = page.get("text", "")
            page_num = page.get("page_number", 1)
            if not text.strip():
                continue
            split_texts = self.splitter.split_text(text)
            for split_text in split_texts:
                chunks.append({
                    "content": split_text,
                    "chunk_index": chunk_idx,
                    "page_number": page_num,
                    "document_id": document_id,
                    "project_id": project_id,
                    "word_count": len(split_text.split()),
                    "token_estimate": len(split_text) // 4
                })
                chunk_idx += 1
        return chunks
    
    def chunk_text(self, text: str, metadata: dict) -> list[dict]:
        chunks = []
        split_texts = self.splitter.split_text(text)
        for idx, split_text in enumerate(split_texts):
            chunk = {
                "content": split_text,
                "chunk_index": idx,
                "metadata": metadata,
                "word_count": len(split_text.split()),
                "token_estimate": len(split_text) // 4
            }
            chunks.append(chunk)
        return chunks
