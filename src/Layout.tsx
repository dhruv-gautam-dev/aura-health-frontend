import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home, MessageCircle, FileText, Pill,
    Download, User, LogOut, Menu, X, Sparkles, Settings, ChevronUp, LucideIcon
} from 'lucide-react';
import { createPageUrl } from './utils/index';
import { Button } from './components/ui/button';
import { authApi } from './api';
import { persistor, RootState } from './store';
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from './store/authSlice';
interface NavItem {
    name: string;
    icon: LucideIcon;
    page: string;
}

interface UserData {
    full_name?: string;
    email?: string;
    role?: string;
}


const patientNavItems: NavItem[] = [
    { name: 'Home', icon: Home, page: 'Home' },
    { name: 'AI Navigator', icon: MessageCircle, page: 'Chat' },
    { name: 'Medical Records', icon: FileText, page: 'MedicalRecords' },
    { name: 'Medications', icon: Pill, page: 'Medications' },
];

const doctorNavItems: NavItem[] = [
    { name: 'Dashboard', icon: Home, page: 'DoctorDashboard' },
    { name: 'Medical Records', icon: FileText, page: 'MedicalRecords' },
    { name: 'Profile', icon: User, page: 'DoctorProfile' },
];

const pagesWithNav = [
    'Home', 'Chat', 'MedicalRecords', 'Medications', 'Settings',
    'DoctorDashboard', 'DoctorProfile',
];

interface LayoutProps {
    children: ReactNode;
    currentPageName?: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
        }
        if (profileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [profileOpen]);
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.auth.user);


    const showNav = currentPageName ? pagesWithNav.includes(currentPageName) : false;
    console.log("Current User in Layout:", user);
    const navItems = user?.role === 'doctor' ? doctorNavItems : patientNavItems;

    // const handleLogout = () => {

    //     // api?.auth?.logout();
    //     authApi.logout();
    // };

    const handleLogout = async () => {
        try {
            await authApi.logout();
            dispatch(clearUser());
            await persistor.purge();     // 🔥 wipe persisted storage
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
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
                                    {user?.role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
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

                        {/* User Profile with popup */}
                        <div className="p-4 border-t border-slate-100 relative" ref={profileRef}>
                            {/* Popup card */}
                            {profileOpen && (
                                <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-800">{user?.username || 'User'}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => { navigate(createPageUrl('Settings')); setProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Settings className="w-4 h-4 text-slate-400" />
                                            Settings
                                        </button>
                                        <button
                                            onClick={() => { handleLogout(); setProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* Trigger */}
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600
                                                flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {user?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <p className="flex-1 text-sm font-medium text-slate-800 truncate">
                                    {user?.username || 'User'}
                                </p>
                                <ChevronUp className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${profileOpen ? '' : 'rotate-180'}`} />
                            </button>
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
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                                <Link
                                    to={createPageUrl('Settings')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Settings</span>
                                </Link>
                                <button
                                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
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
