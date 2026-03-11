from rest_framework.decorators import api_view
from rest_framework.response import Response
from .rag_system import RAGSystem

rag = None

@api_view(['POST'])
def chatbot_response(request):
    global rag
    user_message = request.data.get('message', '')
    
    if not user_message:
        return Response({'response': "Please type a message."})

    # Generate response using RAG
    try:
        if rag is None:
            rag = RAGSystem()

        if not rag.initialized:
             # Try re-initializing if failed previously
            rag.__init__()
            
        response_text = rag.generate_response(user_message)
    except Exception as e:
        print(f"Chatbot Error: {e}")
        response_text = "I'm currently having trouble accessing my medical database. Please try again later."

    return Response({'response': response_text})
