# 🏥 MedGrid — Real-Time Hospital Resource Management

> **Connecting Hospitals. Saving Lives.**
> A smart platform providing real-time bed availability, blood inventory tracking, ambulance dispatch, and AI-powered hospital recommendations for government and private hospitals.

---

## 🚀 Overview

**MedGrid** is a state-of-the-art healthcare management platform designed to bridge the gap between hospitals, ambulances, and patients. By providing real-time data on bed availability and blood inventory, MedGrid ensures that no time is lost when it matters most.

Whether you are a hospital administrator managing ICU beds, an ambulance driver en route to an emergency, or a patient searching for the nearest hospital — MedGrid serves as your intelligent healthcare companion.

---

## 💡 MedGrid Values

| Value | What It Means for Us |
|---|---|
| ⚡ **Speed** | Every second counts in a medical emergency. MedGrid ensures real-time data is always one click away. |
| 🔍 **Transparency** | Patients and ambulances see live, accurate data — no guesswork, no outdated records. |
| 🤝 **Accessibility** | Designed for government hospitals and rural clinics, not just private healthcare. |
| 🧠 **Intelligence** | AI-powered recommendations and a RAG chatbot make complex decisions simple. |
| 🩸 **Community** | Blood donor registration connects citizens directly to hospitals that need them. |
| 🔒 **Reliability** | A system that works when it matters most — during emergencies, disasters, and critical care. |

---

## ✨ Key Features

### 🛏️ 1. Real-Time Bed Tracking
- **Live Availability:** Track ICU, General, NICU, and Emergency beds across all registered hospitals in real time.
- **Staff Portal:** Hospital staff can toggle bed availability, manage departments, and batch-save updates with a single click.
- **Patient View:** Patients can see available beds at any hospital before arriving.

### 🩸 2. Blood Bank Integration
- **Live Inventory:** Real-time blood unit counts for all 8 blood groups (A+, A−, B+, B−, AB+, AB−, O+, O−).
- **Blood Donor Registration:** Citizens can register as blood donors via a comprehensive form.
- **Email Confirmation:** Donors automatically receive a confirmation email with the nearest hospital's details and next steps.

### 🚑 3. Ambulance Dispatch System
- **Emergency Case Management:** Ambulances can raise emergency cases and get matched to the best hospital.
- **AI Hospital Recommendation:** AI recommends the optimal hospital based on location, bed availability, and blood group.
- **Real-Time ETA:** Tracks ambulance status (Pending → Enroute → Arrived → HandedOver).

### 🤖 4. RAG-Powered AI Chatbot
- **Intelligent Q&A:** Ask about hospitals, doctors, bed availability, and blood inventory in natural language.
- **ChromaDB Vector Store:** Powered by Sentence Transformers + ChromaDB for semantic search.
- **LLM Integration:** Uses `microsoft/Phi-3-mini-4k-instruct` via Hugging Face Inference API.

### 🏥 5. Hospital Staff Portal
- **Profile Management:** Update hospital details, specialties, and operating hours.
- **Doctor Management:** Add doctors, toggle on-shift/on-call status.
- **Patient Records:** View and manage patient medical records.
- **Emergency Dashboard:** Real-time emergency case notifications with accept/confirm workflow.

### 👤 6. Patient Portal
- **Hospital Search:** Search hospitals by name or location.
- **Hospital Details:** View beds, blood inventory, doctors, and patient reviews.
- **Review System:** Submit star ratings and comments for hospitals.

---

## 🎬 Project Demo

https://github.com/Esingh-byte/medgrid/releases/download/v1.0.0/medgrid.mp4

---

## 📸 Screenshots

