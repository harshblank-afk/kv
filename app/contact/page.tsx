import { Suspense } from 'react';
import ContactForm from "@/components/ContactForm";
// import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Whether you want to join our waitlist, apply for a role, or just say hello, we'd like to hear from you.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center">Loading form...</div>}>
                    <ContactForm />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
