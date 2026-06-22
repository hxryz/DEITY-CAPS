import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ChevronRight, Compass, Scissors, Layers, Trophy, Cpu, Eye } from "lucide-react";

const STAGES = [
  {
    id: "materials",
    num: "01",
    title: "Raw Material Sourcing",
    subtitle: "DURABLE INDIAN FABRICS",
    description: "Sourcing dependable textiles like heavy cotton drill, hand-carded local cotton twills, robust Khadi canvas, and highly breathable athletic mesh. All materials are tested for daily colorfastness and comfort.",
    details: [
      "Heavy Cotton Drill (320 GSM weight)",
      "Traditional hand-carded cotton twills",
      "Breathable sports poly-kits mesh fabrics",
      "Reinforced double-layered front backing liners"
    ],
    techSpec: "320GSM DRILLED COTTON BASE",
    icon: <Layers className="w-5 h-5 text-zinc-400" />
  },
  {
    id: "embroidery",
    num: "02",
    title: "Computerized Sewing & Logos",
    subtitle: "HIGH VISIBILITY EMBROIDERY",
    description: "Using multi-needle computerized stitching to create clean, dense, long-lasting team crests, logos, and corporate emblems. Embroidery threads are secured in double knots to prevent unraveling.",
    details: [
      "Rigid foam for raised 3D logo embroidery",
      "Bright multi-colour Indian polyester threads",
      "Durable non-warp backing fibers",
      "Strong border overlock to prevent fraying"
    ],
    techSpec: "HIGH-DENSITY EMBROIDERY WORK",
    icon: <Cpu className="w-5 h-5 text-zinc-400" />
  },
  {
    id: "stitching",
    num: "03",
    title: "Panel Joining & Seaming",
    subtitle: "SOLID REINFORCED SEAMS",
    description: "We assemble crown panels using high-tension twin-needle locking seams. Extra sweatbands and custom bias tape covers are stitched on the inside to keep the caps comfortable and in shape.",
    details: [
      "Standard 5-panel, 6-panel, and chef cap pleat structures",
      "12-14 SPI (Stitches Per Inch) solid construction",
      "Reinforced taping on stress points",
      "Flexible standard visor brim liners"
    ],
    techSpec: "TWIN-NEEDLE REINFORCED STITCH",
    icon: <Scissors className="w-5 h-5 text-zinc-400" />
  },
  {
    id: "finishing",
    num: "04",
    title: "Buckles, Straps & Packing",
    subtitle: "ADJUSTABLE ADJUSTERS & CLASPS",
    description: "We finish the caps and aprons with functional adjustments, including quality plastic snapbacks, premium metal slide buckles, or classic easy-tabs, followed by careful ironing and heavy corrugated boxing.",
    details: [
      "Durable plastic snap and velcro adjusters",
      "Brass finish and sliding metal buckles",
      "Woven brand labels and wash-care tags",
      "Polished, pressed, and stacked in heavy boxes"
    ],
    techSpec: "100% QUALITY INSPECT & BOX",
    icon: <Trophy className="w-5 h-5 text-zinc-400" />
  }
];

