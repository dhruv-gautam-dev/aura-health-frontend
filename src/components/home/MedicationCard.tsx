import React from 'react';
import { motion } from 'framer-motion';
import { Pill } from 'lucide-react';
import type { Medication } from '../../types/app.types';

type ColorType = 'coral' | 'mint' | 'blue' | 'purple' | 'pink';

const colorClasses: Record<ColorType, string> = {
    coral: 'bg-gradient-to-br from-coral-50 to-orange-50 border-coral-200',
    mint: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
    blue: 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200',
    purple: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
    pink: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
};

const dotColors: Record<ColorType, string> = {
    coral: 'bg-orange-400',
    mint: 'bg-emerald-400',
    blue: 'bg-sky-400',
    purple: 'bg-violet-400',
    pink: 'bg-pink-400',
};

const pillTextColors: Record<ColorType, string> = {
    coral: 'text-orange-600',
    mint: 'text-emerald-600',
    blue: 'text-sky-600',
    purple: 'text-violet-600',
    pink: 'text-pink-600',
};

const COLORS: ColorType[] = ['coral', 'mint', 'blue', 'purple', 'pink'];

interface MedicationCardProps {
    medication: Medication;
    nextDoseTime?: Date | null;
    onMarkTaken?: (medication: Medication) => void;
}

export default function MedicationCard({ medication }: MedicationCardProps) {
    // Deterministically pick a colour based on the medication id
    const color: ColorType = COLORS[medication.id % COLORS.length];

    return (
        <motion.div
            whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative min-w-[200px] p-4 rounded-2xl border backdrop-blur-sm
                ${colorClasses[color]}
                cursor-pointer transition-all duration-300
            `}
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dotColors[color]} bg-opacity-20`}>
                    <Pill className={`w-4 h-4 ${pillTextColors[color]}`} />
                </div>
            </div>

            <h4 className="font-semibold text-slate-800 text-sm mb-0.5 truncate">
                {medication.medication_name}
            </h4>
            <p className="text-xs text-slate-500 mb-1">
                {medication.dosage}
            </p>
            <p className="text-xs text-slate-400">
                {medication.frequency}
            </p>
        </motion.div>
    );
}
