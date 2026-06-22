import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Compass, ShieldAlert, Award, Star, Globe, TrendingUp, Sparkles } from "lucide-react";

const STATS = [
  {
    id: "caps",
    number: 140,
    suffix: "k+",
    label: "Items Crafted",
    description: "Quality custom caps and premium workwear aprons made, packed, and delivered to Indian companies, colleges, and sports leagues."
  },
  {
    id: "brands",
    number: 2000,
    suffix: "+",
    label: "Happy Clients",
    description: "School chains, local cricket clubs, hotels, food businesses, and companies choosing Deity Cap Works."
  },
  {
    id: "spi",
    number: 14,
    suffix: " SPI",
    label: "Standard Stitching",
    description: "Heavy-duty lock-stitching that ensures seams and panels remain robust and don't fray after standard wash cycles."
  },
  {
    id: "custom",
    number: 100,
    suffix: "%",
    label: "Custom Made",
    description: "Every batch is made custom from your selected color and fabric combos. We do not sell cheap pre-made items."
  }
];

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function WhyChooseUs() {
  const [isInView, setIsInView] = useState(false);

  // Trigger counters when scrolled to
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("stats");
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setIsInView(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="stats" className="relative bg-transparent py-24 lg:py-36 overflow-hidden">
      
      {/* Structural Backdrop Details */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Head section */}
        <div className="max-w-4xl mb-16 lg:mb-24">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.5em] mb-4 text-zinc-400 font-sans animate-pulse">
              Cap & Apron Operations
            </p>
            <h3 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-[1.1]">
              BUILT FOR EVERY <br/>
              <span className="italic font-serif font-light text-zinc-350 tracking-wide normal-case">Stitched Detail.</span>
            </h3>
            <p className="font-sans font-light text-zinc-350 text-sm leading-relaxed pt-2 max-w-2xl">
              By shifting from standard ready-mades to customer-specific fabric selections, we supply teams, factories, and schools with headwear and aprons that hold up beautifully over time.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={stat.id}
              className="group p-8 bg-black/15 backdrop-blur-3xl border border-white/[0.06] rounded-3xl flex flex-col justify-between transition-all duration-350 hover:bg-black/35 hover:border-white/[0.15] hover:shadow-2xl hover:shadow-black/20 h-72 relative"
            >
              {/* Top Index */}
              <div className="flex justify-between items-center relative z-10">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">
                  <span className="font-calligraphy text-[#c5a880] text-lg mr-1.5 font-normal">0{idx + 1}</span>. {stat.label.split(" ")[0]}
                </span>
              </div>

              {/* Number and Label display */}
              <div className="space-y-1 relative z-10">
                <h4 className="font-calligraphy text-6xl text-[#c5a880] tracking-wide leading-none flex items-baseline gap-1">
                  {isInView ? <AnimatedCounter value={stat.number} /> : 0}
                  <span className="text-zinc-400 font-sans not-italic text-lg font-normal select-none">{stat.suffix}</span>
                </h4>
                <p className="font-mono text-[9px] text-zinc-300 uppercase tracking-[0.2em] pt-1.5">{stat.label}</p>
              </div>

              {/* Description body */}
              <p className="font-sans font-light text-xs text-zinc-400 leading-relaxed relative z-10">
                {stat.description}
              </p>

            </div>
          ))}
        </div>

        {/* Dynamic Trust Quote Block */}
        <div className="mt-16 lg:mt-24 p-8 lg:p-12 bg-black/20 backdrop-blur-3xl border border-white/[0.08] rounded-3xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between shadow-xl">
          <div className="space-y-4 relative z-10 max-w-3xl">
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold font-sans">Customer Feedback</span>
            <p className="font-serif font-light text-zinc-200 text-lg md:text-2xl max-w-2xl leading-relaxed italic pr-4">
              "Isha purchased over thousands of custom umpire caps and volunteer clothing sets. The cotton drill fabric is incredibly sturdy and continuous washing didn't affect the shape or fade the logo."
            </p>
          </div>

          <div className="shrink-0 text-left md:text-right relative z-10 md:border-l md:border-white/[0.08] pl-0 md:pl-8 py-2">
            <p className="font-sans font-medium text-sm text-zinc-200">Procurement Team</p>
            <p className="font-sans text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-1">Isha Foundation & Volunteer Services</p>
          </div>
        </div>

      </div>

    </section>
  );
}
