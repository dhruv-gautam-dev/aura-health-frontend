# Aura Health — Frontend

A React web application for the **Aura Health Personal Digital Twin** platform. Patients can chat with an AI health navigator, upload medical documents for automatic data extraction, track lab results over time, manage medications, and connect Google Calendar for dosage reminders. Doctors can create a platform profile to be discoverable by patients.

**Live App:** [https://aura-health-frontend-five.vercel.app](https://aura-health-frontend-five.vercel.app)

---

## Screenshots

> Place your screenshots in the `docs/screenshots/` folder and reference them below.

| Home Dashboard | AI Chat (Aura) |
|---|---|
| ![Home](../docs/screenshots/home.png) | ![Chat](../docs/screenshots/chat.png) |

| Medical Records | Medications |
|---|---|
| ![Medical Records](../docs/screenshots/medical-records.png) | ![Medications](../docs/screenshots/medications.png) |

| Settings | Landing Page |
|---|---|
| ![Settings](../docs/screenshots/settings.png) | ![Landing](../docs/screenshots/landing.png) |

---

## Tech Stack

| Category | Libraries / Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Routing | React Router DOM v7 |
| State Management | Redux Toolkit, Redux Persist |
| Server State | TanStack React Query |
| Forms | React Hook Form + Zod |
| Auth & Storage | Firebase |
| Styling | Tailwind CSS, Framer Motion |
| UI Components | Radix UI, Lucide React, shadcn/ui-style components |
| HTTP | Axios |
| Notifications | Sonner |
| Deployment | Vercel |

---

## Pages

| Route | Page | Access | Description |
|---|---|---|---|
| `/` | Landing Page | Public | Marketing page — overview of Aura's features |
| `/login` | Login | Public | Sign in with email/password via Firebase |
| `/signup` | Sign Up | Public | Register a new account |
| `/role-selection` | Role Selection | Auth | Choose between Patient and Doctor |
| `/onboarding/patient` | Patient Onboarding | Auth | Build the initial Digital Twin — conditions, allergies, medications |
| `/onboarding/doctor` | Doctor Onboarding | Auth | Create a doctor profile with specialty and availability |
| `/home` | Dashboard | Auth | Medication cards, recent lab results with trend indicators, quick health log input |
| `/chat` | AI Chat | Auth | Conversational interface with Aura — health Q&A, diary logging, calendar scheduling |
| `/medical-records` | Medical Records | Auth | Upload prescriptions/lab PDFs; view extracted lab results and medications by document |
| `/medications` | Medications | Auth | Full CRUD for the patient's medication regimen |
| `/settings` | Settings | Auth | Edit medical profile, connect Google Calendar, download FHIR export, sign out |
| `/edit-user` | Edit Profile | Auth | Update name, timezone, and other account settings |

---

## Project Structure

```
src/
├── api/            # Axios API modules (auth, chat, doctor, medications, health-records, calendar, settings, etc.)
├── components/
│   ├── chat/       # ChatBubble, ChatInput, ConnectionStatus
│   ├── home/       # HealthReportCard, MedicationCard, QuickInput
│   └── ui/         # Reusable primitives (Button, Input, Skeleton, etc.)
├── context/        # React context providers (AppContext, AuthContext)
├── lib/            # Query client, NavigationTracker, utilities
├── pages/          # Route-level page components
├── services/       # Auth service, geolocation service
├── store/          # Redux store — authSlice, locationSlice
├── types/          # Shared TypeScript types (Medication, LabResult, UploadedRecord, etc.)
└── utils/          # Helper functions
```

---

## Key Features

### Home Dashboard
The home screen shows a personalised greeting, a **Quick Input** shortcut that sends a message directly to Aura, the user's active medications as cards, and recent lab results with high/low/normal trend badges.

### AI Chat (Aura)
A full-screen chat interface backed by `POST /api/v1/chat/run`. Aura has the user's Digital Twin profile as context on every turn. She can explain lab results, log symptoms to the health diary, and create Google Calendar medication reminders — all through natural conversation.

### Medical Records
Patients drag-and-drop or browse to upload a prescription image or lab PDF. The backend uses Gemini 2.5 Flash to extract structured data (lab tests, medications, diagnoses, doctor name). Each uploaded document is shown as an expandable card with all extracted values.

### Medications
Full CRUD list of the patient's medications. Each entry shows name, dosage, frequency, reminder time, and start/end dates. Adding a medication also triggers a drug-interaction check via the RxNav API on the backend.

### Settings
Patients can edit their core medical profile (conditions, allergies, blood type, emergency contact), connect or disconnect Google Calendar for reminders, and export their entire Digital Twin as a FHIR R4 Bundle.

---

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

```bash
git clone <repo-url>
cd aura-health-frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Deployment

The project is configured for **Vercel**. All routes are rewritten to `index.html` for client-side routing (see [vercel.json](vercel.json)).

Push to your connected branch and Vercel will handle the rest automatically.

---

## License

[MIT](../aura-health-backend/LICENSE)

```bash
npm run lint
```

---

## Deployment

The project is configured for **Vercel**. All routes are rewritten to `index.html` for client-side routing (see [vercel.json](vercel.json)).

Push to your connected branch and Vercel will handle the rest automatically.
