from rest_framework.decorators import api_view
from rest_framework.response import Response
from .rag_system import RAGSystem

rag = RAGSystem()

@api_view(['POST'])
def chatbot_response(request):
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response({'response': "Please type a message."})

    # Generate response using RAG
    try:
        if not rag.initialized:
             # Try re-initializing if failed previously
            rag.__init__()
            
        response_text = rag.generate_response(user_message)
    except Exception as e:
        print(f"Chatbot Error: {e}")
        response_text = "I'm currently having trouble accessing my medical database. Please try again later."

    return Response({'response': response_text})
