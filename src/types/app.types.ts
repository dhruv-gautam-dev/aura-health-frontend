// Matches backend MedicationRead schema
export interface Medication {
    id: number;
    user_id: number;
    medication_name: string;
    dosage: string;
    frequency: string;
    reminder_time: string | null;  // "HH:MM" 24-hour
    start_date: string;       // ISO date "YYYY-MM-DD"
    end_date: string | null;
    notes: string | null;
    google_calendar_event_id: string | null;
    created_at: string;
    updated_at: string;
}

// Returned by POST /medications/ — extends Medication with interaction check
export interface MedicationCreateResponse extends Medication {
    interaction_warning: string | null;
    interactions_found: number;
}

export interface MedicationCreatePayload {
    medication_name: string;
    dosage: string;
    frequency: string;
    reminder_time?: string | null;  // "HH:MM" 24-hour
    start_date: string;
    end_date?: string | null;
    notes?: string | null;
}

export interface MedicationUpdatePayload {
    medication_name?: string;
    dosage?: string;
    frequency?: string;
    start_date?: string;
    end_date?: string | null;
    notes?: string | null;
    google_calendar_event_id?: string | null;
}

// Matches backend LabResult row returned by GET /health-records/labs/timeline
export interface LabResult {
    id: number;
    test_name: string;
    value: number;
    unit: string | null;
    reference_range: string | null;
    flag: 'normal' | 'high' | 'low' | null;
    date: string | null;   // ISO date "YYYY-MM-DD"
}

export interface LabTimelineResponse {
    total: number;
    results: LabResult[];
}

// A medication extracted from a health document by Gemini OCR
export interface ExtractedMedication {
    name: string;
    generic_name?: string | null;
    dosage?: string;
    frequency?: string;
    duration?: string | null;
    instructions?: string | null;
}

// A single uploaded health record file with its extracted labs
export interface UploadedRecord {
    upload_id: string;
    document_title: string;
    file_name: string;
    file_url: string | null;
    uploaded_at: string | null;
    lab_count: number;
    medication_count: number;
    diagnoses: string[];
    medications: ExtractedMedication[];
    doctor_name: string | null;
    clinic_name: string | null;
    document_date: string | null;
    notes: string | null;
    labs: LabResult[];
}

export interface UploadsListResponse {
    total: number;
    uploads: UploadedRecord[];
}

// Returned by POST /health-records/upload
export interface HealthRecordUploadResponse {
    file_url: string;
    extraction: {
        medications: Array<{
            name: string;
            generic_name: string | null;
            dosage: string;
            frequency: string;
            duration: string | null;
            instructions: string | null;
        }>;
        diagnoses: string[];
        lab_results: LabResult[];
        doctor_name: string | null;
        clinic_name: string | null;
        document_date: string | null;
        notes: string | null;
    };
    message: string;
}
