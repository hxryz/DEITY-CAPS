import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Check, Zap, Cpu, Sparkles, ChevronRight, X, ArrowRight, ShieldCheck, Save, Trash2, FolderHeart } from "lucide-react";
import InteractiveCap3D from "./InteractiveCap3D";

interface CapConfiguratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpecs: (specs: any) => void;
}

const PRESET_LOGOS = [
  { id: "vanguard", name: "Vanguard Line", svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <path d="M50,15 L85,80 L65,80 L50,50 L35,80 L15,80 Z" />
    </svg>
  )},
  { id: "crest", name: "Imperial Crest", svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="50" cy="50" r="15" />
    </svg>
  )},
  { id: "apex", name: "Apex Tri", svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <polygon points="50,15 90,85 10,85" stroke="currentColor" strokeWidth="6" fill="none" />
      <polygon points="50,35 75,80 25,80"/>
    </svg>
  )},
  { id: "horizon", name: "Minimal Helix", svg: (
    <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
      <path d="M20,50 Q50,20 80,50 Q50,80 20,50 Z" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="50" cy="50" r="8" />
    </svg>
  )}
];

const COLORS = [
  { name: "Obsidian Black", hex: "#0f0f11", label: "matte" },
  { name: "Imperial Navy", hex: "#151e29", label: "rich" },
  { name: "Alabaster White", hex: "#e5e5e7", label: "stark" },
  { name: "Vanguard Silver", hex: "#7a7e85", label: "metallic" },
  { name: "Sandstone Beige", hex: "#a89985", label: "earthy" },
  { name: "Forest Moss", hex: "#222e23", label: "organic" },
  { name: "Crimson Bronze", hex: "#4a191b", label: "luxury" }
];

const FABRICS = [
  { id: "wool", name: "Heritage Melton Wool", desc: "Heavyweight traditional luxury, rich hand-feel", extra: "Classic warmth & structured elegance" },
  { id: "tech", name: "Laser-Perforated Ripstop", desc: "Hydrophobic structured micro-mesh, performance grid", extra: "Breathable stealth-tech design" },
  { id: "canvas", name: "Waxed Rugged Canvas", desc: "Water-resistant matte patina, industrial drape", extra: "Heritage durabilty, shapes with time" }
];

const MERGER_TECHNIQUES = [
  { id: "puff", name: "3D Puff High-Density Embroidery", price: "Premium", desc: "Sculpural thread elevation up to 3mm height", time: "8-10 days" },
  { id: "metal", name: "Laser-Cut Surgical Steel Crest", price: "Signature", desc: "Beveled-edge plate mounted with industrial hardware", time: "12-14 days" },
  { id: "rubber", name: "Micro-Injected Matte Rubber Stamp", price: "Stealth", desc: "High-contrast rubberized relief with tactile density", time: "10-12 days" },
  { id: "woven", name: "Damask Woven Edge-Sealed Patch", price: "Classic", desc: "Ultra-fine thread weaving capturing infinite detail", time: "6-8 days" }
];

