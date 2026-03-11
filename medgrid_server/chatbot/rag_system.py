
import os
import chromadb
from chromadb.utils import embedding_functions
from huggingface_hub import InferenceClient
from hospitals.models import Hospital, Doctor
from django.conf import settings

# --- Configuration ---
PERSIST_DIRECTORY = os.path.join(settings.BASE_DIR, 'chroma_db')
HF_TOKEN = os.environ.get('HF_TOKEN') or getattr(settings, 'HF_TOKEN', None)

if not HF_TOKEN:
    print("WARNING: HF_TOKEN is not set. Chatbot will fall back to basic responses.")

class RAGSystem:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RAGSystem, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return
        
        print("Initializing RAG System...")
        try:
            self.chroma_client = chromadb.PersistentClient(path=PERSIST_DIRECTORY)
            self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
                model_name="all-MiniLM-L6-v2"
            )
            
            # Get or create collections
            self.hospital_collection = self.chroma_client.get_or_create_collection(
                name="hospitals",
                embedding_function=self.embedding_fn
            )
            self.doctor_collection = self.chroma_client.get_or_create_collection(
                name="doctors",
                embedding_function=self.embedding_fn
            )
            
            # Initial population if empty
            if self.hospital_collection.count() == 0:
                self.populate_vector_db()
            
            # LLM Client
            self.llm_client = InferenceClient(
                model="microsoft/Phi-3-mini-4k-instruct", 
                token=HF_TOKEN
            )
            
            self.initialized = True
            print("RAG System Initialized Successfully.")
            
        except Exception as e:
            print(f"Error initializing RAG System: {e}")
            self.initialized = False

    def populate_vector_db(self):
        print("Populating Vector Database from Django Models...")
        
        # 1. Hospitals
        hospitals = Hospital.objects.all()
        h_docs, h_metas, h_ids = [], [], []
        
        for h in hospitals:
            # Gather related info
            beds = h.departments.all()
            bed_info = [f"{b.name}: {b.available}/{b.total} beds" for b in beds]
            
            blood = h.blood_inventory.all()
            blood_info = [f"{b.blood_group}: {b.units} units" for b in blood]
            
            doc_text = f"""
            Hospital: {h.name}
            Address: {h.full_address or h.location}
            Contact: {h.phone}
            Emergency Contact: {h.emergency_contact}
            
            Available Beds:
            {chr(10).join(bed_info) if bed_info else 'No bed info available'}
            
            Available Blood:
            {chr(10).join(blood_info) if blood_info else 'No blood info available'}
            
            Specialties: {h.specialties or 'General'}
            Equipment: {h.equipment or 'Standard'}
            """
            
            h_docs.append(doc_text)
            h_metas.append({
                "name": h.name,
                "address": h.full_address or h.location,
                "contact": h.phone,
                "type": "hospital"
            })
            h_ids.append(f"hospital_{h.id}")
            
        if h_docs:
            self.hospital_collection.add(
                documents=h_docs,
                metadatas=h_metas,
                ids=h_ids
            )
            print(f"Added {len(h_docs)} hospitals to Vector DB.")

        # 2. Doctors
        doctors = Doctor.objects.all()
        d_docs, d_metas, d_ids = [], [], []
        
        for d in doctors:
            doc_text = f"""
            Doctor: {d.name}
            Specialty: {d.specialty}
            Hospital: {d.hospital.name}
            Status: {'Available' if d.available else 'Not Available'}
            On Shift: {'Yes' if d.on_shift else 'No'}
            On Call: {'Yes' if d.on_call else 'No'}
            Shift Timings: {d.shift_timings or 'Not specified'}
            Phone: {d.phone or 'Contact Hospital'}
            """
            
            d_docs.append(doc_text)
            d_metas.append({
                "name": d.name,
                "specialty": d.specialty,
                "hospital": d.hospital.name,
                "available": d.available,
                "on_call": d.on_call,
                "type": "doctor"
            })
            d_ids.append(f"doctor_{d.id}")
            
        if d_docs:
            self.doctor_collection.add(
                documents=d_docs,
                metadatas=d_metas,
                ids=d_ids
            )
            print(f"Added {len(d_docs)} doctors to Vector DB.")

    def search(self, query, n_results=3):
        results = {}
        try:
            results['hospitals'] = self.hospital_collection.query(
                query_texts=[query], n_results=n_results
            )
            results['doctors'] = self.doctor_collection.query(
                query_texts=[query], n_results=n_results
            )
        except Exception as e:
            print(f"Search Error: {e}")
        return results

    def generate_response(self, query):
        if not self.initialized:
            return "System is initializing or failed to load. Please try again later."
            
        # Search
        search_results = self.search(query)
        
        # Format Context
        context_text = ""
        
        # Hospitals
        if search_results.get('hospitals') and search_results['hospitals']['documents']:
            context_text += "=== RELEVANT HOSPITALS ===\n"
            for i, doc in enumerate(search_results['hospitals']['documents'][0]):
                context_text += doc + "\n---\n"
                
        # Doctors
        if search_results.get('doctors') and search_results['doctors']['documents']:
            context_text += "\n=== RELEVANT DOCTORS ===\n"
            for i, doc in enumerate(search_results['doctors']['documents'][0]):
                context_text += doc + "\n---\n"
                
        if not context_text:
            context_text = "No specific data found in database."

        # LLM Prompt
        prompt = f"""<|system|>
You are MedGrid AI, an advanced medical assistant. 
Use the following retrieved context to answer the user's query accurately.
If the information is not in the context, say you don't know but offer general advice.

Context:
{context_text}

<|end|>
<|user|>
{query}
<|end|>
<|assistant|>"""

        try:
            if not HF_TOKEN:
                return "I found relevant information in the database, but I cannot generate a conversational response without an AI token.\n\nHere is what I found:\n" + context_text

            response = self.llm_client.text_generation(
                prompt,
                max_new_tokens=512,
                temperature=0.3,
                do_sample=True,
                return_full_text=False
            )
            return response.strip()
        except Exception as e:
            print(f"LLM Error: {e}")
            return "I encountered an error generating a response. Please try again."

# Singleton Accessor
rag_system = None
