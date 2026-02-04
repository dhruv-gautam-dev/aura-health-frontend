import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Bell, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import moment from 'moment';

import { api } from '../api/apiClient';
import { createPageUrl } from '../utils';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import QuickInput from '../components/home/QuickInput';
import MedicationCard from '../components/home/MedicationCard';
import HealthReportCard from '../components/home/HealthReportCard';

interface User {
    full_name?: string;
    email?: string;
}

interface Medication {
    id: string | number;
    name: string;
    dosage: string;
    color?: 'coral' | 'mint' | 'blue' | 'purple' | 'pink';
    times?: string[];
    is_active?: boolean;
}

interface HealthReport {
    id: string | number;
    type: 'symptom_summary' | 'medication_adherence' | 'weekly_overview' | 'monthly_report';
    title: string;
    created_date: string;
    summary?: string;
}

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        // @ts-expect-error - api structure is dynamic
        api?.auth?.me().then(setUser).catch(() => {});
    }, []);

    const { data: medications, isLoading: medsLoading } = useQuery<Medication[]>({
        queryKey: ['medications'],
        // @ts-expect-error - api structure is dynamic
        queryFn: () => api?.entities?.Medication.filter({ is_active: true }, '-created_date', 10),
        initialData: [],
    });

    const { data: reports, isLoading: reportsLoading } = useQuery<HealthReport[]>({
        queryKey: ['reports'],
        // @ts-expect-error - api structure is dynamic
        queryFn: () => api?.entities?.HealthReport.list('-created_date', 5),
        initialData: [],
    });

    const getNextDoseTime = (medication: Medication): Date | null => {
        if (!medication.times?.length) return null;
        const now = moment();
        for (const time of medication.times.sort()) {
            const [hours, minutes] = time.split(':');
            const doseTime = moment().set({ hour: parseInt(hours), minute: parseInt(minutes) });
            if (doseTime.isAfter(now)) return doseTime.toDate();
        }
        const [hours, minutes] = medication.times[0].split(':');
        return moment().add(1, 'day').set({ hour: parseInt(hours), minute: parseInt(minutes) }).toDate();
    };

    const handleMarkTaken = async (medication: Medication) => {
        // @ts-expect-error - api structure is dynamic
        await api?.entities?.MedicationLog.create({
            medication_id: medication.id,
            scheduled_time: new Date().toISOString(),
            taken_time: new Date().toISOString(),
            status: 'taken',
        });
    };

    const firstName = user?.full_name?.split(' ')[0] || 'there';

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <header className="pt-6 pb-4 flex items-center justify-between">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-slate-500"
                        >
                            {greeting}
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-2xl font-semibold text-slate-800"
                        >
                            {firstName}
                        </motion.h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm"
                    >
                        <Bell className="w-5 h-5 text-slate-600" />
                    </Button>
                </header>

                {/* Quick Input */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                >
                    <QuickInput />
                </motion.section>

                {/* Upcoming Meds */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Upcoming Meds</h2>
                        <button
                            onClick={() => navigate(createPageUrl('Medications'))}
                            className="text-sm text-cyan-600 font-medium flex items-center gap-1 hover:text-cyan-700"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {medsLoading ? (
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="min-w-[200px] h-[140px] rounded-2xl" />
                            ))}
                        </div>
                    ) : medications && medications.length > 0 ? (
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                            {medications.map((med) => (
                                <MedicationCard
                                    key={med.id}
                                    medication={med}
                                    nextDoseTime={getNextDoseTime(med)}
                                    onMarkTaken={handleMarkTaken}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-3">
                                <Calendar className="w-6 h-6 text-cyan-600" />
                            </div>
                            <p className="text-slate-600 text-sm">No medications added yet</p>
                            <Button
                                onClick={() => navigate(createPageUrl('AddMedication'))}
                                className="mt-3 bg-cyan-600 hover:bg-cyan-700"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Medication
                            </Button>
                        </div>
                    )}
                </motion.section>

                {/* Recent Health Reports */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Health Reports</h2>
                        <button
                            onClick={() => navigate(createPageUrl('Reports'))}
                            className="text-sm text-cyan-600 font-medium flex items-center gap-1 hover:text-cyan-700"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {reportsLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map(i => (
                                <Skeleton key={i} className="h-24 rounded-2xl" />
                            ))}
                        </div>
                    ) : reports && reports.length > 0 ? (
                        <div className="space-y-3">
                            {reports.slice(0, 3).map((report) => (
                                <HealthReportCard
                                    key={report.id}
                                    report={report}
                                    onClick={() => navigate(createPageUrl('Reports') + `?id=${report.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-violet-600" />
                            </div>
                            <p className="text-slate-600 text-sm">No reports generated yet</p>
                            <p className="text-slate-400 text-xs mt-1">Start chatting to generate insights</p>
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
}
