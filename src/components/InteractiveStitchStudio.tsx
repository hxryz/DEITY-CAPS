import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  Torus, 
  Sparkles, 
  Cpu, 
  Play, 
  Pause, 
  Trash2, 
  Flame, 
  Layers, 
  Sliders, 
  CircleDot, 
  Maximize2 
} from "lucide-react";

const STITCH_COLORS = [
  { name: "Surgical Gold", hex: "#d4af37", specular: "#ffffff", desc: "Metallic luxury thread with polished gold sheen" },
  { name: "Obsidian Black", hex: "#111113", specular: "#333333", desc: "Waxed triple-ply high tension structural thread" },
  { name: "Royal Indigo", hex: "#312e81", specular: "#818cf8", desc: "Deep ceremonial vat-dyed athletic stitch thread" },
  { name: "Crimson Silk", hex: "#dc2626", specular: "#fca5a5", desc: "Soft-finish high-contrast commemorative thread" },
  { name: "Aero Chrome", hex: "#e2e8f0", specular: "#ffffff", desc: "Lightweight weather-proof reflective fiber" }
];

const PRESETS = [
  {
    name: "Golden Crown Crest",
    points: [
      new THREE.Vector3(-0.8, -0.4, 0),
      new THREE.Vector3(-0.9, 0.4, 0),
      new THREE.Vector3(-0.4, 0.0, 0),
      new THREE.Vector3(0, 0.6, 0),
      new THREE.Vector3(0.4, 0.0, 0),
      new THREE.Vector3(0.9, 0.4, 0),
      new THREE.Vector3(0.8, -0.4, 0),
      new THREE.Vector3(-0.8, -0.4, 0)
    ]
  },
  {
    name: "Hexagonal Cap Outline",
    points: [
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(0.7, 0.4, 0),
      new THREE.Vector3(0.7, -0.4, 0),
      new THREE.Vector3(0, -0.8, 0),
      new THREE.Vector3(-0.7, -0.4, 0),
      new THREE.Vector3(-0.7, 0.4, 0),
      new THREE.Vector3(0, 0.8, 0)
    ]
  },
  {
    name: "DEITY Stitch Signature",
    points: [
      // D
      new THREE.Vector3(-1.0, -0.3, 0),
      new THREE.Vector3(-1.0, 0.3, 0),
      new THREE.Vector3(-0.7, 0.3, 0),
      new THREE.Vector3(-0.6, 0.15, 0),
      new THREE.Vector3(-0.6, -0.15, 0),
      new THREE.Vector3(-0.7, -0.3, 0),
      new THREE.Vector3(-1.0, -0.3, 0),
      // Space to E
      new THREE.Vector3(-0.4, -0.3, 0),
      new THREE.Vector3(-0.4, 0.3, 0),
      new THREE.Vector3(-0.1, 0.3, 0),
      new THREE.Vector3(-0.4, 0.3, 0),
      new THREE.Vector3(-0.4, 0.0, 0),
      new THREE.Vector3(-0.2, 0.0, 0),
      new THREE.Vector3(-0.4, 0.0, 0),
      new THREE.Vector3(-0.4, -0.3, 0),
      new THREE.Vector3(-0.1, -0.3, 0),
      // Space to I
      new THREE.Vector3(0.1, 0.3, 0),
      new THREE.Vector3(0.1, -0.3, 0),
      // Space to T
      new THREE.Vector3(0.3, 0.3, 0),
      new THREE.Vector3(0.7, 0.3, 0),
      new THREE.Vector3(0.5, 0.3, 0),
      new THREE.Vector3(0.5, -0.3, 0),
      // Space to Y
      new THREE.Vector3(0.8, 0.3, 0),
      new THREE.Vector3(0.95, 0.0, 0),
      new THREE.Vector3(1.1, 0.3, 0),
      new THREE.Vector3(0.95, 0.0, 0),
      new THREE.Vector3(0.95, -0.3, 0)
    ]
  }
];

