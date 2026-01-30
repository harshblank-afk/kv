import { ROLES } from '@/lib/career-data';
import RoleApplicationForm from '@/components/RoleApplicationForm';
import { notFound } from 'next/navigation';
import { Briefcase, MapPin, Clock, Heart, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
    return ROLES.map((role) => ({
        slug: role.slug,
    }));
}

// Params type definition
type Params = Promise<{ slug: string }>;

export default async function RolePage({ params }: { params: Params }) {
    const { slug } = await params;
    const role = ROLES.find((r) => r.slug === slug);

    if (!role) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Link href="/careers" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Kridavista Careers</Link>
                <Link href="/careers">
                    <Button variant="ghost">Back to All Roles</Button>
                </Link>
            </nav>

            <div className="flex-1">
                {/* Role Header */}
                <section className="py-16 px-4 bg-muted/10 relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                    <div className="max-w-4xl mx-auto space-y-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                            {role.type}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold">{role.title}</h1>
                        <div className="flex flex-wrap gap-6 text-muted-foreground text-sm font-medium uppercase tracking-wider">
                            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> {role.location}</div>
                            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> {role.commitment}</div>
                        </div>
                    </div>
                </section>

                <section className="py-16 px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-[2fr_1fr] gap-12">
                        <div className="space-y-12">
                            {/* About */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold border-b border-primary/20 pb-2">About the Role</h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {role.about}
                                </p>
                            </div>

                            {/* Responsibilities */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold border-b border-primary/20 pb-2">Responsibilities</h2>
                                <ul className="space-y-3">
                                    {role.responsibilities.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold border-b border-primary/20 pb-2">Requirements</h2>
                                <ul className="space-y-3">
                                    {role.requirements.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* What You'll Gain */}
                            <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> What You'll Gain</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {role.benefits.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Work Culture */}
                            <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
                                <h3 className="text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-primary" /> Work Culture</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {role.culture.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Application Form Section */}
                <section className="py-20 px-4 bg-muted/5 relative" id="application-form">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
                    <div className="max-w-3xl mx-auto">
                        <RoleApplicationForm role={role} />
                    </div>
                </section>

            </div>
            <Footer />
        </main>
    );
}
