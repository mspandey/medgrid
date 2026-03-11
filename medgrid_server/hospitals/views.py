from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Hospital, Doctor, Review, Patient, Ambulance, BloodDonor, Department, BloodInventory, Bed, EmergencyCase, MedicalRecord
from .serializers import HospitalSerializer, DoctorSerializer, ReviewSerializer, BloodDonorSerializer, AmbulanceSerializer, BedSerializer, EmergencyCaseSerializer, PatientSerializer, MedicalRecordSerializer
from .ai_logic import recommend_hospital

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all().prefetch_related('departments', 'blood_inventory', 'doctors', 'beds')
    serializer_class = HospitalSerializer

    def get_queryset(self):
        queryset = Hospital.objects.all().prefetch_related('departments', 'blood_inventory', 'doctors', 'beds')
        # Search params
        location = self.request.query_params.get('location', None)
        search = self.request.query_params.get('search', None)
        
        if location:
            queryset = queryset.filter(location__icontains=location)
        if search:
            queryset = queryset.filter(name__icontains=search)
            
        return queryset

class EmergencyCaseViewSet(viewsets.ModelViewSet):
    queryset = EmergencyCase.objects.all()
    serializer_class = EmergencyCaseSerializer

    def get_queryset(self):
        queryset = EmergencyCase.objects.all()
        hospital_id = self.request.query_params.get('hospital', None)
        status = self.request.query_params.get('status', None)
        
        if hospital_id:
            queryset = queryset.filter(hospital_id=hospital_id)
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset.order_by('-created_at')

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all().order_by('-created_at')
    serializer_class = PatientSerializer

class MedicalRecordViewSet(viewsets.ModelViewSet):
    queryset = MedicalRecord.objects.all().select_related('patient', 'doctor', 'hospital').order_by('-created_at')
    serializer_class = MedicalRecordSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        patient_id = self.request.query_params.get('patient', None)
        hospital_id = self.request.query_params.get('hospital', None)
        
        if patient_id:
            queryset = queryset.filter(patient_id=patient_id)
        if hospital_id:
            queryset = queryset.filter(hospital_id=hospital_id)
            
        return queryset

