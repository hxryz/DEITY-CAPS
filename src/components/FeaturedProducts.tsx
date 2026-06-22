import { Cpu, Star, Sliders } from "lucide-react";
import React, { useState, useRef } from "react";
import { motion } from "motion/react";

import umpireCapImg from "@/1c0d794c88849998dd2ee7dfb8c048bc.jpg";
import iplCapImg from "@/457ada2b67249145caf97a508d01ffa1.jpg";
import cookCapImg from "@/c8f465e8c5e308b5149b312dfe111e0f.jpg";
import graduationCapImg from "@/f71318ee67dff041cff1134befb64410.jpg";
import apronImg from "@/f1540dea36bdb274c1c459756f4117a4.jpg";

interface ProductImageWithFlareProps {
  image: string;
  alt: string;
  fabric: string;
  style: string;
}

function ProductImageWithFlare({ image, alt, fabric, style }: ProductImageWithFlareProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="h-56 bg-black/50 border border-white/[0.06] rounded-2xl relative flex items-center justify-center overflow-hidden cursor-crosshair group/img-interactive"
    >
      {/* Elastic organic material scale distortion with spring animation */}
      <motion.div 
        className="w-full h-full"
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <img 
          src={image} 
          alt={alt} 
          className="w-full h-full object-cover transition-all duration-500 grayscale brightness-[0.88] group-hover/img-interactive:grayscale-0 group-hover/img-interactive:brightness-105"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Extreme luxury mouse-following light flare / dynamic sheen that highlights thread fibers */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-350"
        style={{
          opacity,
          background: `radial-gradient(circle 120px at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)`
        }}
      />

      {/* Thread Grid / Subtle micro fabric weave texture overlay which lights up with flare */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:5px_5px] mix-blend-overlay opacity-0 group-hover/img-interactive:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Seamless shadow projection mask */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
      
      {/* Absolute Quick Specs displays */}
      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center select-none pointer-events-none z-10 font-mono text-[8px] text-zinc-300 uppercase tracking-widest">
        <span>{fabric}</span>
        <span>{style.toUpperCase()} BASELINE</span>
      </div>
    </div>
  );
}

interface FeaturedProductsProps {
  onLoadConfiguratorSpecs: (specs: any) => void;
}

