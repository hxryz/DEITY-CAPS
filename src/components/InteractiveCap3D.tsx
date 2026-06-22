import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { 
  RotateCcw, 
  RotateCw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Sun, 
  Moon, 
  Flame 
} from "lucide-react";

interface InteractiveCap3DProps {
  style?: "snapback" | "dad" | "runner";
  crownColor?: string;
  visorColor?: string;
  fabric?: "wool" | "tech" | "canvas";
  visorContrastStitch?: boolean;
  autoRotate?: boolean;
}

export default function InteractiveCap3D({
  style = "snapback",
  crownColor = "#0f0f11",
  visorColor = "#0f0f11",
  fabric = "wool",
  visorContrastStitch = false,
  autoRotate = false,
}: InteractiveCap3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Interactive control states
  const [loading, setLoading] = useState(true);
  const [localAutoRotate, setLocalAutoRotate] = useState(autoRotate);
  const [wireframe, setWireframe] = useState(false);
  const [lightMode, setLightMode] = useState<"studio" | "neon" | "sunset">("studio");
  const [currentRotAngle, setCurrentRotAngle] = useState("");

  // Handler refs to pass to the outside frame drag system
  const resetCameraRef = useRef<(() => void) | null>(null);

  // Sync state if props change initially
  useEffect(() => {
    setLocalAutoRotate(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();

    // 2. CAMERA SETUP - Fine tuned centered view position
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.65, 4.2);
    camera.lookAt(new THREE.Vector3(0, 0.15, 0.2));

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. GENERATING PROCEDURAL FABRIC TEXTURES (WOOL BUMP & RIPSTOP DESIGN)
    const createFabricTexture = (type: "wool" | "tech" | "canvas") => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      if (type === "wool") {
        for (let i = 0; i < 4000; i++) {
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = Math.random() * 0.8 + 0.3;
          ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === "tech") {
        ctx.strokeStyle = "rgba(0,0,0,0.18)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i <= size; i += 16) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i, size);
          ctx.moveTo(0, i);
          ctx.lineTo(size, i);
        }
        ctx.stroke();

        for (let x = 8; x < size; x += 16) {
          for (let y = 8; y < size; y += 16) {
            ctx.fillStyle = "rgba(0,0,0,0.08)";
            ctx.fillRect(x - 2, y - 2, 4, 4);
          }
        }
      } else {
        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = -size; i < size; i += 4) {
          ctx.moveTo(i, 0);
          ctx.lineTo(i + size, size);
        }
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(8, 8);
      return texture;
    };

    const woolBump = createFabricTexture("wool");
    const techBump = createFabricTexture("tech");
    const canvasBump = createFabricTexture("canvas");

    // 5. GROUP CONTAINER FOR CAP & ACCESSORIES
    const capGroup = new THREE.Group();
    scene.add(capGroup);

    // 6. CREATING CAP PARTS
    const crownGeom = new THREE.SphereGeometry(
      1.15, 
      36,   
      32,   
      0,    
      Math.PI * 2, 
      0,    
      Math.PI / 2 
    );
    crownGeom.scale(1, 0.95, 1.14);

    const getBumpMap = (f: "wool" | "tech" | "canvas") => {
      if (f === "tech") return techBump;
      if (f === "canvas") return canvasBump;
      return woolBump;
    };

    const getRoughness = (f: "wool" | "tech" | "canvas") => {
      if (f === "tech") return 0.7;
      if (f === "canvas") return 0.85;
      return 0.95;
    };

    const crownMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(crownColor),
      roughness: getRoughness(fabric),
      metalness: fabric === "tech" ? 0.05 : 0.01,
      bumpMap: getBumpMap(fabric),
      bumpScale: fabric === "tech" ? 0.05 : 0.02,
      side: THREE.DoubleSide,
      wireframe: wireframe,
    });

    const crownMesh = new THREE.Mesh(crownGeom, crownMaterial);
    crownMesh.position.y = -0.15;
    crownMesh.castShadow = true;
    crownMesh.receiveShadow = true;
    capGroup.add(crownMesh);

    // B. Sew seams wires for high detailed feel (Hide during wireframe to keep it clean)
    const seamsGroup = new THREE.Group();
    if (!wireframe) {
      const seamCount = 6;
      for (let i = 0; i < seamCount; i++) {
        const angle = (i * Math.PI) / 3;
        const points = [];
        for (let theta = 0; theta <= Math.PI / 2; theta += 0.05) {
          const rHeight = 1.15;
          const x = rHeight * Math.sin(theta) * Math.cos(angle);
          const y = rHeight * Math.cos(theta) * 0.95 - 0.15;
          const z = rHeight * Math.sin(theta) * Math.sin(angle) * 1.14;
          points.push(new THREE.Vector3(x, y + 0.005, z));
        }
        const seamGeom = new THREE.BufferGeometry().setFromPoints(points);
        const seamMat = new THREE.LineBasicMaterial({
          color: visorContrastStitch ? 0xd4af37 : 0x444444,
          linewidth: 1,
          transparent: true,
          opacity: 0.35,
        });
        const seamLine = new THREE.Line(seamGeom, seamMat);
        seamsGroup.add(seamLine);
      }
      capGroup.add(seamsGroup);
    }

    // C. Top button
    const buttonGeom = new THREE.SphereGeometry(0.1, 16, 12);
    buttonGeom.scale(1, 0.6, 1);
    const buttonMesh = new THREE.Mesh(buttonGeom, crownMaterial);
    buttonMesh.position.set(0, 0.95, 0);
    buttonMesh.castShadow = true;
    capGroup.add(buttonMesh);

    // D. Metal Eyelets
    const eyeletsGroup = new THREE.Group();
    let eyeletGeom: THREE.TorusGeometry | undefined;
    if (!wireframe) {
      eyeletGeom = new THREE.TorusGeometry(0.04, 0.015, 6, 16);
      const eyeletMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.3,
        metalness: 0.85,
      });

      const eyeletPositions = [
        new THREE.Vector3(0.55, 0.55, 0.55),
        new THREE.Vector3(-0.55, 0.55, 0.55),
        new THREE.Vector3(0.65, 0.5, -0.4),
        new THREE.Vector3(-0.65, 0.5, -0.4),
      ];

      eyeletPositions.forEach((pos) => {
        const mesh = new THREE.Mesh(eyeletGeom!, eyeletMat);
        mesh.position.copy(pos);
        const targetLook = new THREE.Vector3(pos.x, pos.y + 0.1, pos.z);
        mesh.lookAt(targetLook);
        eyeletsGroup.add(mesh);
      });
      capGroup.add(eyeletsGroup);
    }

    // E. Visor / Bill (Bent customized plate)
    const visorWidth = style === "runner" ? 1.9 : 2.15;
    const visorLength = style === "runner" ? 1.4 : 1.55;
    const visorGeom = new THREE.PlaneGeometry(visorWidth, visorLength, 24, 24);
    
    const posAttr = visorGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);

      let bendFactor = 0.0;
      if (style === "dad") {
        bendFactor = -0.22;
      } else if (style === "runner") {
        bendFactor = -0.16;
      } else {
        bendFactor = -0.05;
      }

      const curveZ = bendFactor * Math.sin((x / (visorWidth / 2)) * (Math.PI / 2)) * Math.sin((x / (visorWidth / 2)) * (Math.PI / 2));
      const frontEdge = -0.15 * (y + visorLength / 2);

      posAttr.setZ(i, curveZ + frontEdge);
    }
    visorGeom.computeVertexNormals();

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(visorColor),
      roughness: getRoughness(fabric),
      metalness: fabric === "tech" ? 0.05 : 0.01,
      bumpMap: getBumpMap(fabric),
      bumpScale: fabric === "tech" ? 0.05 : 0.02,
      side: THREE.DoubleSide,
      wireframe: wireframe,
    });

    const visorMesh = new THREE.Mesh(visorGeom, visorMaterial);
    visorMesh.rotation.x = -Math.PI / 2.1; 
    visorMesh.position.set(0, -0.17, 1.25);
    visorMesh.castShadow = true;
    visorMesh.receiveShadow = true;
    capGroup.add(visorMesh);

    // F. Visor stitch lining visualization
    if (!wireframe) {
      const visorStitchMat = new THREE.LineBasicMaterial({
        color: visorContrastStitch ? 0xd4af37 : 0x555555,
        linewidth: 1.5,
        transparent: true,
        opacity: 0.7,
      });

      const createStitchArc = (frontOff: number, sideWidth: number) => {
        const pts = [];
        for (let ratio = -1; ratio <= 1; ratio += 0.08) {
          const x = ratio * (visorWidth / 2 * sideWidth);
          const y = 0.3 - Math.pow(ratio, 2) * 0.15 + frontOff;
          
          let curveZ = -0.05;
          if (style === "dad") curveZ = -0.22;
          else if (style === "runner") curveZ = -0.16;

          const calculatedCurveZ = curveZ * Math.sin((x / (visorWidth / 2)) * (Math.PI / 2)) * Math.sin((x / (visorWidth / 2)) * (Math.PI / 2));
          const finalZ = calculatedCurveZ - 0.14 * (y + visorLength / 2);

          pts.push(new THREE.Vector3(x, -0.162, 1.25 + (y * 0.7) + finalZ * 0.4));
        }
        const stGeom = new THREE.BufferGeometry().setFromPoints(pts);
        return new THREE.Line(stGeom, visorStitchMat);
      };

      capGroup.add(createStitchArc(0.15, 0.88));
      capGroup.add(createStitchArc(0.32, 0.78));
    }

    // G. Calfskin Strap Adjustment buckle at the back
    const strapGeom = new THREE.TorusGeometry(0.40, 0.038, 8, 24, Math.PI);
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x3d271e, 
      roughness: 0.6,
      metalness: 0.1,
      wireframe: wireframe,
    });
    const strap = new THREE.Mesh(strapGeom, strapMat);
    strap.position.set(0, -0.18, -1.02);
    strap.rotation.x = Math.PI / 10;
    strap.rotation.y = Math.PI;
    capGroup.add(strap);

    // H. Metal Clasp Adjuster Buckle
    const claspGeom = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    const claspMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, 
      roughness: 0.25,
      metalness: 0.9,
      wireframe: wireframe,
    });
    const clasp = new THREE.Mesh(claspGeom, claspMat);
    clasp.position.set(0.16, -0.22, -1.08);
    capGroup.add(clasp);

    // I. Rotating Metallic Glass Exhibition Pedestal Base
    const pedestalGroup = new THREE.Group();
    if (!wireframe) {
      const pedestalGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 48);
      const pedestalMaterial = new THREE.MeshStandardMaterial({
        color: 0x070709,
        roughness: 0.15,
        metalness: 0.95,
        transparent: true,
        opacity: 0.82,
      });
      const pedestal = new THREE.Mesh(pedestalGeom, pedestalMaterial);
      pedestal.position.y = -0.42;
      pedestal.receiveShadow = true;
      pedestalGroup.add(pedestal);

      const rimGeom = new THREE.TorusGeometry(1.65, 0.02, 10, 60);
      const rimMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4af37, 
        roughness: 0.15,
        metalness: 0.98,
      });
      const pedestalRim = new THREE.Mesh(rimGeom, rimMaterial);
      pedestalRim.rotation.x = Math.PI / 2;
      pedestalRim.position.y = -0.38;
      pedestalGroup.add(pedestalRim);
      capGroup.add(pedestalGroup);
    }

    // J. 3D GLOWING PARTICLE ATOMS FIELD (Slow-drifting studio ambiance)
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 5.5; 
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4 + 0.3; 
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5.5; 
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: lightMode === "neon" ? 0xcc55ff : lightMode === "sunset" ? 0xffcc33 : 0xffffff,
      size: 0.042,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMaterial);
    scene.add(particles);

    // 7. LIGHTING ENGINE
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);

    // Baseline general filled base
    const ambientLight = new THREE.AmbientLight(0xffffff, lightMode === "sunset" ? 0.35 : 0.45);
    lightsGroup.add(ambientLight);

    if (lightMode === "studio") {
      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.45);
      dirLight1.position.set(5, 7, 4);
      dirLight1.castShadow = true;
      dirLight1.shadow.mapSize.width = 1024;
      dirLight1.shadow.mapSize.height = 1024;
      lightsGroup.add(dirLight1);

      const rimLight = new THREE.DirectionalLight(0xadd8e6, 0.8);
      rimLight.position.set(-5, 3, -4);
      lightsGroup.add(rimLight);

      const bounceLight = new THREE.PointLight(0xffdf9a, 0.6, 7);
      bounceLight.position.set(0, -0.8, 1.5);
      lightsGroup.add(bounceLight);
    } 
    else if (lightMode === "neon") {
      const indigoLight = new THREE.DirectionalLight(0x4f46e5, 1.8);
      indigoLight.position.set(6, 4, 3);
      lightsGroup.add(indigoLight);

      const magentaLight = new THREE.DirectionalLight(0xec4899, 1.6);
      magentaLight.position.set(-6, 3, -3);
      lightsGroup.add(magentaLight);

      const turquoiseLight = new THREE.PointLight(0x06b6d4, 1.5, 6);
      turquoiseLight.position.set(0, -0.5, 1.2);
      lightsGroup.add(turquoiseLight);
    } 
    else {
      // Sunset warm profile
      const goldKey = new THREE.DirectionalLight(0xf59e0b, 1.8);
      goldKey.position.set(5, 5, 4);
      lightsGroup.add(goldKey);

      const scarletRim = new THREE.DirectionalLight(0xef4444, 1.1);
      scarletRim.position.set(-5, 2, -4);
      lightsGroup.add(scarletRim);

      const warmTungsten = new THREE.PointLight(0xff7722, 1.2, 8);
      warmTungsten.position.set(0, -0.9, 1.4);
      lightsGroup.add(warmTungsten);
    }

    setLoading(false);

    // 8. INTERACTIVE ROTATION DRAG ENGINE
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotX = 0.12; 
    let rotY = -Math.PI / 6; 
    let targetRotX = rotX;
    let targetRotY = rotY;

    // Center camera reset trigger
    resetCameraRef.current = () => {
      targetRotX = 0.12;
      targetRotY = -Math.PI / 6;
    };

    const handleStart = (clientX: number, clientY: number) => {
      isDragging = true;
      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const deltaX = clientX - previousMouseX;
        const deltaY = clientY - previousMouseY;

        targetRotY += deltaX * 0.0075;
        targetRotX += deltaY * 0.0075;

        targetRotX = Math.max(-0.4, Math.min(1.0, targetRotX));

        previousMouseX = clientX;
        previousMouseY = clientY;
      }
    };

    const handleEnd = () => {
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onMouseLeave = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", handleEnd);
    container.addEventListener("mouseleave", onMouseLeave);

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", handleEnd);

    // 9. ANIMATION LOOP
    let reqFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqFrameId = requestAnimationFrame(animate);

      // Damp rotation coordinates
      rotY += (targetRotY - rotY) * 0.12;
      rotX += (targetRotX - rotX) * 0.12;

      capGroup.rotation.y = rotY;
      capGroup.rotation.x = rotX;

      // Local auto rotation
      if (!isDragging) {
        if (localAutoRotate) {
          const dt = clock.getElapsedTime();
          targetRotY += 0.0042; // slightly faster drift for active presentation
          capGroup.position.y = Math.sin(dt * 1.3) * 0.045;
        } else {
          capGroup.position.y += (0 - capGroup.position.y) * 0.12;
        }
      } else {
        capGroup.position.y += (0 - capGroup.position.y) * 0.12;
      }

      // Live update rotation coordinates indicator read-out
      const normalizedAngle = (Math.abs(Math.round((rotY * 180) / Math.PI)) % 360).toString();
      setCurrentRotAngle(normalizedAngle + "°");

      // Slow drift update on particles
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] -= 0.003; 
        if (pos[i * 3 + 1] < -1.3) pos[i * 3 + 1] = 2.0; 
        pos[i * 3] += Math.sin(reqFrameId * 0.005 + i) * 0.0006;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 10. RE-SIZE LISTENER
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // CLEAN-UP EXECUTOR
    return () => {
      cancelAnimationFrame(reqFrameId);
      resizeObserver.disconnect();
      
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", handleEnd);

      woolBump?.dispose();
      techBump?.dispose();
      canvasBump?.dispose();
      crownGeom.dispose();
      crownMaterial.dispose();
      buttonGeom.dispose();
      eyeletGeom?.dispose();
      visorGeom.dispose();
      visorMaterial.dispose();
      strapGeom.dispose();
      strapMat.dispose();
      claspGeom.dispose();
      claspMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [style, crownColor, visorColor, fabric, visorContrastStitch, localAutoRotate, wireframe, lightMode]);

  return (
    <div className="relative w-full h-full min-h-[inherit] flex flex-col items-stretch justify-between">
      
      {/* 3D Viewport itself, perfectly centered */}
      <div className="relative flex-1 items-center justify-center w-full h-full min-h-[inherit]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#070707]/10 backdrop-blur-sm z-30 transition-all">
            <div className="flex flex-col items-center gap-3">
              <span className="w-5 h-5 border-2 border-t-transparent border-zinc-200 rounded-full animate-spin" />
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">Assembling 3D Model...</span>
            </div>
          </div>
        )}
        <div 
          ref={mountRef} 
          className="w-full h-full min-h-[inherit] cursor-grab active:cursor-grabbing select-none"
        />
      </div>

      {/* FLOATING RICH INTERACTIVE CONTROL OVERLAYS */}
      <div className="absolute bottom-5 inset-x-0 mx-auto w-fit max-w-[95%] bg-black/90 border border-zinc-850 p-2 flex items-center gap-2 relative z-30 backdrop-blur-md shadow-2xl flex-wrap justify-center">
        
        {/* Pitch Reading */}
        <div className="px-2.5 py-1.5 bg-zinc-950/80 border border-zinc-900 font-mono text-[9px] text-zinc-400 tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>ROT:</span>
          <span className="text-white font-bold">{currentRotAngle}</span>
        </div>

        <div className="w-px h-5 bg-zinc-850 self-stretch hidden sm:block" />

        {/* Local auto rotational controller */}
        <button
          type="button"
          onClick={() => setLocalAutoRotate(!localAutoRotate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition duration-200 cursor-pointer ${
            localAutoRotate
              ? "bg-zinc-100 text-black border-white font-extrabold"
              : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:text-white"
          }`}
          title={localAutoRotate ? "Stop Automatic Spin" : "Automatic Rotation"}
        >
          <RotateCw className={`w-3.5 h-3.5 ${localAutoRotate ? "animate-spin" : ""}`} />
          <span>{localAutoRotate ? "DRIFT: ON" : "DRIFT: OFF"}</span>
        </button>

        {/* Wireframe toggler */}
        <button
          type="button"
          onClick={() => setWireframe(!wireframe)}
          className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest border transition duration-200 cursor-pointer ${
            wireframe
              ? "bg-zinc-100 text-black border-white font-extrabold"
              : "bg-zinc-950 text-zinc-400 border-zinc-850 hover:text-white"
          }`}
          title="Toggle wireframe topology design"
        >
          {wireframe ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{wireframe ? "SEWING GRID: ON" : "SEWING GRID: OFF"}</span>
        </button>

        {/* Custom studio light cycler */}
        <button
          type="button"
          onClick={() => {
            const sequence: ("studio" | "neon" | "sunset")[] = ["studio", "neon", "sunset"];
            const nextIdx = (sequence.indexOf(lightMode) + 1) % sequence.length;
            setLightMode(sequence[nextIdx]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 border border-zinc-850 font-mono text-[9px] text-zinc-400 uppercase tracking-widest hover:text-white transition duration-200 cursor-pointer"
          title={`Cycle environmental studio light setups (Current: ${lightMode})`}
        >
          {lightMode === "studio" ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : lightMode === "neon" ? (
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          ) : (
            <Flame className="w-3.5 h-3.5 text-red-500" />
          )}
          <span>LIGHTS: {lightMode}</span>
        </button>

        <div className="w-px h-5 bg-zinc-850 self-stretch hidden sm:block" />

        {/* Preset Angle Resetter */}
        <button
          type="button"
          onClick={() => {
            if (resetCameraRef.current) resetCameraRef.current();
          }}
          className="p-1.5 bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
          title="Reset Viewpoint"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
}
