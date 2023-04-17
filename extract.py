import uuid
import os
import shutil
from rich.progress import Progress
from rich.console import Console

console = Console()

s = ""
d = ""
t = ".wav"

with Progress() as progress:
    for root, dirs, files in progress.track(os.walk(s), description="Copying"):
        for name in files:
            if name.endswith(t):
                shutil.copyfile(os.path.join(root, name), os.path.join(d, str(uuid.uuid4())+t))
                # console.log(os.path.join(root, name))
