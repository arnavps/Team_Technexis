# MittiMitra 🌾
> The Temporal Arbitrage Engine: Empowering 146M Smallholders to Optimize the 72-Hour Harvest-to-Market Window.

## 📌 Problem Statement
Indian farmers lose ₹92,000 Crore annually due to post-harvest mistiming. This isn't a "farming" problem; it's a coordination failure. When thousands of farmers harvest simultaneously without data, they create artificial supply gluts, crashing prices by up to 80% and forcing distress sales.

**MittiMitra** transforms the farmer from a "Price Taker" into a "Market Strategist" using fused intelligence.

## 🚀 Key Features

### 1. The Decision Dashboard (Harvest Window Optimizer)
- **Status**: Red/Yellow/Green "Stoplight" indicators for optimal harvest timing.
- **Logic**: Fuses IMD weather forecasts with Agmarknet price trends and crop maturity models.
- **Outcome**: Suggests the specific 24-hour window that maximizes "Net Realization."

### 2. Explainable AI (The "Agri-Vakeel")
- **Multilingual Chatbot**: A voice-enabled assistant that "narrates" the dashboard.
- **The "Why" Layer**: Instead of a black-box advice, it explains: *"Prices in Pune are rising due to supply shortages in neighboring districts—wait 2 days."*

### 3. Shock-Alert Transit Guardian
- **Hardware-Free Monitoring**: Uses the mobile phone’s accelerometer to detect potholes and sudden braking during transit.
- **Damage Prediction**: Alerts the farmer if transit "shocks" likely degraded the crop grade, suggesting a shift from premium to processor markets to save value.

### 4. Zero-Internet Resilience
- **PWA Architecture**: Works on low-end devices with offline caching.
- **Background Sync**: Queues harvest logs and syncs them automatically when the farmer hits a 2G/4G patch.

### 5. Transport & Batching Intelligence
- **Load Matching**: Suggests co-loading with neighbors to split transport costs.
- **Net-Profit Ranking**: Ranks Mandis by *Price - (Fuel + Spoilage Risk)*.

# MittiMitra (AgriChain) - The Temporal Arbitrage Engine

KrishiAI (conceptually "MittiMitra") is a **Decision Support System** built to optimize the 72-hour harvest-to-market window for Indian smallholder farmers. It digests hyper-local weather, Mandi prices, transport costs, and market volatility to output a single, actionable recommendation: **Sell, Wait, or Hold.**

![MittiMitra Architecture](https://img.shields.io/badge/Status-Completed-success)
![Next.js](https://img.shields.io/badge/Next.js-v14+-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![Groq](https://img.shields.io/badge/Groq-Llama_3_70B-f55036)

## 🌟 The Core Problem We Solved
Farmers often sell in distress because they lack predictive visibility into market gluts, sudden weather changes (Black Swans), and the hidden costs of logistics and spoilage. This platform acts as their **Agri-Vakeel**—an intelligent agent that calculates the true **Net Realization** of their crop.

## ✨ Key Features (Fully Implemented)
1. **The Net Realization Algorithm**: Calculates profit by deducting real-time transport costs and a dynamically scaled "Spoilage Penalty" based on IMD temperature/humidity data.
2. **Black Swan Shock Analyzer**: Uses Z-Score volatility mapping on a 7-day rolling average to detect sudden price crashes and triggers an emergency "Pivot Advice" banner (e.g., redirect to cold storage).
3. **Multilingual Voice AI (Groq + Llama 3)**:
   - **Conversational Onboarding**: A 5-step AI-guided registration flow (Language, Consent, CropDetails, Location, FinalCalibration).
   - **The Agri-Vakeel**: A floating voice assistant that parses the dashboard data and explains trade-offs in 7 regional languages (English, Hindi, Marathi, Telugu, Tamil, Gujarati, Punjabi).
4. **Real-Data Mandi Engine**: Prioritizes verified local data for Precise Coordinate Mapping (Nashik, Nagpur, Amravati).
5. **Offline-First PWA Resilience**: Uses Service Workers and `localStorage` to ensure access mid-transit without internet.

---

## 🚀 Tech Stack

### Frontend (Next.js 14 App Router)
- **Framework:** Next.js, React
- **Styling:** Tailwind CSS (v4) with Custom Glassmorphism Keyframes
- **PWA:** `next-pwa` (Stale-while-Revalidate strategy)
- **Voice/Speech:** Web Speech API (`SpeechRecognition`, `speechSynthesis`)
- **Auth:** Firebase Phone Authentication

### Backend (Python FastAPI)
- **Framework:** FastAPI, Uvicorn
- **LLM Engine:** Groq SDK (Llama-3-70b-8192) inside `/chat/explain`
- **Math Engine:** Custom `profit_calc.py` & `shock_analyzer.py`
- **Simulators:** Mock Agmarknet (Mandi) and IMD (Weather) integration wrappers.

---

## 📂 Project Structure
For a detailed breakdown of the internal files and their purposes, see [file_structure.md](./file_structure.md).

---

## 🛠️ Local Installation & Setup

1. **Clone the Repository**

2. **Backend Setup (FastAPI)**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/Scripts/activate # Windows
   pip install fastapi uvicorn pydantic groq python-dotenv
   ```
   *Create a `.env` in `backend/` and add:* `GROQ_API_KEY=gsk_your_groq_key_here`
   ```bash
   uvicorn main:app --reload --port 8000
   ```

3. **Frontend Setup (Next.js)**
   ```bash
   cd frontend
   npm install
   ```
   *Note: Ensure Firebase config is populated in `frontend/services/firebase.ts`*
   ```bash
   # Standard mode
   npm run dev
   
   # Mobile/HTTPS mode (Recommended for GPS/Mic testing)
   npm run dev-https
   ```

4. **Mobile Access (LAN Testing)**
   To test GPS and Microphone on your phone:
   - Run `npm run dev-https`.
   - Find your LAN IP (e.g., `10.17.16.23`).
   - Open `https://your-ip:3000` on your phone browser.
   - Accept the self-signed certificate to proceed.

---

## 💡 Demo Interaction Guide

- **Test the AI:** In the `/dashboard`, click the bottom right microphone button and say *"Mujhe kya karna chahiye?"* (What should I do?). The AI will read the JSON state and reply in Hindi.
- **Simulate a Crash:** Click the **"Simulate Shock ⚡"** button in the header. The Next.js frontend will force a 40% price drop. Watch the UI immediately turn into an emergency state, deploying the pulsing banner.
- **Go Offline:** Turn off your Wi-Fi/Network in browser dev tools and reload. The dashboard will load from the Service Worker cache, displaying an "Offline Mode" badge.

*Built by Arnav Shirwadkar & Agentic AI.*

## 🛡️ Data Privacy (DPDP Act 2023 Compliance)
- **Consent-Driven**: Granular permission for GPS and sensor data.
- **Minimalism**: No PII (Personally Identifiable Information) collected beyond Phone Number.
- **Transparency**: Clear logs of how advice is generated from public data sources.

## 🌟 What Makes This Unique?
- **Timing over Yield**: Most agritech apps focus on Yield or Marketplaces. **KrishiAI** focuses on **Timing**. By desynchronizing harvest windows across clusters of farmers, we stabilize local market supply and reclaim the 25% value lost to "panic harvesting."
- **⚡ Dynamic Shock Absorption**: Unlike static apps, KrishiAI monitors for 'Black Swan' events. Using Z-score volatility analysis, it detects sudden market gluts or weather shifts in real-time, providing 'Pivot Advice' to farmers already in transit, potentially saving 100% of the load value from distress sales.
