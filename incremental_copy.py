import os
import shutil

s_local = ""
s_remote = ""
d = ""

t = ".ogg"

local_files = []
remote_files = []

for file_name in os.listdir(s_local):
    if file_name.endswith(t):
            local_files.append(file_name)

for file_name in os.listdir(s_remote):
    if file_name.endswith(t):
            remote_files.append(file_name)

for remote_file in remote_files:
    if remote_file not in local_files:
        shutil.copyfile(os.path.join(s_remote, remote_file), os.path.join(d, remote_file))
    else:
         print(f"{remote_file} exists, skip")
