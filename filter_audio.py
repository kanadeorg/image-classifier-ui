import os
import shutil
from pydub import AudioSegment

s = ""
t = ".ogg"
min = 2
d = ""


for root, dirs, files in os.walk(s):
        for name in files:
            if name.endswith(t):
                  audio = AudioSegment.from_file(os.path.join(s, name))
                  if (audio.duration_seconds >= min):
                        shutil.copyfile(os.path.join(root, name), os.path.join(d, name))
