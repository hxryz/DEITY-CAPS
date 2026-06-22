import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function ThreeCanvasBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111215, 0.04);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 4. Custom Waving Thread Matrix Geometries (Brand Embroidery representation)
    const pointsCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const originalPositions: number[] = [];
    const colors = new Float32Array(pointsCount * 3);

    // Gold/Amber luxury color tones
    const goldColor = new THREE.Color("#c5a880");
    const charcoalColor = new THREE.Color("#4b5563");

    for (let i = 0; i < pointsCount; i++) {
      // Create grid-like waves of thread connections
      const x = (Math.random() - 0.5) * 45;
      const y = (Math.random() - 0.5) * 28;
      const z = (Math.random() - 0.5) * 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push(x, y, z);

      // Gradient from gold to soft charcoal gray
      const mixRatio = Math.random();
      const mixedColor = goldColor.clone().lerp(charcoalColor, mixRatio);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circular texture for pristine dots
    const createCircleTexture = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0)";
        ctx.fillRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      }
      return new THREE.CanvasTexture(canvas);
    };

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: createCircleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starPoints = new THREE.Points(geometry, pointMaterial);
    scene.add(starPoints);

    // 5. Connect Constellation Threads (Lines)
    const lineIndices: number[] = [];
    const maxDistance = 6.8;

    for (let i = 0; i < pointsCount; i++) {
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      // Find nearby points to draw stitching connections
      let connections = 0;
      for (let j = i + 1; j < pointsCount; j++) {
        if (connections >= 2) break; // Limit lines density
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];

        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < maxDistance) {
          lineIndices.push(i, j);
          connections++;
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    lineGeometry.setIndex(lineIndices);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });

    const threadLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(threadLines);

    // 6. Interactive Cursor Movement & Scroll Parallax with GSAP
    const cursor = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      cursor.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      cursor.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Scroll parallax dynamic coordinates
    let scrollProgress = 0;
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        scrollProgress = window.scrollY / maxScroll;
      }
    };
    window.addEventListener("scroll", onScroll);

    // 7. Render Loop
    let clock = new THREE.Clock();
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic waving motion imitating fabric mesh / loom thread stress
      const posAttr = geometry.getAttribute("position");
      for (let i = 0; i < pointsCount; i++) {
        const x = originalPositions[i * 3];
        const y = originalPositions[i * 3 + 1];
        const z = originalPositions[i * 3 + 2];

        // Complex sine wave overlay
        const waveX = Math.sin(elapsedTime * 0.45 + x * 0.1) * 0.6;
        const waveY = Math.cos(elapsedTime * 0.5 + y * 0.12) * 0.6;
        const waveZ = Math.sin(elapsedTime * 0.35 + z * 0.08) * 0.8;

        posAttr.setX(i, x + waveX);
        posAttr.setY(i, y + waveY);
        posAttr.setZ(i, z + waveZ);
      }
      posAttr.needsUpdate = true;
      lineGeometry.getAttribute("position").needsUpdate = true;

      // Smooth camera interpolation toward cursor targets (damped inertia)
      cursor.x += (cursor.targetX - cursor.x) * 0.05;
      cursor.y += (cursor.targetY - cursor.y) * 0.05;

      camera.position.x = cursor.x * 2.8;
      camera.position.y = cursor.y * 2.8;

      // Scroll changes camera height/depth subtly
      camera.position.z = 18 - scrollProgress * 5;
      camera.rotation.y = cursor.x * 0.06;
      camera.rotation.x = -cursor.y * 0.06 + scrollProgress * 0.25;

      // Slow orbital rotate
      starPoints.rotation.y = elapsedTime * 0.015;
      threadLines.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    tick();

    // 8. Window Resize Handler
    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      lineGeometry.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden bg-transparent"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
