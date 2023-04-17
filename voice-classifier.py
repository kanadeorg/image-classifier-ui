# import uuid
# import os
# import shutil
# from rich.progress import Progress
# from rich.console import Console

# console = Console()

# s = ""
# d = ""
# t = ".ogg"

# with Progress() as progress:
#     for root, dirs, files in progress.track(os.walk(s), description="Copying"):
#         for name in files:
#             if name.endswith(t):
#                 shutil.copyfile(os.path.join(root, name), os.path.join(d, str(uuid.uuid4())+t))
#                 # console.log(os.path.join(root, name))

import tensorflow as tf
import tensorflow_io as tfio
import os

s = ""
t_pos = ".\\pos"
t_neg = ".\\neg"

ext = ".ogg"

model = tf.keras.models.load_model('')

def load_ogg_16k_mono(filename):
    res = tfio.audio.AudioIOTensor(filename)
    tensor = res.to_tensor()
    tensor = tf.math.reduce_sum(tensor, axis=1) / 2
    sample_rate = res.rate
    sample_rate = tf.cast(sample_rate, dtype=tf.int64)
    wav = tfio.audio.resample(tensor, rate_in=sample_rate, rate_out=16000)
    return wav

def preprocess(path):
    au = load_ogg_16k_mono(path)
    if len(au > 90000):
        au = au[:90000]
    print(au.shape)
    zero_padding = tf.zeros([90000] - tf.shape(au), dtype=tf.float32)
    print(zero_padding)
    au = tf.concat([zero_padding, au], 0)
    print(au.shape)
    spectro = tf.signal.stft(au, frame_length=320, frame_step=100)
    spectro = tf.abs(spectro)
    spectro = tf.expand_dims(spectro, axis=2)
    return spectro

file = ''
wav = preprocess(os.path.join(s,file))

import numpy as np
test = np.array([wav])
y = model.predict(test)
print(y)