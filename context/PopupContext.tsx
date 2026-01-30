'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PopupType = 'waitlist' | 'newsletter' | null;

interface PopupContextType {
    openPopup: (type: PopupType) => void;
    closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export function usePopup() {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
}

export function PopupProvider({ children }: { children: ReactNode }) {
    const [popupType, setPopupType] = useState<PopupType>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const openPopup = (type: PopupType) => {
        setPopupType(type);
        setSuccessMessage(null);
        setError(null);
    };

    const closePopup = () => {
        setPopupType(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const type = popupType || 'waitlist';
        // Endpoint based on type
        const endpoint = type === 'newsletter' ? '/api/newsletter' : '/api/waitlist';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessMessage(data.message || 'Success!');
                setTimeout(() => {
                    closePopup();
                }, 3000);
            } else {
                setError(data.error || 'Something went wrong.');
            }
        } catch {
            setError('Failed to submit. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PopupContext.Provider value={{ openPopup, closePopup }}>
            {children}
            <AnimatePresence>
                {popupType && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={closePopup}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md rounded-2xl bg-card border border-primary/20 p-6 shadow-2xl shadow-primary/10"
                        >
                            <button
                                onClick={closePopup}
                                className="absolute right-4 top-4 text-muted-foreground hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                {popupType === 'waitlist' ? 'Join Waitlist' : 'Subscribe'}
                            </h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                {popupType === 'waitlist'
                                    ? 'Get early access to Kridavista.'
                                    : 'Stay updated with our latest news.'}
                            </p>

                            {successMessage ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-green-400 gap-3"
                                >
                                    <CheckCircle2 className="w-12 h-12" />
                                    <p className="text-center font-medium">{successMessage}</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground pl-1">Full Name</label>
                                        <Input id="name" name="name" placeholder="Name" required className="bg-background/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground pl-1">Email Address</label>
                                        <Input id="email" name="email" type="email" placeholder="your@mail.com" required className="bg-background/50" />
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-sm">{error}</p>
                                    )}

                                    <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Submit'}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </PopupContext.Provider>
    );
}
