import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Sparkles, MailOpen } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

export default function InlandEnvelope({ onOpenComplete }) {
  const stageRef = useRef(null);
  const inlandWrapperRef = useRef(null);
  const topFlapRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const bottomFlapRef = useRef(null);
  const waxSealRef = useRef(null);
  const innerLetterRef = useRef(null);
  const burstRingRef = useRef(null);

  const [phase, setPhase] = useState('sealed'); // 'sealed' | 'unfolding' | 'revealed'

  // Subtle idle float & mouse 3D tilt before opening
  useEffect(() => {
    soundFX.ensureMusicElement();
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const ctx = gsap.context(() => {
      // Initial entrance of the Inland Letter onto the desk
      gsap.fromTo(
        inlandWrapperRef.current,
        { y: 50, opacity: 0, rotateX: isMobile ? 10 : 22, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          rotateX: isMobile ? 3 : 8,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
        }
      );

      // Pulse the wax seal halo
      gsap.to('.wax-seal-pulse', {
        scale: 1.18,
        opacity: 0.2,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, stageRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (phase !== 'sealed' || !inlandWrapperRef.current) return;
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;

    const rect = inlandWrapperRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    gsap.to(inlandWrapperRef.current, {
      rotateY: deltaX * 12,
      rotateX: 8 - deltaY * 10,
      duration: 0.45,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (phase !== 'sealed' || !inlandWrapperRef.current) return;
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;

    gsap.to(inlandWrapperRef.current, {
      rotateY: 0,
      rotateX: 8,
      duration: 0.7,
      ease: 'elastic.out(1, 0.6)',
    });
  };

  const triggerInlandUnfold = () => {
    if (phase !== 'sealed') return;
    setPhase('unfolding');
    soundFX.playSealCrack();

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('revealed');
        soundFX.playRevealChord();
        confetti({
          particleCount: isMobile ? 45 : 70,
          spread: isMobile ? 65 : 80,
          origin: { y: 0.55 },
          colors: ['#D4AF37', '#FFF3C4', '#134E3A', '#E6B800', '#F5D77F'],
        });
      },
    });

    // 1. Center and level the 3D inland card
    tl.to(inlandWrapperRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.35,
      ease: 'power2.inOut',
    });

    // 2. Wax seal cracks, spins slightly & bursts golden ring
    tl.to(
      waxSealRef.current,
      {
        scale: 1.28,
        rotation: 14,
        duration: 0.25,
        ease: 'back.out(2)',
      },
      '<'
    )
      .fromTo(
        burstRingRef.current,
        { scale: 0.4, opacity: 1 },
        { scale: isMobile ? 2.1 : 2.8, opacity: 0, duration: 0.65, ease: 'power2.out' },
        '-=0.1'
      )
      .to(
        waxSealRef.current,
        {
          scale: 0,
          opacity: 0,
          y: 16,
          duration: 0.32,
          ease: 'power2.in',
        },
        '-=0.45'
      );

    // 3. Unfold Top Inland Flap (180 deg upward)
    tl.call(() => soundFX.playPaperUnfold(0))
      .to(
        topFlapRef.current,
        {
          rotateX: 180,
          opacity: isMobile ? 0 : 1,
          duration: 0.82,
          ease: 'power3.inOut',
        },
        '-=0.1'
      )
      .set(topFlapRef.current, { zIndex: 1 });

    // 4. Unfold Left & Right Inland Wings outward
    tl.call(() => soundFX.playPaperUnfold(1))
      .to(
        leftWingRef.current,
        {
          rotateY: -176,
          opacity: isMobile ? 0 : 1,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '-=0.3'
      )
      .call(() => soundFX.playPaperUnfold(2), null, '-=0.5')
      .to(
        rightWingRef.current,
        {
          rotateY: 176,
          opacity: isMobile ? 0 : 1,
          duration: 0.75,
          ease: 'power3.inOut',
        },
        '-=0.65'
      );

    // 5. Unfold Bottom Inland Flap downward
    tl.call(() => soundFX.playPaperUnfold(3)).to(
      bottomFlapRef.current,
      {
        rotateX: -176,
        opacity: isMobile ? 0 : 1,
        duration: 0.78,
        ease: 'power3.inOut',
      },
      '-=0.45'
    );

    // 6. Elevate the Inner Letter Sheet & animate its golden calligraphy inside
    tl.to(
      innerLetterRef.current,
      {
        scale: isMobile ? 1 : 1.05,
        y: isMobile ? 0 : -12,
        boxShadow: '0 26px 64px rgba(0, 0, 0, 0.65), 0 0 40px rgba(212, 175, 55, 0.35)',
        duration: 0.85,
        ease: 'power3.out',
      },
      '-=0.3'
    ).fromTo(
      '.inland-inner-stagger',
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.55'
    );
  };

  const handleProceedToFullInvite = () => {
    soundFX.playPaperUnfold(4);
    gsap.to(stageRef.current, {
      opacity: 0,
      scale: 1.04,
      y: -24,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        onOpenComplete();
      },
    });
  };

  return (
    <section
      ref={stageRef}
      className="inland-stage-overlay"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Header Instruction */}
      <div className="inland-top-caption">
        <span className="inland-badge">
          <Sparkles size={13} /> ROYAL INLAND LETTER INVITATION <Sparkles size={13} />
        </span>
        <p className="inland-subtitle-hint">
          {phase === 'sealed' &&
            'Tap the Crimson & Gold Wax Seal to break the seal and unfold the Inland Letter'}
          {phase === 'unfolding' && 'Unfolding the royal inland folds from Thazhe Chovva...'}
          {phase === 'revealed' &&
            'The Inland Letter is open! Explore the full wedding celebration below'}
        </p>
      </div>

      {/* 3D Perspective Container for the Inland Letter */}
      <div className="inland-perspective-scene">
        <div ref={inlandWrapperRef} className={`inland-3d-card phase-${phase}`}>
          {/* ============================================================
              INNER LETTER SHEET (Revealed when all 4 Inland flaps unfold)
             ============================================================ */}
          <div ref={innerLetterRef} className="inland-inner-sheet">
            <div className="inland-inner-border">
              {/* Ornate Corner Filigrees */}
              <span className="corner-ornament tl" />
              <span className="corner-ornament tr" />
              <span className="corner-ornament bl" />
              <span className="corner-ornament br" />

              <p className="inland-bismillah inland-inner-stagger">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="inland-blessing-line inland-inner-stagger">
                In the Name of Allah, the Most Gracious, the Most Merciful
              </p>

              <div className="inland-couple-names inland-inner-stagger">
                <h2>Fathima Laila</h2>
                <span className="inland-ampersand">&amp;</span>
                <h2>Yamal</h2>
              </div>

              <div className="inland-divider-gold inland-inner-stagger">
                <span className="diamond-dot" />
              </div>

              <p className="inland-date-highlight inland-inner-stagger">
                SUNDAY • NOVEMBER 8, 2026
              </p>

              <div className="inland-mini-events inland-inner-stagger">
                <div className="inland-mini-pill">
                  <strong>Nikah:</strong> After Asr Prayer
                </div>
                <div className="inland-mini-pill">
                  <strong>Reception:</strong> Night 6:00 PM
                </div>
              </div>

              <p className="inland-venue-line inland-inner-stagger">
                Venue: <strong>‘Sukoon’</strong>, Thazhe Chovva, Kannur
              </p>

              {phase === 'revealed' && (
                <button
                  type="button"
                  onClick={handleProceedToFullInvite}
                  className="enter-invitation-btn inland-inner-stagger"
                >
                  <MailOpen size={17} />
                  <span>Enter Full Interactive Invitation</span>
                </button>
              )}
            </div>
          </div>

          {/* ============================================================
              LEFT INLAND FOLD WING
             ============================================================ */}
          <div ref={leftWingRef} className="inland-flap inland-wing-left">
            <div className="flap-outer-face wing-face">
              <div className="perforation-edge left-perf" />
              <span className="wing-vertical-text">FIRST FOLD • SUKOON • THAZHE CHOVVA</span>
            </div>
            <div className="flap-inner-face" />
          </div>

          {/* ============================================================
              RIGHT INLAND FOLD WING
             ============================================================ */}
          <div ref={rightWingRef} className="inland-flap inland-wing-right">
            <div className="flap-outer-face wing-face">
              <div className="perforation-edge right-perf" />
              <span className="wing-vertical-text">SECOND FOLD • 08 NOVEMBER 2026</span>
            </div>
            <div className="flap-inner-face" />
          </div>

          {/* ============================================================
              BOTTOM INLAND FOLD FLAP (Address & Postmark Face)
             ============================================================ */}
          <div ref={bottomFlapRef} className="inland-flap inland-flap-bottom">
            <div className="flap-outer-face bottom-outer-face">
              <div className="inland-address-box">
                <div className="inland-stamp-row">
                  <div className="inland-postmark">
                    <span>THAZHE CHOVVA</span>
                    <strong>08 NOV 2026</strong>
                    <span>KANNUR • KERALA</span>
                  </div>
                  <div className="inland-royal-stamp">
                    <span className="stamp-top">BHARAT / KERALA</span>
                    <strong className="stamp-center">SUKOON</strong>
                    <span className="stamp-sub">WEDDING POST</span>
                  </div>
                </div>

                <div className="inland-recipient-lines">
                  <p className="to-label">To: Our Beloved Family &amp; Friends,</p>
                  <p className="to-sub">
                    Cordially invited to share in the joy of the Nikah &amp; Reception of
                  </p>
                  <p className="to-names-script">Fathima Laila &amp; Yamal</p>
                </div>
              </div>
            </div>
            <div className="flap-inner-face" />
          </div>

          {/* ============================================================
              TOP INLAND FOLD FLAP (Header Crest & Triangular Seal Edge)
             ============================================================ */}
          <div ref={topFlapRef} className="inland-flap inland-flap-top">
            <div className="flap-outer-face top-outer-face">
              <div className="inland-crest-header">
                <span className="inland-type-title">INLAND LETTER CARD • निक़ाह मुबारक</span>
                <h3 className="inland-front-monogram">Laila &amp; Yamal</h3>
                <p className="inland-front-sub">Venue: ‘Sukoon’, Thazhe Chovva • Nov 8, 2026</p>
              </div>
            </div>
            <div className="flap-inner-face" />
          </div>

          {/* ============================================================
              ROYAL CRIMSON & GOLD WAX SEAL (Interactive Trigger)
             ============================================================ */}
          <div ref={burstRingRef} className="wax-burst-ring" />

          <button
            ref={waxSealRef}
            type="button"
            className="royal-wax-seal-btn"
            onClick={triggerInlandUnfold}
            aria-label="Break wax seal and unfold wedding inland invitation"
          >
            <span className="wax-seal-pulse" />
            <div className="wax-seal-disc">
              <div className="wax-seal-inner-ring">
                <span className="wax-arabic-top">ما شاء الله</span>
                <span className="wax-monogram">L ♥ Y</span>
                <span className="wax-date-tiny">08•11•26</span>
              </div>
            </div>
            <span className="wax-click-cta">Tap to Unfold</span>
          </button>
        </div>
      </div>

      {/* Bottom Quick Action Bar */}
      <div className="inland-bottom-controls">
        {phase === 'sealed' ? (
          <button
            type="button"
            className="inland-action-pill"
            onClick={triggerInlandUnfold}
          >
            <Sparkles size={16} />
            <span>Unfold Inland Letter</span>
          </button>
        ) : (
          <button
            type="button"
            className="inland-action-pill gold-solid"
            onClick={handleProceedToFullInvite}
          >
            <MailOpen size={16} />
            <span>Continue to Full Wedding Invitation</span>
          </button>
        )}
      </div>
    </section>
  );
}
