'use client';

import { Button } from './ui/button';
import { Mail } from 'lucide-react';
import { usePopup } from '@/context/PopupContext';

export default function NewsletterForm() {
    const { openPopup } = usePopup();

    return (
        <section className="py-24 px-4 border-y border-white/5 bg-gradient-to-b from-transparent to-background">
            <div className="mx-auto max-w-2xl text-center">
                <Mail className="w-12 h-12 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl font-bold tracking-tight mb-4">
                    Stay Updated
                </h2>
                <p className="text-muted-foreground mb-8">
                    Subscribe to our newsletter for the latest updates on Kridavista's development.
                </p>

                <Button
                    size="lg"
                    className="rounded-full px-8 text-white"
                    onClick={() => openPopup('newsletter')}
                >
                    Subscribe for Updates
                </Button>
            </div>
        </section>
    );
}
