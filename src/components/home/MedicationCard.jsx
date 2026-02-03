import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Pill, Check } from 'lucide-react';
import moment from 'moment';
import { Button } from '../ui/button';

const colorClasses = {
    coral: 'bg-gradient-to-br from-coral-50 to-orange-50 border-coral-200',
    mint: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
    blue: 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200',
    purple: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
    pink: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
};

const dotColors = {
    coral: 'bg-orange-400',
    mint: 'bg-emerald-400',
    blue: 'bg-sky-400',
    purple: 'bg-violet-400',
    pink: 'bg-pink-400',
};

export default function MedicationCard({ medication, nextDoseTime, onMarkTaken }) {
    const color = medication.color || 'blue';
    const timeRemaining = nextDoseTime ? moment(nextDoseTime).fromNow() : 'No schedule';
    const isUpcoming = nextDoseTime && moment(nextDoseTime).diff(moment(), 'minutes') <= 30;

    return (
        <motion.div
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative min-w-[200px] p-4 rounded-2xl border backdrop-blur-sm
                ${colorClasses[color] || colorClasses.blue}
                cursor-pointer transition-all duration-300
            `}
        >
            {isUpcoming && (
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"
                />
            )}
            
            <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dotColors[color] || dotColors.blue} bg-opacity-20`}>
                    <Pill className={`w-4 h-4 ${color === 'coral' ? 'text-orange-600' : color === 'mint' ? 'text-emerald-600' : color === 'purple' ? 'text-violet-600' : color === 'pink' ? 'text-pink-600' : 'text-sky-600'}`} />
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 rounded-full hover:bg-white/60"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkTaken?.(medication);
                    }}
                >
                    <Check className="w-4 h-4 text-slate-500" />
                </Button>
            </div>

            <h4 className="font-semibold text-slate-800 text-sm mb-0.5 truncate">
                {medication.name}
            </h4>
            <p className="text-xs text-slate-500 mb-3">
                {medication.dosage}
            </p>

            <div className="flex items-center gap-1.5 text-xs">
                <Clock className={`w-3.5 h-3.5 ${isUpcoming ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className={isUpcoming ? 'text-orange-600 font-medium' : 'text-slate-500'}>
                    {isUpcoming ? `Due ${timeRemaining}` : timeRemaining}
                </span>
            </div>
        </motion.div>
    );
}