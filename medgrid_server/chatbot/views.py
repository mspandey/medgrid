from rest_framework.decorators import api_view
from rest_framework.response import Response
from hospitals.models import Hospital, Doctor
from django.db.models import Q

@api_view(['POST'])
def chatbot_response(request):
    user_message = request.data.get('message', '').lower()
    
    response_text = "I'm sorry, I didn't quite catch that. You can ask me about hospitals, doctors, or bed availability."
    
    # 1. Greeting
    if any(word in user_message for word in ['hi', 'hello', 'hey']):
        response_text = "Hello! I am MedGrid AI. How can I assist you with your medical needs today?"

    # 2. Hospitals Query
    elif 'hospital' in user_message or 'clinic' in user_message:
        hospitals = Hospital.objects.all()[:3]
        names = ", ".join([h.name for h in hospitals])
        response_text = f"We have several top-rated hospitals registered, such as: {names}. You can view the full list on the Dashboard."

    # 3. Doctor Query
    elif 'doctor' in user_message or 'specialist' in user_message:
        doctors = Doctor.objects.filter(available=True)[:3]
        if doctors.exists():
            doc_names = ", ".join([f"Dr. {d.name} ({d.specialty})" for d in doctors])
            response_text = f"Here are some available specialists: {doc_names}."
        else:
            response_text = "I couldn't find any available doctors at the moment. Please check the dashboard for the latest updates."

    # 4. ICU / Bed Query
    elif 'bed' in user_message or 'icu' in user_message:
        response_text = "You can check real-time bed availability (ICU & General) directly on the Dashboard for each hospital."

    # 5. Emergency
    elif 'emergency' in user_message or 'help' in user_message:
        response_text = "If this is a medical emergency, please call 911 or your local emergency number immediately. Use MedGrid to locate the nearest hospital."

    return Response({'response': response_text})
