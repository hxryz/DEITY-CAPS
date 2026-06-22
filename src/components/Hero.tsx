import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ChevronRight, Sparkles } from "lucide-react";

interface HeroProps {
  onOpenConfigurator: () => void;
  onScrollToExplore: () => void;
  isConfiguratorActive?: boolean;
}

export default function Hero({ onOpenConfigurator, onScrollToExplore, isConfiguratorActive = false }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  // Sync state or reset
  useEffect(() => {
    if (!isConfiguratorActive) {
      setIsClicked(false);
    }
  }, [isConfiguratorActive]);

  const isLabActive = isConfiguratorActive || isClicked;

  useEffect(() => {
    if (videoRef.current) {
      // Force loading configuration and playing immediately
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.warn("Hero background video autoplay deferred or blocked:", err);
      });
    }
  }, []);

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty("--mouse-x", `${x}px`);
    btn.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-transparent">
      
      {/* Background Video Element - Preloaded, acceleration styled, full viewport cover */}
      <video
        ref={videoRef}
        id="hero-background-video"
        src="https://res.cloudinary.com/dwcdqt5yv/video/upload/v1781954664/Baseball_cap_assembly_in_darkness_202606101915_zaswzf.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ willChange: "transform", transform: "translate3d(0,0,0)", opacity: 0.85 }}
        referrerPolicy="no-referrer"
      />
      
      {/* Dark overlay with soft brightness structure */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50 z-10" />

      {/* Central Content - Stacked cleanly with elegant display typography */}
      <div id="hero-content-container" className="max-w-6xl mx-auto px-6 md:px-12 relative z-20 flex flex-col items-center text-center mt-12 select-none">
        
        {/* Minimal Subheading */}
        <motion.p 
          id="hero-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-[10px] uppercase tracking-[0.6em] mb-6 text-zinc-350 font-mono font-bold drop-shadow"
        >
          DEITY CAP WORKS / Luxury Custom Manufacture
        </motion.p>

        {/* 40+ Years Experience Luxury Badge with Pulsing Neon Aura */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative flex items-center gap-2.5 mb-8 bg-[#111215]/80 border border-[#c5a880]/30 px-6 py-2.5 rounded-full backdrop-blur-xl shadow-[0_0_25px_rgba(197,168,128,0.15),_inset_0_0_12px_rgba(197,168,128,0.1)] hover:shadow-[0_0_35px_rgba(197,168,128,0.35)] select-none transition-all duration-500 cursor-default group"
        >
          {/* Animated glowing back aura layer */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#c5a880]/20 to-transparent blur-md opacity-80 animate-pulse pointer-events-none" />
          
          <Sparkles className="w-4 h-4 text-[#c5a880] animate-bounce shrink-0" />
          <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#c5a880] font-bold">DEITY LEGACY</span>
          <span className="w-1 h-1 rounded-full bg-[#c5a880]/65" />
          <span className="font-calligraphy text-[18px] sm:text-xl text-white tracking-wide">40+ Years Experience</span>
        </motion.div>

        {/* Cinematic Headline with premium tracking (Refined and slightly smaller) */}
        <div id="hero-headline-wrapper" className="overflow-hidden space-y-1.5">
          <motion.h1 
            id="hero-title"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] tracking-tight leading-[0.95] text-white uppercase drop-shadow-lg animate-fade-in"
          >
            Crafting Quality <br/>
            <span className="font-calligraphy text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] text-[#c5a880] tracking-wide normal-case drop-shadow-md block mt-1 select-none leading-none">Since 1985.</span>
          </motion.h1>
        </div>

        {/* Sleek, Minimal Action Block with No Backing Colors/Boxes */}
        <motion.div 
          id="hero-action-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12 w-full max-w-4xl"
        >
          <div id="hero-buttons-group" className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
               id="hero-btn-start-lab"
              onClick={() => {
                setIsClicked(true);
                onOpenConfigurator();
              }}
              onMouseMove={handleButtonMouseMove}
              className={`w-full sm:w-auto px-10 py-5 text-[12px] uppercase tracking-widest font-extrabold transition-all duration-500 rounded-xl cursor-pointer text-center font-sans relative overflow-hidden group ${
                isLabActive
                  ? "bg-transparent text-[#c5a880] border-2 border-[#c5a880] shadow-[0_0_25px_rgba(197,168,128,0.5),_inset_0_0_12px_rgba(197,168,128,0.25)] backdrop-blur-xl"
                  : "bg-[#c5a880] text-black hover:bg-[#d8c09d] shadow-[0_0_20px_rgba(197,168,128,0.2)] hover:shadow-[0_0_30px_rgba(197,168,128,0.45)] border border-transparent"
              }`}
            >
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: isLabActive 
                    ? "radial-gradient(circle 80px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(197, 168, 128, 0.2) 0%, transparent 100%)"
                    : "radial-gradient(circle 80px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.4) 0%, transparent 100%)",
                }}
              />
              <span className="relative z-10">Start Custom Lab</span>
            </button>

            <button
              id="hero-btn-explore"
              onClick={onScrollToExplore}
              onMouseMove={handleButtonMouseMove}
              className="w-full sm:w-auto px-10 py-5 bg-black/40 border border-white/20 hover:border-[#c5a880]/60 text-white text-[12px] uppercase tracking-widest font-medium transition-all rounded-xl cursor-pointer text-center backdrop-blur-md hover:bg-black/60 font-sans relative overflow-hidden group"
            >
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: "radial-gradient(circle 100px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(197, 168, 128, 0.25) 0%, transparent 100%)",
                }}
              />
              <span className="relative z-10">Explore Catalogues</span>
            </button>
          </div>
          <div id="hero-divider-vertical" className="hidden md:block w-px h-12 bg-white/20" />
          <p id="hero-tagline-text" className="max-w-xs text-xs md:text-sm text-zinc-200 leading-relaxed font-sans font-medium text-center md:text-left drop-shadow-sm">
            Delivering high-quality custom sports caps, umpire hats, chef gear, aprons, and traditional college graduation ceremony physical regalia.
          </p>
        </motion.div>

      </div>

      {/* Luxury Minimalist Scroll Indicator */}
      <div 
        id="hero-scroll-trigger"
        onClick={onScrollToExplore}
        className="absolute bottom-10 inset-x-0 z-25 flex flex-col items-center justify-center gap-1.5 text-zinc-300 hover:text-white transition duration-300 cursor-pointer select-none"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] translate-x-[0.2em] font-bold drop-shadow">Scroll to Discover</span>
        <motion.div 
          id="hero-scroll-bezel"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/50 rounded-full flex items-start justify-center p-1 backdrop-blur-[1px]"
        >
          <span className="w-1 h-2 bg-white rounded-full" />
        </motion.div>
      </div>

    </section>
  );
}
