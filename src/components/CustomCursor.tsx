import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Position of raw mouse absolute coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Elite, low-tension physical trail tracking spring configurations
  const springConfig = { damping: 32, stiffness: 380, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Class definitions or HTML types requiring active cursor transformations
      const isSelectable = 
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") || 
        target.closest("select") || 
        target.closest("textarea") || 
        target.closest(".group") || // All product and action card groups
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovered(!!isSelectable);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    // Smooth transitions depending on whether mouse leaves main viewport coordinates
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Luxurious, responsive circular trailing frame ring (visible on desktop) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#c5a880]/50 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? (isClicked ? 1.6 : 1.4) : (isClicked ? 0.85 : 1),
          backgroundColor: isHovered ? "rgba(197, 168, 128, 0.04)" : "transparent",
          borderColor: isHovered ? "#c5a880" : "rgba(197, 168, 128, 0.3)",
        }}
        animate={{
          borderWidth: isHovered ? "1.5px" : "1px",
          boxShadow: isHovered 
            ? "0 0 14px rgba(197, 168, 128, 0.3)" 
            : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.22 }}
      />

      {/* 2. Micro precise center point dot targeting stitches */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-[#c5a880] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovered ? 0.6 : 1,
        }}
        transition={{ type: "tween", duration: 0.1 }}
      />
    </>
  );
}
