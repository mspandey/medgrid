
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

print("Importing Patient...")
from hospitals.models import Patient
print(f"Patient: {Patient}")

print("Importing ReviewSerializer...")
from hospitals.serializers import ReviewSerializer
print(f"ReviewSerializer: {ReviewSerializer}")

print("Importing ReviewViewSet...")
from hospitals.views import ReviewViewSet
print(f"ReviewViewSet: {ReviewViewSet}")
