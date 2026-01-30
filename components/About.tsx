import { User, Youtube, Instagram, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SOCIAL_LINKS } from '@/lib/socials';

export default function About() {
    return (
        <section id="about" className="py-24 px-4 bg-muted/10">
            <div className="mx-auto max-w-4xl space-y-16">

                {/* Heading */}
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent sm:text-4xl">
                        About the Creator
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        The mind and vision behind Kridavista.
                    </p>
                </div>

                {/* Bio Section */}
                <div className="flex flex-col md:flex-row items-start gap-12">
                    {/* Profile Image / Icon */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-primary/20 shadow-2xl overflow-hidden relative group">
                            <Image
                                src="/developer.png"
                                alt="Harsh Kumar Singh"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-bold">Harsh Kumar Singh</h3>
                            <p className="text-sm text-primary">Founder & Developer</p>
                        </div>
                    </div>

                    {/* Bio Text */}
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            Hello, I’m <strong>Harsh Kumar Singh</strong>, the Founder and Developer of Kridavista. My journey as a builder has always been driven by curiosity and a deep desire to create digital platforms that solve real human needs, not just technical ones.
                        </p>
                        <p>
                            Kridavista represents my vision for a more connected future. I wanted to move beyond passive consumption and build a space where people can genuinely hang out, play, and share moments together, no matter the distance. It’s an experiment in making the virtual world feel a little more human.
                        </p>
                        <p>
                            I believe in respectful engineering—building products that value your time and privacy. Kridavista is a reflection of that commitment, and I’m constantly learning and growing to make this platform better for everyone who calls it home.
                        </p>
                    </div>
                </div>

                {/* Connect Section */}
                <div className="border-t border-primary/10 pt-12">
                    <h3 className="text-2xl font-bold text-center mb-10">Connect With Us</h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">

                        {/* Kridavista Official */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-center text-white/80 uppercase tracking-widest text-xs">Official Channels</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href={SOCIAL_LINKS.kridavista.youtube}
                                    target="_blank"
                                    className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all hover:scale-105 shadow-[0_0_20px_-10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]"
                                >
                                    <Youtube className="w-8 h-8 text-white group-hover:text-red-500 transition-colors" />
                                    <div className="text-center">
                                        <p className="font-bold text-sm">YouTube</p>
                                        <p className="text-xs text-muted-foreground group-hover:text-white/60 transition-colors">@KridaVista</p>
                                    </div>
                                </Link>

                                <Link
                                    href={SOCIAL_LINKS.kridavista.instagram}
                                    target="_blank"
                                    className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all hover:scale-105 shadow-[0_0_20px_-10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.5)]"
                                >
                                    <Instagram className="w-8 h-8 text-white group-hover:text-pink-500 transition-colors" />
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Instagram</p>
                                        <p className="text-xs text-muted-foreground group-hover:text-white/60 transition-colors">@kridavista</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Developer Personal */}
                        <div className="space-y-6">
                            <h4 className="text-lg font-semibold text-center text-white/80 uppercase tracking-widest text-xs">Developer</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href={SOCIAL_LINKS.developer.youtube}
                                    target="_blank"
                                    className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/50 hover:bg-red-500/5 transition-all hover:scale-105 shadow-[0_0_20px_-10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)]"
                                >
                                    <Youtube className="w-8 h-8 text-white group-hover:text-red-500 transition-colors" />
                                    <div className="text-center">
                                        <p className="font-bold text-sm">YouTube</p>
                                        <p className="text-xs text-muted-foreground group-hover:text-white/60 transition-colors">@harshuopjs</p>
                                    </div>
                                </Link>

                                <Link
                                    href={SOCIAL_LINKS.developer.instagram}
                                    target="_blank"
                                    className="group flex flex-col items-center justify-center gap-3 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all hover:scale-105 shadow-[0_0_20px_-10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.5)]"
                                >
                                    <Instagram className="w-8 h-8 text-white group-hover:text-pink-500 transition-colors" />
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Instagram</p>
                                        <p className="text-xs text-muted-foreground group-hover:text-white/60 transition-colors">@engi.harsh</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
