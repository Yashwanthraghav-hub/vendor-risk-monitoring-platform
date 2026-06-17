# Vendor Risk Monitoring Platform (VRMP)

An enterprise-grade full-stack web application designed for procurement teams in large enterprises to monitor vendor performance, track compliance regulations, calculate weighted risk assessments, and preview AI-driven disruption forecasts.

---

## 🚀 Key Features

1. **Enterprise Authentication & RBAC**:
   - Authentication using JSON Web Tokens (JWT) with session persistence.
   - Role-Based Access Control enforcing specific clearances for `Admin`, `Procurement Manager`, and `Risk Analyst`.
   - Logging audit trail records dynamically.

2. **Supplier Catalog & Contract Management**:
   - Complete CRUD interface for vendor profiles.
   - Details covering company sectors, financial values, durations, and liaison contact cards.
   - Interactive search, categorizations, multi-column sorting, and paginations.

3. **Weighted Risk Engine & Heat Map Matrix**:
   - Dynamically calculates numerical risk scores (0-100) using weighted variables:
     - *Delivery delays (25%)*
     - *Service quality (25%)*
     - *Compliance violations (30%)*
     - *Contract fulfillment defaults (10%)*
     - *Category volatility index (10%)*
   - Categorizes risk levels: **Low (Green)**, **Medium (Yellow)**, **High (Red)**.
   - Beautiful half-donut SVG Risk Gauge Dial.
   - Renders a 3x3 Risk Heat Map (Likelihood of failure vs Impact criticality based on contract value).

4. **Compliance calendars & Reminders**:
   - Verification checklist for audits, ISO certifications, licenses, and insurance policies.
   - Monthly grid Compliance Calendar indicating upcoming document expirations.
   - Simulation engine to trigger email notifications to contacts for renewing expired/pending papers.

5. **AI Predictive Telemetry**:
   - Analyzes recent quality indices and delivery margins to predict:
     - *Future Delivery Delays Probability*
     - *Compliance Failure Probability*
     - *Service Performance Decline Probability*
   - Returns technical analysis summaries.

6. **Reporting Center**:
   - Compile PDF reports (using standard browser print styles) or export spreadsheets (native CSV downloaders).

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js, React Router, Lucide Icons
- **Backend**: Node.js, Express.js, JWT, BcryptJS
- **Database**: Dual-mode data connection:
  - *MongoDB*: Connects automatically via Mongoose if a `MONGODB_URI` string is supplied in backend environment.
  - *JSON Database*: If MongoDB is unavailable or offline, the platform automatically falls back to a file-based storage database under `backend/data/*.json`. This allows the application to run **immediately with zero setup**.

---

## 🏁 Installation & Startup

### Prerequisites
- Node.js (v18+ recommended)
- Windows OS (to execute `start.bat`)

### 1-Click Execution (Recommended)
Double-click `start.bat` in the root folder.
This script will automatically:
1. Install all dependencies for the root, backend, and frontend.
2. Synchronize database seeding with high-fidelity mock assets.
3. Concurrently start the Express backend server (`localhost:5000`) and the Vite React frontend server (`localhost:5173`).

### Manual Launch
If you prefer running manual commands, open terminal windows in the project root:

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```
2. **Launch Application**:
   ```bash
   npm start
   ```

---

## 🔑 Demo Sandbox Credentials

The platform initializes with default testing users. All test accounts use the password: `password123`.

| Profile Role | Email Address | Description |
| :--- | :--- | :--- |
| **Admin** | `admin@vendorrisk.com` | Unlimited administrative clearance. Can delete vendors and inspect system Audit Logs. |
| **Procurement Manager** | `procurement@vendorrisk.com` | Access to CRUD vendor profiles, contracts, and upload compliance certs. |
| **Risk Analyst** | `analyst@vendorrisk.com` | Assess risk scoring models, review AI forecasts, and verify compliance files. |

---

## 📂 Project Architecture

```
vendor-risk-monitoring-platform/
├── package.json                 # Orchestrates concurrently scripts
├── start.bat                    # Windows startup script
├── backend/                     # Node.js + Express backend
│   ├── server.js                # App entry point
│   ├── config/
│   │   ├── db.js                # Connection coordinator & JSON fallback
│   │   └── seeder.js            # Fills database with mock records
│   ├── controllers/             # Auth, vendor, compliance, alert handlers
│   ├── models/                  # Database schemas
│   ├── middleware/              # JWT verification & RBAC authorizations
│   └── routes/                  # REST API Endpoints
└── frontend/                    # Vite + React + Tailwind frontend
    ├── index.html
    ├── src/
    │   ├── main.jsx             
    │   ├── App.jsx              # Main routing coordinates
    │   ├── index.css            # Base Tailwind imports
    │   ├── context/             # AuthContext JWT state
    │   ├── components/          
    │   │   ├── Layout.jsx       # Persistent Sidebar & Top bar shells
    │   │   ├── RiskGauge.jsx    # SVG half donut dial
    │   │   ├── RiskHeatMap.jsx  # Grid Likelihood vs Criticality matrix
    │   │   ├── ComplianceCalendar.jsx # Expiry tracking calendars
    │   │   └── ChartWidgets.jsx # Reusable ChartJS wrappers
    │   └── pages/               # LandingPage, Dashboard, profile views
```
