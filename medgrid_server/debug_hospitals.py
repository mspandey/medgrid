
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital

with open('hospitals_dump.txt', 'w', encoding='utf-8') as f:
    f.write("--- REGISTERED HOSPITALS ---\n")
    for h in Hospital.objects.all():
        f.write(f"ID: {h.id} | Name: {h.name} | Email: '{h.email}' | Password: '{h.password}'\n")
    f.write("--------------------------\n")
print("Done writing to hospitals_dump.txt")
