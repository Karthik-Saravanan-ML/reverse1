import re

class TextCleaner:
    def clean(self, text: str) -> str:
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def is_meaningful(self, text: str, min_words: int = 10) -> bool:
        words = text.split()
        return len(words) >= min_words
