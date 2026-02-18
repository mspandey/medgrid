
import os
import django
import sys
import traceback

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medgrid_server.settings')
django.setup()

try:
    print("Attempting to import models...")
    from hospitals.models import Review
    print("Models imported successfully.")
    
    print("Attempting to import serializers...")
    from hospitals.serializers import ReviewSerializer
    print("Serializers imported successfully.")
    
    print("Attempting to import views...")
    from hospitals.views import ReviewViewSet
    print("Views imported successfully.")
    
except ImportError as e:
    print("ImportError caught:")
    traceback.print_exc()
except Exception as e:
    print(f"An error occurred: {e}")
    traceback.print_exc()
