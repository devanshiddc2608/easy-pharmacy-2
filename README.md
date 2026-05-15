# Easy Pharmacy 2.0 🏥

> An AI-powered medical Q&A web application built with Flask and Groq (Llama 3.3 70B).

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python) ![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey?logo=flask) ![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Overview

Easy Pharmacy 2.0 is a healthcare web platform that lets users ask medicine-related questions in plain English and receive clear, AI-generated answers. The application features full conversation memory, so follow-up questions work naturally — just like talking to a pharmacist.

## ✨ Features

- **AI Medical Assistant (MedBot)** — Powered by Llama 3.3 70B via Groq API. Answers questions about drug interactions, side effects, dosages, and general health with a thoughtful system prompt that balances helpfulness with safety.
- **Conversation Memory** — Full multi-turn chat history so follow-up questions like *"What about for children?"* work contextually.
- **Medicine Catalogue** — Static catalogue of common Indian medicines with categories, brands, descriptions, and pricing.
- **Doctor Consultation Booking** — UI mockup for online video consultation booking.
- **Responsive Design** — Clean healthcare aesthetic that works on desktop and mobile.
- **Graceful Error Handling** — Friendly error messages for API failures with detailed server-side logging.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11 + Flask 3.0 |
| AI Model | Llama 3.3 70B Versatile |
| AI Provider | Groq API (`groq` Python SDK) |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Fonts | DM Serif Display + DM Sans (Google Fonts) |
| Session Management | Flask server-side session |
| Deployment | Render (via Gunicorn + Procfile) |

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/easy-pharmacy-2.git
cd easy-pharmacy-2
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and add your keys:
- `GROQ_API_KEY` — Get it free from [console.groq.com](https://console.groq.com)
- `SECRET_KEY` — Generate with: `python -c "import secrets; print(secrets.token_hex(32))"`

### 3. Run locally

```bash
python app.py
```

Open [http://localhost:5000](http://localhost:5000)

## ☁️ Deploy to Render

1. Push your code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [render.com](https://render.com) → New Web Service → Connect your repo
3. Set **Build Command**: `pip install -r requirements.txt`
4. Set **Start Command**: `gunicorn app:app`
5. Add Environment Variables: `GROQ_API_KEY` and `SECRET_KEY`
6. Deploy 🚀

## 📁 Project Structure

```
easy-pharmacy-2/
├── app.py                  # Flask app + Groq API integration
├── templates/
│   ├── index.html          # Landing page with hero section
│   ├── chatbot.html        # AI chatbot interface
│   ├── medicines.html      # Medicine catalogue
│   └── consultation.html   # Doctor booking form (UI mockup)
├── static/
│   ├── style.css           # Healthcare design system
│   └── chat.js             # Chat frontend logic
├── requirements.txt
├── Procfile                # For Render deployment
├── .env.example            # Environment variable template
└── .gitignore
```

## 💬 Sample Questions to Try

- *"Is ibuprofen safe with paracetamol?"*
- *"What are the side effects of metformin?"*
- *"Can I take antacids with antibiotics?"*
- *"What is the dose of cetirizine for adults?"*
- *"How should I store insulin at home?"*

## 🔮 Roadmap

- [ ] RAG over a medicines database (FAISS + drug compendium PDF)
- [ ] Prescription image upload + OCR analysis
- [ ] Firebase Firestore for persistent chat history per user
- [ ] User authentication (Firebase Auth)
- [ ] Symptom checker with structured input
- [ ] Drug interaction checker with dedicated dataset

## ⚕️ Disclaimer

This application provides general health information only and is not a substitute for professional medical advice. Always consult a licensed healthcare professional for medical decisions.

## 🔗 Try out the MedBot here - https://easy-pharmacy-2.onrender.com

---

Built by Devanshi · MBA (IT) · SICSR, Pune
