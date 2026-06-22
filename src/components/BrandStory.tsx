import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Star, Eye, ShieldCheck, Origami, Move } from "lucide-react";
import InteractiveCap3D from "./InteractiveCap3D";

import brandCapImg from "@/7450e8fcee3152633e856479c9878b41.jpg";
import badgeDraftImg from "@/1c0d794c88849998dd2ee7dfb8c048bc.jpg";

export default function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bentoImageRef = useRef<HTMLDivElement>(null);
  const [bentoCoords, setBentoCoords] = useState({ x: 50, y: 50 });
  const [bentoOpacity, setBentoOpacity] = useState(0);

  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bentoImageRef.current) return;
    const rect = bentoImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setBentoCoords({ x, y });
  };
  
  // Custom parallax scroll track for interactive text banner
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textXLeft = useTransform(scrollYProgress, [0, 1], [-150, 150]);
  const textXRight = useTransform(scrollYProgress, [0, 1], [150, -150]);

  return (
    <section 
      ref={containerRef}
      id="story" 
      className="relative bg-transparent py-24 lg:py-40 overflow-hidden"
    >
      {/* Absolute Decorative Linear accents */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      
      {/* Background Flowing Text Banner for Awwwards feel */}
      <div className="absolute inset-y-0 w-full flex flex-col justify-center gap-12 opacity-5 pointer-events-none select-none z-0">
        <motion.div 
          style={{ x: textXLeft }}
          className="font-sans font-black text-7xl md:text-9xl tracking-[0.3em] whitespace-nowrap uppercase text-stroke-white"
        >
          CRAFTED TO LEAD • VANGUARD PATTERNS • CRAFTING SINCE 1985 •
        </motion.div>
        <motion.div 
          style={{ x: textXRight }}
          className="font-sans font-black text-7xl md:text-9xl tracking-[0.3em] whitespace-nowrap uppercase text-zinc-100"
        >
          FORGING LEGACIES • IMPERIAL BRANDING • HAND SEWN •
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left text column */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#c5a880]" />
              <span className="text-[11px] uppercase tracking-[0.5em] text-[#c5a880] font-sans font-bold">01 / OUR LEGACY STORY</span>
            </div>
            <div className="font-calligraphy text-xl text-[#c5a880] px-4 py-1.5 border border-[#c5a880]/30 rounded-full bg-[#c5a880]/5 backdrop-blur-md shadow-sm select-none">
              40+ Years Experience
            </div>
          </div>

          <h3 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight uppercase">
            A LEGACY BUILT OVER GENERATIONS <br />
            <span className="italic font-serif font-light text-zinc-400 tracking-wide normal-case drop-shadow-md">Quality, reliability, and attention to detail.</span>
          </h3>

          <div className="space-y-6">
            <p className="font-sans font-light text-zinc-200 text-lg leading-relaxed max-w-2xl">
              What began in <span className="text-[#c5a880] font-calligraphy text-3xl font-medium">1985</span> as a small workshop with a single machine and a passion for craftsmanship has grown into a modern garment manufacturing company trusted by brands and businesses across the region.
            </p>

            <p className="font-sans font-light text-zinc-450 text-sm leading-relaxed max-w-2xl border-l-2 border-[#c5a880]/30 pl-4">
              Over the decades, we have expanded our capabilities, invested in advanced machinery, and refined our production processes while staying true to the values that started it all — quality, reliability, and attention to detail.
            </p>

            <p className="font-sans font-light text-zinc-450 text-sm leading-relaxed max-w-2xl">
              Today, our facility operates with more than <span className="text-[#c5a880] font-calligraphy text-3xl font-medium">20</span> specialized machines and a skilled team dedicated to producing premium garments and headwear that meet the highest standards of craftsmanship.
            </p>

            <p className="font-semibold text-[#c5a880] font-mono text-xs uppercase tracking-widest leading-relaxed max-w-2xl mt-4">
              Every product we create carries forward a legacy built over generations — a commitment to excellence that continues to define DEITY CAPS.
            </p>
          </div>

          {/* Core Values / Features Bullet Array */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="flex gap-3.5">
              <div className="p-2.5 h-fit bg-[#0c0c0c] border border-zinc-800 text-zinc-300 rounded-none">
                <Origami className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-semibold text-sm text-zinc-200 uppercase tracking-wider">Perfect Everyday Fit</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Standard 5-panel and 6-panel patterns designed to sit comfortably on all head shapes with adjustable closures.</p>
              </div>
            </div>

            <div className="flex gap-3.5">
              <div className="p-2.5 h-fit bg-[#0c0c0c] border border-zinc-800 text-zinc-300 rounded-none">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-semibold text-sm text-zinc-200 uppercase tracking-wider">Reinforced Fabrics</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Made from rugged Indian cotton drill to withstand sun exposure, high active heat, and frequent washing.</p>
              </div>
            </div>
          </div>

          {/* Legacy Timeline Section */}
          <div className="pt-8 border-t border-white/[0.04] space-y-6">
            <h4 className="font-sans font-bold text-[10px] uppercase tracking-[0.4em] text-[#c5a880] select-none">
              HISTORICAL TRAJECTORY • CHRONOLOGY
            </h4>
            
            <div className="relative flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-2 py-6 px-4 bg-black/20 border border-white/[0.03] rounded-3xl">
              {/* Horizontal line for timeline on larger screens */}
              <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#c5a880]/30 to-transparent hidden sm:block -translate-y-1/2 -z-0" />
              
              {[
                { year: "1985", title: "Genesis", desc: "Crafting workshop with single sewing machine." },
                { year: "1995", title: "Expansion", desc: "Installed 5 more heavy machines." },
                { year: "2005", title: "Culinary Line", desc: "Supplying aprons and chef wear." },
                { year: "2015", title: "Modern Plant", desc: "Acquired specialized embroidery workstations." },
                { year: "2026", title: "Digital Era", desc: "Interactive online 3D custom tool release." }
              ].map((milestone, idx, arr) => (
                <React.Fragment key={milestone.year}>
                  <div className="relative z-10 flex flex-col items-center text-center group">
                    {/* Calligraphy Year indicator */}
                    <div className="font-calligraphy text-4xl text-[#c5a880] group-hover:text-white transition-colors duration-300 select-none">
                      {milestone.year}
                    </div>
                    
                    {/* Bullet Dot */}
                    <div className="w-5 h-5 rounded-full bg-[#151619] border-2 border-[#c5a880] flex items-center justify-center my-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c5a880] group-hover:bg-white" />
                    </div>

                    <h5 className="font-sans font-semibold text-[10px] text-zinc-300 uppercase tracking-wider">
                      {milestone.title}
                    </h5>
                  </div>
                  
                  {/* Vertical Flow arrow between years, custom styled */}
                  {idx < arr.length - 1 && (
                    <>
                      {/* For small screens: visible vertical arrow */}
                      <div className="sm:hidden text-[#c5a880] font-light text-2xl select-none leading-none animate-pulse py-1">
                        ↓
                      </div>
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

        </div>

        {/* Right decorative visual bento-card */}
        <div className="lg:col-span-5 relative">
          
          {/* Main card with high quality custom cap sample image */}
          <div className="relative bg-[#151619]/45 backdrop-blur-3xl border border-white/[0.08] rounded-3xl overflow-hidden aspect-[4/5] flex flex-col justify-between shadow-2xl p-6">
            
            {/* Shimmer background */}
            <div className="absolute inset-0 grid-overlay opacity-[0.05] select-none pointer-events-none z-0" />
            
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] relative z-10 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-300 font-semibold">TIRUPUR SEWING DEPT</span>
              </div>
              <span className="font-mono text-[8px] text-zinc-400">ESTABLISHED QUALITY</span>
            </div>

            {/* Direct High Resolution Image of Apparel Production / Fabrics */}
            <div 
              ref={bentoImageRef}
              onMouseMove={handleBentoMouseMove}
              onMouseEnter={() => setBentoOpacity(1)}
              onMouseLeave={() => setBentoOpacity(0)}
              className="flex-1 w-full min-h-[220px] relative z-10 flex items-center justify-center overflow-hidden my-4 group rounded-2xl cursor-crosshair bg-black/50 border border-white/[0.04]"
            >
              <motion.div 
                className="w-full h-full"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              >
                <img 
                  src={brandCapImg}
                  alt="Sewing drill cotton caps & cook aprons"
                  className="w-full h-full object-cover grayscale brightness-[0.8] hover:grayscale-0 hover:brightness-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Dynamic light flare highlighting premium fabric fibers */}
              <motion.div 
                className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-350"
                style={{
                  opacity: bentoOpacity,
                  background: `radial-gradient(circle 120px at ${bentoCoords.x}% ${bentoCoords.y}%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 100%)`
                }}
              />

              {/* Micro fabric warp & weft scanlines overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:5px_5px] mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-left z-10">
                <p className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest">RAW MATERIAL REFERENCE</p>
                <p className="font-sans font-bold text-sm text-white uppercase tracking-wider mt-0.5">Heavy 100% Cotton Drill Fabric</p>
              </div>
            </div>

            {/* Traditional manufacturing tagline */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl w-full p-4 flex items-center gap-3 relative z-10 select-none">
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-serif italic text-sm text-zinc-300 shrink-0">
                D
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-zinc-200 uppercase tracking-wider font-sans">Everyday Wear Durability</p>
                <p className="text-[9px] text-zinc-400 font-sans mt-0.5 leading-relaxed truncate">"Our fabrics are tightly woven to survive demanding environments."</p>
              </div>
            </div>

          </div>

          {/* Floating Premium Unsplash Cap Image Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ marginLeft: "1px", paddingLeft: "13px" }}
            className="absolute -bottom-6 -left-8 hidden md:flex items-center gap-3 bg-[#111215]/80 backdrop-blur-3xl border border-white/[0.08] p-3 shadow-2xl w-52 select-none z-20 hover:scale-105 transition-transform duration-300 rounded-2xl"
          >
            <div className="w-12 h-12 bg-zinc-900 overflow-hidden border border-white/[0.06] shrink-0 rounded-xl">
              <img 
                src={badgeDraftImg} 
                alt="Polyester drill sample" 
                className="w-full h-full object-cover grayscale opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[7px] text-zinc-400 uppercase tracking-widest block font-bold">SAMPLE SECTOR</p>
              <p className="font-sans font-bold text-[9px] text-white truncate uppercase tracking-wider mt-0.5">Indian Club Edition</p>
              <p className="font-sans text-[8px] text-zinc-400 uppercase mt-0.5">Custom Plastic Snaps</p>
            </div>
          </motion.div>

          {/* Underlay decoration */}
          <div className="absolute -inset-2 border border-white/[0.03] rounded-3xl -z-10 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
