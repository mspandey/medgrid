import math
from .models import Hospital, Department, BloodInventory, Doctor

def haversine(lat1, lon1, lat2, lon2):
    """Calculates the great-circle distance between two points on Earth."""
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return float('inf')
    
    R = 6371  # Earth radius in kilometers
    dlat = math.radians(float(lat2) - float(lat1))
    dlon = math.radians(float(lon2) - float(lon1))
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(float(lat1))) * math.cos(math.radians(float(lat2))) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def recommend_hospital(amb_lat, amb_lon, patient_condition, blood_group):
    hospitals = Hospital.objects.all()
    recommendations = []

    for hospital in hospitals:
        score = 0
        
        # 1. Distance Score (40%)
        dist = haversine(amb_lat, amb_lon, hospital.latitude, hospital.longitude)
        # Closer is better. Assume max relevance within 50km.
        dist_score = max(0, 100 - (dist * 2)) 
        score += dist_score * 0.4

        # 2. Bed Availability (30%)
        # Map condition to department
        dept_map = {
            'Cardiac Arrest': 'ICU',
            'Accident': 'Trauma',
            'Pregnancy': 'Gynaecology',
            'Child': 'NICU'
        }
        target_dept = dept_map.get(patient_condition, 'General')
        try:
            dept = hospital.departments.get(name__icontains=target_dept)
            bed_score = (dept.available / dept.total * 100) if dept.total > 0 else 0
        except Department.DoesNotExist:
            bed_score = 0
        score += bed_score * 0.3

        # 3. Blood Inventory (20%)
        try:
            blood = hospital.blood_inventory.get(blood_group=blood_group)
            # Normalize units. Assume 5 units is "good" coverage for one patient.
            blood_score = min(100, (blood.units / 5) * 100)
        except BloodInventory.DoesNotExist:
            blood_score = 0
        score += blood_score * 0.2

        # 4. Specialty Match (10%)
        # Check if any doctor matches the condition
        has_specialist = hospital.doctors.filter(specialty__icontains=patient_condition, available=True).exists()
        specialty_score = 100 if has_specialist else 0
        score += specialty_score * 0.1

        recommendations.append({
            'hospital_id': hospital.id,
            'name': hospital.name,
            'score': round(score, 2),
            'distance_km': round(dist, 2),
            'bed_availability': bed_score,
            'blood_units': blood.units if 'blood' in locals() and blood else 0
        })

    # Sort by score descending
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    return recommendations[:3] # Return top 3
