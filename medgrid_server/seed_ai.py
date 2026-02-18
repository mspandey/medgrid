import os
import django
import sys

# Set up Django environment
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital, Department, BloodInventory, Doctor

def seed_ai_data():
    # Update Hospitals with coordinates and equipment
    data = [
        {
            "name": "City General Hospital",
            "lat": 27.176174,
            "lon": 75.956827,
            "equipment": "MRI, CT-Scan, Ventilators, Oxygen Support",
            "depts": [
                ("ICU", 10, 15), 
                ("Trauma", 5, 20),
                ("General", 30, 50),
                ("NICU", 4, 10),
                ("Women Ward", 8, 20),
                ("Children Ward", 12, 25),
                ("Deluxe", 2, 5)
            ],
            "blood": [("O+", 10), ("A+", 5), ("B+", 8), ("AB+", 3)]
        },
        {
            "name": "Metro North Govt.",
            "lat": 27.186174,
            "lon": 75.966827,
            "equipment": "Ventilators, X-Ray, Oxygen Support",
            "depts": [
                ("ICU", 2, 10), 
                ("General", 20, 50),
                ("NICU", 0, 5)
            ],
            "blood": [("O+", 2), ("O-", 8), ("A-", 10)]
        },
        {
            "name": "Emergency Trauma Care",
            "lat": 27.166174,
            "lon": 75.946827,
            "equipment": "Trauma Kits, Portable X-Ray",
            "depts": [("Trauma", 15, 15), ("Emergency", 10, 10)],
            "blood": [("B+", 10), ("AB+", 2)]
        }
    ]

    for h_data in data:
        hospital, created = Hospital.objects.get_or_create(
            name=h_data["name"],
            defaults={"email": h_data["name"].lower().replace(" ", "") + "@test.com", "password": "password", "location": "Test City"}
        )
        hospital.latitude = h_data["lat"]
        hospital.longitude = h_data["lon"]
        hospital.equipment = h_data["equipment"]
        hospital.save()

        # Seed Depts
        for d_name, avail, total in h_data["depts"]:
            Department.objects.get_or_create(hospital=hospital, name=d_name, defaults={"available": avail, "total": total})
        
        # Seed Blood
        for b_group, units in h_data["blood"]:
            BloodInventory.objects.get_or_create(hospital=hospital, blood_group=b_group, defaults={"units": units})

    print("AI Seed data populated!")

if __name__ == "__main__":
    seed_ai_data()
