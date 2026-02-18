import pandas as pd
from django.core.management.base import BaseCommand
from hospitals.models import Hospital, Department, BloodInventory, Doctor
import os

class Command(BaseCommand):
    help = 'Seeds the database with hospital and doctor data from Excel files'

    def handle(self, *args, **kwargs):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        # base_dir should be d:\medgrid\medgrid_server -> parent -> d:\medgrid
        # Actually structure: d:\medgrid\medgrid_server\medgrid_server\settings.py
        # Command is in d:\medgrid\medgrid_server\hospitals\management\commands\seed_data.py
        # root of medgrid (where .xls are) is d:\medgrid
        
        # d:\medgrid\medgrid_server\hospitals\management\commands\seed_data.py
        # available at:
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))
        # But wait, medgrid_server is inside d:\medgrid. 
        # So d:\medgrid\medgrid_server\hospitals\management\commands\seed_data.py
        # 1. commands
        # 2. management
        # 3. hospitals
        # 4. medgrid_server (project folder)
        # 5. d:\medgrid (root) -- Wait, did I create medgrid_server inside medgrid? Yes.
        
        # Paths to Excel
        hospitals_file = os.path.join(project_root, 'hospitals_expanded.xls')
        doctors_file = os.path.join(project_root, 'doctors_expanded.xls')

        self.stdout.write(f"Reading {hospitals_file}...")
        
        try:
            self.stdout.write("Attempting to read as Excel...")
            try:
                df_hospitals = pd.read_excel(hospitals_file, engine='xlrd')
                df_doctors = pd.read_excel(doctors_file, engine='xlrd')
            except Exception as e:
                self.stdout.write(f"Excel read failed ({e}), trying CSV...")
                # It might be a CSV disguised as .xls
                df_hospitals = pd.read_csv(hospitals_file, sep=None, engine='python')
                df_doctors = pd.read_csv(doctors_file, sep=None, engine='python')
        except FileNotFoundError:
             # Try stricter path if relative logic failed
             hospitals_file = r'd:\medgrid\hospitals_expanded.xls'
             doctors_file = r'd:\medgrid\doctors_expanded.xls'
             try:
                 df_hospitals = pd.read_excel(hospitals_file, engine='xlrd')
                 df_doctors = pd.read_excel(doctors_file, engine='xlrd')
             except:
                 df_hospitals = pd.read_csv(hospitals_file, sep=None, engine='python')
                 df_doctors = pd.read_csv(doctors_file, sep=None, engine='python')

        # Clean DB
        self.stdout.write("Clearing existing data...")
        Hospital.objects.all().delete()
        Doctor.objects.all().delete()

        # Import Hospitals
        self.stdout.write("Importing Hospitals...")
        hospital_map = {}

        for index, row in df_hospitals.iterrows():
            name = str(row['Name']).strip()
            contact = str(row['Contact']).strip()
            email = contact if '@' in contact else f"admin@{name.replace(' ', '').lower()}.com"
            
            hospital = Hospital.objects.create(
                name=name,
                email=email,
                password='password123', # In production, hash this!
                location=str(row['Address']).strip(),
                phone=contact,
                verified=True
            )
            hospital_map[row['Hospital_ID']] = hospital

            # Departments
            icu_total = int(row.get('ICU_Beds', 0))
            gen_total = int(row.get('General_Ward_Beds', 0))
            
            Department.objects.create(hospital=hospital, name='ICU', total=icu_total, available=icu_total//2)
            Department.objects.create(hospital=hospital, name='General', total=gen_total, available=gen_total//2)
            Department.objects.create(hospital=hospital, name='NICU', total=10, available=5)

            # Blood Inventory
            blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
            for bg in blood_groups:
                units = int(row.get(bg, 0))
                BloodInventory.objects.create(hospital=hospital, blood_group=bg, units=units)

        # Import Doctors
        self.stdout.write("Importing Doctors...")
        self.stdout.write(f"Doctor Columns: {df_doctors.columns.tolist()}")
        
        # Normalize columns
        df_doctors.columns = df_doctors.columns.str.strip()
        
        for index, row in df_doctors.iterrows():
            hid = row['Hospital_ID']
            if hid in hospital_map:
                hospital = hospital_map[hid]
                status_val = row.get('Availability_Status', row.get('Availability', 'Available'))
                status = str(status_val).lower() == 'available'
                
                Doctor.objects.create(
                    hospital=hospital,
                    name=str(row['Name']).strip(),
                    specialty=str(row['Specialty']).strip(),
                    available=status
                )

        self.stdout.write(self.style.SUCCESS(f'Successfully imported {len(df_hospitals)} hospitals and {len(df_doctors)} doctors.'))