| | |
|---|---|
| ![Screenshot 1](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/1.png) | ![Screenshot 2](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/2.png) |
| ![Screenshot 3](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/3.png) | ![Screenshot 4](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/4.png) |
| ![Screenshot 5](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/5.png) | ![Screenshot 6](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/6.png) |
| ![Screenshot 7](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/7.png) | ![Screenshot 8](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/8.png) |
| ![Screenshot 9](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/9.png) | ![Screenshot 10](https://raw.githubusercontent.com/Esingh-byte/medgrid/main/screenshots/10.png) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend Layer                      │
│         React + TypeScript + Tailwind CSS            │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │Dashboard │  │StaffPortal│  │Patient/Ambulance   │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────┘
                        │ REST API (Axios)
┌─────────────────────────────────────────────────────┐
│               Backend Layer (Django)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ Hospitals API│  │ Chatbot API  │  │ Auth API  │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────┐
│                  Data & AI Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ SQLite DB│  │ ChromaDB │  │ HuggingFace LLM    │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + TypeScript** | UI Framework |
| **Tailwind CSS** | Styling & Design System |
| **Axios** | API Communication |
| **React Router v6** | Client-Side Routing |
| **Lucide React** | Icons |

### Backend
| Technology | Purpose |
|---|---|
| **Django 6 + DRF** | REST API Framework |
| **SQLite** | Database |
| **ChromaDB** | Vector Database for RAG |
| **Sentence Transformers** | Embeddings (`all-MiniLM-L6-v2`) |
| **Hugging Face** | LLM (`Phi-3-mini-4k-instruct`) |
| **Django Email (SMTP)** | Blood Donor Email Notifications |

---

## 📋 Prerequisites

- **Node.js** v18+
- **Python** v3.9+
- **Git**

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Esingh-byte/medgrid.git
cd medgrid
```

### 2. Backend Setup

```bash
cd medgrid_server

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# (Optional) Seed sample data
python seed_apro_data.py

# Start the server
python manage.py runserver
# Backend runs on http://localhost:8000
```

**Environment Variables** (optional, for full features):

| Variable | Description |
|---|---|
| `HF_TOKEN` | Hugging Face API token (for RAG chatbot LLM) |
| `EMAIL_HOST_USER` | Gmail address (for blood donor emails) |
| `EMAIL_HOST_PASSWORD` | Gmail App Password |

Set them in your terminal before running the server:
```bash
# Windows PowerShell
$env:HF_TOKEN="your_hf_token"
$env:EMAIL_HOST_USER="your@gmail.com"
$env:EMAIL_HOST_PASSWORD="your_app_password"
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hospitals/` | List all hospitals |
| `POST` | `/api/hospitals/` | Register a new hospital |
| `GET/PATCH` | `/api/hospitals/:id/` | Get or update hospital details |
| `POST` | `/api/auth/login` | Hospital login |
| `POST` | `/api/auth/patient/login` | Patient login |
| `POST` | `/api/auth/patient/register` | Patient registration |
| `POST` | `/api/auth/ambulance/login` | Ambulance login |
| `POST` | `/api/beds/:id/toggle` | Toggle bed availability |
| `POST` | `/api/doctors/:id/toggle` | Toggle doctor shift/call status |
| `POST` | `/api/blood-donation` | Register blood donor + send email |
| `GET` | `/api/ai-recommendation` | AI hospital recommendation |
| `POST` | `/api/chat/` | RAG Chatbot query |
| `GET/POST` | `/api/emergencies/` | Emergency case management |
| `GET/POST` | `/api/reviews/` | Hospital reviews |

---

## 🗺️ Roadmap

- [x] Hospital Registration & Authentication
- [x] Real-Time Bed Tracking (ICU, General, NICU, Emergency)
- [x] Blood Inventory Management
- [x] Blood Donor Registration with Email Confirmation
- [x] Ambulance Dispatch & Emergency Management
- [x] RAG-Powered AI Chatbot
- [x] AI Hospital Recommendation Engine
- [x] Patient Portal & Review System
- [x] Staff Portal with Batch Save
- [ ] Mobile App (React Native)
- [ ] Google Maps Integration for Live Tracking
- [ ] SMS Notifications for Emergencies
- [ ] Government Hospital API Integration
- [ ] Multi-language Support (Hindi, Tamil, etc.)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ❤️ for better healthcare access

**Team MedGrid** — [GitHub](https://github.com/Esingh-byte/medgrid)