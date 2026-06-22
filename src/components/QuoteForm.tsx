import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Send, 
  Check, 
  Sparkles, 
  User, 
  Briefcase, 
  Mail, 
  PhoneCall, 
  ChevronDown, 
  Layers, 
  FileText, 
  Calendar, 
  MapPin, 
  Clock 
} from "lucide-react";

interface QuoteFormProps {
  integratedSpecs: any | null;
  onClearIntegratedSpecs: () => void;
}

export default function QuoteForm({ integratedSpecs, onClearIntegratedSpecs }: QuoteFormProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    capType: "custom-drill",
    customCapDetail: "",
    quantity: "",
    logoRequired: "Yes",
    deliveryDate: "",
    shippingLocation: "",
    requirements: ""
  });

  // Validation & UX State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync integrated specs if user customized a cap in the 3D lab
  useEffect(() => {
    if (integratedSpecs) {
      const generatedType = `Custom ${integratedSpecs.style?.toUpperCase()} (${integratedSpecs.fabric} - ${integratedSpecs.technique})`;
      setFormData(prev => ({
        ...prev,
        capType: "custom-3d-blueprint",
        customCapDetail: generatedType
      }));
    }
  }, [integratedSpecs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.company.trim()) newErrors.company = "Company or Brand name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-]{6,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid contact phone number";
    }
    if (!formData.capType) newErrors.capType = "Please select a cap style";
    if (!formData.quantity.trim()) {
      newErrors.quantity = "Please enter an approximate quantity";
    } else if (isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Quantity must be a valid number";
    }
    if (!formData.shippingLocation.trim()) newErrors.shippingLocation = "Shipping delivery destination is required";

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury loader transition experience
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Construct formatted WhatsApp message
      const formattedCapType = formData.capType === "custom-3d-blueprint" && formData.customCapDetail
        ? formData.customCapDetail 
        : getCapTypeReadable(formData.capType);

      const message = `Hello DEITY CAP WORKS Team,

I would like to request a quotation for custom caps.

Please find my requirements below:

Name: ${formData.name.trim()}

Company / Brand Name /Your Name: ${formData.company.trim()}

Cap Type: ${formattedCapType}

Quantity Required: ${formData.quantity.trim()}

Logo / Branding Required: ${formData.logoRequired}

Required Delivery Date: ${formData.deliveryDate || "Not Specified"}

Shipping Location: ${formData.shippingLocation.trim()}

Additional Requirements:
${formData.requirements.trim() || "No additional requirements provided."}

Please share pricing, minimum order quantity (MOQ), production timeline, and shipping details.

Thank you.`;

      const encodedMsg = encodeURIComponent(message);
      // Country Code: 91 for India, phone: 9843566994
      const whatsappURL = `https://api.whatsapp.com/send?phone=919843566994&text=${encodedMsg}`;
      
      // Delay redirection slightly so the user experiences the success state animation
      setTimeout(() => {
        window.open(whatsappURL, "_blank");
        setIsSuccess(false);
      }, 1500);

    }, 1200);
  };

  const getCapTypeReadable = (val: string) => {
    switch (val) {
      case "umpire-isha": return "Classic Indian Umpire Cap (Isha Style)";
      case "ipl-sports": return "Premium Caps (Sports & Fan Channels)";
      case "chef-apron": return "Cooking Hat & Uniform Apron Set";
      case "college-grad": return "Traditional College Coronation/Graduation Cap";
      case "custom-6panel": return "Custom 6-Panel Premium Cotton Drill Hat";
      case "custom-snapback": return "High-Density Puff Embroidered Snapback";
      default: return "Custom Premium Headwear Profile";
    }
  };

  return (
    <section id="contact" className="relative bg-transparent py-24 lg:py-36 overflow-hidden">
      
      {/* Decorative Matrix & Alignment blue-print lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-[0.04] pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-zinc-800/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Layout split: Brand Introduction (5 Columns) vs Interactive Glass Form (7 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Left Column Area */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-12">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold">06 / SPECIFICATION SUBMISSION</span>
              </div>
              
              <h3 className="font-sans text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-tight uppercase">
                Initiate
                <br />
                <span className="italic font-serif font-light text-zinc-350 normal-case">Pricing Quote.</span>
              </h3>

              <p className="font-sans font-light text-zinc-300 text-sm leading-relaxed max-w-lg">
                Submit your project specifications straight to the <strong className="text-zinc-250 font-bold font-sans">DEITY CAP WORKS</strong> tailoring queue. We generate custom configurations and redirect you immediately to discuss via WhatsApp.
              </p>

              <div className="space-y-4 pt-6">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-[9px] text-[#c5a880] shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-zinc-200 uppercase tracking-wider">Direct WhatsApp Linkage</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Submit the form to send direct encoded strings. Discuss minimum order quantities (MOQ), raw yarns, and custom colors over secure chat.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-[9px] text-[#c5a880] shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-zinc-200 uppercase tracking-wider">Sourcing Indian Fabrics</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Choose premium heavy weight cotton drill, hand-woven cotton canvas or breathable sports mesh. Ideal for Indian institutions, corporates, and events.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-[9px] text-[#c5a880] shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-sans font-semibold text-xs text-zinc-200 uppercase tracking-wider">Fast Courier Swatch Dispatch</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Get sample hats and finished products sent to major cities with double corrugated packaging to safeguard structure.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro details bar */}
            <div className="bg-[#151619]/45 backdrop-blur-3xl border border-white/[0.08] rounded-3xl p-5 font-sans space-y-2 max-w-lg shadow-xl">
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-[#c5a880] shrink-0" />
                <span className="font-mono text-[9.5px] text-zinc-300 uppercase tracking-wider font-extrabold">Instant Support Line</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                Need phone assistance raw material advice immediately? Dial or text us on <span className="text-white hover:underline font-bold">+91 98435 66994</span> to consult with a tailoring technologist.
              </p>
            </div>

            <div className="border-t border-white/[0.06] pt-6 mt-6 flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880] animate-pulse" />
              <span>DIRECT APPAREL ROUTING SYSTEM ONLINE</span>
            </div>

          </div>

          {/* Right Column: Premium Form Container */}
          <div className="lg:col-span-12 xl:col-span-7 relative">
            
            {/* The Glassmorphism Card */}
            <div className="w-full h-full bg-[#151619]/45 border border-white/[0.08] rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl relative backdrop-blur-3xl">
              
              <div className="space-y-6 relative z-15">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/[0.06]">
                  <div>
                    <h4 className="font-mono text-[10px] text-[#c5a880] uppercase tracking-[0.2em] font-extrabold">DEITY CAP WORKS</h4>
                    <span className="text-xs font-sans text-zinc-400 block leading-none mt-1">Submit parameters for swift appraisal</span>
                  </div>
                  
                  {/* Digital Badge */}
                  <div className="px-3.5 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center gap-2 font-mono text-[9px] text-[#c5a880] tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a880] animate-spin" />
                    <span>SECURE WA DISPATCH</span>
                  </div>
                </div>

                {/* SHOW LAB蓝图 SPECS PRE-FILLED IF DETECTED */}
                {integratedSpecs && (
                  <motion.div 
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl space-y-2 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Connected 3D Lab Specs Applied
                      </span>
                      <button 
                        type="button"
                        onClick={onClearIntegratedSpecs}
                        className="font-mono text-[8px] text-zinc-400 hover:text-white uppercase tracking-widest cursor-pointer"
                      >
                        [ Reset Specs ]
                      </button>
                    </div>
                    <p className="text-[10px] font-sans text-zinc-300 leading-normal">
                      Form cap style has been synced with your customized blueprint: <strong>{formData.customCapDetail}</strong>.
                    </p>
                  </motion.div>
                )}

                {/* FORM WRAPPER */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5" id="field-name">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Full Name <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550" />
                        <input 
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ex: Rajesh Kumar"
                          className={`w-full bg-black/30 border p-3 pl-10 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all ${
                            errors.name ? "border-red-500/80 focus:border-red-500" : "border-white/[0.06] focus:border-[#c5a880]/50"
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-[10px] font-mono text-red-400">{errors.name}</p>}
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1.5" id="field-company">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Company / Brand Name <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550" />
                        <input 
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Ex: Deity Caps Team / Personal"
                          className={`w-full bg-black/30 border p-3 pl-10 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all ${
                            errors.company ? "border-red-500/80 focus:border-red-500" : "border-white/[0.06] focus:border-[#c5a880]/50"
                          }`}
                        />
                      </div>
                      {errors.company && <p className="text-[10px] font-mono text-red-400">{errors.company}</p>}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Email Optionally */}
                    <div className="space-y-1.5" id="field-email">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Email Address <span className="text-zinc-500">(Optional)</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550" />
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Ex: rajesh@domain.com"
                          className={`w-full bg-black/30 border p-3 pl-10 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all ${
                            errors.email ? "border-red-500/80 focus:border-red-500" : "border-white/[0.06] focus:border-[#c5a880]/50"
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-[10px] font-mono text-red-400">{errors.email}</p>}
                    </div>

                    {/* Phone Number Required */}
                    <div className="space-y-1.5" id="field-phone">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Phone Number <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550" />
                        <input 
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Ex: +91 98435 66994"
                          className={`w-full bg-black/30 border p-3 pl-10 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all ${
                            errors.phone ? "border-red-500/80 focus:border-red-500" : "border-white/[0.06] focus:border-[#c5a880]/50"
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] font-mono text-red-400">{errors.phone}</p>}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Cap Type Select */}
                    <div className="space-y-1.5 relative" id="field-capType">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Cap Type Style <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550 pointer-events-none" />
                        <select 
                          name="capType"
                          value={formData.capType}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-white/[0.06] p-3 pl-10 pr-10 text-sm text-zinc-200 rounded-xl font-sans focus:outline-none transition-all appearance-none cursor-pointer focus:border-[#c5a880]/50"
                        >
                          {formData.capType === "custom-3d-blueprint" && (
                            <option value="custom-3d-blueprint">✨ Active Lab 3D Blueprint</option>
                          )}
                          <option value="custom-6panel">Custom 6-Panel Premium Cotton Drill Cap</option>
                          <option value="umpire-isha">Classic Indian Umpire Cap (Isha Style)</option>
                          <option value="ipl-sports">Premium Caps (Sports & Fan Channels)</option>
                          <option value="chef-apron">Cooking Cap & Catering Apron Combo Set</option>
                          <option value="college-grad">Traditional College Graduation ceremony Cap</option>
                          <option value="custom-snapback">High Density 3D Puff Snapback Cap</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-zinc-550 pointer-events-none" />
                      </div>
                    </div>

                    {/* Quantity Required */}
                    <div className="space-y-1.5" id="field-quantity">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Quantity Required <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550" />
                        <input 
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="Ex: 50 / 500 / 1000"
                          className={`w-full bg-black/30 border p-3 pl-10 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all ${
                            errors.quantity ? "border-red-500/80 focus:border-red-500" : "border-white/[0.06] focus:border-[#c5a880]/50"
                          }`}
                        />
                      </div>
                      {errors.quantity && <p className="text-[10px] font-mono text-red-400">{errors.quantity}</p>}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Logo/Branding Options Yes/No */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Logo & Branding Required?</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, logoRequired: "Yes" }))}
                          className={`p-3 text-xs uppercase tracking-widest font-mono border rounded-xl transition-all cursor-pointer ${
                            formData.logoRequired === "Yes" 
                              ? "bg-[#c5a880] text-black border-[#c5a880] font-extrabold" 
                              : "bg-black/30 text-zinc-400 border-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          Yes / Full Branding
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, logoRequired: "No" }))}
                          className={`p-3 text-xs uppercase tracking-widest font-mono border rounded-xl transition-all cursor-pointer ${
                            formData.logoRequired === "No" 
                              ? "bg-[#c5a880] text-black border-[#c5a880] font-extrabold" 
                              : "bg-black/30 text-zinc-400 border-white/[0.06] hover:border-white/20"
                          }`}
                        >
                          No / Blank Cap
                        </button>
                      </div>
                    </div>

                    {/* Required Delivery Date */}
                    <div className="space-y-1.5" id="field-deliveryDate">
                      <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Required Delivery Date <span className="text-zinc-500">(Optional)</span></label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550 pointer-events-none" />
                        <input 
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleChange}
                          className="w-full bg-black/30 border border-white/[0.06] p-3 pl-10 text-sm text-zinc-350 rounded-xl font-mono focus:outline-none transition-all focus:border-[#c5a880]/50"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Shipping Location */}
                  <div className="space-y-1.5" id="field-shippingLocation">
                    <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Shipping Location / Delivery Address <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-zinc-550" />
                      <input 
                        type="text"
                        name="shippingLocation"
                        value={formData.shippingLocation}
                        onChange={handleChange}
                        placeholder="Ex: Bangalore, India / Chennai, Tamil Nadu"
                        className={`w-full bg-black/30 border p-3 pl-10 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all ${
                          errors.shippingLocation ? "border-red-500/80 focus:border-red-500" : "border-white/[0.06] focus:border-[#c5a880]/50"
                        }`}
                      />
                    </div>
                    {errors.shippingLocation && <p className="text-[10px] font-mono text-red-400">{errors.shippingLocation}</p>}
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase font-mono text-zinc-400 font-bold tracking-wider">Additional Styling Requirements</label>
                    <textarea 
                      name="requirements"
                      rows={3}
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="Discuss stitching line colors, custom side texts, placement size, custom catering aprons pocket layers, or any specific details..."
                      className="w-full bg-black/30 border border-white/[0.06] p-3 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl font-sans focus:outline-none transition-all focus:border-[#c5a880]/50 resize-none"
                    />
                  </div>

                  {/* SUBMIT BUTTON WITH FEEDBACK LOADERS */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-xl shadow-emerald-950/20 active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Preparing WhatsApp Specs...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce text-lime-400" />
                          <span>Redirecting to WhatsApp Chat...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Specifications to WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>

              </div>

              {/* Glassmorphism success checkout animations */}
              <AnimatePresence>
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#0c0d10]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-6 p-8 select-none border border-emerald-500/10 rounded-3xl"
                  >
                    <motion.div 
                      initial={{ scale: 0.6, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400"
                    >
                      <Check className="w-8 h-8" />
                    </motion.div>
                    
                    <div className="text-center space-y-2">
                      <p className="font-mono text-xs text-emerald-400 uppercase tracking-[0.35em] font-extrabold">Blueprints Formulated</p>
                      <h5 className="font-sans font-bold text-xl text-white uppercase tracking-wider">DEITY CAP WORKS</h5>
                      <p className="font-sans text-xs text-zinc-400 text-center max-w-sm pt-2 leading-relaxed">
                        Redirecting you directly to the WhatsApp channel with your formatted inquiry message. Please tap "Send" in the chat to submit.
                      </p>
                    </div>

                    {/* Micro-loader progress */}
                    <div className="w-36 h-0.5 bg-zinc-900 overflow-hidden relative">
                      <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
