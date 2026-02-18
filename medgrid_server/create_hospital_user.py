
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital

email = "apro43@gmail.com"
password = "medgrid123"

# Check if exists
if Hospital.objects.filter(email=email).exists():
    print(f"User {email} already exists.")
else:
    h = Hospital.objects.create(
        name="Metro City Hospital",
        email=email,
        password=password,
        location="Downtown District",
        phone="+1 555-0123",
        verified=True
    )
    print(f"Successfully created hospital account for {email} with password '{password}'")
