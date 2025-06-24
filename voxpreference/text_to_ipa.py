import sys
import json
import os
from functools import lru_cache
from phonemizer import phonemize

@lru_cache(maxsize=256)
def _phonemize_cached(texts_tuple, language, backend, strip, preserve_punctuation, punctuation_marks, with_stress):
    """Cached internal function for phonemization."""
    return phonemize(
        list(texts_tuple),
        language=language,
        backend=backend,
        strip=strip,
        preserve_punctuation=preserve_punctuation,
        punctuation_marks=punctuation_marks,
        with_stress=with_stress,
        njobs=os.cpu_count() or 1 
    )

def convert_to_ipa(text):
    try:
        is_string_input = isinstance(text, str)
        
        if is_string_input:
            texts = [line for line in text.split('\n') if line.strip()]
        elif isinstance(text, list):
            texts = [item for item in text if isinstance(item, str) and item.strip()]
        else:
            raise TypeError("Input must be a string or a list of strings.")

        if not texts:
            return {"success": True, "ipa": "" if is_string_input else []}

        phonemizer_args = (
            "en-us",
            "espeak",
            True,
            True,
            ';:,.!?¡¿—…"«»"()',
            True
        )
        
        ipa_list = _phonemize_cached(tuple(texts), *phonemizer_args)
        
        result_ipa = "\n".join(ipa_list) if is_string_input else ipa_list

        return {
            "success": True,
            "ipa": result_ipa
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    text = sys.stdin.read()
    result = convert_to_ipa(text)
    print(json.dumps(result)) 