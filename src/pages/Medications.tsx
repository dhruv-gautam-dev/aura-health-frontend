import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pill, Trash2, AlertTriangle, X, Calendar } from 'lucide-react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { medicationApi } from '../api/medication.api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Skeleton } from '../components/ui/skeleton';
import type { Medication, MedicationCreatePayload } from '../types/app.types';

const COLORS = ['bg-sky-100 border-sky-200', 'bg-emerald-100 border-emerald-200', 'bg-violet-100 border-violet-200', 'bg-orange-100 border-orange-200', 'bg-pink-100 border-pink-200'];

export default function Medications() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [interactionWarning, setInteractionWarning] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<MedicationCreatePayload>();

    const { data: medications, isLoading } = useQuery<Medication[]>({
        queryKey: ['medications'],
        queryFn: medicationApi.list,
        initialData: [],
    });

    const createMutation = useMutation({
        mutationFn: medicationApi.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
            reset();
            setShowForm(false);
            if (data.interaction_warning) {
                setInteractionWarning(data.interaction_warning);
            } else {
                toast.success(`${data.medication_name} added successfully`);
            }
        },
        onError: () => {
            toast.error('Failed to add medication. Please try again.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: medicationApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications'] });
            toast.success('Medication removed');
        },
        onError: () => {
            toast.error('Failed to remove medication.');
        },
    });

    const onSubmit = (data: MedicationCreatePayload) => {
        createMutation.mutate(data);
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Medications</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Your current regimen · {medications.length} active
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowForm(true)}
                        className="bg-cyan-600 hover:bg-cyan-700"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Medication
                    </Button>
                </div>

                {/* Drug Interaction Warning */}
                <AnimatePresence>
                    {interactionWarning && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3"
                        >
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-amber-800 mb-1">
                                    ⚠️ Possible Drug Interaction Detected
                                </p>
                                <p className="text-sm text-amber-700">{interactionWarning}</p>
                                <p className="text-xs text-amber-600 mt-2 font-medium">
                                    The medication was saved. Please consult your doctor before taking it.
                                </p>
                            </div>
                            <button onClick={() => setInteractionWarning(null)}>
                                <X className="w-4 h-4 text-amber-400 hover:text-amber-600" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add Medication Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-semibold text-slate-800">New Medication</h2>
                                <button onClick={() => setShowForm(false)}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="medication_name">Medication Name *</Label>
                                        <Input
                                            id="medication_name"
                                            placeholder="e.g. Glycomet SR 500"
                                            {...register('medication_name', { required: 'Required' })}
                                            className="mt-1"
                                        />
                                        {errors.medication_name && (
                                            <p className="text-xs text-red-500 mt-1">{errors.medication_name.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="dosage">Dosage *</Label>
                                        <Input
                                            id="dosage"
                                            placeholder="e.g. 500mg"
                                            {...register('dosage', { required: 'Required' })}
                                            className="mt-1"
                                        />
                                        {errors.dosage && (
                                            <p className="text-xs text-red-500 mt-1">{errors.dosage.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="frequency">Frequency *</Label>
                                        <Input
                                            id="frequency"
                                            placeholder="e.g. twice daily"
                                            {...register('frequency', { required: 'Required' })}
                                            className="mt-1"
                                        />
                                        {errors.frequency && (
                                            <p className="text-xs text-red-500 mt-1">{errors.frequency.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="start_date">Start Date *</Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            {...register('start_date', { required: 'Required' })}
                                            className="mt-1"
                                        />
                                        {errors.start_date && (
                                            <p className="text-xs text-red-500 mt-1">{errors.start_date.message}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="end_date">End Date</Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            {...register('end_date')}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input
                                            id="notes"
                                            placeholder="e.g. Take after meals"
                                            {...register('notes')}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400">
                                    We'll automatically check for drug-drug interactions with your existing medications.
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending}
                                        className="bg-cyan-600 hover:bg-cyan-700"
                                    >
                                        {createMutation.isPending ? 'Checking interactions…' : 'Save Medication'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Medications List */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
                    </div>
                ) : medications.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                        <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mx-auto mb-4">
                            <Pill className="w-7 h-7 text-cyan-600" />
                        </div>
                        <p className="text-slate-600 font-medium">No medications added yet</p>
                        <p className="text-slate-400 text-sm mt-1">Add your first medication to track your regimen</p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="mt-4 bg-cyan-600 hover:bg-cyan-700"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Medication
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {medications.map((med, i) => {
                            const isActive = !med.end_date || moment(med.end_date).isSameOrAfter(moment(), 'day');
                            return (
                                <motion.div
                                    key={med.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={`bg-white rounded-2xl border p-4 flex items-start justify-between ${COLORS[i % COLORS.length]}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                                            <Pill className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{med.medication_name}</p>
                                            <p className="text-sm text-slate-500">{med.dosage} · {med.frequency}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs text-slate-400">
                                                    {moment(med.start_date).format('DD MMM YYYY')}
                                                    {med.end_date && ` → ${moment(med.end_date).format('DD MMM YYYY')}`}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {isActive ? 'Active' : 'Completed'}
                                                </span>
                                            </div>
                                            {med.notes && (
                                                <p className="text-xs text-slate-400 mt-1">{med.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteMutation.mutate(med.id)}
                                        disabled={deleteMutation.isPending}
                                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