const PRODUCTS = [
  {
    id: "umpire-cap",
    name: "Classic Umpire Cap",
    category: "OFFICIATING & LEAGUE SERIES",
    desc: "Bespoke short-curved-brim umpire officiating cap with durable multi-row stitching, custom crown paneling, and sweat-absorbing lining. Crafted for clear visibility.",
    fabric: "Premium Cotton Drill",
    style: "dad",
    technique: "Direct Flat Thread Embroidery",
    colors: [
      { name: "Navy Blue", hex: "#0f1c3f" },
      { name: "Off White", hex: "#f3f4f6" },
      { name: "Pure Black", hex: "#111113" }
    ],
    highlights: [
      "Rigid low profile crown paneling",
      "Short curved sun-blocking visor",
      "Elastic heavy absorbent bands",
      "Reinforced brass strap buckle"
    ],
    imageAlt: "Standard Umpire Officiating Cap",
    image: umpireCapImg
  },
  {
    id: "ipl-cap",
    name: "Premium Caps",
    category: "FAN CHANNELS & SPORTS ASSOCIATIONS",
    desc: "Vibrant high-contrast official sports cap engineered with high-density 3D puff embroidery, breathable rear channels, and durable peak shields for premium matches.",
    fabric: "Breathable Poly-Mesh",
    style: "snapback",
    technique: "3D Puff High-Density Logo Embroidery",
    colors: [
      { name: "IPL Golden Yellow", hex: "#fcbf15" },
      { name: "RCB Bold Red-Gold", hex: "#8c1515" },
      { name: "MI Cobalt Blue", hex: "#004ba0" }
    ],
    highlights: [
      "High-loft 3D puff stitch layout",
      "Moisture-wicking mesh linings",
      "Under-visor contrast stitching",
      "Adjustable snap-lock adjuster"
    ],
    imageAlt: "Sports Fan Athlete Cap Preview",
    image: iplCapImg
  },
  {
    id: "cook-cap",
    name: "Culinary Cook Cap",
    category: "PROFESSIONAL CHEF & KITCHEN WEAR",
    desc: "Pleated traditional chef caps and flat-crown server headwear designed for warm food-prep spaces. Keeps back-of-house staff perfectly streamlined.",
    fabric: "Premium Lightweight Cotton",
    style: "runner",
    technique: "Screen printed restaurant logo",
    colors: [
      { name: "Snow White", hex: "#ffffff" },
      { name: "Classic Pitch Black", hex: "#111113" },
      { name: "Steel Grey", hex: "#4b5563" }
    ],
    highlights: [
      "Comfort-fit rear stretch panels",
      "Stain-resistant protective guard",
      "High breathability fiber stitch",
      "Tear-resistant double locks"
    ],
    imageAlt: "Chef Kitchen Cooking Cap Represent",
    image: cookCapImg
  },
  {
    id: "graduation-cap",
    name: "Traditional Graduation Cap",
    category: "ACADEMIC CONVOCATION & CERMONY",
    desc: "Elegant structured academic graduation caps with custom-woven matching tassels and soft interior satin bands, engineered to fit comfortably during long graduation days.",
    fabric: "Polyester Matte Sateen",
    style: "dad",
    technique: "Golden Braided Trim Tassel Lock",
    colors: [
      { name: "Convocation Black", hex: "#040405" },
      { name: "University Crimson", hex: "#5c0612" },
      { name: "Chancellor Blue", hex: "#0c152d" }
    ],
    highlights: [
      "Carded interior stabilizing plate",
      "Reinforced golden year charm loop",
      "Sweatband-supported underlayer",
      "Elastic adaptive rear expandable"
    ],
    imageAlt: "College Academic Cap presentation",
    image: graduationCapImg
  },
  {
    id: "apron",
    name: "Durable Workwear Apron",
    category: "HOSPITALITY & SERVICE UNIFORMS",
    desc: "Specialized double-pocket barista and cooking aprons crafted with canvas textures and reinforced loops for all-day staff utility.",
    fabric: "Heavy Cotton Canvas Twill",
    style: "runner",
    technique: "High-density thermal brand print",
    colors: [
      { name: "Expresso Charcoal", hex: "#1c1917" },
      { name: "Cocoa Brown", hex: "#44403c" },
      { name: "Heritage Khaki", hex: "#78716c" }
    ],
    highlights: [
      "Heavyweight stain barrier tech",
      "Reinforced rivet pocket locks",
      "Adjustable high-tension neckstrap",
      "Double stitched storage segments"
    ],
    imageAlt: "Industrial Grade Premium Apron",
    image: apronImg
  }
];

interface ProductCardInteractiveProps {
  key?: string;
  p: any;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDecompile: (p: any) => void;
}