export default function CapConfigurator({ isOpen, onClose, onSelectSpecs }: CapConfiguratorProps) {
  const [style, setStyle] = useState<"snapback" | "dad" | "runner">("snapback");
  const [crownColor, setCrownColor] = useState(COLORS[0]);
  const [visorColor, setVisorColor] = useState(COLORS[0]);
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [technique, setTechnique] = useState(MERGER_TECHNIQUES[0]);
  const [selectedLogo, setSelectedLogo] = useState(PRESET_LOGOS[0]);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [visorContrastStitch, setVisorContrastStitch] = useState(false);
  const [eyeletColor, setEyeletColor] = useState(COLORS[2]); // Default Alabaster White/Silver

  const fileInputRef = useRef<HTMLInputElement>(null);

  interface SavedDraft {
    id: string;
    name: string;
    timestamp: number;
    style: "snapback" | "dad" | "runner";
    crownColorName: string;
    visorColorName: string;
    fabricId: string;
    techniqueId: string;
    selectedLogoId: string;
    visorContrastStitch: boolean;
    eyeletColorName: string;
  }

  const [drafts, setDrafts] = useState<SavedDraft[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("deity_cap_drafts");
      if (stored) {
        setDrafts(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load drafts from localStorage", e);
    }
  }, []);

  const saveDraft = () => {
    const draftName = `${crownColor.name.split(" ")[0]} & ${visorColor.name.split(" ")[0]} ${style.charAt(0).toUpperCase() + style.slice(1)}`;
    const newDraft: SavedDraft = {
      id: Date.now().toString(),
      name: draftName,
      timestamp: Date.now(),
      style,
      crownColorName: crownColor.name,
      visorColorName: visorColor.name,
      fabricId: fabric.id,
      techniqueId: technique.id,
      selectedLogoId: selectedLogo.id,
      visorContrastStitch,
      eyeletColorName: eyeletColor.name,
    };
    const updated = [newDraft, ...drafts];
    setDrafts(updated);
    localStorage.setItem("deity_cap_drafts", JSON.stringify(updated));
  };

  const loadDraft = (draft: SavedDraft) => {
    setStyle(draft.style);
    
    const foundCrown = COLORS.find(c => c.name === draft.crownColorName);
    if (foundCrown) setCrownColor(foundCrown);

    const foundVisor = COLORS.find(c => c.name === draft.visorColorName);
    if (foundVisor) setVisorColor(foundVisor);

    const foundFabric = FABRICS.find(f => f.id === draft.fabricId);
    if (foundFabric) setFabric(foundFabric);

    const foundTech = MERGER_TECHNIQUES.find(t => t.id === draft.techniqueId);
    if (foundTech) setTechnique(foundTech);

    const foundLogo = PRESET_LOGOS.find(l => l.id === draft.selectedLogoId);
    if (foundLogo) setSelectedLogo(foundLogo);

    setVisorContrastStitch(draft.visorContrastStitch);

    const foundEyelet = COLORS.find(c => c.name === draft.eyeletColorName);
    if (foundEyelet) setEyeletColor(foundEyelet);
  };

  const deleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem("deity_cap_drafts", JSON.stringify(updated));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomLogoUrl(url);
    }
  };

  const getActiveLogoColor = () => {
    // contrast logo color depending on crown color
    const darkCrowns = ["#0f0f11", "#151e29", "#222e23", "#4a191b"];
    return darkCrowns.includes(crownColor.hex) ? "#d4af37" : "#0f0f11"; // luxury gold on dark, dark obsidian on light
  };

  const handleSubmit = () => {
    onSelectSpecs({
      style,
      crownColor: crownColor.name,
      visorColor: visorColor.name,
      fabric: fabric.name,
      technique: technique.name,
      logoType: customLogoUrl ? "Client Uploaded Graphic" : selectedLogo.name,
      customLogoUrl: customLogoUrl || undefined,
      visorContrastStitch: visorContrastStitch ? "Enabled" : "Disabled",
      eyelets: eyeletColor.name,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0c0d10]/95 backdrop-blur-3xl border border-white/[0.08] rounded-3xl w-full max-w-6xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] relative"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-15 p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl text-zinc-300 hover:text-white hover:border-white/[0.18] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left Column: Interactive Product Visualizer (3D-like Vector Cap rendering!) */}
          <div className="lg:col-span-7 bg-transparent p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Grid for rendering */}
            <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none" />

            {/* Configurator Label */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Interactive Dev Preview</span>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs text-brand-gold uppercase tracking-wider font-semibold">CUSTOM LAB</p>
                <p className="font-sans text-[10px] text-zinc-500">Premium Bespoke Build</p>
              </div>
            </div>

            {/* Interactive 3D Cap Canvas */}
            <div className="relative flex-1 flex items-center justify-center p-4 min-h-[300px] lg:min-h-[400px]">
              <div className="w-full h-full min-h-[inherit] relative flex items-center justify-center">
                <InteractiveCap3D 
                  style={style}
                  crownColor={crownColor.hex}
                  visorColor={visorColor.hex}
                  fabric={fabric.id as any}
                  visorContrastStitch={visorContrastStitch}
                  autoRotate={false}
                />
              </div>
            </div>

            {/* Configurator Specifications Summary */}
            <div className="relative z-10 bg-zinc-950/80 border border-zinc-850 rounded-none p-4 flex gap-4 overflow-x-auto select-none no-scrollbar">
              <div className="shrink-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 block">Sillhouette</span>
                <span className="font-sans text-xs font-semibold uppercase text-zinc-200">{style}</span>
              </div>
              <div className="w-px bg-zinc-850 self-stretch shrink-0" />
              <div className="shrink-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 block">Fabric Cloth</span>
                <span className="font-sans text-xs font-semibold uppercase text-zinc-200 truncate max-w-[100px] block">{fabric.name.split(" ")[1]}</span>
              </div>
              <div className="w-px bg-zinc-850 self-stretch shrink-0" />
              <div className="shrink-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 block">Branding Method</span>
                <span className="font-sans text-xs font-semibold uppercase text-zinc-200 truncate max-w-[100px] block">{technique.name.split(" ")[0]}</span>
              </div>
              <div className="w-px bg-zinc-850 self-stretch shrink-0" />
              <div className="shrink-0">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 block">Contrast Stitch</span>
                <span className="font-sans text-xs font-semibold uppercase text-zinc-200">{visorContrastStitch ? "Active" : "None"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Customizer Controls */}
          <div className="lg:col-span-5 p-6 lg:p-10 flex flex-col justify-between overflow-y-auto h-full max-h-[85vh] lg:max-h-[90vh]">
            <div className="space-y-8">
              {/* Head Section */}
              <div>
                <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                  <StarIcon className="w-3.5 h-3.5 text-zinc-400 fill-current" />
                  Bespoke Manufacture Build
                </div>
                <h3 className="font-sans font-bold uppercase tracking-wide text-xl text-white mt-1">Configure Model</h3>
                <p className="text-xs text-zinc-450 mt-1">Design your line of custom caps using our precise raw material specs.</p>
              </div>

              {/* 1. Silhouette Style Select */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">01 / Choose Silhouette</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "snapback", label: "Snapback", sub: "Flat Visor, Structured" },
                    { id: "dad", label: "Classic Dad", sub: "Curved Visor, Unstructured" },
                    { id: "runner", label: "Runner Cap", sub: "Curved Bill, Fast Mesh" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setStyle(item.id as any)}
                      className={`text-left p-3 rounded-none border transition-all cursor-pointer ${
                        style === item.id 
                          ? "bg-[#141414] border-zinc-500 text-white shadow-xl" 
                          : "border-zinc-900 hover:border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <p className="font-sans font-semibold text-xs text-zinc-200">{item.label}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5 line-clamp-1">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Selection (Crown vs Visor) */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">02 / Color Formulation</span>
                
                {/* Crown Color */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-400 font-sans">Crown Panel Color: <strong className="text-zinc-200">{crownColor.name}</strong></span>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={`crown-${color.hex}`}
                        onClick={() => setCrownColor(color)}
                        className="w-7 h-7 rounded-none border transition-all p-0.5 cursor-pointer flex items-center justify-center"
                        style={{ borderColor: crownColor.hex === color.hex ? "#ffffff" : "rgba(255,255,255,0.08)" }}
                      >
                        <span className="w-full h-full rounded-none block border border-white/10" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visor Color */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-zinc-400 font-sans">Visor / Bill Color: <strong className="text-zinc-200">{visorColor.name}</strong></span>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={`visor-${color.hex}`}
                        onClick={() => setVisorColor(color)}
                        className="w-7 h-7 rounded-none border transition-all p-0.5 cursor-pointer flex items-center justify-center"
                        style={{ borderColor: visorColor.hex === color.hex ? "#ffffff" : "rgba(255,255,255,0.08)" }}
                      >
                        <span className="w-full h-full rounded-none block border border-white/10" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eyelet Metal Eyelet Color Selection */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-zinc-400 font-sans">Hardware (Eyelets) Color: <strong className="text-zinc-200">{eyeletColor.name}</strong></span>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.slice(0, 5).map((color) => (
                      <button
                        key={`eyelet-${color.hex}`}
                        onClick={() => setEyeletColor(color)}
                        className="w-6 h-6 rounded-none border transition-all p-0.5 cursor-pointer flex items-center justify-center"
                        style={{ borderColor: eyeletColor.hex === color.hex ? "#ffffff" : "rgba(255,255,255,0.08)" }}
                      >
                        <span className="w-full h-full rounded-none block border border-white/10" style={{ backgroundColor: color.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Materials Selection */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">03 / Textile Engineering (Crown Fabric)</span>
                <div className="space-y-2">
                  {FABRICS.map((fab) => (
                    <button
                      key={fab.id}
                      onClick={() => setFabric(fab)}
                      className={`w-full text-left p-3 rounded-none border transition-all cursor-pointer flex justify-between items-start ${
                        fabric.id === fab.id 
                          ? "bg-zinc-900 border-zinc-700 text-white" 
                          : "border-zinc-900 hover:border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-sans font-semibold text-xs text-zinc-200">{fab.name}</p>
                        <p className="text-[10px] text-zinc-550">{fab.desc}</p>
                        <p className="text-[9px] text-[#888] italic mt-1 font-mono">{fab.extra}</p>
                      </div>
                      {fabric.id === fab.id && <Check className="w-3.5 h-3.5 text-white bg-zinc-850 p-0.5 rounded-none" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Branding Technique */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">04 / Premium Branding Method</span>
                <div className="space-y-2">
                  {MERGER_TECHNIQUES.map((tech) => (
                    <button
                      key={tech.id}
                      onClick={() => setTechnique(tech)}
                      className={`w-full text-left p-3 rounded-none border transition-all cursor-pointer flex justify-between items-start ${
                        technique.id === tech.id 
                          ? "bg-zinc-900 border-zinc-700 text-white" 
                          : "border-zinc-900 hover:border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-sans font-semibold text-xs text-zinc-200">{tech.name}</p>
                          <span className="px-1.5 py-0.5 bg-zinc-800 text-[8px] font-mono text-zinc-450 uppercase rounded-none tracking-wider">{tech.price}</span>
                        </div>
                        <p className="text-[10px] text-zinc-550">{tech.desc}</p>
                        <p className="text-[9px] text-zinc-450 mt-1 font-mono">Machining lead: <span className="text-zinc-200">{tech.time}</span></p>
                      </div>
                      {technique.id === tech.id && <Check className="w-3.5 h-3.5 text-white bg-zinc-850 p-0.5 rounded-none" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Custom Graphic upload vs Presets */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">05 / Vector Graphics Seal</span>
                
                <div className="space-y-3">
                  {/* Preset list toggle */}
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_LOGOS.map((logo) => (
                      <button
                        key={logo.id}
                        onClick={() => {
                          setSelectedLogo(logo);
                          setCustomLogoUrl(null); // Clear custom upload
                        }}
                        className={`p-3 rounded-none border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 h-16 ${
                          selectedLogo.id === logo.id && !customLogoUrl
                            ? "bg-[#141414] border-zinc-500 text-zinc-200" 
                            : "border-zinc-900 hover:border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <div className="w-5 h-5">{logo.svg}</div>
                        <span className="text-[8px] uppercase tracking-widest block truncate text-center w-full">{logo.name.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* SVG upload client custom file */}
                  <div className="border border-zinc-900 bg-zinc-950/40 rounded-none p-3 flex items-center justify-between gap-3">
                    <div className="flex gap-2.5 items-center">
                      <div className="p-2 bg-zinc-900 rounded-none text-zinc-500">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">Upload Your Logo</p>
                        <p className="text-[9px] text-zinc-500">SVG, PNG or Vector graphics (Transparency preferred)</p>
                      </div>
                    </div>
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-none font-mono text-[9px] uppercase tracking-wider text-zinc-300 hover:text-white transition cursor-pointer"
                      >
                        {customLogoUrl ? "Change" : "Browse"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra styling choices */}
              <div className="space-y-3 pt-2">
                <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Extra Details</span>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-none border border-zinc-900 hover:border-zinc-800 select-none">
                  <input
                    type="checkbox"
                    checked={visorContrastStitch}
                    onChange={(e) => setVisorContrastStitch(e.target.checked)}
                    className="w-4 h-4 rounded-none border-zinc-800 text-zinc-100 bg-zinc-900 cursor-pointer accent-white"
                  />
                  <div>
                    <p className="text-xs font-semibold text-zinc-250">Contrast Stitching on Visor</p>
                    <p className="text-[9px] text-zinc-500">Adds an elegant gold stitch pattern matching custom thread lines.</p>
                  </div>
                </label>
              </div>

              {/* 06 / Drafts Storage Hub */}
              <div className="space-y-4 pt-4 border-t border-zinc-900/65">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">06 / Draft Storage Hub</span>
                  <span className="font-mono text-[9px] text-zinc-650">{drafts.length} Stored Drafts</span>
                </div>

                <button
                  onClick={saveDraft}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#c5a880]/10 hover:bg-[#c5a880]/20 border border-[#c5a880]/20 hover:border-[#c5a880]/50 text-[#c5a880] hover:text-white rounded-none font-mono text-[10px] uppercase tracking-widest transition duration-350 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Current Configuration as Draft</span>
                </button>

                {drafts.length > 0 && (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 border border-zinc-900 p-2 bg-black/10 no-scrollbar">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        onClick={() => loadDraft(draft)}
                        className="group/draft flex items-center justify-between p-2.5 border border-white/[0.03] hover:border-[#c5a880]/30 hover:bg-white/[0.02] cursor-pointer transition-all duration-300"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FolderHeart className="w-3.5 h-3.5 text-[#c5a880]/70 group-hover/draft:text-[#c5a880] shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-[10px] font-sans font-semibold text-zinc-200 group-hover/draft:text-white transition-colors truncate">
                              {draft.name}
                            </p>
                            <p className="text-[8px] font-mono text-zinc-550 uppercase tracking-wider">
                              {draft.fabricId} / {draft.techniqueId.split("-").join(" ")}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => deleteDraft(draft.id, e)}
                          className="p-1.5 hover:bg-white/[0.05] hover:text-red-400 rounded-none text-zinc-600 transition cursor-pointer"
                          title="Purge Draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sticky Configurator Bottom: Submit specs directly to quotes setup */}
            <div className="border-t border-zinc-900 pt-6 mt-8 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-550 font-sans">Formulated Mockup Style:</span>
                <span className="text-xs text-zinc-250 font-mono tracking-wider font-semibold uppercase">{style} Cap / {fabric.name.split(" ")[1]} / {technique.name.split(" ")[0]}</span>
              </div>
              <button 
                onClick={handleSubmit}
                className="w-full bg-white hover:bg-zinc-100 text-black py-4 px-6 rounded-none font-sans font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer group"
              >
                Assemble Spec & Get Quote
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </button>
              
              <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-zinc-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                INDUSTRIAL SPECIFICATIONS RETAINED IN MEMORY
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function StarIcon({ className, size = 16 }: { className?: string, size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
