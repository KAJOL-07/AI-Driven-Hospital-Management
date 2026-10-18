# MediFlow AI — Hospital Bed Capacity Forecasting & Smart Bed Allocation System

An AI-driven hospital management platform featuring bed capacity forecasting, intelligent inter-ward transfer recommendations, and smart bed allocation across a 3-floor clinical hospital structure with 15 specialized departments.

---

## 🏥 Hospital Architectural Blueprint

- **Floor Layout**:
  - **Ground Floor**: 50 beds (30 General Ward Hall + 10 Emergency/Triage + 10 Surgery)
  - **First Floor**: 50 private single rooms & beds (Rooms 101–150 across Cardiology, Neurology, Orthopedics, Gynecology, Pulmonology)
  - **Second Floor**: 50 private single rooms & beds (Rooms 201–250 across Pediatrics, Oncology, Nephrology, Urology, ENT, Ophthalmology, Dermatology)
- **15 Centralized Departments**: General Medicine, Cardiology, Neurology, Orthopedics, Gynecology, Pulmonology, Pediatrics, General Surgery, Emergency Medicine, Oncology, Dermatology, ENT, Ophthalmology, Urology, Nephrology
- **Total Beds**: 150 inpatient beds

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Lucide React, Webpack 5, Babel |
| **Backend** | Node.js (>=18.0.0), Express 5, Mongoose 9 |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Hosting (Frontend)** | Vercel |
| **Hosting (Backend)** | Render |

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB instance (local or MongoDB Atlas connection string)

### 2. Backend Setup
```bash
cd backend
npm install
# Duplicate .env.example to .env and configure your values
cp .env.example .env
# Seed database with the 3 floors and 15 departments
npm run seed
# Start backend API server
npm start
```
The backend API starts on `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend dev server opens on `http://localhost:3000`.

---

## 🌐 Production Deployment Guide

### Phase 1: Push Project to GitHub

1. Ensure the root `.gitignore` is present so `.env` files are never tracked:
```bash
git add .
git commit -m "chore: prepare repository for production deployment on Render and Vercel"
```
2. Create a new **Private** repository on [GitHub](https://github.com/new).
3. Push your repository:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main
git push -u origin main
```

---

### Phase 2: MongoDB Atlas Setup

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create a **Shared (Free M0)** or dedicated cluster.
3. In **Network Access**, click **Add IP Address** -> Select **Allow Access From Anywhere (`0.0.0.0/0`)** (required for Render to connect).
4. In **Database Access**, create a database user with Read and Write permissions.
5. In **Database** -> Click **Connect** -> Choose **Drivers (Node.js)**.
6. Copy the connection string format:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/hospital_management?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your database user credentials.

---

### Phase 3: Backend Deployment on Render

1. Log in to [Render](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `mediflow-backend` (or your chosen name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose the closest region
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `HOST` | `0.0.0.0` |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@...` |
   | `JWT_SECRET` | *(Generate a 32+ character random string)* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `FRONTEND_URL` | *(Leave empty initially; fill in after Vercel deployment)* |
   | `CORS_ORIGIN` | `*` *(or your Vercel URL once deployed)* |
6. Click **Create Web Service**.
7. Once deployed, note your Render backend URL:
   `https://mediflow-backend.onrender.com`
8. Verify backend health by visiting:
   `https://mediflow-backend.onrender.com/api/health`

*(Optional)* Run database seed on Render:
In Render Dashboard -> **Shell** tab:
```bash
npm run seed
```

---

### Phase 4: Frontend Deployment on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure Project Settings:
   - **Framework Preset**: `Other`
   - **Root Directory**: Click `Edit` -> Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. In **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `REACT_APP_API_URL` | `https://mediflow-backend.onrender.com/api` |
6. Click **Deploy**.
7. Once deployment finishes, Vercel gives you your production URL:
   `https://your-hospital-frontend.vercel.app`

---

### Phase 5: Connect & Finalize CORS

1. Go back to your [Render Dashboard](https://dashboard.render.com/) -> Select your backend web service.
2. In **Environment Variables**, update:
   - `FRONTEND_URL` = `https://your-hospital-frontend.vercel.app`
   - `CORS_ORIGIN` = `https://your-hospital-frontend.vercel.app`
3. Render will automatically redeploy with the updated CORS configuration.
4. Open your Vercel URL in your browser and test authentication, bed allocation, floor management, and patient admission!
