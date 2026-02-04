import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';

export default function QuickInput() {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(createPageUrl('Chat') + `?initial=${encodeURIComponent(query)}`);
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            animate={{ 
                boxShadow: isFocused 
                    ? '0 8px 40px rgba(14, 116, 144, 0.15)' 
                    : '0 2px 20px rgba(0,0,0,0.04)'
            }}
            className={`
                relative bg-white rounded-2xl border transition-all duration-300
                ${isFocused ? 'border-cyan-300' : 'border-slate-200'}
            `}
        >
            <div className="flex items-center px-4 py-3">
                <Sparkles className={`w-5 h-5 mr-3 transition-colors ${isFocused ? 'text-cyan-500' : 'text-slate-400'}`} />
                
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="How are you feeling right now?"
                    className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 
                               text-sm focus:outline-none"
                />

                <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center
                               hover:bg-cyan-100 transition-colors"
                >
                    <Mic className="w-4 h-4 text-slate-500" />
                </motion.button>
            </div>

            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-3 pt-1 border-t border-slate-100"
                >
                    <div className="flex flex-wrap gap-2">
                        {['I have a headache', 'Feeling tired', 'Medication question'].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                    setQuery(suggestion);
                                    navigate(createPageUrl('Chat') + `?initial=${encodeURIComponent(suggestion)}`);
                                }}
                                className="px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-600
                                           hover:bg-cyan-100 hover:text-cyan-700 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.form>
    );
}
