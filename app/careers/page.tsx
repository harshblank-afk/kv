import { Button } from '@/components/ui/button';
import { Briefcase, Heart, Rocket, Clock, Users, Zap, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { ROLES } from '@/lib/career-data';

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            {/* Navbar Placeholder - Minimal */}
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Kridavista</Link>
                <Link href="/">
                    <Button variant="ghost">Back to Home</Button>
                </Link>
            </nav>

            <div className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-4 text-center relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Join the Kridavista Journey</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We are building the future of virtual connection, and we want you to be a part of it.
                    </p>
                </section>

                {/* Why Join */}
                <section className="py-16 px-4 bg-muted/20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                            <Heart className="text-primary" /> Why Join Kridavista?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 text-lg text-muted-foreground">
                            <p>
                                Kridavista is an early-stage, people-first startup. We believe that great products are built by happy, motivated people. Our culture is defined by curiosity, respect, and a genuine passion for technology.
                            </p>
                            <p>
                                We offer a stress-free, flexible, and growth-oriented environment where learning takes precedence over strict deadlines. You won't just be an intern here; you'll be a core contributor working directly with the founder on real production systems.
                            </p>
                            <p>
                                No toxic work culture. No burnout. Just pure creation and collaboration. We are here to help you grow your skills and build your portfolio with meaningful work.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Benefits & Environment</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Rocket, title: "Real-World Exposure", desc: "Work on live production systems." },
                                { icon: Clock, title: "Flexible Hours", desc: "Work when you are most productive." },
                                { icon: Users, title: "Remote-First", desc: "Work from anywhere in the world." },
                                { icon: BookOpen, title: "Learning Focused", desc: "Mentorship and skill-building over deadlines." },
                                { icon: Zap, title: "Zero Pressure", desc: "A calm, supportive environment." },
                                { icon: Heart, title: "Inclusive Culture", desc: "Respect and kindness are our core values." },
                            ].map((benefit, idx) => (
                                <div key={idx} className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                    <benefit.icon className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Open Roles */}
                <section className="py-20 px-4 bg-black/40">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                            <Briefcase className="text-primary" /> Open Roles
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {ROLES.map((role) => (
                                <div key={role.id} className="flex flex-col bg-card border border-primary/20 rounded-2xl p-6 hover:shadow-[0_0_30px_-10px_var(--primary)] hover:border-primary/50 transition-all duration-300">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-4">
                                            {role.type}
                                        </span>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {role.shortDescription}
                                        </p>
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Requirements</p>
                                            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                                                {role.requirements.map((req, i) => (
                                                    <li key={i}>{req}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-6">
                                        <Link href={`/careers/${role.slug}`} className="w-full">
                                            <Button className="w-full bg-primary hover:bg-primary/80 text-white font-semibold shadow-lg shadow-primary/20">
                                                View Details & Apply
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
