import React from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Calendar, ChevronRight, LucideIcon } from 'lucide-react';
import moment from 'moment';

type ReportType = 'symptom_summary' | 'medication_adherence' | 'weekly_overview' | 'monthly_report';

const typeIcons: Record<ReportType, LucideIcon> = {
    symptom_summary: TrendingUp,
    medication_adherence: FileText,
    weekly_overview: Calendar,
    monthly_report: FileText,
};

const typeColors: Record<ReportType, string> = {
    symptom_summary: 'from-violet-500 to-purple-600',
    medication_adherence: 'from-emerald-500 to-teal-600',
    weekly_overview: 'from-sky-500 to-blue-600',
    monthly_report: 'from-orange-500 to-coral-600',
};

interface Report {
    id: string | number;
    type: ReportType;
    title: string;
    created_date: string;
    summary?: string;
}

interface HealthReportCardProps {
    report: Report;
    onClick?: () => void;
}

export default function HealthReportCard({ report, onClick }: HealthReportCardProps) {
    const Icon = typeIcons[report.type] || FileText;
    const gradientClass = typeColors[report.type] || typeColors.weekly_overview;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer 
                       hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300"
        >
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} 
                                flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 text-sm truncate">
                        {report.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Generated {moment(report.created_date).fromNow()}
                    </p>
                    {report.summary && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                            {report.summary}
                        </p>
                    )}
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
            </div>
        </motion.div>
    );
}
