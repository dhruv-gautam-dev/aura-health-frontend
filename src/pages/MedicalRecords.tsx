import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Upload, FileText, TrendingUp, TrendingDown, Minus,
    Download, FlaskConical, Loader2, CheckCircle2, X,
    ChevronDown, ChevronUp, Trash2, Pill, Stethoscope,
} from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

import { healthRecordsApi } from '../api/healthRecords.api';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import type { LabResult, UploadedRecord, ExtractedMedication } from '../types/app.types';

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

function MedCard({ med }: { med: ExtractedMedication }) {
    return (
        <div className="flex items-start justify-between bg-slate-50 rounded-xl px-3 py-2.5">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{med.name}</p>
                {med.generic_name && (
                    <p className="text-xs text-slate-400 mt-0.5">{med.generic_name}</p>
                )}
                {med.instructions && (
                    <p className="text-xs text-slate-400 mt-0.5 italic">{med.instructions}</p>
                )}
            </div>
            <div className="text-right ml-4 flex-shrink-0">
                {med.dosage && <p className="text-xs font-medium text-slate-600">{med.dosage}</p>}
                {med.frequency && <p className="text-xs text-slate-400">{med.frequency}</p>}
                {med.duration && <p className="text-xs text-slate-400">{med.duration}</p>}
            </div>
        </div>
    );
}

