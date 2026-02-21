import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    ChevronRight,
    ChevronLeft,
    Stethoscope,
    GraduationCap,
    Calendar,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { authApi, doctorApi } from "../api";
import { Textarea } from "../components/ui/textarea";
/* ============================= */
/*          TYPES                */
/* ============================= */

interface Education {
    degree: string;
    institution: string;
    year: string;
}

interface Availability {
    days: string[];
    hours: string;
}

interface DoctorFormData {
    specialization: string;
    license_number: string;
    years_of_experience: string;
    bio: string;
    consultation_fee: string;
    education: Education[];
    certifications: string[];
    languages: string[];
    availability: Availability;
}

interface Step {
    id: number;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
}

/* ============================= */
/*           STEPS               */
/* ============================= */

const steps: Step[] = [
    { id: 1, title: "Professional Details", icon: Stethoscope },
    { id: 2, title: "Education & Credentials", icon: GraduationCap },
    { id: 3, title: "Availability", icon: Calendar },
];

/* ============================= */
/*        COMPONENT              */
/* ============================= */

export const OnboardingDoctor: React.FC = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [formData, setFormData] = useState<DoctorFormData>({
        specialization: "",
        license_number: "",
        years_of_experience: "",
        bio: "",
        consultation_fee: "",
        education: [],
        certifications: [],
        languages: [],
        availability: {
            days: [],
            hours: "",
        },
    });

    const [educationForm, setEducationForm] = useState<Education>({
        degree: "",
        institution: "",
        year: "",
    });

    const [certInput, setCertInput] = useState<string>("");
    const [langInput, setLangInput] = useState<string>("");

    /* ============================= */
    /*        HANDLERS               */
    /* ============================= */

    const handleChange = (field: keyof DoctorFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAvailabilityChange = (
        field: keyof Availability,
        value: string | string[]
    ) => {
        setFormData((prev) => ({
            ...prev,
            availability: {
                ...prev.availability,
                [field]: value,
            },
        }));
    };

    const addEducation = (): void => {
        if (
            educationForm.degree &&
            educationForm.institution &&
            educationForm.year
        ) {
            setFormData((prev) => ({
                ...prev,
                education: [...prev.education, educationForm],
            }));

            setEducationForm({
                degree: "",
                institution: "",
                year: "",
            });
        }
    };

    const toggleDay = (day: string): void => {
        setFormData((prev) => ({
            ...prev,
            availability: {
                ...prev.availability,
                days: prev.availability.days.includes(day)
                    ? prev.availability.days.filter((d) => d !== day)
                    : [...prev.availability.days, day],
            },
        }));
    };

    const handleNext = (): void => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);

        try {

            const user = await authApi.me();

            await authApi.updateMe({
                user_type: "doctor",
                onboarding_completed: true,
            });

            await doctorApi.createProfile({
                user_id: user.id,
                specialization: formData.specialization,
                license_number: formData.license_number,
                years_of_experience: Number(formData.years_of_experience),
                bio: formData.bio,
                consultation_fee: Number(formData.consultation_fee),
                education: formData.education,
                certifications: formData.certifications,
                languages: formData.languages,
                availability: formData.availability,
                is_verified: false,
                is_available: true,
                rating: 0,
                total_consultations: 0,
            });

            toast.success("Profile created successfully! Pending verification.");
            navigate(createPageUrl("DoctorDashboard"));
        } catch (error) {
            console.error(error);
            toast.error("Failed to create profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const daysOfWeek: string[] = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-slate-800 mb-3">Doctor Registration</h1>
                    <p className="text-slate-500">Create your professional profile</p>
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
                                    {step.title}
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
                        {/* Step 1: Professional Details */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Professional Details</h2>

                                <div className="space-y-2">
                                    <Label>Specialization *</Label>
                                    <Select
                                        value={formData.specialization}
                                        onValueChange={(value) => handleChange('specialization', value)}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl">
                                            <SelectValue placeholder="Select specialization" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="General Practitioner">General Practitioner</SelectItem>
                                            <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                                            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                                            <SelectItem value="Neurologist">Neurologist</SelectItem>
                                            <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                                            <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                                            <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                                            <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                                            <SelectItem value="Oncologist">Oncologist</SelectItem>
                                            <SelectItem value="Endocrinologist">Endocrinologist</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Medical License Number *</Label>
                                        <Input
                                            value={formData.license_number}
                                            onChange={(e) => handleChange('license_number', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Years of Experience *</Label>
                                        <Input
                                            type="number"
                                            value={formData.years_of_experience}
                                            onChange={(e) => handleChange('years_of_experience', e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Consultation Fee (USD) *</Label>
                                    <Input
                                        type="number"
                                        value={formData.consultation_fee}
                                        onChange={(e) => handleChange('consultation_fee', e.target.value)}
                                        placeholder="e.g., 50"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Professional Bio</Label>
                                    <Textarea
                                        value={formData.bio}
                                        onChange={(e) => handleChange('bio', e.target.value)}
                                        placeholder="Tell patients about your experience and approach..."
                                        className="rounded-xl min-h-[120px]"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Education */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Education & Credentials</h2>

                                <div className="space-y-4">
                                    <Label>Education</Label>
                                    <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                                        <Input
                                            placeholder="Degree (e.g., MD, MBBS)"
                                            value={educationForm.degree}
                                            onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                                            className="h-10 rounded-lg"
                                        />
                                        <Input
                                            placeholder="Institution"
                                            value={educationForm.institution}
                                            onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                                            className="h-10 rounded-lg"
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Year"
                                                value={educationForm.year}
                                                onChange={(e) => setEducationForm({ ...educationForm, year: e.target.value })}
                                                className="h-10 rounded-lg"
                                            />
                                            <Button onClick={addEducation} className="h-10 rounded-lg">
                                                Add Education
                                            </Button>
                                        </div>
                                    </div>
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-cyan-900">{edu.degree}</p>
                                                <p className="text-sm text-cyan-600">{edu.institution} • {edu.year}</p>
                                            </div>
                                            <button
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    education: prev.education.filter((_, i) => i !== index)
                                                }))}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <Label>Certifications</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={certInput}
                                            onChange={(e) => setCertInput(e.target.value)}
                                            placeholder="e.g., Board Certified in Internal Medicine"
                                            className="h-12 rounded-xl"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (certInput.trim()) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            certifications: [...prev.certifications, certInput.trim()]
                                                        }));
                                                        setCertInput('');
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (certInput.trim()) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        certifications: [...prev.certifications, certInput.trim()]
                                                    }));
                                                    setCertInput('');
                                                }
                                            }}
                                            className="h-12 px-6 rounded-xl"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.certifications.map((cert, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {cert}
                                                <button
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        certifications: prev.certifications.filter((_, i) => i !== index)
                                                    }))}
                                                    className="hover:text-emerald-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Languages Spoken</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={langInput}
                                            onChange={(e) => setLangInput(e.target.value)}
                                            placeholder="e.g., English, Spanish"
                                            className="h-12 rounded-xl"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    if (langInput.trim()) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            languages: [...prev.languages, langInput.trim()]
                                                        }));
                                                        setLangInput('');
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (langInput.trim()) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        languages: [...prev.languages, langInput.trim()]
                                                    }));
                                                    setLangInput('');
                                                }
                                            }}
                                            className="h-12 px-6 rounded-xl"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.languages.map((lang, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm flex items-center gap-2"
                                            >
                                                {lang}
                                                <button
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        languages: prev.languages.filter((_, i) => i !== index)
                                                    }))}
                                                    className="hover:text-violet-900"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Availability */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Availability</h2>

                                <div className="space-y-2">
                                    <Label>Available Days</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {daysOfWeek.map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => toggleDay(day)}
                                                className={`p-3 rounded-xl border-2 transition-all ${formData.availability.days.includes(day)
                                                        ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
                                                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Working Hours</Label>
                                    <Input
                                        value={formData.availability.hours}
                                        onChange={(e) => handleAvailabilityChange('hours', e.target.value)}
                                        placeholder="e.g., 9:00 AM - 5:00 PM"
                                        className="h-12 rounded-xl"
                                    />
                                </div>

                                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                                    <p className="text-sm text-cyan-800">
                                        Your profile will be reviewed by our team before it becomes visible to patients. This usually takes 24-48 hours.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
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
                                'Complete Registration'
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