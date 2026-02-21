import React, { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, MapPin, Heart, Shield, Loader2, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { createPageUrl } from '../utils';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { authApi } from '../api';
import { patientApi } from '../api/patient.api';

interface Step {
    id: number;
    title: string;
    icon: LucideIcon;
}

const steps: Step[] = [
    { id: 1, title: 'Personal Information', icon: User },
    { id: 2, title: 'Location & Contact', icon: MapPin },
    { id: 3, title: 'Medical History', icon: Heart },
    { id: 4, title: 'Insurance Details', icon: Shield },
];

interface LocationData {
    city: string;
    state: string;
    country: string;
    timezone: string;
    postal_code: string;
}

interface MedicalHistoryData {
    blood_type: string;
    allergies: string[];
    chronic_conditions: string[];
    past_surgeries: string[];
    family_history: string;
}

interface InsuranceData {
    provider: string;
    policy_number: string;
    group_number: string;
}

interface EmergencyContactData {
    name: string;
    relationship: string;
    phone: string;
}

interface OnboardingFormData {
    date_of_birth: string;
    phone: string;
    location: LocationData;
    medical_history: MedicalHistoryData;
    insurance: InsuranceData;
    emergency_contact: EmergencyContactData;
}

export default function OnboardingPatient() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<OnboardingFormData>({
        date_of_birth: '',
        phone: '',
        location: {
            city: '',
            state: '',
            country: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            postal_code: '',
        },
        medical_history: {
            blood_type: '',
            allergies: [],
            chronic_conditions: [],
            past_surgeries: [],
            family_history: '',
        },
        insurance: {
            provider: '',
            policy_number: '',
            group_number: '',
        },
        emergency_contact: {
            name: '',
            relationship: '',
            phone: '',
        },
    });

    const [allergyInput, setAllergyInput] = useState('');
    const [conditionInput, setConditionInput] = useState('');

    const handleChange = (path: string, value: string) => {
        const keys = path.split('.');
        setFormData(prev => {
            const updated = JSON.parse(JSON.stringify(prev)) as OnboardingFormData;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let current: any = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const addToArray = (path: string, value: string) => {
        if (!value.trim()) return;
        const keys = path.split('.');
        setFormData(prev => {
            const updated = JSON.parse(JSON.stringify(prev)) as OnboardingFormData;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let current: any = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = [...current[keys[keys.length - 1]], value.trim()];
            return updated;
        });
    };

    const removeFromArray = (path: string, index: number) => {
        const keys = path.split('.');
        setFormData(prev => {
            const updated = JSON.parse(JSON.stringify(prev)) as OnboardingFormData;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let current: any = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = current[keys[keys.length - 1]].filter((_: string, i: number) => i !== index);
            return updated;
        });
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            // await authApi.updateMe({
            //     ...formData,
            //     user_type: "patient",
            //     onboarding_completed: true,
            // });

            await patientApi.createProfile({
                ...formData,
                // user_type: "patient",
                onboarding_completed: true,
            });

            toast.success("Profile completed successfully!");
            navigate(createPageUrl("Home"));
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-800 mb-3">Welcome to Aura Health</h1>
                    <p className="text-slate-500">Let's set up your health profile</p>
                </motion.div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <motion.div
                                    animate={{
                                        scale: currentStep === step.id ? 1.1 : 1,
                                        backgroundColor: currentStep >= step.id ? '#0E7490' : '#E2E8F0',
                                    }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${currentStep >= step.id ? 'text-white' : 'text-slate-400'
                                        }`}
                                >
                                    <step.icon className="w-6 h-6" />
                                </motion.div>
                                <p className={`text-xs font-medium ${currentStep >= step.id ? 'text-cyan-700' : 'text-slate-400'
                                    }`}>
                                    Step {step.id}
                                </p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-4 bg-slate-200 relative top-[-20px]">
                                    <motion.div
                                        animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                                        className="h-full bg-cyan-600"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Personal Information</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
                                        <Input
                                            type="date"
                                            value={formData.date_of_birth}
                                            onChange={(e) => handleChange('date_of_birth', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            placeholder="+1 (555) 123-4567"
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Emergency Contact Name</Label>
                                    <Input
                                        value={formData.emergency_contact.name}
                                        onChange={(e) => handleChange('emergency_contact.name', e.target.value)}
                                        placeholder="Full name"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Relationship</Label>
                                        <Select
                                            value={formData.emergency_contact.relationship}
                                            onValueChange={(value) => handleChange('emergency_contact.relationship', value)}
                                        >
                                            <SelectTrigger className="h-12 rounded-xl">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="spouse">Spouse</SelectItem>
                                                <SelectItem value="parent">Parent</SelectItem>
                                                <SelectItem value="sibling">Sibling</SelectItem>
                                                <SelectItem value="child">Child</SelectItem>
                                                <SelectItem value="friend">Friend</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Emergency Contact Phone</Label>
                                        <Input
                                            type="tel"
                                            value={formData.emergency_contact.phone}
                                            onChange={(e) => handleChange('emergency_contact.phone', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Location */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Location & Contact</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input
                                            value={formData.location.city}
                                            onChange={(e) => handleChange('location.city', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State/Province</Label>
                                        <Input
                                            value={formData.location.state}
                                            onChange={(e) => handleChange('location.state', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Country</Label>
                                        <Input
                                            value={formData.location.country}
                                            onChange={(e) => handleChange('location.country', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Postal Code</Label>
                                        <Input
                                            value={formData.location.postal_code}
                                            onChange={(e) => handleChange('location.postal_code', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                                    <p className="text-sm text-cyan-800">
                                        <strong>Timezone detected:</strong> {formData.location.timezone}
                                    </p>
                                    <p className="text-xs text-cyan-600 mt-1">
                                        We use your location for weather-based health insights and local time scheduling.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Medical History */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Medical History</h2>

                                <div className="space-y-2">
                                    <Label>Blood Type</Label>
                                    <Select
                                        value={formData.medical_history.blood_type}
                                        onValueChange={(value) => handleChange('medical_history.blood_type', value)}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="Select blood type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Allergies</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={allergyInput}
                                            onChange={(e) => setAllergyInput(e.target.value)}
                                            placeholder="e.g., Penicillin, Peanuts"
                                            className="h-12 rounded-xl"
                                            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addToArray('medical_history.allergies', allergyInput);
                                                    setAllergyInput('');
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                addToArray('medical_history.allergies', allergyInput);
                                                setAllergyInput('');
                                            }}
                                            className="h-12 px-6 rounded-xl"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.medical_history.allergies.map((allergy, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {allergy}
                                                <button
                                                    onClick={() => removeFromArray('medical_history.allergies', index)}
                                                    className="hover:text-red-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Chronic Conditions</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={conditionInput}
                                            onChange={(e) => setConditionInput(e.target.value)}
                                            placeholder="e.g., Diabetes, Hypertension"
                                            className="h-12 rounded-xl"
                                            onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addToArray('medical_history.chronic_conditions', conditionInput);
                                                    setConditionInput('');
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                addToArray('medical_history.chronic_conditions', conditionInput);
                                                setConditionInput('');
                                            }}
                                            className="h-12 px-6 rounded-xl"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.medical_history.chronic_conditions.map((condition, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {condition}
                                                <button
                                                    onClick={() => removeFromArray('medical_history.chronic_conditions', index)}
                                                    className="hover:text-amber-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Family Medical History (Optional)</Label>
                                    <Textarea
                                        value={formData.medical_history.family_history}
                                        onChange={(e) => handleChange('medical_history.family_history', e.target.value)}
                                        placeholder="Any relevant family medical history..."
                                        className="rounded-xl min-h-[100px]"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Insurance */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Insurance Details</h2>

                                <div className="space-y-2">
                                    <Label>Insurance Provider</Label>
                                    <Input
                                        value={formData.insurance.provider}
                                        onChange={(e) => handleChange('insurance.provider', e.target.value)}
                                        placeholder="e.g., Blue Cross Blue Shield"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Policy Number</Label>
                                        <Input
                                            value={formData.insurance.policy_number}
                                            onChange={(e) => handleChange('insurance.policy_number', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Group Number (Optional)</Label>
                                        <Input
                                            value={formData.insurance.group_number}
                                            onChange={(e) => handleChange('insurance.group_number', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl">
                                    <p className="text-sm text-slate-600">
                                        Your insurance information is encrypted and securely stored. It will only be used for billing purposes with your explicit consent.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                            className="h-12 px-6 rounded-xl"
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="h-12 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : currentStep === steps.length ? (
                                'Complete Setup'
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
