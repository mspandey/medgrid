import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital, Doctor

print("--- Hospitals ---")
for h in Hospital.objects.all():
    print(f"ID: {h.id}, Name: {h.name}, Email: {h.email}")

print("\n--- Doctors ---")
for d in Doctor.objects.all():
    print(f"ID: {d.id}, Name: {d.name}, Hospital: {d.hospital.name}, OnShift: {d.on_shift}, OnCall: {d.on_call}")

h_apro = Hospital.objects.filter(name='apro').first()
if h_apro:
    print(f"\n--- Doctors for 'apro' (ID: {h_apro.id}) ---")
    docs = Doctor.objects.filter(hospital=h_apro)
    if not docs.exists():
        print("No doctors found for 'apro'.")
    for d in docs:
        print(f"ID: {d.id}, Name: {d.name}, OnShift: {d.on_shift}, OnCall: {d.on_call}")
else:
    print("\nHospital 'apro' not found.")