export default function ManufacturingExcellence() {
  const [activeStage, setActiveStage] = useState(STAGES[0]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Excellence background video play deferred or blocked:", error);
          // Try to reload sequence to ensure native prefetching has triggered
          video.load();
          video.play().catch(() => {});
        });
      }
    }
  }, []);

  return (
    <section id="excellence" className="relative bg-transparent py-20 md:py-28 lg:py-36 min-h-screen flex items-center overflow-hidden">
      
      {/* Background Cinematic Video Element - Responsive full-bleed high resolution, covers entire screen natively with full brightness */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dwcdqt5yv/video/upload/v1781962703/Black_cap_gliding_studio_environ__202606201907_dmpfb4.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 select-none scale-100 transition-opacity duration-1000"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
          referrerPolicy="no-referrer"
        />
        {/* Softer bright premium ambient overlays for incredible cinematic brightness and glassmorphism contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />
        <div className="absolute inset-0 bg-white/[0.02]" />
      </div>

      {/* Soft background ambient glowing nodes to elevate glassmorphism contrast & depth */}
      <div className="absolute top-[30%] left-[10%] w-[350px] h-[350px] bg-zinc-800/15 rounded-full blur-[120px] pointer-events-none select-none z-0" />
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[400px] bg-neutral-900/40 rounded-full blur-[130px] pointer-events-none select-none z-0 animate-pulse duration-10005" />
      <div className="absolute top-[5%] right-[25%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[90px] pointer-events-none select-none z-0" />

      {/* Decorative Blueprint lines */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent z-5" />
      <div className="absolute inset-0 grid-overlay opacity-[0.03] pointer-events-none z-5" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        
        {/* Head Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12 md:mb-16 lg:mb-24">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.5em] mb-3 text-zinc-300 font-sans font-medium drop-shadow-sm">
              Manufacture Assembly Steps
            </p>
            <h3 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight uppercase drop-shadow">
              Reliable <br />
              <span className="italic font-serif font-light text-zinc-200 normal-case">Production.</span>
            </h3>
          </div>
          <p className="max-w-sm font-sans font-light text-zinc-100 text-sm leading-relaxed drop-shadow-sm">
            Every batch of DEITY CAP WORKS custom caps and aprons is tailored with durable stitches, premium Indian threads, and checked twice for clean alignment so your team looks perfectly presented.
          </p>
        </div>

        {/* Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left: Interactive Stepper Control (5 columns) with supreme transparency */}
          <div className="lg:col-span-5 space-y-3.5">
            {STAGES.map((stage) => {
              const isActive = activeStage.id === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage)}
                  className={`w-full text-left p-5 md:p-6 rounded-2xl border transition-all duration-350 flex items-start gap-4 cursor-pointer relative overflow-hidden group ${
                    isActive 
                      ? "bg-black/45 backdrop-blur-2xl border-white/[0.18] text-white shadow-2xl shadow-black/50" 
                      : "bg-black/15 backdrop-blur-md border-white/[0.04] hover:bg-black/25 hover:border-white/[0.12] text-zinc-300"
                  }`}
                >
                  {/* Absolute left indicator border */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeExcellenceBorder"
                      className="absolute left-0 inset-y-0 w-1 bg-white"
                    />
                  )}

                  {/* Stage Index Number */}
                  <div className={`font-calligraphy text-2xl ${isActive ? "text-[#c5a880]" : "text-zinc-500"}`}>
                    {stage.num}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-sans font-semibold text-sm tracking-wide text-zinc-150 group-hover:text-white transition-colors uppercase">{stage.title}</p>
                      <span className={`transition-transform duration-300 ${isActive ? "text-white rotate-90" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-400">{stage.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Stage Content details & specs cards (7 columns) */}
          <div className="lg:col-span-7 bg-black/25 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 lg:p-12 min-h-[440px] flex flex-col justify-between relative shadow-[0_30px_70px_rgba(0,0,0,0.65)] overflow-hidden">
            
            {/* Soft decorative background glow */}
            <div className="absolute inset-0 grid-overlay opacity-15 select-none pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Icon & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-zinc-100">
                        {activeStage.icon}
                      </div>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4af37]">STITCH PROCESS TECH</span>
                        <h4 className="font-sans font-bold text-base text-white uppercase tracking-wide">{activeStage.title}</h4>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] px-3 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full text-zinc-200 uppercase tracking-widest">{activeStage.techSpec}</span>
                  </div>

                  {/* Description Paragraph */}
                  <p className="font-sans font-light text-zinc-200 text-sm md:text-base leading-relaxed">
                    {activeStage.description}
                  </p>

                  <div className="h-px bg-white/[0.06]" />

                  {/* Check Bullet Points */}
                  <div className="space-y-3.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#d4af37] block font-bold">RAW CRITICAL SPECIFICATIONS:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {activeStage.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full" />
                          <span className="font-sans text-xs text-zinc-100">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Technical Telemetry */}
                <div className="border-t border-white/[0.06] w-full pt-6 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-200">ISO-9003 COMPLIANT COUTURE</span>
                  </div>
                  <span className="font-mono text-[8px] text-zinc-300 tracking-widest uppercase">LAB_STG_{activeStage.id.toUpperCase()}_v2.6</span>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>

    </section>
  );
}