@api_view(['POST'])
def hospital_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        hospital = Hospital.objects.get(email=email)
        if hospital.password == password:
            return Response({
                'token': f'mock-token-{hospital.id}',
                'user': {'id': hospital.id, 'name': hospital.name, 'role': 'hospital'}
            })
        return Response({'msg': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Hospital.DoesNotExist:
        return Response({'msg': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def patient_register(request):
    from .models import Patient
    try:
        patient = Patient.objects.create(
            name=request.data.get('name'),
            email=request.data.get('email'),
            password=request.data.get('password'),
            phone=request.data.get('phone', ''),
            age=request.data.get('age', 0),
            blood_group=request.data.get('bloodGroup', '')
        )
        return Response({
            'token': f'mock-token-{patient.id}',
            'user': {'id': patient.id, 'name': patient.name, 'role': 'user'}
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def patient_login(request):
    from .models import Patient
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        patient = Patient.objects.get(email=email)
        if patient.password == password:
             return Response({
                'token': f'mock-token-{patient.id}',
                'user': {'id': patient.id, 'name': patient.name, 'role': 'user'}
            })
        return Response({'msg': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Patient.DoesNotExist:
        return Response({'msg': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def patient_google_auth(request):
    from .models import Patient
    email = request.data.get('email')
    name = request.data.get('name')
    uid = request.data.get('uid')

    if not email or not uid:
        return Response({'msg': 'Email and UID are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        patient = Patient.objects.get(email=email)
        # Log them in 
        return Response({
            'token': f'mock-token-{patient.id}',
            'user': {'id': patient.id, 'name': patient.name, 'role': 'user'}
        })
    except Patient.DoesNotExist:
        # Create a new account automatically
        try:
            patient = Patient.objects.create(
                name=name or 'Google User',
                email=email,
                password=uid, # Use Google UID as a dummy password 
                phone='',
                age=0,
                blood_group=''
            )
            return Response({
                'token': f'mock-token-{patient.id}',
                'user': {'id': patient.id, 'name': patient.name, 'role': 'user'}
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def ambulance_register(request):
    from .models import Ambulance
    try:
        data = request.data
        ambulance = Ambulance.objects.create(
            vehicle_number=data.get('vehicle_number'),
            driver_name=data.get('driver_name'),
            phone=data.get('phone'),
            email=data.get('email'),
            password=data.get('password'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            status=data.get('status', 'Available') # Available, Busy, Offline
        )
        return Response({
            'token': f'mock-token-amb-{ambulance.id}',
            'user': {
                'id': ambulance.id, 
                'name': ambulance.driver_name, 
                'role': 'ambulance',
                'status': ambulance.status,
                'latitude': ambulance.latitude,
                'longitude': ambulance.longitude
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'msg': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def ambulance_login(request):
    from .models import Ambulance
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        ambulance = Ambulance.objects.get(email=email)
        if ambulance.password == password:
            return Response({
                'token': f'mock-token-amb-{ambulance.id}',
                'user': {'id': ambulance.id, 'name': ambulance.driver_name, 'role': 'ambulance'}
            })
        return Response({'msg': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Ambulance.DoesNotExist:
        return Response({'msg': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().select_related('patient', 'hospital').order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        hospital_id = self.request.query_params.get('hospital', None)
        if hospital_id:
            queryset = queryset.filter(hospital_id=hospital_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        # Allow partial updates for the inventory/profile
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

@api_view(['POST'])
def toggle_bed_status(request, pk):
    try:
        bed = Bed.objects.get(pk=pk)
        bed.is_available = not bed.is_available
        bed.save()
        return Response({'id': bed.id, 'is_available': bed.is_available, 'bed_code': bed.bed_code})
    except Bed.DoesNotExist:
        return Response({'msg': 'Bed not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def toggle_doctor_status(request, pk):
    status_type = request.data.get('type') # 'shift' or 'call'
    try:
        doctor = Doctor.objects.get(pk=pk)
        if status_type == 'shift':
            doctor.on_shift = not doctor.on_shift
        elif status_type == 'call':
            doctor.on_call = not doctor.on_call
        doctor.save()
        return Response({'id': doctor.id, 'on_shift': doctor.on_shift, 'on_call': doctor.on_call, 'name': doctor.name})
    except Doctor.DoesNotExist:
        return Response({'msg': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_ai_recommendation(request):
    amb_lat = request.query_params.get('lat')
    amb_lon = request.query_params.get('lon')
    condition = request.query_params.get('condition', 'General')
    blood_group = request.query_params.get('blood_group', 'O+')
    
    if not amb_lat or not amb_lon:
        return Response({'msg': 'Latitude and Longitude are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    recommendations = recommend_hospital(amb_lat, amb_lon, condition, blood_group)
    return Response(recommendations)


@api_view(['POST'])
def blood_donation(request):
    """Register a blood donor and send a confirmation email."""
    from django.core.mail import send_mail
    from django.conf import settings as django_settings

    data = request.data
    donor_name = data.get('fullName', 'Donor')
    donor_email = data.get('email', '')
    blood_group = data.get('bloodGroup', 'Unknown')

    # Save to DB
    try:
        donor = BloodDonor.objects.create(
            full_name=donor_name,
            blood_group=blood_group,
            age=int(data.get('age', 0) or 0),
            gender=data.get('gender', ''),
            weight=float(data.get('weight', 0) or 0),
            phone=data.get('phone', ''),
            email=donor_email,
            address=data.get('address', ''),
            healthy_today=data.get('healthyToday', False),
            recent_illness=data.get('recentIllness', False),
            chronic_diseases=data.get('chronicDiseases', False),
            recent_surgery=data.get('recentSurgery', False),
            taking_meds=data.get('takingMeds', False),
            pregnancy=data.get('pregnancy', False),
            tattoo_piercing=data.get('tattooPiercing', False),
            history_high_risk=data.get('historyHighRisk', False),
            first_time_donor=data.get('firstTimeDonor', True),
            emergency_donor=data.get('emergencyDonor', False),
            preferred_time=data.get('preferredTime', ''),
            consent_agreed=data.get('voluntaryAgreed', False),
        )
    except Exception as e:
        return Response({'msg': f'DB error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


    # Find a hospital to direct the donor to
    hospital = Hospital.objects.first()
    hospital_name = hospital.name if hospital else 'MedGrid Partner Hospital'
    hospital_address = hospital.full_address if hospital and hospital.full_address else hospital.location if hospital else 'Please visit your nearest hospital'
    hospital_phone = hospital.phone if hospital else 'N/A'

    # Send confirmation email if email provided
    if donor_email:
        subject = '🩸 Blood Donor Registration Confirmed — MedGrid'
        message = f"""Dear {donor_name},

Thank you for registering as a blood donor on MedGrid! Your generosity can save lives. ❤️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR REGISTRATION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name        : {donor_name}
Blood Group : {blood_group}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT STEPS — PLEASE VISIT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hospital    : {hospital_name}
Address     : {hospital_address}
Contact     : {hospital_phone}

Please visit the hospital at your earliest convenience to:
  1. Get a quick health screening & blood test
  2. Complete your donation (takes ~30 minutes)
  3. Receive your donor certificate

Bring a valid ID and stay hydrated before your visit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for being a hero. 🦸
— Team MedGrid
"""
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[donor_email],
                fail_silently=False,
            )
        except Exception as e:
            # Don't fail the registration if email fails
            print(f"Email send failed: {e}")

    return Response({
        'msg': 'Registration successful! A confirmation email has been sent.',
        'donor_id': donor.id,
        'hospital': hospital_name,
        'hospital_address': hospital_address,
    }, status=status.HTTP_201_CREATED)

