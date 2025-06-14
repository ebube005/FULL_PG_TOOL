from phonemizer import phonemize
from phonemizer.backend.espeak.wrapper import EspeakWrapper
# EspeakWrapper.set_library(r'C:\Program Files (x86)\eSpeak\command_line\espeak.exe')
text = ["Hello, world!"]
phonemes = phonemize(text, language='en-us', backend='espeak')
print(phonemes)