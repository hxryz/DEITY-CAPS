import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Hammer, Cpu, Quote, Menu, X, ArrowRight, Shield } from "lucide-react";

interface HeaderProps {
  onOpenConfigurator: () => void;
  scrollToSection: (id: string) => void;
}

export default function Header({ onOpenConfigurator, scrollToSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Hero" },
    { id: "story", label: "About" },
    { id: "excellence", label: "Excellence" },
    { id: "collection", label: "Curation" },
    { id: "stats", label: "Telemetry" },
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "py-4 bg-black/60 backdrop-blur-md border-b border-white/5" 
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick("hero")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="text-lg md:text-xl tracking-[0.3em] font-bold uppercase text-zinc-150 group-hover:text-white transition">
              DEITY <span className="font-serif italic font-light text-zinc-400 lowercase tracking-normal">cap</span> WORKS
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-[10px] uppercase tracking-[0.25em] font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer relative py-1"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-zinc-500" />
              <span className="font-sans text-[9px] text-zinc-500 uppercase tracking-[0.2em]">LAB ACTIVE</span>
            </div>
            <div className="w-8 h-px bg-zinc-700"></div>
            
            <button
              onClick={onOpenConfigurator}
              className="px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-200 transition-all font-sans rounded-none cursor-pointer"
            >
              CUSTOM LAB
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={onOpenConfigurator}
              className="px-4 py-2 bg-white text-black text-[10px] font-sans font-bold tracking-widest uppercase rounded-none cursor-pointer"
            >
              LAB
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[72px] bottom-0 bg-[#050505]/98 backdrop-blur-lg z-30 p-8 flex flex-col justify-between md:hidden border-t border-zinc-800"
          >
            <div className="space-y-6 pt-6">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2">Collections</span>
              <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="font-serif text-3xl font-light italic text-zinc-300 text-left hover:text-white transition duration-200"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pb-12 border-t border-zinc-800 pt-6">
              <button
                onClick={() => {
                  onOpenConfigurator();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-4 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-none flex items-center justify-center gap-2"
              >
                <span>OPEN INTERACTIVE CUSTOM LAB</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
