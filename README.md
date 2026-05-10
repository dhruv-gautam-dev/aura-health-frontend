# Aura Health — Frontend

A modern health platform connecting patients and doctors, featuring AI-powered chat, health report tracking, medication management, and real-time communication.

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
| UI Primitives | Radix UI, Lucide React, shadcn/ui-style components |
| HTTP | Axios |
| Notifications | Sonner |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── api/            # Axios API modules (auth, chat, doctor, patient, medications, etc.)
├── components/     # Reusable UI components (chat, home widgets, shadcn-style ui/)
├── context/        # React context providers (App, Auth)
├── lib/            # Utilities, query client, navigation tracker
├── pages/          # Route-level page components
├── services/       # Business logic services (auth, geolocation)
├── store/          # Redux store, slices (auth, location)
├── types/          # Shared TypeScript types
└── utils/          # Helper utilities
```

---

## Pages

| Route | Page | Access |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/signup` | Sign Up | Public |
| `/role-selection` | Role Selection | Auth |
| `/onboarding/patient` | Patient Onboarding | Auth |
| `/onboarding/doctor` | Doctor Onboarding | Auth |
| `/home` | Dashboard / Home | Auth |
| `/chat` | AI Chat | Auth |
| `/edit-user` | Edit Profile | Auth |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd aura-health-frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the required variables (Firebase config, API base URL, etc.).

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
