import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GsapAmbientGraphics({ intensity = 'normal' }) {
  const containerRef = useRef(null);
  const leftLanternRef = useRef(null);
  const rightLanternRef = useRef(null);
  const centerMandalaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Swaying hanging brass lanterns
      if (leftLanternRef.current) {
        gsap.to(leftLanternRef.current, {
          rotation: 4.5,
          duration: 3.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 0%',
        });
      }
      if (rightLanternRef.current) {
        gsap.to(rightLanternRef.current, {
          rotation: -4.5,
          duration: 4.4,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 0%',
        });
      }

      // Glowing lantern bulbs pulse
      gsap.to('.lantern-glow', {
        opacity: 0.95,
        scale: 1.18,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.6,
        transformOrigin: '50% 50%',
      });

      // Slow rotating geometric Islamic star mandala
      if (centerMandalaRef.current) {
        gsap.to(centerMandalaRef.current, {
          rotation: 360,
          duration: 90,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
      }

      // Floating golden petals & firefly motes
      const particles = gsap.utils.toArray('.gsap-petal-particle');
      particles.forEach((p, i) => {
        const startX = (i * 137.5) % 100;
        const startY = (i * 73) % 100;
        gsap.set(p, {
          left: `${startX}%`,
          top: `${startY}%`,
          scale: gsap.utils.random(0.5, 1.35),
          opacity: gsap.utils.random(0.25, 0.75),
        });

        gsap.to(p, {
          y: gsap.utils.random(-140, 140),
          x: gsap.utils.random(-90, 90),
          rotation: gsap.utils.random(-220, 220),
          opacity: gsap.utils.random(0.15, 0.85),
          duration: gsap.utils.random(7, 15),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: (i % 5) * 0.4,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [intensity]);

  const particleCount = intensity === 'high' ? 28 : 20;

  return (
    <div ref={containerRef} className="ambient-graphics-layer" aria-hidden="true">
      {/* Rotating Geometric Islamic Mandala Watermark */}
      <svg
        ref={centerMandalaRef}
        className="ambient-mandala-svg"
        viewBox="0 0 600 600"
        fill="none"
      >
        <g stroke="url(#goldGrad)" strokeWidth="0.9" opacity="0.22">
          {Array.from({ length: 12 }).map((_, idx) => (
            <g key={idx} transform={`rotate(${idx * 30} 300 300)`}>
              <rect
                x="150"
                y="150"
                width="300"
                height="300"
                rx="18"
              />
              <path d="M300 40 L345 160 L300 280 L255 160 Z" />
              <circle cx="300" cy="95" r="14" />
            </g>
          ))}
          <circle cx="300" cy="300" r="245" strokeDasharray="6 8" />
          <circle cx="300" cy="300" r="190" />
          <circle cx="300" cy="300" r="110" strokeDasharray="4 4" />
        </g>
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="600" y2="600">
            <stop offset="0%" stopColor="#F5D77F" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
        </defs>
      </svg>

      {/* Left Hanging Ornate Fanoos Lantern */}
      <div ref={leftLanternRef} className="hanging-lantern lantern-left">
        <svg viewBox="0 0 120 340" width="95" height="270" fill="none">
          {/* Chain */}
          <line x1="60" y1="0" x2="60" y2="95" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="60" cy="95" r="6" fill="#D4AF37" />
          {/* Dome */}
          <path
            d="M35 125 C35 100, 85 100, 85 125 Z"
            fill="url(#lanternBrass)"
            stroke="#FFE599"
            strokeWidth="1.2"
          />
          {/* Filigree Crown */}
          <path d="M28 125 L92 125 L84 138 L36 138 Z" fill="#9E7223" stroke="#F5D77F" strokeWidth="1" />
          {/* Glow Halo */}
          <circle className="lantern-glow" cx="60" cy="182" r="46" fill="url(#warmLanternGlow)" opacity="0.65" />
          {/* Lantern Body */}
          <path
            d="M36 138 L24 182 L38 232 L82 232 L96 182 L84 138 Z"
            fill="rgba(255, 224, 130, 0.16)"
            stroke="#F5D77F"
            strokeWidth="1.6"
          />
          {/* Inner Arch Lattice */}
          <path
            d="M46 142 L40 182 L47 228 M74 142 L80 182 L73 228 M60 138 L60 232"
            stroke="#D4AF37"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Inner Flame */}
          <path
            className="lantern-glow"
            d="M60 162 C68 175, 68 192, 60 198 C52 192, 52 175, 60 162 Z"
            fill="#FFF3C4"
          />
          {/* Base Tassel */}
          <path d="M38 232 L82 232 L68 248 L52 248 Z" fill="url(#lanternBrass)" />
          <line x1="60" y1="248" x2="60" y2="285" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="60" cy="288" r="4" fill="#F5D77F" />
          <defs>
            <linearGradient id="lanternBrass" x1="24" y1="100" x2="96" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFE599" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#7C5310" />
            </linearGradient>
            <radialGradient id="warmLanternGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE89E" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#F5B041" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F5B041" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Right Hanging Ornate Fanoos Lantern */}
      <div ref={rightLanternRef} className="hanging-lantern lantern-right">
        <svg viewBox="0 0 120 300" width="84" height="235" fill="none">
          <line x1="60" y1="0" x2="60" y2="65" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5 3" />
          <circle cx="60" cy="65" r="5" fill="#D4AF37" />
          <path
            d="M35 95 C35 70, 85 70, 85 95 Z"
            fill="url(#lanternBrass)"
            stroke="#FFE599"
            strokeWidth="1.2"
          />
          <path d="M28 95 L92 95 L84 108 L36 108 Z" fill="#9E7223" stroke="#F5D77F" strokeWidth="1" />
          <circle className="lantern-glow" cx="60" cy="152" r="44" fill="url(#warmLanternGlow)" opacity="0.65" />
          <path
            d="M36 108 L24 152 L38 202 L82 202 L96 152 L84 108 Z"
            fill="rgba(255, 224, 130, 0.16)"
            stroke="#F5D77F"
            strokeWidth="1.6"
          />
          <path
            d="M46 112 L40 152 L47 198 M74 112 L80 152 L73 198 M60 108 L60 202"
            stroke="#D4AF37"
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            className="lantern-glow"
            d="M60 132 C68 145, 68 162, 60 168 C52 162, 52 145, 60 132 Z"
            fill="#FFF3C4"
          />
          <path d="M38 202 L82 202 L68 218 L52 218 Z" fill="url(#lanternBrass)" />
          <line x1="60" y1="218" x2="60" y2="255" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="60" cy="258" r="4" fill="#F5D77F" />
        </svg>
      </div>

      {/* Floating Jasmine Petals & Golden Motes */}
      {Array.from({ length: particleCount }).map((_, idx) => (
        <div
          key={idx}
          className={`gsap-petal-particle ${idx % 2 === 0 ? 'petal-shape' : 'star-mote'}`}
        >
          {idx % 2 === 0 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C7 7 5 13 12 22C19 13 17 7 12 2Z"
                fill="url(#petalGrad)"
                opacity="0.78"
              />
              <defs>
                <linearGradient id="petalGrad" x1="5" y1="2" x2="19" y2="22">
                  <stop offset="0%" stopColor="#FFFDF5" />
                  <stop offset="60%" stopColor="#F5D77F" />
                  <stop offset="100%" stopColor="#C8962E" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#FFE599"
                opacity="0.85"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

