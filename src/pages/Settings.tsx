import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    User, Phone, Calendar, Globe, Heart, AlertTriangle,
    Shield, Users, Save, Trash2, LogOut, ChevronRight,
    Download, Loader2, CheckCircle2, X, Plus,
} from 'lucide-react';
import { toast } from 'sonner';

import { settingsApi } from '../api/settings.api';
import { healthRecordsApi } from '../api/healthRecords.api';
import { authApi } from '../api/auth.api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { clearUser } from '../store/authSlice';
import { persistor } from '../store';
import type { UserSettingsUpdatePayload } from '../types/app.types';

// Common Indian + international timezones
const TIMEZONES = [
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'Australia/Sydney',
    'Pacific/Auckland',
    'UTC',
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

function TagInput({
    label,
    values,
    onChange,
    placeholder,
}: {
    label: string;
    values: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
}) {
    const [input, setInput] = useState('');

    const add = () => {
        const trimmed = input.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange([...values, trimmed]);
        }
        setInput('');
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2">
                {values.map(v => (
                    <span
                        key={v}
                        className="flex items-center gap-1 text-xs bg-cyan-50 text-cyan-700 border border-cyan-100 px-2.5 py-1 rounded-full"
                    >
                        {v}
                        <button
                            type="button"
                            onClick={() => onChange(values.filter(x => x !== v))}
                            className="text-cyan-400 hover:text-red-500 ml-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
                    placeholder={placeholder ?? `Add ${label.toLowerCase()}...`}
                    className="text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={add} className="shrink-0">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

function Section({ icon: Icon, title, children }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-6"
        >
            <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-cyan-600" />
                </div>
                <h2 className="text-base font-semibold text-slate-800">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}

export default function Settings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    const { data: profile, isLoading } = useQuery({
        queryKey: ['user-me'],
        queryFn: settingsApi.getMe,
    });

    // Form state — initialised once profile loads
    const [form, setForm] = useState<UserSettingsUpdatePayload>({});
    const [allergies, setAllergies] = useState<string[]>([]);
    const [conditions, setConditions] = useState<string[]>([]);
    const [surgeries, setSurgeries] = useState<string[]>([]);

    useEffect(() => {
        if (!profile) return;
        setForm({
            username: profile.username ?? '',
            phone: profile.phone ?? '',
            date_of_birth: profile.date_of_birth ?? '',
            timezone: profile.timezone ?? 'Asia/Kolkata',
            blood_type: profile.blood_type ?? '',
            family_history: profile.family_history ?? '',
            emergency_contact_name: profile.emergency_contact_name ?? '',
            emergency_contact_relationship: profile.emergency_contact_relationship ?? '',
            emergency_contact_phone: profile.emergency_contact_phone ?? '',
        });
        setAllergies(profile.allergies ?? []);
        setConditions(profile.chronic_conditions ?? []);
        setSurgeries(profile.past_surgeries ?? []);
    }, [profile]);

    const updateMutation = useMutation({
        mutationFn: settingsApi.updateMe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-me'] });
            toast.success('Settings saved');
        },
        onError: () => toast.error('Failed to save settings. Please try again.'),
    });

    const deleteMutation = useMutation({
        mutationFn: settingsApi.deleteMe,
        onSuccess: async () => {
            await authApi.logout();
            dispatch(clearUser());
            await persistor.purge();
            navigate('/login');
        },
        onError: () => toast.error('Failed to delete account. Please try again.'),
    });

    const exportMutation = useMutation({
        mutationFn: healthRecordsApi.exportFhir,
        onSuccess: () => toast.success('FHIR export downloaded'),
        onError: () => toast.error('FHIR export failed.'),
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            ...form,
            allergies,
            chronic_conditions: conditions,
            past_surgeries: surgeries,
        });
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
            dispatch(clearUser());
            await persistor.purge();
            navigate('/login');
        } catch {
            navigate('/login');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your profile, health info, and account</p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Profile */}
                    <Section icon={User} title="Profile">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
                                <Input
                                    value={form.username ?? ''}
                                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <Input
                                    value={profile?.email ?? ''}
                                    disabled
                                    className="bg-slate-50 text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-slate-400 mt-1">Email cannot be changed here</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" /> Phone
                                    </label>
                                    <Input
                                        value={form.phone ?? ''}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Date of Birth
                                    </label>
                                    <Input
                                        type="date"
                                        value={form.date_of_birth ?? ''}
                                        onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Timezone */}
                    <Section icon={Globe} title="Timezone">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your timezone</label>
                            <select
                                value={form.timezone ?? 'Asia/Kolkata'}
                                onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                {TIMEZONES.map(tz => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">Used by Aura AI to contextualise your health diary and reminders</p>
                        </div>
                    </Section>

                    {/* Health Info */}
                    <Section icon={Heart} title="Health Info">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Type</label>
                                <select
                                    value={form.blood_type ?? ''}
                                    onChange={e => setForm(f => ({ ...f, blood_type: e.target.value }))}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Select blood type</option>
                                    {BLOOD_TYPES.map(bt => (
                                        <option key={bt} value={bt}>{bt}</option>
                                    ))}
                                </select>
                            </div>
                            <TagInput
                                label="Allergies"
                                values={allergies}
                                onChange={setAllergies}
                                placeholder="e.g. Penicillin, Peanuts..."
                            />
                            <TagInput
                                label="Chronic Conditions"
                                values={conditions}
                                onChange={setConditions}
                                placeholder="e.g. Type 2 Diabetes, Hypertension..."
                            />
                            <TagInput
                                label="Past Surgeries"
                                values={surgeries}
                                onChange={setSurgeries}
                                placeholder="e.g. Appendectomy 2019..."
                            />
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Family Medical History</label>
                                <textarea
                                    value={form.family_history ?? ''}
                                    onChange={e => setForm(f => ({ ...f, family_history: e.target.value }))}
                                    rows={3}
                                    placeholder="e.g. Father: Hypertension, Type 2 Diabetes. Mother: Hypothyroidism..."
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Emergency Contact */}
                    <Section icon={Shield} title="Emergency Contact">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                                <Input
                                    value={form.emergency_contact_name ?? ''}
                                    onChange={e => setForm(f => ({ ...f, emergency_contact_name: e.target.value }))}
                                    placeholder="Full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Relationship</label>
                                <Input
                                    value={form.emergency_contact_relationship ?? ''}
                                    onChange={e => setForm(f => ({ ...f, emergency_contact_relationship: e.target.value }))}
                                    placeholder="e.g. Spouse"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                                <Input
                                    value={form.emergency_contact_phone ?? ''}
                                    onChange={e => setForm(f => ({ ...f, emergency_contact_phone: e.target.value }))}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Save button */}
                    <Button
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-11"
                    >
                        {updateMutation.isPending
                            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                    </Button>
                </form>

                {/* Account actions */}
                <div className="mt-6 space-y-3">
                    <Section icon={Download} title="Data">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Export Health Data</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Download all your records as a FHIR R4 bundle</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => exportMutation.mutate()}
                                    disabled={exportMutation.isPending}
                                    className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 shrink-0"
                                >
                                    {exportMutation.isPending
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <><Download className="w-4 h-4 mr-1.5" /> Export FHIR</>}
                                </Button>
                            </div>
                        </div>
                    </Section>

                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            </div>
                            <h2 className="text-base font-semibold text-slate-800">Account</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Sign Out</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Sign out of your account on this device</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="shrink-0"
                                >
                                    <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
                                </Button>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-red-600">Delete Account</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                    >
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 text-center">Delete your account?</h3>
                        <p className="text-sm text-slate-500 text-center mt-2 mb-5">
                            This will permanently delete your profile, all medical records, lab results, and medications. This action <strong>cannot be undone</strong>.
                        </p>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                            Type <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-red-600">DELETE</span> to confirm
                        </p>
                        <Input
                            value={deleteInput}
                            onChange={e => setDeleteInput(e.target.value)}
                            placeholder="DELETE"
                            className="mb-4 font-mono"
                        />
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                disabled={deleteInput !== 'DELETE' || deleteMutation.isPending}
                                onClick={() => deleteMutation.mutate()}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                            >
                                {deleteMutation.isPending
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : 'Delete My Account'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
