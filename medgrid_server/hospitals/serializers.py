from rest_framework import serializers
from .models import Hospital, Department, Doctor, BloodInventory, Review, Patient, Ambulance, BloodDonor, Bed, EmergencyCase

class EmergencyCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyCase
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'available', 'total']

class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = ['id', 'department_name', 'bed_code', 'is_available', 'last_updated']

class BloodInventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodInventory
        fields = ['blood_group', 'units']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty', 'available', 'on_shift', 'on_call', 'phone', 'shift_timings']

class HospitalSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, required=False)
    blood_inventory = BloodInventorySerializer(many=True, required=False)
    doctors = DoctorSerializer(many=True, required=False)
    beds = BedSerializer(many=True, required=False)

    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'email', 'password', 'location', 'phone', 
            'departments', 'blood_inventory', 'doctors', 'beds',
            'verified', 'latitude', 'longitude', 'equipment',
            'hospital_id_code', 'full_address', 'emergency_contact',
            'opening_time', 'closing_time', 'is_24_7', 'working_days',
            'specialties', 'data_verified', 'updated_at'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        departments_data = validated_data.pop('departments', None)
        blood_data = validated_data.pop('blood_inventory', None)
        doctors_data = validated_data.pop('doctors', None)
        beds_data = validated_data.pop('beds', None)
        
        # Update Hospital fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update Departments
        if departments_data is not None:
            for dept_data in departments_data:
                dept_name = dept_data.get('name')
                if dept_name:
                    Department.objects.update_or_create(
                        hospital=instance, name=dept_name,
                        defaults={'available': dept_data.get('available', 0), 'total': dept_data.get('total', 0)}
                    )

        # Update Blood Inventory
        if blood_data is not None:
            for b_data in blood_data:
                b_group = b_data.get('blood_group')
                if b_group:
                    BloodInventory.objects.update_or_create(
                        hospital=instance, blood_group=b_group,
                        defaults={'units': b_data.get('units', 0)}
                    )

        # Update/Create Doctors
        if doctors_data is not None:
            for doc_data in doctors_data:
                doc_id = doc_data.get('id')
                if doc_id:
                    Doctor.objects.filter(id=doc_id, hospital=instance).update(
                        specialty=doc_data.get('specialty', ''),
                        phone=doc_data.get('phone', ''),
                        shift_timings=doc_data.get('shift_timings', ''),
                        on_shift=doc_data.get('on_shift', False),
                        on_call=doc_data.get('on_call', False)
                    )
                else:
                    # Create new doctor
                    Doctor.objects.create(hospital=instance, **doc_data)

        # Update/Create Beds
        if beds_data is not None:
            for bed_data in beds_data:
                bed_id = bed_data.get('id')
                if bed_id:
                    Bed.objects.filter(id=bed_id, hospital=instance).update(
                        is_available=bed_data.get('is_available', True),
                        department_name=bed_data.get('department_name', 'General')
                    )
                else:
                    # Create new bed
                    Bed.objects.create(hospital=instance, **bed_data)

        return instance

class BloodDonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodDonor
        fields = '__all__'

class AmbulanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'hospital', 'patient', 'patient_name', 'rating', 'comment', 'created_at']
