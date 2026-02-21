import React, { useState, useEffect } from 'react';
import { Cloud, Lock, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectionStatus({ mode = 'cloud', minimal = false }) {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const currentMode = isOnline ? mode : 'offline';

    if (minimal) {
        return (
            <div className={`w-2 h-2 rounded-full ${currentMode === 'cloud' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
        );
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentMode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`
                    inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                    ${currentMode === 'cloud' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }
                `}
            >
                {currentMode === 'cloud' ? (
                    <>
                        <Cloud className="w-3.5 h-3.5" />
                        <span>Cloud Connected</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </>
                ) : (
                    <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Secure Offline Mode</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}