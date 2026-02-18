
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

from hospitals.models import Hospital

# Delete hospitals with empty passwords (created during the bug)
broken_hospitals = Hospital.objects.filter(password='')
count = broken_hospitals.count()
broken_hospitals.delete()
print(f"Deleted {count} broken hospital records.")