function UploadCard({ record, onDelete }: { record: UploadedRecord; onDelete: (id: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    const hasContent =
        record.labs.length > 0 ||
        record.medications.length > 0 ||
        record.diagnoses.length > 0 ||
        Boolean(record.doctor_name) ||
        Boolean(record.notes);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
        >
            {/* Card header */}
            <div
                className="flex items-center justify-between px-4 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(v => !v)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 text-sm">{record.document_title || record.file_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {record.uploaded_at ? moment(record.uploaded_at).format('DD MMM YYYY, h:mm A') : 'Unknown date'}
                            {' · '}
                            <span className="text-cyan-600">{expanded ? 'Hide analysis' : 'View analysis'}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {record.lab_count > 0 && (
                                <span className="flex items-center gap-1 text-xs text-violet-600">
                                    <FlaskConical className="w-3 h-3" />
                                    {record.lab_count} lab result{record.lab_count !== 1 ? 's' : ''}
                                </span>
                            )}
                            {record.medication_count > 0 && (
                                <span className="flex items-center gap-1 text-xs text-cyan-600">
                                    <Pill className="w-3 h-3" />
                                    {record.medication_count} medication{record.medication_count !== 1 ? 's' : ''}
                                </span>
                            )}
                            {record.diagnoses.length > 0 && (
                                <span className="text-xs text-slate-400 truncate max-w-[180px]">
                                    {record.diagnoses.join(', ')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {record.file_url && (
                        <a
                            href={record.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                            title="View original file"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}
                    <button
                        onClick={e => { e.stopPropagation(); onDelete(record.upload_id); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete this record"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {expanded
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </div>

            {/* Expandable analysis panel */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100"
                    >
                        {!hasContent ? (
                            <p className="text-xs text-slate-400 text-center py-6">
                                No data could be extracted from this file
                            </p>
                        ) : (
                            <div className="px-4 py-5 space-y-5">
                                {(record.doctor_name || record.clinic_name || record.document_date) && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                        {record.doctor_name && (
                                            <span className="flex items-center gap-1 font-medium text-slate-700">
                                                <Stethoscope className="w-3.5 h-3.5 text-violet-400" />
                                                {record.doctor_name}
                                            </span>
                                        )}
                                        {record.clinic_name && (
                                            <span>{record.clinic_name}</span>
                                        )}
                                        {record.document_date && (
                                            <span>{moment(record.document_date).format('DD MMM YYYY')}</span>
                                        )}
                                    </div>
                                )}

                                {record.diagnoses.length > 0 && (
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                                            Diagnoses
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {record.diagnoses.map((d, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-full font-medium"
                                                >
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {record.medications.length > 0 && (
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Pill className="w-3 h-3" /> Prescribed Medications
                                        </p>
                                        <div className="space-y-1.5">
                                            {record.medications.map((med, i) => (
                                                <MedCard key={i} med={med} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {record.labs.length > 0 && (
                                    <div>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <FlaskConical className="w-3 h-3" /> Lab Results
                                        </p>
                                        <div className="divide-y divide-slate-50">
                                            {record.labs.map(lab => <LabRow key={lab.id} lab={lab} />)}
                                        </div>
                                    </div>
                                )}

                                {record.notes && (
                                    <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                                            Notes
                                        </p>
                                        <p className="text-xs text-slate-600 leading-relaxed">{record.notes}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function MedicalRecords() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadResult, setUploadResult] = useState<{ labCount: number; medicationCount: number } | null>(null);

    const { data: uploadsData, isLoading } = useQuery({
        queryKey: ['health-uploads'],
        queryFn: healthRecordsApi.getUploads,
    });

    const uploadMutation = useMutation({
        mutationFn: healthRecordsApi.upload,
        onSuccess: (data) => {
            const extraction = data.extraction ?? {};
            setUploadResult({
                labCount: (extraction.lab_results ?? []).length,
                medicationCount: (extraction.medications ?? []).length,
            });
            queryClient.invalidateQueries({ queryKey: ['health-uploads'] });
        },
        onError: () => {
            toast.error('Upload failed. Please check the file type and size (max 10 MB).');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: healthRecordsApi.deleteUpload,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health-uploads'] });
            toast.success('Record deleted');
        },
        onError: () => toast.error('Failed to delete record.'),
    });

    const exportMutation = useMutation({
        mutationFn: healthRecordsApi.exportFhir,
        onSuccess: () => toast.success('FHIR export downloaded'),
        onError: () => toast.error('FHIR export failed. Please try again.'),
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setUploadResult(null); uploadMutation.mutate(file); }
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) { setUploadResult(null); uploadMutation.mutate(file); }
    };

    const uploads: UploadedRecord[] = uploadsData?.uploads ?? [];

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800">Medical Records</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {uploadsData?.total ?? 0} record{uploadsData?.total !== 1 ? 's' : ''} uploaded
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => exportMutation.mutate()}
                        disabled={exportMutation.isPending}
                        className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                    >
                        {exportMutation.isPending
                            ? <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            : <Download className="w-4 h-4 mr-2" />}
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
                            : 'border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50'}
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
                            <p className="text-sm font-medium text-cyan-700">Analysing with Gemini AI...</p>
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
                                <p className="text-xs text-slate-400 mt-1">JPG · PNG · WEBP · HEIC · PDF · Max 10 MB</p>
                                <p className="text-xs text-slate-400">Prescriptions · Lab reports · Discharge summaries</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upload success banner */}
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
                                <div className="flex gap-4 mt-1 text-xs text-emerald-700">
                                    <span>{uploadResult.medicationCount} medication(s) found</span>
                                    <span>ðŸ”¬ {uploadResult.labCount} lab result(s) extracted</span>
                                </div>
                            </div>
                            <button onClick={() => setUploadResult(null)}>
                                <X className="w-4 h-4 text-emerald-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Uploads list */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-violet-500" />
                        Uploaded Records
                    </h2>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                        </div>
                    ) : uploads.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
                            <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-3">
                                <FileText className="w-6 h-6 text-violet-400" />
                            </div>
                            <p className="text-slate-600 text-sm">No records uploaded yet</p>
                            <p className="text-slate-400 text-xs mt-1">
                                Upload a prescription or lab report above to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {uploads.map(record => (
                                <UploadCard
                                    key={record.upload_id}
                                    record={record}
                                    onDelete={(id) => deleteMutation.mutate(id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
