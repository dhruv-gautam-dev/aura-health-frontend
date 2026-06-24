import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    Upload, FileText, TrendingUp, TrendingDown, Minus,
    Download, FlaskConical, Loader2, CheckCircle2, X,
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

import { healthRecordsApi } from '../api/healthRecords.api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import type { LabResult } from '../types/app.types';

const FLAG_CONFIG = {
    high: { icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50 border-red-100', label: 'High' },
    low: { icon: TrendingDown, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', label: 'Low' },
    normal: { icon: Minus, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', label: 'Normal' },
};

function LabRow({ lab }: { lab: LabResult }) {
    const cfg = FLAG_CONFIG[lab.flag ?? 'normal'];
    const Icon = cfg.icon;
    return (
        <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
            <div>
                <p className="text-sm font-medium text-slate-800">{lab.test_name}</p>
                {lab.reference_range && (
                    <p className="text-xs text-slate-400 mt-0.5">Ref: {lab.reference_range}</p>
                )}
                {lab.date && (
                    <p className="text-xs text-slate-400">{moment(lab.date).format('DD MMM YYYY')}</p>
                )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span className="text-sm font-semibold text-slate-700">
                    {lab.value}{lab.unit ? ` ${lab.unit}` : ''}
                </span>
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.color}`}>
                    <Icon className="w-3 h-3" />
                    {cfg.label}
                </span>
            </div>
        </div>
    );
}

export default function MedicalRecords() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadResult, setUploadResult] = useState<{ message: string; diagnoses: string[]; medicationCount: number; labCount: number } | null>(null);

    const { data: labsData, isLoading: labsLoading, refetch: refetchLabs } = useQuery({
        queryKey: ['labs-timeline', searchTerm],
        queryFn: () => healthRecordsApi.getLabsTimeline(searchTerm || undefined),
    });

    const uploadMutation = useMutation({
        mutationFn: healthRecordsApi.upload,
        onSuccess: (data) => {
            const extraction = data.extraction ?? {};
            setUploadResult({
                message: data.message,
                diagnoses: extraction.diagnoses ?? [],
                medicationCount: (extraction.medications ?? []).length,
                labCount: (extraction.lab_results ?? []).length,
            });
            refetchLabs();
        },
        onError: () => {
            toast.error('Upload failed. Please check the file type and size (max 10 MB).');
        },
    });

    const exportMutation = useMutation({
        mutationFn: healthRecordsApi.exportFhir,
        onSuccess: () => toast.success('FHIR export downloaded'),
        onError: () => toast.error('FHIR export failed. Please try again.'),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadResult(null);
            uploadMutation.mutate(file);
        }
        // Reset input so same file can be re-selected
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setUploadResult(null);
            uploadMutation.mutate(file);
        }
    };

    const labs: LabResult[] = labsData?.results ?? [];

    // Group labs by test name for trend view
    const labsByTest: Record<string, LabResult[]> = {};
    for (const lab of labs) {
        (labsByTest[lab.test_name] ??= []).push(lab);
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Medical Records</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Upload prescriptions and lab reports · {labsData?.total ?? 0} lab results stored
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => exportMutation.mutate()}
                        disabled={exportMutation.isPending}
                        className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                    >
                        {exportMutation.isPending ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Export FHIR
                    </Button>
                </div>

                {/* Upload Zone */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
                    className={`
                        relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer mb-6
                        ${uploadMutation.isPending
                            ? 'border-cyan-300 bg-cyan-50 cursor-not-allowed'
                            : 'border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50'
                        }
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.heic,.pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {uploadMutation.isPending ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                            <p className="text-sm font-medium text-cyan-700">Analysing with Gemini AI…</p>
                            <p className="text-xs text-cyan-500">Extracting medications and lab values</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                                <Upload className="w-7 h-7 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    Drop a file here or <span className="text-cyan-600">click to browse</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Supports: JPG, PNG, WEBP, HEIC, PDF · Max 10 MB
                                </p>
                                <p className="text-xs text-slate-400">
                                    Prescriptions · Lab reports · Discharge summaries
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload Result */}
                <AnimatePresence>
                    {uploadResult && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex gap-3"
                        >
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-emerald-800">Document analysed successfully</p>
                                <div className="flex gap-4 mt-1.5 text-xs text-emerald-700">
                                    <span>💊 {uploadResult.medicationCount} medication(s) found</span>
                                    <span>🔬 {uploadResult.labCount} lab result(s) extracted</span>
                                </div>
                                {uploadResult.diagnoses.length > 0 && (
                                    <p className="text-xs text-emerald-600 mt-1">
                                        Diagnoses: {uploadResult.diagnoses.join(', ')}
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setUploadResult(null)}>
                                <X className="w-4 h-4 text-emerald-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lab Results Timeline */}
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-violet-500" />
                            Lab Results Timeline
                        </h2>
                        <div className="w-48">
                            <Input
                                placeholder="Filter by test…"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="text-sm h-9"
                            />
                        </div>
                    </div>

                    {labsLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}
                        </div>
                    ) : labs.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
                                <FlaskConical className="w-6 h-6 text-violet-400" />
                            </div>
                            <p className="text-slate-600 text-sm">
                                {searchTerm ? `No results found for "${searchTerm}"` : 'No lab results yet'}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                                Upload a lab report above to extract results automatically
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(labsByTest).map(([testName, entries]) => (
                                <motion.div
                                    key={testName}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border border-slate-100 px-4 py-1"
                                >
                                    <div className="flex items-center justify-between py-2 mb-1">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                            {testName}
                                        </p>
                                        <span className="text-xs text-slate-300">{entries.length} reading(s)</span>
                                    </div>
                                    {entries.map(lab => <LabRow key={lab.id} lab={lab} />)}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
