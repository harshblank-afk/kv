'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { CareerRole } from '@/lib/career-data';
import { motion, AnimatePresence } from 'framer-motion';

interface RoleApplicationFormProps {
    role: CareerRole;
}

export default function RoleApplicationForm({ role }: RoleApplicationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ ticketId: string; message: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [resumeName, setResumeName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Resume must be smaller than 5MB');
                setResumeName(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setError(null);
                setResumeName(file.name);
            }
        }
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessData(null);

        const formData = new FormData(event.currentTarget);
        formData.append('roleSlug', role.slug);
        formData.append('roleTitle', role.title);

        // Validate Resume
        const resume = formData.get('resume') as File;
        if (!resume || resume.size === 0) {
            setError('Please upload your resume (PDF only).');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/career', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccessData({
                ticketId: data.ticketId,
                message: data.message
            });
            event.currentTarget.reset();
            setResumeName(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to apply';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    if (successData) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6 py-12 bg-card/50 border border-success/20 rounded-2xl p-8"
            >
                <div className="rounded-full bg-green-500/20 p-4 ring-1 ring-green-500/50">
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                </div>
                <div className="space-y-4 max-w-lg">
                    <h3 className="text-2xl font-bold text-white">Application Received Successfully</h3>
                    <p className="text-muted-foreground">Thank you for applying to Kridavista.</p>
                    <p className="text-muted-foreground">Our team is currently reviewing your profile. You can expect to hear back from us within approximately <strong>one week</strong> regarding the next steps.</p>
                    <p className="text-xs text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10">
                        Please avoid submitting multiple applications for the same role, as this may delay the process.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-card/30 p-8 rounded-2xl border border-white/10 shadow-xl">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold">Apply for this Role</h3>
                <p className="text-muted-foreground">Please fill out the form below to be considered.</p>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium pl-1">Full Name *</label>
                    <Input id="name" name="name" placeholder="Name" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium pl-1">Email Address *</label>
                    <Input id="email" name="email" type="email" placeholder="your@mail.com" required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium pl-1">Phone Number</label>
                    <Input id="phone" name="phone" type="tel" placeholder="Phone Number" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium pl-1">Current Status *</label>
                    <div className="relative">
                        <select
                            id="status"
                            name="status"
                            className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-card text-foreground"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>Select Status</option>
                            <option value="Student">Student</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Working Professional">Working Professional</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="portfolio" className="text-sm font-medium pl-1">Portfolio / LinkedIn / GitHub</label>
                <Input id="portfolio" name="portfolio" placeholder="Portfolio URL" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="why_join" className="text-sm font-medium pl-1">Why do you want to join Kridavista? *</label>
                    <Textarea id="why_join" name="why_join" placeholder="Write your answer..." required />
                </div>
                <div className="space-y-2">
                    <label htmlFor="why_suitable" className="text-sm font-medium pl-1">Why are you suitable for this role? *</label>
                    <Textarea id="why_suitable" name="why_suitable" placeholder="Write your answer..." required />
                </div>
            </div>

            {/* Role Specific Fields */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-lg font-semibold text-primary">Role Specific Questions</h4>
                <div className="grid grid-cols-1 gap-6">
                    {role.formFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            <label htmlFor={field.id} className="text-sm font-medium pl-1">{field.label} *</label>
                            {field.type === 'textarea' ? (
                                <Textarea id={field.id} name={field.id} required={field.required} />
                            ) : (
                                <Input id={field.id} name={field.id} type={field.type} required={field.required} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2 pt-4 border-t border-white/10">
                <label htmlFor="resume" className="text-sm font-medium pl-1">Resume (PDF Only, Max 5MB) *</label>
                <div
                    className={`border-2 border-dashed rounded-xl p-8 hover:bg-white/5 transition-colors cursor-pointer text-center group ${resumeName ? 'border-primary/50 bg-primary/5' : 'border-input'}`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className={`w-8 h-8 mx-auto mb-3 transition-colors ${resumeName ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                    <p className="text-sm text-foreground font-medium">
                        {resumeName || 'Click to upload PDF'}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        id="resume"
                        name="resume"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <p>{error}</p>
                </div>
            )}

            <Button type="submit" size="lg" className="w-full text-lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Application...
                    </>
                ) : (
                    'Submit Application'
                )}
            </Button>
        </form>
    );
}
