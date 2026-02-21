import React, { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Home, MessageCircle, FileText, Users, Stethoscope, 
    Activity, User, LogOut, Menu, X, Sparkles, LucideIcon
} from 'lucide-react';
import { createPageUrl } from './utils/index';
import { Button } from './components/ui/button';
import { authApi } from './api';

interface NavItem {
    name: string;
    icon: LucideIcon;
    page: string;
}

interface UserData {
    full_name?: string;
    email?: string;
    user_type?: string;
}

const patientNavItems: NavItem[] = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'Find Doctor', icon: Users, page: 'FindDoctor' },
    { name: 'Find Ambulance', icon: Activity, page: 'FindAmbulance' },
    { name: 'AI Diagnosis', icon: Sparkles, page: 'ImageDiagnosis' },
    { name: 'Medical Records', icon: FileText, page: 'MedicalRecords' },
    { name: 'Medications', icon: Activity, page: 'Medications' },
];

const doctorNavItems: NavItem[] = [
    { name: 'Dashboard', icon: Home, page: 'DoctorDashboard' },
    { name: 'Patients', icon: Users, page: 'DoctorPatients' },
    { name: 'Medical Records', icon: FileText, page: 'MedicalRecords' },
    { name: 'Profile', icon: Stethoscope, page: 'DoctorProfile' },
];

const pagesWithNav = [
    'Home', 'FindDoctor', 'FindAmbulance', 'ImageDiagnosis', 'MedicalRecords', 'Medications', 'Reports', 'Profile',
    'DoctorDashboard', 'DoctorPatients', 'DoctorProfile'
];

interface LayoutProps {
    children: ReactNode;
    currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
    const [user, setUser] = useState<UserData | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        
        // api?.auth?.me().then(setUser).catch(() => {});
        authApi.me()
    }, []);

    const showNav = currentPageName ? pagesWithNav.includes(currentPageName) : false;
    const navItems = user?.user_type === 'doctor' ? doctorNavItems : patientNavItems;

    const handleLogout = () => {
        
        // api?.auth?.logout();
        authApi.logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
            <style>{`
                :root {
                    --color-coral: #FF6B6B;
                    --color-mint: #4ECDC4;
                    --color-cerulean: #0E7490;
                }
            `}</style>

            {/* Desktop Sidebar */}
            {showNav && (
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-50">
                    <div className="flex flex-col flex-grow bg-white border-r border-slate-200 overflow-y-auto">
                        {/* Logo */}
                        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 
                                            flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">Aura Health</h1>
                                <p className="text-xs text-slate-500">
                                    {user?.user_type === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
                                </p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            {navItems.map((item) => {
                                const isActive = currentPageName === item.page;
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        to={createPageUrl(item.page)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                                            ${isActive 
                                                ? 'bg-cyan-50 text-cyan-700 font-medium' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }
                                        `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Profile */}
                        <div className="p-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 
                                                flex items-center justify-center text-white font-semibold">
                                    {user?.full_name?.[0] || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                        {user?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </aside>
            )}

            {/* Mobile Header */}
            {showNav && (
                <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 
                                            flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-lg font-bold text-slate-800">Aura Health</h1>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-100 px-4 py-3"
                        >
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={createPageUrl(item.page)}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50"
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    )}
                </header>
            )}

            {/* Main Content */}
            <main className={showNav ? 'lg:pl-64' : ''}>
                {children}
            </main>
        </div>
    );
}
