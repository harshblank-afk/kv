'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePopup } from '@/context/PopupContext';

export default function Footer() {
    const { openPopup } = usePopup();

    return (
        <footer className="border-t border-white/10 bg-black py-12 px-4">
            <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-center md:text-left">
                    <Link href="/" className="block">
                        <div className="relative w-32 h-10 mb-2">
                            <Image
                                src="/kridavista_logo.png"
                                alt="Kridavista"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Kridavista. All rights reserved.
                    </p>
                </div>

                <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <button onClick={() => openPopup('waitlist')} className="hover:text-primary transition-colors">
                        Join Waitlist
                    </button>
                    <Link href="/careers" className="hover:text-primary transition-colors">
                        Careers
                    </Link>
                    <Link href="/contact?type=support" className="hover:text-primary transition-colors">
                        Contact
                    </Link>
                    <button onClick={() => openPopup('newsletter')} className="hover:text-primary transition-colors">
                        Newsletter
                    </button>
                </nav>
            </div>
        </footer>
    );
}
