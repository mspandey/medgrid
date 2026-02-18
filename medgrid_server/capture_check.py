
import subprocess

with open('error_log.txt', 'w', encoding='utf-8') as f:
    subprocess.run(['python', 'manage.py', 'check'], stderr=subprocess.STDOUT, stdout=f)
