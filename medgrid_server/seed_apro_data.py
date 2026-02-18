import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital, Doctor, Bed

def seed():
    apro = Hospital.objects.filter(name='apro').first()
    if not apro:
        print("Hospital 'apro' not found. Please register it first.")
        return

    print(f"Seeding data for {apro.name}...")

    # Seed Doctors
    doctors_data = [
        {"name": "Dr. Sarah Smith", "specialty": "Cardiologist", "phone": "+91 98765 00001", "shift_timings": "09:00 AM - 05:00 PM", "on_shift": True},
        {"name": "Dr. James Wilson", "specialty": "Neurologist", "phone": "+91 98765 00002", "shift_timings": "10:00 AM - 06:00 PM", "on_shift": False, "on_call": True},
        {"name": "Dr. Elena Rodriguez", "specialty": "Pediatrician", "phone": "+91 98765 00003", "shift_timings": "08:00 AM - 04:00 PM", "on_shift": True},
        {"name": "Dr. Michael Chen", "specialty": "Emergency Specialist", "phone": "+91 98765 00004", "shift_timings": "07:00 PM - 07:00 AM", "on_shift": False, "on_call": True},
    ]

    for d_data in doctors_data:
        Doctor.objects.get_or_create(hospital=apro, name=d_data['name'], defaults=d_data)

    # Seed Beds
    beds_data = [
        {"bed_code": "ICU-101", "department_name": "ICU", "is_available": True},
        {"bed_code": "ICU-102", "department_name": "ICU", "is_available": False},
        {"bed_code": "GEN-201", "department_name": "General", "is_available": True},
        {"bed_code": "GEN-202", "department_name": "General", "is_available": True},
        {"bed_code": "PED-301", "department_name": "Pediatrics", "is_available": True},
    ]

    for b_data in beds_data:
        Bed.objects.get_or_create(hospital=apro, bed_code=b_data['bed_code'], defaults=b_data)

    print("Seeding completed successfully!")

if __name__ == "__main__":
    seed()
