'use client';

import { Button } from './ui/button';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

const ROLES = [
    {
        id: 'fullstack',
        title: 'Full Stack Developer',
        type: 'Unpaid Internship',
        description: 'Join us to build the core platform using Next.js, Node.js, and WebRTC technologies.',
    },
    {
        id: 'hr',
        title: 'HR Internship',
        type: 'Unpaid Internship',
        description: 'Help us grow our team and build a culture of innovation and inclusivity.',
    },
    {
        id: 'content',
        title: 'Content Management',
        type: 'Unpaid Internship',
        description: 'Create engaging content to tell the Kridavista story across all channels.',
    },
];

export default function Careers() {
    return (
        <section id="careers" className="py-24 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
                    <Briefcase className="text-primary" /> Careers at Kridavista
                </h2>
                <p className="text-muted-foreground">
                    Join us in building the future of virtual connection.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ROLES.map((role) => (
                    <div key={role.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10 flex flex-col justify-between">
                        <div>
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                                <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary-foreground">
                                    {role.type}
                                </span>
                            </div>
                            <p className="text-muted-foreground mb-6 line-clamp-3">
                                {role.description}
                            </p>
                        </div>

                        <Link href={`/contact?type=career&role=${encodeURIComponent(role.title)}`}>
                            <Button
                                variant="outline"
                                className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                            >
                                Apply Now
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
