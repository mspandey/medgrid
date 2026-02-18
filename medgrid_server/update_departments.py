import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital, Department

def update_all_hospitals():
    hospitals = Hospital.objects.all()
    print(f"Found {hospitals.count()} hospitals. Updating...")
    
    new_depts = [
        ("ICU", 12, 12),
        ("NICU", 8, 12),
        ("General Ward", 45, 100),
        ("Deluxe Room", 3, 5),
        ("Child Dept", 12, 20),
        ("Women/Maternal Dept", 15, 25)
    ]

    for h in hospitals:
        print(f"Updating {h.name}...")
        h.departments.all().delete()
        for name, avail, total in new_depts:
            Department.objects.create(hospital=h, name=name, available=avail, total=total)
    
    print("All hospitals updated successfully!")

if __name__ == "__main__":
    update_all_hospitals()
