import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ScanFace } from 'lucide-react';
import { flickerStyles } from './AnimationStyles';

const GlitchText = ({ text }) => {
    return (
        <div className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-[#00aaff] opacity-0 group-hover:opacity-70 animate-pulse translate-x-[2px]">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-0 group-hover:opacity-70 animate-pulse -translate-x-[2px] delay-75">
                {text}
            </span>
        </div>
    );
};

const TiltCard = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full h-full flex flex-col justify-center items-center perspective-1000"
        >
            <div
                className="absolute inset-0 bg-gradient-to-br from-[#00aaff]/5 to-transparent rounded-3xl -z-10 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"
                style={{ transform: "translateZ(-50px)" }}
            />
            {children}
        </motion.div>
    );
};

export const LeftSideContent = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center perspective-1000">
            <style>{flickerStyles}</style>
            <TiltCard>


                <div className="relative rounded-[20px] p-[1px] bg-transparent h-full flex flex-col w-full border border-[#00aaff]/30 animate-flicker-card">

                    <div className="bg-black/60 backdrop-blur-xl rounded-[19px] p-8 lg:p-12 relative flex-grow flex flex-col w-full h-full">


                        <div className="flex flex-col md:flex-row items-center gap-5 border border-[#00aaff]/30 bg-black/20 rounded-xl p-6 mb-6 flex-shrink-0 animate-flicker-card">
                            <div className="flex-shrink-0">
                                <img src="/cccLogo.png" className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(0,170,255,0.5)]" alt="CCC Logo" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold leading-tight font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-[#0066cc] via-[#00aaff] to-white drop-shadow-[0_0_5px_rgba(0,170,255,0.4)] text-center md:text-left">
                                Be part of the future of <br />
                                <span className="text-[#00aaff] underline decoration-2 underline-offset-4 decoration-blue-500/50 cursor-default">
                                    <GlitchText text="Cloud Computing" />
                                </span>
                            </h1>
                        </div>


                        <motion.div

                            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}

                            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                            transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }}
                            className="relative flex-grow w-full flex items-center justify-center overflow-hidden rounded-xl bg-black/40 border border-[#00aaff]/20 group min-h-[300px] animate-flicker-card"
                        >

                            <div className="absolute top-0 left-0 w-full h-1 bg-[#00aaff]/50 shadow-[0_0_20px_#00aaff] animate-[scan_3s_ease-in-out_infinite] z-20 pointer-events-none" />

                            <img
                                src="https://new-cccc.vercel.app/assets/nimbusp-Cu5HSp79.jpg"
                                alt="Event Poster"
                                className="w-full h-full object-contain relative z-10 p-2"
                            />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#00aaff]/20 z-0">
                                <ScanFace size={64} className="mb-4 opacity-50" />
                                <p className="text-sm tracking-[0.2em] uppercase font-bold">Event Poster</p>
                            </div>
                        </motion.div>

                    </div>
                </div>

            </TiltCard>
        </div>
    );
};