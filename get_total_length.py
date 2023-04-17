import os
from pydub import AudioSegment

s = ""
t = ".wav"


total_sec = 0

for root, dirs, files in os.walk(s):
        for name in files:
            if name.endswith(t):
                  audio = AudioSegment.from_file(os.path.join(s, name))
                  total_sec += audio.duration_seconds

print(f"Total Length: {total_sec} sec(s); {total_sec/60} min(s); {total_sec/60/60} hr(s)")
