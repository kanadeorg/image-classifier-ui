import os

s = ""
d = ""
t = ".wav"


total_sec = 0

for root, dirs, files in os.walk(s):
        for name in files:
            if name.endswith(t):
                  os.system(f"ffmpeg -i \"{os.path.join(root, name)}\" -af silenceremove=stop_periods=-1:stop_duration=0.1:stop_threshold=-50dB {os.path.join(d, name)}")