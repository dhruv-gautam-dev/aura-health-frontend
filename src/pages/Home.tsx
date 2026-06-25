import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Bell, Calendar, ChevronRight, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import moment from 'moment';

import { createPageUrl } from '../utils';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import QuickInput from '../components/home/QuickInput';
import MedicationCard from '../components/home/MedicationCard';
import { medicationApi } from '../api/medication.api';
import { healthRecordsApi } from '../api/healthRecords.api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { Medication, LabResult } from '../types/app.types';

interface User {
    username?: string;
    email?: string;
}

export default function Home() {
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    })();

    const { data: medications, isLoading: medsLoading } = useQuery<Medication[]>({
        queryKey: ['medications'],
        queryFn: medicationApi.list,
        initialData: [],
    });

    const { data: labsData, isLoading: labsLoading } = useQuery({
        queryKey: ['labs-timeline'],
        queryFn: () => healthRecordsApi.getLabsTimeline(),
    });

    const recentLabs = labsData?.results?.slice(0, 4) ?? [];

    const flagIcon = (flag: LabResult['flag']) => {
        if (flag === 'high') return <TrendingUp className="w-3.5 h-3.5 text-red-500" />;
        if (flag === 'low') return <TrendingDown className="w-3.5 h-3.5 text-blue-500" />;
        return <Minus className="w-3.5 h-3.5 text-emerald-500" />;
    };

    const flagColor = (flag: LabResult['flag']) => {
        if (flag === 'high') return 'text-red-600 bg-red-50 border-red-100';
        if (flag === 'low') return 'text-blue-600 bg-blue-50 border-blue-100';
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    };

    const firstName = user?.username?.split(' ')[0] || 'there';

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
                                    nextDoseTime={null}
                                    onMarkTaken={() => { }}
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
                                onClick={() => navigate(createPageUrl('Medications'))}
                                className="mt-3 bg-cyan-600 hover:bg-cyan-700"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Medication
                            </Button>
                        </div>
                    )}
                </motion.section>

                {/* Recent Lab Results */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800">Recent Lab Results</h2>
                        <button
                            onClick={() => navigate(createPageUrl('MedicalRecords'))}
                            className="text-sm text-cyan-600 font-medium flex items-center gap-1 hover:text-cyan-700"
                        >
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {labsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-16 rounded-2xl" />
                            ))}
                        </div>
                    ) : recentLabs.length > 0 ? (
                        <div className="space-y-2">
                            {recentLabs.map((lab) => (
                                <div
                                    key={lab.id}
                                    className="bg-white rounded-2xl border border-slate-100 px-4 py-3 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">{lab.test_name}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {lab.date ? moment(lab.date).format('DD MMM YYYY') : 'Date unknown'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-700">
                                            {lab.value}{lab.unit ? ` ${lab.unit}` : ''}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${flagColor(lab.flag)}`}>
                                            {flagIcon(lab.flag)}
                                            {lab.flag ?? 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
                                <Sparkles className="w-6 h-6 text-violet-600" />
                            </div>
                            <p className="text-slate-600 text-sm">No lab results yet</p>
                            <p className="text-slate-400 text-xs mt-1">Upload a lab report to get started</p>
                            <Button
                                onClick={() => navigate(createPageUrl('MedicalRecords'))}
                                className="mt-3 bg-violet-600 hover:bg-violet-700"
                            >
                                Upload Report
                            </Button>
                        </div>
                    )}
                </motion.section>
            </div>
        </div>
    );
}
