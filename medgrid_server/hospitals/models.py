from django.db import models

class Hospital(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255) # Hashed password
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    verified = models.BooleanField(default=False)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    equipment = models.TextField(blank=True, null=True) # JSON or Comma-separated list
    
    hospital_id_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    full_address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=20, blank=True, null=True)
    
    # Operating Details
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)
    is_24_7 = models.BooleanField(default=False)
    working_days = models.CharField(max_length=255, default='Mon-Fri') # Comma separated
    
    # Specialties & Verification
    specialties = models.TextField(blank=True, null=True) # JSON or Comma-separated
    data_verified = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    hospital = models.ForeignKey(Hospital, related_name='departments', on_delete=models.CASCADE)
    name = models.CharField(max_length=50) # e.g., 'ICU', 'General', 'NICU'
    available = models.IntegerField(default=0)
    total = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.hospital.name} - {self.name}"

class Bed(models.Model):
    hospital = models.ForeignKey(Hospital, related_name='beds', on_delete=models.CASCADE)
    department_name = models.CharField(max_length=50) # 'ICU', 'General', etc.
    bed_code = models.CharField(max_length=20) # e.g., 'ICU-101'
    is_available = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.hospital.name} - {self.bed_code} ({'Available' if self.is_available else 'Occupied'})"

    class Meta:
        unique_together = ('hospital', 'bed_code')

class BloodInventory(models.Model):
    hospital = models.ForeignKey(Hospital, related_name='blood_inventory', on_delete=models.CASCADE)
    blood_group = models.CharField(max_length=5) # e.g., 'A+', 'O-'
    units = models.IntegerField(default=0)

    class Meta:
        unique_together = ('hospital', 'blood_group')

    def __str__(self):
        return f"{self.hospital.name} - {self.blood_group}: {self.units}"

class Doctor(models.Model):
    hospital = models.ForeignKey(Hospital, related_name='doctors', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=100)
    available = models.BooleanField(default=True)
    on_shift = models.BooleanField(default=False)
    on_call = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True, null=True)
    shift_timings = models.CharField(max_length=100, blank=True, null=True) # e.g., '09:00 AM - 05:00 PM'

    def __str__(self):
        return f"{self.name} ({self.specialty})"

class Patient(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    blood_group = models.CharField(max_length=5, blank=True)
    address = models.TextField(blank=True, null=True)
    medical_history = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True, related_name='medical_records')
    diagnosis = models.TextField()
    prescription = models.TextField()
    treatment_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Record for {self.patient.name} at {self.hospital.name}"

class BloodDonor(models.Model):
    # Personal Info
    full_name = models.CharField(max_length=255)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    blood_group = models.CharField(max_length=5)
    weight = models.FloatField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()

    # Health & Eligibility
    healthy_today = models.BooleanField(default=False)
    recent_illness = models.BooleanField(default=False)
    chronic_diseases = models.BooleanField(default=False)
    recent_surgery = models.BooleanField(default=False)
    taking_meds = models.BooleanField(default=False)
    pregnancy = models.BooleanField(default=False)
    tattoo_piercing = models.BooleanField(default=False)
    history_high_risk = models.BooleanField(default=False)

    # Donation History
    first_time_donor = models.BooleanField(default=True)
    last_donation_date = models.DateField(blank=True, null=True)
    complications = models.BooleanField(default=False)

    # Availability
    emergency_donor = models.BooleanField(default=False)
    preferred_time = models.CharField(max_length=255, blank=True)
    
    # Consent
    consent_agreed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.blood_group})"

class Ambulance(models.Model):
    vehicle_number = models.CharField(max_length=20, unique=True)
    driver_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    status = models.CharField(max_length=20, default='Available') # Available, Busy, Offline
    is_available = models.BooleanField(default=True) # Deprecated but kept for backward compatibility if needed
    
    def __str__(self):
        return f"{self.vehicle_number} - {self.driver_name}"

class Review(models.Model):
    hospital = models.ForeignKey(Hospital, related_name='reviews', on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating}* for {self.hospital.name} by {self.patient.name}"

class EmergencyCase(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Enroute', 'Enroute'),
        ('Arrived', 'Arrived'),
        ('HandedOver', 'HandedOver'),
    ]
    SEVERITY_CHOICES = [
        ('Critical', 'Critical'),
        ('Moderate', 'Moderate'),
        ('Stable', 'Stable'),
    ]

    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='emergencies')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='emergencies')
    patient_name = models.CharField(max_length=255)
    patient_condition = models.CharField(max_length=255)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='Moderate')
    eta_minutes = models.IntegerField(default=10)
    distance_km = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Emergency: {self.patient_name} -> {self.hospital.name}"
