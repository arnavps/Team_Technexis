# KrishiAI File Structure Overview

This document provides an overview of the KrishiAI codebase, detailing the purpose of key directories and files in both the frontend and backend.

## Root Directory
- `frontend/`: React/Next.js application providing the user interface.
- `backend/`: FastAPI application providing the logic and data processing.
- `README.md`: High-level project overview, setup, and deployment instructions.
- `prd.md`: Product Requirement Document outlining goals and features.
- `todo.md`: Tracking file for ongoing development and pending tasks.
- `file_structure.md`: (This file) Documentation of the codebase layout.

---

## Frontend (`/frontend`)
The frontend is a modern Next.js application using Tailwind CSS and a "Classy Glassy" (glassmorphism) design system.

- `app/`: Next.js App Router directory.
  - `page.tsx`: The landing page with language selection.
  - `onboarding/`: AI-driven conversational registration flow.
  - `dashboard/`: The main command center for profit mapping and decision support.
  - `login/`: Authentication portal.
- `components/`: Reusable UI components (Modals, Cards, Tables).
- `translations/`: Multi-language dictionary files supporting 7 regional languages (English, Hindi, Marathi, Telugu, Tamil, Gujarati, Punjabi).
- `contexts/`: React Contexts for global state management (e.g., `LanguageContext`).
- `hooks/`: Custom React hooks, including `useGPS` for hyper-local location tracking.
- `certificates/`: Local SSL certificates to enable HTTPS for mobile testing.
- `public/`: Static assets such as images and branding.

---

## Backend (`/backend`)
The backend is a high-performance FastAPI server that handles AI processing and financial calculations.

- `main.py`: Entry point for the FastAPI server.
- `api/`: API route definitions.
  - `chat.py`: Handles conversational AI extraction (Groq) and TTS generation.
  - `user.py`: Profile management and data persistence.
- `engine/`: Core agricultural and financial logic.
  - `profit_calc.py`: Net Realization and profit mapping logic.
  - `shock_analyzer.py`: Predicts market volatility and harvest risks.
  - `decay_logic.py`: Calculates post-harvest spoilage rates based on weather.
  - `map_logic.py`: Geographic mapping for mandi selection.
- `integrations/`: Connections to external and internal data sources.
  - `mandi_api.py`: Fetches market prices with priority on verified local data.
  - `enam_client.py`: Interface for the government's e-NAM marketplace API.
  - `weather_api.py`: Real-time weather data integration.
- `data/`: Localized datasets.
  - `mandi_prices_real.json`: Verified historical and coordinate data for Central India hubs.
- `scripts/`: Utility scripts for maintenance and deployment.
