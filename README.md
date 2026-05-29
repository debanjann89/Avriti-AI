# AvritiAI — Virtual Try-On Module

> Autonomous Generative Neural-Vision System for Local Retail Digitization  
> MCA Final Year Project — Siliguri Institute of Technology

---

## What This Module Does

1. **Merchant uploads** a garment photo (smartphone quality is fine)
2. **Gemini Vision** analyzes the garment → extracts type, color, fabric, style, occasion
3. **Merchant selects a Persona** → Age Group, Ethnicity, Body Type, Gender
4. **HuggingFace SDXL** generates a photorealistic model wearing that garment
5. Result is ready to share on Instagram / e-commerce listings

---

## Project Structure

```
aavriti/
├── backend/                  ← FastAPI (Python)
│   ├── main.py               ← App entry point + CORS
│   ├── config.py             ← Env var settings
│   ├── requirements.txt
│   ├── .env.example          ← Copy to .env and fill in keys
│   ├── routers/
│   │   └── tryon.py          ← API endpoints
│   └── services/
│       ├── gemini_service.py ← Garment analysis + prompt builder
│       └── hf_service.py     ← SDXL image generation
│
└── frontend/                 ← React + Vite + Tailwind
    ├── package.json
    └── src/
        ├── App.jsx
        ├── api/tryon.js      ← API calls to FastAPI
        └── components/
            ├── TryOnStudio.jsx     ← Main orchestrator
            ├── ImageUpload.jsx     ← Drag & drop upload
            └── PersonaSelector.jsx ← Chip-based persona UI
```

---

## Setup & Running

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up env vars
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and HF_TOKEN

# Run the server
uvicorn main:app --reload --port 8000
```

API will be live at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be live at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/tryon/generate` | Full pipeline (upload + persona → image) |
| POST | `/api/tryon/analyze-only` | Only run Gemini garment analysis |

### Example: `/api/tryon/generate`

**Form fields:**
- `garment_image` (file) — JPG/PNG/WEBP
- `age_group` — Teen / Young Adult / Adult / Senior
- `ethnicity` — South Asian / East Asian / African / Caucasian / Hispanic / Middle Eastern
- `body_type` — Slim / Athletic / Average / Plus Size
- `gender` — Woman / Man
- `variants` — 1, 2, or 3

**Response:**
```json
{
  "garment_analysis": {
    "garment_type": "kurta",
    "primary_color": "deep red",
    "pattern": "embroidered",
    ...
  },
  "positive_prompt": "A 25-year-old South Asian average woman wearing...",
  "images": ["<base64_png>", ...]
}
```

---

## API Keys Needed

| Key | Where to get |
|-----|-------------|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) → Get API key |
| `HF_TOKEN` | [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) → New token (read access is enough) |

---

## Swapping Models

To upgrade image quality, change `TRYON_MODEL` in `backend/services/hf_service.py`:

| Model | Quality | Speed |
|-------|---------|-------|
| `stabilityai/stable-diffusion-xl-base-1.0` | ★★★★ | Medium |
| `black-forest-labs/FLUX.1-dev` | ★★★★★ | Slower |
| `stabilityai/stable-diffusion-2-1` | ★★★ | Fast |

---

## Next Modules to Build

- [ ] **SAM Segmentation** — isolate garment from background using `facebook/sam-vit-base`
- [ ] **Merchant Dashboard** — React portal for inventory management
- [ ] **Metadata Generator** — Gemini writes SEO product descriptions
- [ ] **MongoDB Integration** — store garments, personas, results
- [ ] **Auth** — merchant login with JWT
# Avriti-AI
