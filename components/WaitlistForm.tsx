'use client';

import { Button } from './ui/button';
import { CheckCircle2 } from 'lucide-react';
import { usePopup } from '@/context/PopupContext';

export default function WaitlistForm() {
    const { openPopup } = usePopup();

    return (
        <section id="waitlist" className="py-24 px-4 bg-muted/20">
            <div className="mx-auto max-w-xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                    Join the Waitlist
                </h2>
                <p className="text-muted-foreground mb-8">
                    Be the first to experience Kridavista when we launch.
                </p>

                <Button
                    size="lg"
                    className="w-full sm:w-auto px-12 text-white"
                    onClick={() => openPopup('waitlist')}
                >
                    Join the Waitlist
                </Button>
            </div>
        </section>
    );
}
