import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LenisScroll from "./components/LenisScroll";
import ThreeCanvasBackground from "./components/ThreeCanvasBackground";
import Header from "./components/Header";
import Hero from "./components/Hero";
import BrandStory from "./components/BrandStory";
import ManufacturingExcellence from "./components/ManufacturingExcellence";
import FeaturedProducts from "./components/FeaturedProducts";
import WhyChooseUs from "./components/WhyChooseUs";
import QuoteForm from "./components/QuoteForm";
import CapConfigurator from "./components/CapConfigurator";
import InteractiveStitchStudio from "./components/InteractiveStitchStudio";
import CustomCursor from "./components/CustomCursor";
import { ShieldCheck, Mail, MapPin, ArrowUpRight, Cpu } from "lucide-react";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [integratedSpecs, setIntegratedSpecs] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercent, setLoadingPercent] = useState(0);

  // 1. Loading timer animation
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 700);
      }
      setLoadingPercent(current);
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // 2. Parallax background ScrollTrigger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = document.querySelectorAll(".gsap-parallax-section");
      sections.forEach((section) => {
        const bg = section.querySelector(".gsap-parallax-bg");
        if (bg) {
          gsap.fromTo(bg, 
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

  const handleOpenConfigurator = () => {
    setIsConfiguratorOpen(true);
  };

  const handleCloseConfigurator = () => {
    setIsConfiguratorOpen(false);
  };

  const handleSelectSpecs = (specs: any) => {
    setIntegratedSpecs(specs);
    // Automatically scroll to the request form after formulating their custom cap spec
    setTimeout(() => {
      scrollToSection("contact");
    }, 200);
  };

  const handleLoadConfiguratorSpecs = (specs: any) => {
    setIntegratedSpecs(specs);
    setIsConfiguratorOpen(true);
  };

  const handleClearSpecs = () => {
    setIntegratedSpecs(null);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#111215] text-zinc-150 overflow-x-hidden antialiased selection:bg-brand-gold selection:text-black">
      
      {/* Precision Circular Custom Cursor trail */}
      <CustomCursor />

      {/* 3D Animated Luxury Background Threads */}
      <ThreeCanvasBackground />
      
      {/* 0. Minimalist Premium Preloader */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 bg-black text-white z-50 flex flex-col items-center justify-between p-12 select-none"
          >
            {/* Top micro coordinates info */}
            <div className="w-full flex justify-between items-center font-mono text-[8px] text-zinc-650">
              <span>INITIALIZING DEITY CAPS STITCH SYSTEMS v2.6</span>
              <span>CONTACT: +91 98435 66994</span>
            </div>

            {/* Main minimal loading identity */}
            <div className="flex flex-col items-center space-y-6 max-w-md text-center">
              {/* Simple elegant logo placeholder with since 1985 */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center space-y-2.5"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full mb-2">
                    <span className="font-calligraphy text-[#c5a880] text-3xl">D</span>
                  </div>
                  <span className="font-sans font-bold text-lg tracking-[0.4em] text-white">DEITY CAPS</span>
                </div>
                <span className="font-calligraphy text-2xl text-[#c5a880] capitalize tracking-wide">Since <span className="font-calligraphy text-[#c5a880]">1985</span> • The Atelier</span>
              </motion.div>
              
              {/* Dynamic task status list */}
              <div className="h-4 font-calligraphy text-xl text-zinc-400 tracking-wide text-center min-w-[200px] italic">
                {loadingPercent < 30 && "Loading cotton drill fabrics..."}
                {loadingPercent >= 30 && loadingPercent < 60 && "Preparing customized embroidery patterns..."}
                {loadingPercent >= 60 && loadingPercent < 85 && "Aligning culinary cooking aprons & sports caps..."}
                {loadingPercent >= 85 && "Polishing graduation caps & convocation gear..."}
              </div>

              {/* Brand Heritage Story Line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="pt-4 border-t border-white/[0.04] space-y-2 px-4"
              >
                <p className="font-serif italic text-sm text-zinc-350 leading-relaxed tracking-wide">
                  Spanning four decades of structural cap shape masterclass. Born in <span className="font-calligraphy text-lg text-[#c5a880]">1985</span>, our premium stitch workshop has engineered bespoke sports wear and culinary uniforms, forging custom fits that endure the test of active discipline.
                </p>
                <span className="inline-block font-calligraphy text-xl text-[#c5a880]/90 tracking-wide">
                  40 Years of Uncompromising Tailoring Craft
                </span>
              </motion.div>
            </div>

            {/* Footer loading percentage indicator */}
            <div className="w-full flex justify-between items-end">
              <div className="text-left">
                <p className="text-[10px] font-mono tracking-widest text-[#c5a880]">LOADING CUSTOM ASSETS</p>
                <p className="text-5xl text-white font-calligraphy leading-none mt-1">{loadingPercent}%</p>
              </div>
              
              {/* Progress micro line */}
              <div className="w-48 h-0.5 bg-zinc-900 overflow-hidden relative mb-1.5">
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 bg-white"
                  style={{ width: `${loadingPercent}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Global Lenis smooth scroll initializer */}
      <LenisScroll />

      {/* 2. Custom floating responsive header */}
      <Header 
        onOpenConfigurator={handleOpenConfigurator} 
        scrollToSection={scrollToSection} 
      />

      {/* 3. Main Sections Layout */}
      <main className="relative">
        
        {/* Cinematic Video Hero segment */}
        <Hero 
          onOpenConfigurator={handleOpenConfigurator} 
          onScrollToExplore={() => scrollToSection("excellence")} 
          isConfiguratorActive={isConfiguratorOpen}
        />

        {/* Stepper interactive details of tailoring/embroidery process */}
        <ManufacturingExcellence />

        {/* Dynamic large-typography brand story marquee segment */}
        <BrandStory />

        {/* Parallax Cinematic Image Ribbon 1 - Made fully translucent with stardust projection */}
        <div className="gsap-parallax-section relative h-[45vh] sm:h-[55vh] w-full overflow-hidden border-y border-white/[0.04]">
          <div className="absolute inset-0 bg-transparent z-10 flex items-center justify-center p-6 select-none">
            <div className="text-center space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-extrabold block">TACTILE SEWING DEPTH</span>
              <p className="font-serif italic font-light text-zinc-200 text-xl sm:text-2xl leading-relaxed max-w-2xl">
                Tightly woven 100% cotton drill threads. Built for daily wear.
              </p>
            </div>
          </div>
        </div>

        {/* Product showcase cards with preset decompile links */}
        <FeaturedProducts 
          onLoadConfiguratorSpecs={handleLoadConfiguratorSpecs} 
        />

        {/* Parallax Cinematic Image Ribbon 2 - Made fully translucent with stardust projection */}
        <div className="gsap-parallax-section relative h-[45vh] sm:h-[55vh] w-full overflow-hidden border-y border-white/[0.04]">
          <div className="absolute inset-0 bg-transparent z-10 flex items-center justify-center p-6 select-none">
            <div className="text-center space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-extrabold block">TRADITION & ALIGNMENT</span>
              <p className="font-serif italic font-light text-zinc-200 text-xl sm:text-2xl leading-relaxed max-w-2xl">
                Traditional convocation degree regalia and custom sports team embroidery.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time interactive 3D Stitch Studio Lab wrapper */}
        <InteractiveStitchStudio />

        {/* Why choose us, telemetry metric digits */}
        <WhyChooseUs />

        {/* Quote formulation and request synthesis contact block */}
        <QuoteForm 
          integratedSpecs={integratedSpecs} 
          onClearIntegratedSpecs={handleClearSpecs} 
        />

      </main>

      {/* 4. Modular Interactive Cap Configurator Dialog Panel */}
      <CapConfigurator 
        isOpen={isConfiguratorOpen} 
        onClose={handleCloseConfigurator} 
        onSelectSpecs={handleSelectSpecs} 
      />

      {/* 5. Luxury Minimalist Corporate Footer - Glassmorphic Translucent */}
      <footer className="relative bg-[#111215]/20 backdrop-blur-md border-t border-white/[0.06] py-16 lg:py-24 overflow-hidden select-none">
        
        {/* Subtle grid decoration overlay */}
        <div className="absolute inset-0 grid-overlay opacity-[0.06] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Logo & Manifesto Column */}
          <div className="md:col-span-2 lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 flex items-center justify-center bg-white rounded-none">
                <span className="font-sans font-bold text-black text-xs">D</span>
              </div>
              <h2 className="font-sans font-bold text-sm tracking-widest text-white uppercase">DEITY <span className="font-light text-zinc-500 font-sans">cap WORKS</span></h2>
            </div>
            
            <p className="font-sans font-style-normal font-light text-xs text-zinc-500 leading-relaxed max-w-sm">
              We specialize exclusively in premium custom caps and durable team workwear aprons. Quality stitching, high-density designs, and bespoke fit.
            </p>

            <div className="flex gap-2">
              <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-none font-mono text-[8px] text-zinc-400 tracking-wider">COTTON & DRILL</span>
              <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-none font-mono text-[8px] text-zinc-400 tracking-wider">MADE IN INDIA</span>
            </div>
          </div>

          {/* Quick links curate column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-semibold block">NAV CURATION</span>
            <div className="flex flex-col gap-2.5 font-sans text-xs text-zinc-500">
              <button onClick={() => scrollToSection("hero")} className="hover:text-white transition duration-200 text-left cursor-pointer">Hero Perspective</button>
              <button onClick={() => scrollToSection("story")} className="hover:text-white transition duration-200 text-left cursor-pointer">Apparel Story</button>
              <button onClick={() => scrollToSection("excellence")} className="hover:text-white transition duration-200 text-left cursor-pointer">Production Steps</button>
              <button onClick={() => scrollToSection("collection")} className="hover:text-white transition duration-200 text-left cursor-pointer">Baseline Catalog</button>
            </div>
          </div>

          {/* Resource info column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-semibold block">CUSTOM APPAREL REQ</span>
            <div className="flex flex-col gap-2.5 font-sans text-xs text-zinc-500">
              <button onClick={handleOpenConfigurator} className="hover:text-white text-left flex items-center gap-1 cursor-pointer">
                <span>Interactive Custom Lab</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-600" />
              </button>
              <button onClick={() => scrollToSection("stats")} className="hover:text-white transition duration-200 text-left cursor-pointer">Production Numbers</button>
              <button onClick={() => scrollToSection("contact")} className="hover:text-white transition duration-200 text-left cursor-pointer">Enquiry Booking Form</button>
            </div>
          </div>

          {/* Location & specs coordinates column */}
          <div className="md:col-span-2 lg:col-span-4 space-y-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-semibold block">HEADQUARTERS & CONTACT</span>
            <div className="space-y-4 font-sans text-xs text-zinc-500 leading-relaxed">
              <a 
                href="https://maps.app.goo.gl/uqUAG924zVYv7yF79?g_st=aw"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group hover:text-white transition duration-300"
              >
                <MapPin className="w-4 h-4 text-[#c5a880] group-hover:text-white shrink-0 mt-0.5 transition duration-300 animate-pulse" />
                <span className="text-left font-sans text-[11px] leading-relaxed">
                  <strong className="text-zinc-200 block mb-1">DLP GARMENTS</strong>
                  DOOR NO: 206A, K.VALAYARPATTI,<br />
                  KEERANUR, MADURAI - 625110.<br />
                  <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 font-mono block mt-1.5 transition">Click to view on Map • GST: 33ABDPE8046L1ZO</span>
                </span>
              </a>
              <div className="flex flex-col gap-1.5 pt-1 font-mono text-[11px]">
                <p>Call / WhatsApp: <a href="tel:9843566994" className="text-zinc-300 font-bold hover:underline">9843566994</a></p>
                <p>Email: <a href="mailto:deitycap@gmail.com" className="hover:text-zinc-300 transition">deitycap@gmail.com</a></p>
              </div>
              
              {/* Premium Mini-Map Embed with Dark Grayscale Overlays */}
              <div className="relative w-full h-[140px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d0e11] shadow-2xl mt-4 group">
                <iframe 
                  src="https://maps.google.com/maps?q=DLP%20GARMENTS,%20DOOR%20NO:%20206A,%20K.VALAYARPATTI,%20KEERANUR,%20MADURAI%20-625110&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.1) brightness(0.9)" }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full opacity-65 group-hover:opacity-90 transition duration-500 rounded-2xl"
                />
                <a 
                  href="https://maps.app.goo.gl/uqUAG924zVYv7yF79?g_st=aw"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-transparent cursor-pointer z-10"
                  title="Open full interactive map"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[8px] text-[#c5a880] tracking-widest uppercase font-mono border border-white/[0.04] pointer-events-none">
                  INTERACTIVE MAP
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Lower copyright bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-zinc-900 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-mono">
          <p>© 2026 DEITY CAP WORKS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition cursor-help">TERMS OF ORDER</span>
            <span className="text-zinc-800">•</span>
            <span className="hover:text-white transition cursor-help">PRODUCTION SECURITY</span>
          </div>
        </div>

      </footer>

    </div>
  );
}