function ProductCardInteractive({ p, isHovered, onMouseEnter, onMouseLeave, onDecompile }: ProductCardInteractiveProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        onMouseEnter();
        setOpacity(1);
      }}
      onMouseLeave={() => {
        onMouseLeave();
        setOpacity(0);
      }}
      whileHover={{ y: -6, scale: 1.012 }}
      transition={{ type: "spring", stiffness: 140, damping: 18 }}
      className="group/card relative bg-[#151619]/45 backdrop-blur-3xl border border-white/[0.07] rounded-3xl p-6 lg:p-8 flex flex-col justify-between transition-all duration-350 hover:border-white/[0.18] hover:bg-[#151619]/65 hover:shadow-2xl hover:shadow-black/50 overflow-hidden min-h-[580px] cursor-pointer"
    >
      {/* Interactive mouse-following active light flare inside the card backdrop */}
      <motion.div 
        className="absolute inset-0 pointer-events-none mix-blend-screen transition-opacity duration-350"
        style={{
          opacity,
          background: `radial-gradient(circle 350px at ${coords.x}% ${coords.y}%, rgba(197, 168, 128, 0.05) 0%, rgba(197, 168, 128, 0.01) 60%, transparent 100%)`
        }}
      />

      {/* Soft background glow */}
      <div 
        className="absolute -top-32 -left-32 w-64 h-64 bg-white/2 rounded-full blur-[80px] transition-all duration-700 group-hover:scale-150 group-hover:bg-zinc-800/10 pointer-events-none" 
      />

      <div className="space-y-6">
        {/* Category Card Header */}
        <div className="flex justify-between items-center">
          <span className="font-mono text-[9px] uppercase tracking-widest text-[#c5a880] font-bold">{p.category}</span>
          <Star className={`w-4 h-4 transition-colors duration-450 ${isHovered ? "text-[#c5a880] fill-[#c5a880]" : "text-zinc-650"}`} />
        </div>

        {/* Title & Desc */}
        <div className="space-y-2">
          <h4 className="font-sans font-bold text-lg text-zinc-150 group-hover/card:text-white transition-colors uppercase tracking-wide">{p.name}</h4>
          <p className="font-sans font-light text-xs text-zinc-400 leading-relaxed line-clamp-3 group-hover/card:text-zinc-300 transition-colors">{p.desc}</p>
        </div>

        {/* High Quality Mockup Photography Showcase Area */}
        <ProductImageWithFlare 
          image={p.image} 
          alt={p.imageAlt} 
          fabric={p.fabric} 
          style={p.style} 
        />

        {/* Color Formulations */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-550 font-bold block">Available Standard Colors:</span>
          <div className="flex flex-wrap gap-2">
            {p.colors.map((color) => (
              <div 
                key={color.name}
                className="flex items-center gap-1.5 px-2 py-1 bg-black/30 border border-white/[0.05] rounded-l transition-transform duration-300 hover:scale-105"
              >
                <span className="w-2.5 h-2.5 block rounded-full border border-white/10" style={{ backgroundColor: color.hex }} />
                <span className="text-[8px] font-mono text-zinc-400 capitalize">{color.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Solid divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Highlights Bullet List */}
        <div className="space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-550 font-bold block">Material Highlights:</span>
          <ul className="grid grid-cols-2 gap-2">
            {p.highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-1.5 text-zinc-450 font-sans text-xs transition-colors duration-300 hover:text-zinc-200">
                <span className="w-1 h-1 bg-[#c5a880] rounded-full shrink-0" />
                <span className="truncate">{h}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Card Action footer */}
      <div className="pt-8 mt-6 border-t border-white/[0.06]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDecompile(p);
          }}
          className="w-full py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] text-zinc-200 hover:text-white rounded-xl font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group transition cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white group-hover:rotate-45 transition duration-350" />
          <span>Decompile In Custom Lab</span>
          <Sliders className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition duration-300" />
        </button>
      </div>

    </motion.div>
  );
}

export default function FeaturedProducts({ onLoadConfiguratorSpecs }: FeaturedProductsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const handleDecompileInLab = (p: typeof PRODUCTS[0]) => {
    onLoadConfiguratorSpecs({
      style: p.style,
      crownColor: p.colors[0].name,
      visorColor: p.colors[0].name,
      fabric: p.fabric,
      technique: p.technique,
      visorContrastStitch: p.style === "snapback" ? "Enabled" : "Disabled"
    });
  };

  return (
    <section id="collection" className="relative bg-transparent py-24 lg:py-40 overflow-hidden">
      
      {/* Structural Accent Details */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-[0.05] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Head description */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-4 text-zinc-400 font-sans">
            Ready-To-Order Catalogues
          </p>
          <h3 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight uppercase">
            HEADWEAR & APRON <br />
            <span className="italic font-serif font-light text-zinc-350 normal-case">Curations.</span>
          </h3>
          <p className="font-sans font-style-normal font-light text-zinc-300 text-sm leading-relaxed mt-4 max-w-xl">
            Choose from our specialized baseline outlines. Perfect for sports teams, restaurants, hospitality, universities, and promotional events. Custom branded caps and high-density stitched aprons.
          </p>
        </div>

        {/* Product Cards Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PRODUCTS.map((p) => {
            const isHovered = hoveredProduct === p.id;
            return (
              <ProductCardInteractive 
                key={p.id}
                p={p}
                isHovered={isHovered}
                onMouseEnter={() => setHoveredProduct(p.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onDecompile={handleDecompileInLab}
              />
            );
          })}
        </div>
        
      </div>
    </section>
  );
}
