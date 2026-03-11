from django.urls import path, include
# Force Reload
from rest_framework.routers import DefaultRouter
from .views import HospitalViewSet, hospital_login, patient_login, patient_register, patient_google_auth, blood_donation, ambulance_login, ambulance_register, ReviewViewSet, get_ai_recommendation, toggle_bed_status, toggle_doctor_status, EmergencyCaseViewSet, PatientViewSet, MedicalRecordViewSet

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'emergencies', EmergencyCaseViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'medical-records', MedicalRecordViewSet)

# Debug Print
print("Loading hospitals/urls.py...")

urlpatterns = [
    path('auth/login', hospital_login),
    path('auth/patient/login', patient_login),
    path('auth/patient/register', patient_register),
    path('auth/patient/google', patient_google_auth),
    path('auth/ambulance/login', ambulance_login),
    path('auth/ambulance/register', ambulance_register),
    path('ai-recommendation', get_ai_recommendation),
    path('beds/<int:pk>/toggle', toggle_bed_status),
    path('doctors/<int:pk>/toggle', toggle_doctor_status),
    path('blood-donation', blood_donation),
    path('', include(router.urls)),
]
