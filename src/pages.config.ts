import Home from './pages/Home';
import OnboardingPatient from './pages/OnboardingPatient';
import __Layout from './Layout';
import { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import Signup from './pages/Signup';
import { OnboardingDoctor } from './pages/OnboardingDoctor';
import Chat from './pages/Chat';
import Medications from './pages/Medications';
import MedicalRecords from './pages/MedicalRecords';


export const PAGES: Record<string, React.ComponentType> = {
  "Home": Home,
  "Chat": Chat,
  "Medications": Medications,
  "MedicalRecords": MedicalRecords,
  "RoleSelectionPage": RoleSelectionPage,
  "OnboardingPatient": OnboardingPatient,
  "LandingPage": LandingPage,
  "Signup": Signup,
  "OnboardingDoctor": OnboardingDoctor,
}

interface PagesConfig {
  mainPage: string;
  Pages: Record<string, React.ComponentType>;
  Layout: React.ComponentType<{ currentPageName?: string; children: ReactNode }>;
}

export const pagesConfig: PagesConfig = {
  mainPage: "LandingPage",
  Pages: PAGES,
  Layout: __Layout,
};
