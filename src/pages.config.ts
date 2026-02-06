import Home from './pages/Home';
// import Chat from './pages/Chat';
// import ScanPrescription from './pages/ScanPrescription';
// import Medications from './pages/Medications';
// import Reports from './pages/Reports';
// import Profile from './pages/Profile';
import OnboardingPatient from './pages/OnboardingPatient';
// import OnboardingDoctor from './pages/OnboardingDoctor';
// import FindDoctor from './pages/FindDoctor';
// import MedicalRecords from './pages/MedicalRecords';
// import FindAmbulance from './pages/FindAmbulance';
// import ImageDiagnosis from './pages/ImageDiagnosis';
import __Layout from './Layout';
import { ReactNode } from 'react';
import LandingPage from './pages/LandingPage';


export const PAGES: Record<string, React.ComponentType> = {
  "Home": Home,
  // "Chat": Chat,
  // "ScanPrescription": ScanPrescription,
  // "Medications": Medications,
  // "Reports": Reports,
  // "Profile": Profile,
  "OnboardingPatient": OnboardingPatient,
  "LandingPage":LandingPage,
  // "OnboardingDoctor": OnboardingDoctor,
  // "FindDoctor": FindDoctor,
  // "MedicalRecords": MedicalRecords,
  // "FindAmbulance": FindAmbulance,
  // "ImageDiagnosis": ImageDiagnosis,
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
