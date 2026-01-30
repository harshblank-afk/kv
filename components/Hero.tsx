'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { Button } from './ui/button';
import { usePopup } from '@/context/PopupContext';
import confetti from 'canvas-confetti';
import Image from 'next/image';

export default function Hero() {
    const [isRevealed, setIsRevealed] = useState(false);
    const { openPopup } = usePopup();

    // Mouse tracking for 3D effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    // Smooth spring animation for the tracking values
    const springConfig = { damping: 25, stiffness: 200 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    // Dynamic transformations for "3D" feel
    // Shadow moves with cursor (light source opposite? or shadow follows cursor? "along with cursor")
    // If "along with cursor", then xPct > 0 (right) -> shadow > 0 (right).
    const shadowX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
    const shadowY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

    // Gradient shift (background position or angle equivalent)
    // We can simulate gradient shift by moving background position
    const bgPosX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
    const bgPosY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

    // Construct the text shadow string
    const textShadow = useMotionTemplate`${shadowX}px ${shadowY}px 20px rgba(192, 38, 211, 0.4), ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, 0.2)`;

    const handleReveal = () => {
        setIsRevealed(true);
        const end = Date.now() + 1000;

        // Magenta-themed confetti
        const colors = ['#c026d3', '#a855f7', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Main burst
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: colors,
            zIndex: 50 // Ensure it's above other elements if needed
        });
    };

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
        >
            {/* Logo */}
            <div className="absolute top-6 left-6 z-50">
                <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg hover:border-fuchsia-500/30 transition-all duration-300">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-fuchsia-500/20">
                        <Image
                            src="/kridavista_logo.png"
                            alt="Kridavista"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                        Kridavista
                    </span>
                </div>
            </div>

            {/* Background Gradient */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
            >
                <div className="perspective-1000">
                    <motion.h1
                        style={{
                            textShadow,
                            backgroundSize: "200% auto",
                            backgroundImage: "linear-gradient(to right, #ffffff, #c026d3, #ffffff)",
                            backgroundPositionX: bgPosX,
                        }}
                        className="bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl py-2"
                    >
                        Kridavista is Coming Soon
                    </motion.h1>
                </div>

                <motion.p
                    style={{
                        x: useTransform(springX, [-0.5, 0.5], [-10, 10]),
                        y: useTransform(springY, [-0.5, 0.5], [-10, 10])
                    }}
                    className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl relative z-10"
                >
                    A premium virtual connection platform blending video rooms and interactive games to make distance irrelevant.
                </motion.p>

                <div className="py-12 relative z-20">
                    <AnimatePresence mode="wait">
                        {!isRevealed ? (
                            <motion.div
                                key="reveal-button"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5 }}
                            >
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={handleReveal}
                                    className="rounded-full px-8 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    Reveal Launch Date
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="launch-date"
                                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
                                className="flex flex-col items-center"
                            >
                                <p className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-fuchsia-400 to-primary bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(192,38,211,0.5)]">
                                    Launching on 4 October 2026
                                </p>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-sm text-muted-foreground mt-4"
                                >
                                    Mark your calendars.
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-4 relative z-20">
                    <Button
                        size="lg"
                        onClick={() => openPopup('waitlist')}
                        className="rounded-full px-8 text-lg font-semibold shadow-[0_0_20px_-5px_var(--primary)] text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_var(--primary)]"
                    >
                        Join the Waitlist
                    </Button>
                </div>
            </motion.div>
        </section>
    );
}
