# ✈️ Team Vajra – Official Club Website

> The official website of **Team Vajra**, the RC Drone & UAV club of MMCOE (Marathwada Minda College of Engineering), Pune.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (custom design system) |
| Auth & DB | Firebase (Auth + Firestore) |
| Backend | Node.js + Express |
| Email | Nodemailer (Gmail SMTP) |

---

## 📁 Project Structure

```
club_website/
├── frontend/          # React + Vite app
│   ├── public/
│   │   └── assets/    # All images, videos
│   └── src/
│       ├── components/ # Reusable UI & layout components
│       ├── pages/      # Route-level page components
│       │   └── admin/  # Admin Dashboard & Editor
│       ├── store/      # Zustand auth store
│       └── styles/     # Global CSS theme
├── backend/           # Express API server
│   ├── index.js       # Server entry point
│   ├── .env.example   # Template for environment variables
│   └── package.json
└── legacy/            # Original static HTML/CSS site (archived)
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/your-org/club_website.git
cd club_website
```

### 2. Set up the Backend

```bash
cd backend
npm install

# Copy the env template and fill in your values
cp .env.example .env
# Edit .env with your Gmail credentials
```

Start the backend server:
```bash
npm start
# Server runs on http://localhost:5001
```

### 3. Set up the Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Environment Variables

The backend requires a `.env` file in the `backend/` directory. **Never commit this file.**

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Description |
|---|---|
| `EMAIL_USER` | Gmail address used to send contact emails |
| `EMAIL_PASS` | Gmail App Password (16-char, from Google Account > Security) |
| `EMAIL_TO` | Email address that receives contact form submissions |
| `PORT` | Port for the Express server (default: `5001`) |

---

## 🌐 Pages

| Page | Route |
|---|---|
| Home | `/` |
| Drones | `/drones` |
| Team | `/team` |
| Achievements | `/achievements` |
| Gallery | `/gallery` |
| Blog | `/blog` |
| Contact | `/contact` |
| Admin Dashboard | `/admin` |

---

## 🔥 Firebase Setup

The frontend uses Firebase for:
- **Authentication** – Admin login
- **Firestore** – Blog posts storage

The Firebase config is in `frontend/src/firebase.js`. Update it with your own Firebase project credentials if you fork this project.

---

## 📜 License

This project is the intellectual property of **Team Vajra, MMCOE**. All rights reserved.
