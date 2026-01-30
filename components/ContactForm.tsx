'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Loader2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

const QUERY_TYPES = [
    { value: 'waitlist', label: 'Join Waitlist' },
    { value: 'newsletter', label: 'Newsletter Subscription' },
    { value: 'career', label: 'Career Application' },
    { value: 'support', label: 'Support / General Query' }
];

export default function ContactForm() {
    const searchParams = useSearchParams();
    const defaultType = searchParams.get('type') || 'support';

    const [isLoading, setIsLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ ticketId: string; message: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessData(null);

        const formData = new FormData(event.currentTarget);

        // Client-side validation for file size (e.g. 5MB)
        const file = formData.get('attachment') as File;
        if (file && file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/support', {
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
            event.currentTarget.reset();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to submit form';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-card/30 p-8 rounded-2xl border border-white/10 shadow-xl">
            <AnimatePresence mode="wait">
                {successData ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-center space-y-6 py-12"
                    >
                        <div className="rounded-full bg-green-500/20 p-4 ring-1 ring-green-500/50">
                            <CheckCircle2 className="w-16 h-16 text-green-400" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
                            <p className="text-muted-foreground">{successData.message}</p>
                        </div>
                        <div className="bg-white/5 px-6 py-3 rounded-lg border border-white/10">
                            <p className="text-sm text-gray-400">Transaction ID</p>
                            <p className="font-mono text-xl text-primary font-bold tracking-wider">{successData.ticketId}</p>
                        </div>
                        <Button onClick={() => setSuccessData(null)} variant="outline">
                            Submit Another Request
                        </Button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium pl-1">Full Name</label>
                                <Input id="name" name="name" placeholder="Name" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium pl-1">Email Address</label>
                                <Input id="email" name="email" type="email" placeholder="your@mail.com" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium pl-1">Phone Number</label>
                                <Input id="phone" name="phone" type="tel" placeholder="Phone Number" required />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="type" className="text-sm font-medium pl-1">Query Type</label>
                                <div className="relative">
                                    <select
                                        id="type"
                                        name="type"
                                        defaultValue={defaultType}
                                        className="flex h-10 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    >
                                        {QUERY_TYPES.map(type => (
                                            <option key={type.value} value={type.value} className="bg-card text-foreground">
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    {/* Custom chevron if needed, but standard select is robust */}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium pl-1">Message</label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Write your message..."
                                className="min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="attachment" className="text-sm font-medium pl-1">Attachment (Optional)</label>
                            <div
                                className="border-2 border-dashed border-input rounded-xl p-8 hover:bg-white/5 transition-colors cursor-pointer text-center group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                                <p className="text-sm text-muted-foreground">Click to upload PDF or Image (Max 5MB)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    className="hidden"
                                    accept="image/*,application/pdf"
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
                                    Processing...
                                </>
                            ) : (
                                'Submit Request'
                            )}
                        </Button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
