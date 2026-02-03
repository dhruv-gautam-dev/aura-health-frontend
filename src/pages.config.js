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
import __Layout from './Layout.jsx';


export const PAGES = {
  "Home": Home,
  // "Chat": Chat,
  // "ScanPrescription": ScanPrescription,
  // "Medications": Medications,
  // "Reports": Reports,
  // "Profile": Profile,
  "OnboardingPatient": OnboardingPatient,
  // "OnboardingDoctor": OnboardingDoctor,
  // "FindDoctor": FindDoctor,
  // "MedicalRecords": MedicalRecords,
  // "FindAmbulance": FindAmbulance,
  // "ImageDiagnosis": ImageDiagnosis,
}

export const pagesConfig = {
  mainPage: "Home",
  Pages: PAGES,
  Layout: __Layout,
};