export default function InteractiveStitchStudio() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Interactive Config States
  const [activeColor, setActiveColor] = useState(STITCH_COLORS[0]);
  const [speedPPM, setSpeedPPM] = useState(750); // Punches Per Minute
  const [densitySPI, setDensitySPI] = useState(14); // Stitches Per Inch
  const [tension, setTension] = useState(0.75); // Yarn tension factor
  const [autoProgram, setAutoProgram] = useState<string | null>(null);
  const [isSewing, setIsSewing] = useState(false);
  const [stitchCount, setStitchCount] = useState(142);
  const [totalYards, setTotalYards] = useState(12.4);
  const [needleState, setNeedleState] = useState("Ready");
  
  // Three.js internal controllers
  const addManualStitchRef = useRef<((pt: THREE.Vector3) => void) | null>(null);
  const triggerAutoProgramRef = useRef<((points: THREE.Vector3[]) => void) | null>(null);
  const clearStitchesRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();

    // 2. CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.0);

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. EMBROIDERY CLOTH CANVAS (A dense weave styled surface)
    const plateGeom = new THREE.BoxGeometry(2.4, 1.8, 0.06);
    
    // Create rich heavy fabric weave texture
    const createWeaveTexture = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, size, size);

      // Draw cross-grid threads
      ctx.strokeStyle = "rgba(40,40,45, 0.85)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= size; i += 4) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
      }
      ctx.stroke();

      // Slanted weave bump look
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let i = -size; i < size; i += 8) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i + size, size);
      }
      ctx.stroke();

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(12, 9);
      return texture;
    };

    const weaveBump = createWeaveTexture();

    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.95,
      metalness: 0.1,
      bumpMap: weaveBump || undefined,
      bumpScale: 0.02,
    });
    
    const plateMesh = new THREE.Mesh(plateGeom, plateMat);
    plateMesh.receiveShadow = true;
    scene.add(plateMesh);

    // Outer framing holder
    const frameGeom = new THREE.BoxGeometry(2.5, 1.9, 0.08);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Golden clamp hoop
      roughness: 0.3,
      metalness: 0.9,
      wireframe: false,
    });
    const frameMesh = new THREE.Mesh(frameGeom, frameMat);
    frameMesh.position.z = -0.01;
    scene.add(frameMesh);

    // 5. ANIMATED NEEDLE ASSEMBLY MODEL
    const needleGroup = new THREE.Group();
    scene.add(needleGroup);

    // Tapered needle rod
    const needleRodGeom = new THREE.CylinderGeometry(0.012, 0.003, 0.8, 12);
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xddeefc,
      roughness: 0.12,
      metalness: 0.95,
    });
    const needleRod = new THREE.Mesh(needleRodGeom, metalMat);
    needleRod.position.y = 0.4;
    needleGroup.add(needleRod);

    // Needle eye bar cross
    const needleEyeGeom = new THREE.TorusGeometry(0.02, 0.006, 6, 16);
    const needleEye = new THREE.Mesh(needleEyeGeom, metalMat);
    needleEye.position.set(0, 0.1, 0);
    needleEye.rotation.x = Math.PI / 2;
    needleGroup.add(needleEye);

    // Spun yarn thread feeding through the eye of the needle on 3D layout
    const yarnPoints = [
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(0, 0.1, 0),
      new THREE.Vector3(0.2, 0.0, 0.1)
    ];
    const yarnGeom = new THREE.BufferGeometry().setFromPoints(yarnPoints);
    const yarnMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(activeColor.hex),
      linewidth: 2,
    });
    const yarnLine = new THREE.Line(yarnGeom, yarnMat);
    needleGroup.add(yarnLine);

    // Position needle initially high up
    needleGroup.position.set(0, 0, 0.1);

    // 6. STITCH GRAPHICS SYSTEMS (Line & Spherical node representation for micro precision)
    const stitchesGroup = new THREE.Group();
    scene.add(stitchesGroup);

    // Persistent collection of stitch coordinate points
    let currentYarnColor = new THREE.Color(activeColor.hex);
    let stitchPoints: THREE.Vector3[] = [];
    const maxStitchesLimit = 400;

    // Recreate full stitch meshes based on point collection
    const rebuildStitchMeshes = () => {
      // Clear existing children
      while (stitchesGroup.children.length > 0) {
        const obj = stitchesGroup.children[0];
        stitchesGroup.remove(obj);
      }

      if (stitchPoints.length < 2) return;

      // Draw lines matching stitch segments
      const pointsGeom = new THREE.BufferGeometry().setFromPoints(stitchPoints);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: currentYarnColor,
        linewidth: 4,
      });
      const lines = new THREE.Line(pointsGeom, lineMaterial);
      lines.position.z = 0.035;
      stitchesGroup.add(lines);

      // Draw small spheres to represent SPI lock needle nodes
      const nodeGeom = new THREE.SphereGeometry(0.015, 6, 6);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: currentYarnColor,
        roughness: 0.6,
        metalness: 0.1
      });

      stitchPoints.forEach((point) => {
        const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
        nodeMesh.position.copy(point);
        nodeMesh.position.z = 0.035;
        stitchesGroup.add(nodeMesh);
      });
    };

    // Initialize with a pre-woven geometric boundary
    const initDefaultDemoStitches = () => {
      stitchPoints = [];
      const numSteps = 40;
      for (let i = 0; i <= numSteps; i++) {
        const rRatio = i / numSteps;
        const angle = rRatio * Math.PI * 4;
        const radius = 0.1 + rRatio * 0.45;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        stitchPoints.push(new THREE.Vector3(x, y, 0));
      }
      rebuildStitchMeshes();
      setStitchCount(stitchPoints.length);
      setTotalYards(parseFloat((3.2 + stitchPoints.length * 0.07).toFixed(1)));
    };

    initDefaultDemoStitches();

    // 7. EMITTING SPARK PHYSICS FIELD ON PUNCTURES
    const sparkCount = 35;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      // hidden initially
      sparkPositions[i * 3] = 999;
      sparkPositions[i * 3 + 1] = 999;
      sparkPositions[i * 3 + 2] = 0;
    }
    sparkGeom.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xd4af37, // golden sparks
      size: 0.035,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkSystem = new THREE.Points(sparkGeom, sparkMat);
    scene.add(sparkSystem);

    const triggerPunctureSpark = (pivot: THREE.Vector3) => {
      const pos = sparkSystem.geometry.attributes.position.array as Float32Array;
      sparkMat.opacity = 1.0;
      for (let i = 0; i < sparkCount; i++) {
        pos[i * 3] = pivot.x;
        pos[i * 3 + 1] = pivot.y;
        pos[i * 3 + 2] = 0.038;

        // Radial velocity blast outer
        const angle = Math.random() * Math.PI * 2;
        const velocityMagnitude = 0.015 + Math.random() * 0.02;
        sparkVelocities[i * 3] = Math.cos(angle) * velocityMagnitude;
        sparkVelocities[i * 3 + 1] = Math.sin(angle) * velocityMagnitude;
        sparkVelocities[i * 3 + 2] = 0.01 + Math.random() * 0.015;
      }
      sparkSystem.geometry.attributes.position.needsUpdate = true;
    };

    // 8. ENVIRONMENTAL LIGHTING ENGINE
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0xffffff, 1.2);
    primaryLight.position.set(4, 5, 6);
    scene.add(primaryLight);

    const goldStudioLight = new THREE.PointLight(0xd4af37, 1.2, 5);
    goldStudioLight.position.set(-1.5, 1.0, 1.0);
    scene.add(goldStudioLight);

    // 9. EVENT LISTENERS & INTERACTION DRAG
    let isDraggingNeedle = false;
    let targetNeedlePos = new THREE.Vector3(0, 0, 0.1);

    const updateNeedleFromCoords = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Unproject to retrieve approximate 3D coordinate on plane
      const planeZ = 0.1;
      const x3D = normX * 1.5; 
      const y3D = normY * 1.1;

      targetNeedlePos.set(
        Math.max(-1.1, Math.min(1.1, x3D)),
        Math.max(-0.8, Math.min(0.8, y3D)),
        planeZ
      );
    };

    // Add coordinate manually as embroidery node stitch
    const addManualStitchNode = (pt: THREE.Vector3) => {
      const minDistance = 0.08;
      if (stitchPoints.length > 0) {
        const lastPt = stitchPoints[stitchPoints.length - 1];
        if (lastPt.distanceTo(pt) < minDistance) return; // ignore duplicates
      }

      if (stitchPoints.length >= maxStitchesLimit) {
        stitchPoints.shift(); // rotate queue
      }

      stitchPoints.push(pt.clone());
      rebuildStitchMeshes();
      
      setStitchCount(stitchPoints.length);
      setTotalYards(parseFloat((3.2 + stitchPoints.length * 0.07).toFixed(1)));
      setNeedleState("Punching");
      triggerPunctureSpark(pt);
    };

    addManualStitchRef.current = addManualStitchNode;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingNeedle = true;
      updateNeedleFromCoords(e.clientX, e.clientY);
      addManualStitchNode(targetNeedlePos);
    };

    const onMouseMove = (e: MouseEvent) => {
      updateNeedleFromCoords(e.clientX, e.clientY);
      if (isDraggingNeedle) {
        addManualStitchNode(targetNeedlePos);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        isDraggingNeedle = true;
        updateNeedleFromCoords(e.touches[0].clientX, e.touches[0].clientY);
        addManualStitchNode(targetNeedlePos);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        updateNeedleFromCoords(e.touches[0].clientX, e.touches[0].clientY);
        if (isDraggingNeedle) {
          addManualStitchNode(targetNeedlePos);
        }
      }
    };

    const onEnd = () => {
      isDraggingNeedle = false;
      setNeedleState("Ready");
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onEnd);

    // 10. CNC AUTO-EMBROIDERY PROGRAM PLAYER
    let activeProgramPoints: THREE.Vector3[] = [];
    let currentSegmentIndex = 0;
    let interpolationTick = 0;

    triggerAutoProgramRef.current = (points: THREE.Vector3[]) => {
      stitchPoints = []; // reset
      activeProgramPoints = points;
      currentSegmentIndex = 1;
      interpolationTick = 0;
      setIsSewing(true);
      setNeedleState("CNC Active");
    };

    clearStitchesRef.current = () => {
      stitchPoints = [];
      rebuildStitchMeshes();
      setStitchCount(0);
      setTotalYards(0);
      setNeedleState("Cleared");
    };

    // 11. ANIMATION TICK LOOP
    let animationId: number;
    let reciprocationSine = 0;

    const tick = () => {
      animationId = requestAnimationFrame(tick);

      // Live fiber color update
      currentYarnColor.set(activeColor.hex);
      yarnMat.color.set(activeColor.hex);

      // Handle Automated CNC Program movement if active
      if (isSewing && activeProgramPoints.length > 1) {
        const startNode = activeProgramPoints[currentSegmentIndex - 1];
        const endNode = activeProgramPoints[currentSegmentIndex];

        // speed calculation
        const stepResolution = Math.max(8, Math.floor(1200 / speedPPM));
        interpolationTick += 1 / stepResolution;

        if (interpolationTick >= 1.0) {
          interpolationTick = 0;
          
          // Punch complete of node segment!
          const exactNodePt = endNode.clone();
          addManualStitchNode(exactNodePt);

          currentSegmentIndex++;
          if (currentSegmentIndex >= activeProgramPoints.length) {
            // Program completed successfully!
            setIsSewing(false);
            setAutoProgram(null);
            setNeedleState("Program Finished");
          }
        } else {
          // Travel between nodes smoothly
          targetNeedlePos.lerpVectors(startNode, endNode, interpolationTick);
        }
      }

      // Smooth coordinate damping of needle assembly position
      needleGroup.position.x += (targetNeedlePos.x - needleGroup.position.x) * 0.25;
      needleGroup.position.y += (targetNeedlePos.y - needleGroup.position.y) * 0.25;

      // Reciprocating Up-and-Down stitching vertical pulse
      reciprocationSine += (isSewing || isDraggingNeedle ? (speedPPM / 120) : 0.05);
      const verticalPulse = Math.sin(reciprocationSine) * 0.09;
      needleGroup.position.z = 0.16 + verticalPulse;

      // Rotate camera layout slightly to feel 3D on hover
      camera.position.x += (targetNeedlePos.x * 0.15 - camera.position.x) * 0.05;
      camera.position.y += (targetNeedlePos.y * 0.15 - camera.position.y) * 0.05;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Update particle physics spark trajectory
      const posArr = sparkSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        if (sparkMat.opacity > 0) {
          posArr[i * 3] += sparkVelocities[i * 3];
          posArr[i * 3 + 1] += sparkVelocities[i * 3 + 1];
          posArr[i * 3 + 2] += sparkVelocities[i * 3 + 2];
          // Gravity pull
          sparkVelocities[i * 3 + 2] -= 0.001; 
        }
      }
      sparkSystem.geometry.attributes.position.needsUpdate = true;

      if (sparkMat.opacity > 0) {
        sparkMat.opacity -= 0.038; 
      }

      renderer.render(scene, camera);
    };

    tick();

    // 12. RESPONSIVENESS LISTENER
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onEnd);

      weaveBump?.dispose();
      plateGeom.dispose();
      plateMat.dispose();
      frameGeom.dispose();
      frameMat.dispose();
      needleRodGeom.dispose();
      needleEyeGeom.dispose();
      metalMat.dispose();
      yarnGeom.dispose();
      yarnMat.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeColor, speedPPM]);

  // Execute pre-programmed vector drawing on 3D loom canvas
  const handleRunProgram = (progName: string, points: THREE.Vector3[]) => {
    setAutoProgram(progName);
    if (triggerAutoProgramRef.current) {
      triggerAutoProgramRef.current(points);
    }
  };

  return (
    <section id="stitch-studio" className="relative bg-transparent py-24 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
      <div className="absolute inset-0 grid-overlay opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Head Intro Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 lg:mb-20">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.5em] mb-4 text-[#d4af37] font-mono flex items-center gap-2 font-bold">
              <CircleDot className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
              Embroidery Laboratory Precision
            </span>
            <h3 className="font-sans text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase leading-[1.1]">
              3D PRECISION <br/>
              <span className="italic font-serif font-light text-zinc-350 tracking-wide normal-case text-3xl lg:text-4xl">Stitching Studio.</span>
            </h3>
            <p className="font-sans font-light text-zinc-300 text-sm leading-relaxed max-w-2xl">
              Interact with our custom manufacturing embroidery system. Select a heavy-tension linen thread, drag or paint onto our golden-framed 3D canvas hoop, or run computer-controlled CNC programs watch stitch lockwork built node-by-node.
            </p>
          </div>

          {/* Stats Read-out Display box */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 bg-[#151619]/45 backdrop-blur-3xl border border-white/[0.08] p-6 relative rounded-3xl">
            <div className="absolute top-0 right-0 p-2.5 font-mono text-[8px] text-zinc-500 select-none">SYSTEM STATUS</div>
            <div className="space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Stitch Count</p>
              <h5 className="font-sans font-bold text-3xl text-white tracking-tight">{stitchCount}</h5>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#d4af37]">
                <Cpu className="w-3.5 h-3.5" />
                <span>14 SPI Target</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">Thread Consumed</p>
              <h5 className="font-sans font-bold text-3xl text-white tracking-tight">{totalYards} <span className="text-sm font-medium text-zinc-400">Yards</span></h5>
              <p className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest">{activeColor.name}</p>
            </div>
          </div>
        </div>

        {/* Studio Layout Canvas & Controls Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* WebGL Canvas block (col-span-8) */}
          <div className="lg:col-span-8 bg-[#151619]/45 backdrop-blur-3xl border border-white/[0.08] p-4 shrink-0 flex flex-col justify-between relative overflow-hidden min-h-[420px] lg:min-h-[500px] rounded-3xl shadow-xl">
            <div className="flex items-center justify-between select-none relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#d4af37] rounded-none animate-ping" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Embroidery Needle Workspace Camera</span>
              </div>
              <div className="font-mono text-[9px] bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1 text-zinc-300 capitalize">
                Needle: <span className="text-white font-bold">{needleState}</span>
              </div>
            </div>

            {/* Canvas Mount Container */}
            <div 
              ref={containerRef} 
              className="flex-1 w-full relative z-10 cursor-crosshair px-2 py-4"
            />

            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 text-[9px] font-mono text-zinc-400 relative z-10 select-none">
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3 h-3 text-zinc-500" />
                Drag / Hover to guide silver needle. Click to stitch your design.
              </span>
              <span>Loom Coordinates: Real-time</span>
            </div>
          </div>

          {/* Interactive settings sidebar controls panel (col-span-4) */}
          <div className="lg:col-span-4 bg-[#151619]/45 backdrop-blur-3xl border border-white/[0.08] p-6 flex flex-col justify-between space-y-8 rounded-3xl shadow-xl">
            <div className="space-y-6">
              
              {/* Spool thread colorway selectors */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">01 / Choose embroidery spool thread</span>
                <div className="grid grid-cols-5 gap-2">
                  {STITCH_COLORS.map((col) => {
                    const isSelected = col.name === activeColor.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => {
                          setActiveColor(col);
                          setIsSewing(false); // interrupt programs on color shift
                        }}
                        className="aspect-square border p-1 rounded-none flex items-center justify-center transition-all cursor-pointer relative group"
                        style={{ borderColor: isSelected ? "#ffffff" : "rgba(255,255,255,0.08)" }}
                        title={col.name}
                      >
                        {/* Spool mockup circle inside */}
                        <span className="w-full h-full rounded-full border border-white/10 relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: col.hex }}>
                          {/* spool pattern thread lines */}
                          <span className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-black/20" />
                          <span className="w-1.5 h-1.5 bg-yellow-900/50 rounded-full border border-white/20" />
                        </span>
                        {/* Tooltip */}
                        <span className="absolute bottom-[115%] left-1/2 -translate-x-1/2 bg-zinc-950 text-white font-mono text-[8px] tracking-wide px-2 py-1 border border-zinc-800 pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                          {col.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed capitalize">{activeColor.desc}</p>
              </div>

              {/* Sewing sliders tweaks */}
              <div className="space-y-4 pt-2">
                <span className="font-mono text-[10px] text-zinc-550 uppercase tracking-widest block font-bold">02 / Stitch Tension & Tuning Controls</span>
                
                {/* Speed Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[9px] text-zinc-400">
                    <span>SEWING SPEED (PPM)</span>
                    <span className="text-white font-bold">{speedPPM} PPM</span>
                  </div>
                  <input 
                    type="range"
                    min="300"
                    max="1100"
                    step="50"
                    value={speedPPM}
                    onChange={(e) => setSpeedPPM(parseInt(e.target.value))}
                    className="w-full accent-white h-1 bg-zinc-800 rounded-none cursor-pointer"
                  />
                  <p className="text-[8px] font-mono text-zinc-650">Matches computer needle movement step rates.</p>
                </div>

                {/* Density preset read only info */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  <div className="flex justify-between font-mono text-[9px] text-zinc-400">
                    <span>STITCH DENSITY (SPI)</span>
                    <span className="text-[#d4af37] font-bold">{densitySPI} SPI</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[10, 12, 14, 16].map((spi) => (
                      <button
                        key={spi}
                        onClick={() => setDensitySPI(spi)}
                        className={`flex-1 py-1 font-mono text-[9px] text-center border-zinc-800 border cursor-pointer hover:bg-zinc-900 transition ${
                          densitySPI === spi ? "bg-[#d4af37]/15 border-[#d4af37] text-white" : "text-zinc-500"
                        }`}
                      >
                        {spi} SPI
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Robotic Programs */}
              <div className="space-y-3 pt-2 border-t border-zinc-900">
                <span className="font-mono text-[10px] text-zinc-550 uppercase tracking-widest block font-bold">03 / Run Computer Automation Programs</span>
                <div className="space-y-2">
                  {PRESETS.map((p) => {
                    const isProgramActive = autoProgram === p.name;
                    return (
                      <button
                        key={p.name}
                        onClick={() => handleRunProgram(p.name, p.points)}
                        disabled={isSewing}
                        className={`w-full text-left p-3 border rounded-none flex items-center justify-between text-xs transition duration-200 cursor-pointer ${
                          isProgramActive 
                            ? "bg-[#d4af37]/10 border-[#d4af37] text-white"
                            : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:border-zinc-800 hover:text-white disabled:opacity-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Cpu className={`w-3.5 h-3.5 ${isProgramActive ? "text-[#d4af37]" : "text-zinc-500"}`} />
                          <span className="font-sans font-semibold text-zinc-300">{p.name}</span>
                        </div>
                        {isProgramActive ? (
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        ) : (
                          <Play className="w-3 h-3 text-zinc-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Clear Board Canvas action */}
            <div className="pt-4 border-t border-zinc-900">
              <button
                onClick={() => {
                  if (clearStitchesRef.current) {
                    clearStitchesRef.current();
                  }
                  setIsSewing(false);
                  setAutoProgram(null);
                }}
                className="w-full py-3 bg-zinc-950 border border-zinc-900 hover:border-red-900/40 hover:bg-red-950/10 text-zinc-400 hover:text-red-400 transition font-mono text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Re-set Embroidery Hoop</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
