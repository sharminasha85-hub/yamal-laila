import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Navigation,
  Send,
  Sun,
  Moon,
  CheckCircle2,
} from 'lucide-react';
import GsapAmbientGraphics from './components/GsapAmbientGraphics';
import InlandEnvelope from './components/InlandEnvelope';
import { soundFX } from './utils/soundEffects';
import './App.css';

// Target Wedding Date: November 8, 2026 at 16:00 IST (After Asr Prayer)
const WEDDING_TARGET_DATE = new Date('2026-11-08T16:00:00+05:30').getTime();

const INITIAL_WISHES = [
  {
    id: 1,
    name: 'Amina & Family',
    attending: 'Both Nikah & Reception',
    message:
      'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fi khair! Wishing Fathima Laila & Yamal a lifetime of sukoon and love.',
    time: 'Just now',
  },
  {
    id: 2,
    name: 'Rizwan Malabar',
    attending: 'Reception (6:00 PM)',
    message:
      'So excited to celebrate with you both at Sukoon, Thazhe Chovva on Nov 8! May Allah bless your union abundantly.',
    time: '12 mins ago',
  },
  {
    id: 3,
    name: 'Nadia & Farhan',
    attending: 'Both Nikah & Reception',
    message:
      'Heartiest congratulations to dear Fathima Laila and Yamal! Counting down the days to November 8th.',
    time: '1 hour ago',
  },
];

export default function App() {
  const [inlandOpened, setInlandOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [activeMood, setActiveMood] = useState('both'); // 'asr' | 'night' | 'both'
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Wishes / RSVP form state
  const [wishes, setWishes] = useState(INITIAL_WISHES);
  const [guestName, setGuestName] = useState('');
  const [attendingSlot, setAttendingSlot] = useState('Both Nikah & Reception');
  const [guestMessage, setGuestMessage] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const mainInviteRef = useRef(null);
  const archPathRef = useRef(null);
  const asrSunRef = useRef(null);
  const nightMoonRef = useRef(null);

  // Live Countdown Timer to November 8, 2026
  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, WEDDING_TARGET_DATE - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Entrance & Graphics Animations when Inland Letter finishes opening
  useEffect(() => {
    if (!inlandOpened) return;

    const ctx = gsap.context(() => {
      // 1. Stagger reveal of main invitation sections
      gsap.fromTo(
        '.gsap-reveal-section',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.18,
          ease: 'power3.out',
        }
      );

      // 2. SVG Royal Archway Stroke-Draw animation
      if (archPathRef.current) {
        const length = archPathRef.current.getTotalLength?.() || 1800;
        gsap.fromTo(
          archPathRef.current,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 2.6,
            ease: 'power2.inOut',
          }
        );
      }

      // 3. Couple Names floating shimmer
      gsap.fromTo(
        '.hero-couple-name',
        { scale: 0.92, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.22,
          ease: 'back.out(1.5)',
          delay: 0.3,
        }
      );

      // 4. Continuous GSAP Graphics inside Event Cards (Asr Sun Rays & Night Crescent)
      if (asrSunRef.current) {
        gsap.to(asrSunRef.current, {
          rotation: 360,
          duration: 36,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });
      }

      if (nightMoonRef.current) {
        gsap.to(nightMoonRef.current, {
          y: -7,
          rotation: 6,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          transformOrigin: '50% 50%',
        });
      }

      gsap.to('.night-star-twinkle', {
        opacity: 0.2,
        scale: 0.7,
        duration: 1.4,
        stagger: 0.25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, mainInviteRef);

    return () => ctx.revert();
  }, [inlandOpened]);

  useEffect(() => {
    const unsubscribe = soundFX.subscribe(({ muted: isMuted, isMusicPlaying }) => {
      setMuted(isMuted);
      setMusicPlaying(isMusicPlaying);
    });
    return unsubscribe;
  }, []);

  const toggleSound = () => {
    const nextMuted = soundFX.toggleMute();
    setMuted(nextMuted);
    if (!nextMuted) {
      soundFX.playPaperUnfold(2);
    }
  };

  const handleReplayInland = () => {
    soundFX.startWeddingMusic({ restart: true });
    soundFX.playPaperUnfold(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setInlandOpened(false);
  };

  const handleDownloadCalendar = () => {
    soundFX.playSealCrack();
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Fathima Laila & Yamal Wedding//EN',
      'BEGIN:VEVENT',
      'SUMMARY:Wedding of Fathima Laila & Yamal (Nikah & Reception)',
      'DTSTART:20261108T103000Z',
      'DTEND:20261108T163000Z',
      "LOCATION:'Sukoon', Thazhe Chovva, Kannur, Kerala",
      "DESCRIPTION:Nikah After Asr Prayer & Wedding Reception at Night 6:00 PM at Venue 'Sukoon', Thazhe Chovva.",
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Fathima-Laila-Yamal-Wedding-Nov8-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    soundFX.playRevealChord();
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#FFF3C4', '#10B981', '#F59E0B'],
    });

    const newEntry = {
      id: Date.now(),
      name: guestName.trim(),
      attending: attendingSlot,
      message: guestMessage.trim(),
      time: 'Just now',
    };

    setWishes([newEntry, ...wishes]);
    setGuestName('');
    setGuestMessage('');
    setRsvpSubmitted(true);
    setTimeout(() => setRsvpSubmitted(false), 4500);
  };

  return (
    <div className={`wedding-app-shell mood-${activeMood}`}>
      {/* Persistent GSAP Ambient Graphics (Lanterns, Mandala, Floating Petals) */}
      <GsapAmbientGraphics intensity={inlandOpened ? 'high' : 'normal'} />

      {/* Top Floating Navigation Bar */}
      <header className="royal-topbar">
        <div className="topbar-brand">
          <span className="brand-monogram">L &amp; Y</span>
          <span className="brand-date-chip">08 • 11 • 2026</span>
        </div>

        <div className="topbar-actions">
          {inlandOpened && (
            <button
              type="button"
              className="topbar-btn replay-inland-btn"
              onClick={handleReplayInland}
              title="Replay the 3D Inland Letter Unfolding Animation"
            >
              <RotateCcw size={15} />
              <span>Replay Inland Opening</span>
            </button>
          )}

          <button
            type="button"
            className="topbar-btn"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute Wedding Music' : 'Mute Wedding Music'}
            title={muted ? 'Unmute Wedding Music' : 'Mute Wedding Music'}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            <span>{muted ? 'Music Muted' : musicPlaying ? 'Playing Music' : 'Music On'}</span>
          </button>
        </div>
      </header>

      {/* =================================================================
          STAGE 1: INTERACTIVE 3D INLAND LETTER OPENING EXPERIENCE
         ================================================================= */}
      {!inlandOpened && (
        <InlandEnvelope onOpenComplete={() => setInlandOpened(true)} />
      )}

      {/* =================================================================
          STAGE 2: FULL INTERACTIVE WEDDING INVITATION
         ================================================================= */}
      {inlandOpened && (
        <main ref={mainInviteRef} className="invitation-main-container">
          {/* -------------------------------------------------------------
              HERO ROYAL ARCHWAY CARD
             ------------------------------------------------------------- */}
          <section className="hero-arch-card gsap-reveal-section">
            {/* Animated GSAP SVG Mughal / Malabar Arch Frame */}
            <svg
              className="hero-arch-svg-frame"
              viewBox="0 0 800 980"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                ref={archPathRef}
                d="M 40 940 L 40 310 C 40 160, 230 95, 400 38 C 570 95, 760 160, 760 310 L 760 940 Z"
                stroke="url(#heroArchGold)"
                strokeWidth="3.2"
              />
              <path
                d="M 62 920 L 62 320 C 62 182, 245 120, 400 66 C 555 120, 738 182, 738 320 L 738 920 Z"
                stroke="url(#heroArchGold)"
                strokeWidth="1.2"
                strokeDasharray="6 6"
                opacity="0.7"
              />
              <defs>
                <linearGradient id="heroArchGold" x1="0" y1="0" x2="800" y2="980" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFE599" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8A6214" />
                </linearGradient>
              </defs>
            </svg>

            <div className="hero-card-content">
              <div className="bismillah-header">
                <p className="arabic-calligraphy">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <p className="bismillah-translation">
                  In the Name of Allah, the Most Gracious, the Most Merciful
                </p>
              </div>

              <p className="invitation-formal-intro">
                With joyful hearts and the blessings of the Almighty, we cordially invite you and
                your family to grace the auspicious occasion of the Nikah &amp; Wedding Reception of
              </p>

              {/* BRIDE & GROOM NAMES */}
              <div className="couple-names-stage">
                <div className="bride-block hero-couple-name">
                  <span className="role-tag">THE BRIDE</span>
                  <h1 className="couple-display-name">Fathima Laila</h1>
                </div>

                <div className="couple-union-emblem hero-couple-name">
                  <span className="union-line" />
                  <div className="union-heart-circle">
                    <Heart size={20} fill="#D4AF37" color="#D4AF37" />
                  </div>
                  <span className="union-line" />
                </div>

                <div className="groom-block hero-couple-name">
                  <span className="role-tag">THE GROOM</span>
                  <h1 className="couple-display-name">Yamal</h1>
                </div>
              </div>

              {/* QURANIC VERSE / BLESSING */}
              <blockquote className="quran-verse-box">
                <p className="verse-arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا</p>
                <p className="verse-english">
                  “And among His Signs is that He created for you mates from among yourselves, that
                  you may find <strong>Sukoon</strong> (tranquility) in them, and He placed between
                  you affection and mercy.” — <em>Surah Ar-Rum (30:21)</em>
                </p>
              </blockquote>

              {/* HIGHLIGHT DATE & VENUE PILLS */}
              <div className="hero-key-highlights">
                <div className="highlight-pill">
                  <Calendar size={20} className="pill-icon" />
                  <div>
                    <span className="pill-label">WEDDING DATE</span>
                    <strong className="pill-value">Sunday, November 8, 2026</strong>
                  </div>
                </div>

                <div className="highlight-pill">
                  <MapPin size={20} className="pill-icon" />
                  <div>
                    <span className="pill-label">WEDDING VENUE</span>
                    <strong className="pill-value">‘Sukoon’, Thazhe Chovva</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              CEREMONIES & TIMINGS (NIKAH AFTER ASR & RECEPTION 6:00 PM)
             ------------------------------------------------------------- */}
          <section className="ceremonies-section gsap-reveal-section">
            <div className="section-title-block">
              <span className="section-eyebrow">
                <Sparkles size={14} /> SACRED MOMENTS <Sparkles size={14} />
              </span>
              <h2 className="section-heading">Wedding Schedule &amp; Timings</h2>
              <p className="section-subheading">
                Click or hover on a ceremony below to shift the ambient lighting of ‘Sukoon’
              </p>

              {/* Ambient Mood Switcher */}
              <div className="mood-switcher-pills">
                <button
                  type="button"
                  className={`mood-pill ${activeMood === 'asr' ? 'active' : ''}`}
                  onClick={() => setActiveMood('asr')}
                >
                  <Sun size={15} /> Asr Golden Hour (Nikah)
                </button>
                <button
                  type="button"
                  className={`mood-pill ${activeMood === 'both' ? 'active' : ''}`}
                  onClick={() => setActiveMood('both')}
                >
                  <Sparkles size={15} /> Royal Emerald
                </button>
                <button
                  type="button"
                  className={`mood-pill ${activeMood === 'night' ? 'active' : ''}`}
                  onClick={() => setActiveMood('night')}
                >
                  <Moon size={15} /> 6:00 PM Starlight (Reception)
                </button>
              </div>
            </div>

            <div className="ceremonies-grid">
              {/* CEREMONY 1: THE BLESSED NIKAH (AFTER ASR PRAYER) */}
              <article
                className="ceremony-card nikah-card"
                onMouseEnter={() => setActiveMood('asr')}
              >
                <div className="ceremony-graphic-stage">
                  <svg viewBox="0 0 260 150" className="ceremony-svg">
                    {/* Rotating Asr Sunburst */}
                    <g ref={asrSunRef} style={{ transformOrigin: '130px 85px' }}>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line
                          key={i}
                          x1="130"
                          y1="85"
                          x2="130"
                          y2="12"
                          stroke="#F5D77F"
                          strokeWidth="1.5"
                          strokeDasharray="4 6"
                          opacity="0.45"
                          transform={`rotate(${i * 30} 130 85)`}
                        />
                      ))}
                    </g>
                    <circle cx="130" cy="85" r="34" fill="url(#asrSunGrad)" />
                    {/* Silhouette of Dome & Arches */}
                    <path
                      d="M30 140 L30 112 Q55 95 80 112 L80 140 Z M92 140 L92 102 C92 68 168 68 168 102 L168 140 Z M180 140 L180 112 Q205 95 230 112 L230 140 Z"
                      fill="#0D3124"
                      stroke="#D4AF37"
                      strokeWidth="1.5"
                    />
                    <path d="M130 52 L130 66" stroke="#FFE599" strokeWidth="2" />
                    <circle cx="130" cy="49" r="3.5" fill="#FFE599" />
                    <defs>
                      <radialGradient id="asrSunGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FFF5CC" />
                        <stop offset="65%" stopColor="#F5B041" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                <div className="ceremony-badge">SACRED COVENANT</div>
                <h3 className="ceremony-title">The Blessed Nikah</h3>

                <div className="ceremony-meta-list">
                  <div className="meta-row">
                    <Clock size={18} className="meta-icon" />
                    <div>
                      <span className="meta-label">TIMING</span>
                      <strong className="meta-value highlight-gold">After Asr Prayer</strong>
                      <span className="meta-note">Sunday, November 8, 2026</span>
                    </div>
                  </div>

                  <div className="meta-row">
                    <MapPin size={18} className="meta-icon" />
                    <div>
                      <span className="meta-label">VENUE</span>
                      <strong className="meta-value">‘Sukoon’, Thazhe Chovva</strong>
                      <span className="meta-note">Kannur, Kerala</span>
                    </div>
                  </div>
                </div>

                <p className="ceremony-desc">
                  Join us in prayer and witness the sacred vows of Nikah as Fathima Laila and Yamal
                  begin their journey together after the blessed Asr prayer.
                </p>
              </article>

              {/* CEREMONY 2: WEDDING RECEPTION (NIGHT 6:00 PM) */}
              <article
                className="ceremony-card reception-card"
                onMouseEnter={() => setActiveMood('night')}
              >
                <div className="ceremony-graphic-stage">
                  <svg viewBox="0 0 260 150" className="ceremony-svg">
                    {/* Twinkling Night Stars */}
                    <circle className="night-star-twinkle" cx="48" cy="36" r="2.2" fill="#FFF3C4" />
                    <circle className="night-star-twinkle" cx="85" cy="24" r="1.8" fill="#FFE599" />
                    <circle className="night-star-twinkle" cx="185" cy="30" r="2.5" fill="#FFF3C4" />
                    <circle className="night-star-twinkle" cx="216" cy="52" r="1.8" fill="#FFE599" />
                    <circle className="night-star-twinkle" cx="65" cy="70" r="1.6" fill="#FFF3C4" />

                    {/* Floating Crescent Moon */}
                    <g ref={nightMoonRef}>
                      <path
                        d="M142 36 A 30 30 0 1 0 172 78 A 24 24 0 1 1 142 36 Z"
                        fill="url(#moonGold)"
                      />
                    </g>

                    {/* Illuminated 'Sukoon' Pavilion Archways */}
                    <path
                      d="M35 140 L225 140 L215 102 L45 102 Z"
                      fill="rgba(212, 175, 55, 0.15)"
                      stroke="#D4AF37"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M70 140 L70 116 Q90 105 110 116 L110 140 M150 140 L150 116 Q170 105 190 116 L190 140"
                      fill="rgba(255, 232, 158, 0.28)"
                      stroke="#FFE599"
                      strokeWidth="1.3"
                    />
                    <defs>
                      <linearGradient id="moonGold" x1="115" y1="30" x2="175" y2="85" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFDF5" />
                        <stop offset="100%" stopColor="#D4AF37" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="ceremony-badge reception-badge">EVENING FEAST &amp; CELEBRATION</div>
                <h3 className="ceremony-title">Wedding Reception</h3>

                <div className="ceremony-meta-list">
                  <div className="meta-row">
                    <Clock size={18} className="meta-icon" />
                    <div>
                      <span className="meta-label">TIMING</span>
                      <strong className="meta-value highlight-gold">Night 6:00 PM Onwards</strong>
                      <span className="meta-note">Sunday, November 8, 2026</span>
                    </div>
                  </div>

                  <div className="meta-row">
                    <MapPin size={18} className="meta-icon" />
                    <div>
                      <span className="meta-label">VENUE</span>
                      <strong className="meta-value">‘Sukoon’, Thazhe Chovva</strong>
                      <span className="meta-note">Kannur, Kerala</span>
                    </div>
                  </div>
                </div>

                <p className="ceremony-desc">
                  As the evening lanterns glow at 6:00 PM, celebrate with us over a warm Malabar
                  wedding feast, heartfelt conversations, and joyous blessings for the newlyweds.
                </p>
              </article>
            </div>
          </section>

          {/* -------------------------------------------------------------
              LIVE COUNTDOWN TO NOVEMBER 8, 2026
             ------------------------------------------------------------- */}
          <section className="countdown-section gsap-reveal-section">
            <div className="countdown-card">
              <span className="section-eyebrow">COUNTING EVERY MOMENT</span>
              <h2 className="section-heading">Until November 8, 2026</h2>

              <div className="countdown-boxes">
                <div className="time-unit-box">
                  <span className="time-number">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="time-label">Days</span>
                </div>
                <div className="time-colon">:</div>
                <div className="time-unit-box">
                  <span className="time-number">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="time-label">Hours</span>
                </div>
                <div className="time-colon">:</div>
                <div className="time-unit-box">
                  <span className="time-number">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="time-label">Minutes</span>
                </div>
                <div className="time-colon">:</div>
                <div className="time-unit-box">
                  <span className="time-number">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="time-label">Seconds</span>
                </div>
              </div>

              <div className="countdown-actions">
                <button
                  type="button"
                  onClick={handleDownloadCalendar}
                  className="gold-outline-btn"
                >
                  <Calendar size={17} />
                  <span>Save Wedding to Calendar (.ICS)</span>
                </button>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              VENUE SHOWCASE: 'SUKOON', THAZHE CHOVVA
             ------------------------------------------------------------- */}
          <section className="venue-section gsap-reveal-section">
            <div className="venue-showcase-card">
              <div className="venue-text-col">
                <span className="section-eyebrow">THE DESTINATION OF TRANQUILITY</span>
                <h2 className="venue-title">‘Sukoon’</h2>
                <p className="venue-location-sub">Thazhe Chovva, Kannur, Kerala</p>

                <p className="venue-story">
                  True to its name, <strong>‘Sukoon’</strong> in the heart of{' '}
                  <strong>Thazhe Chovva</strong> is where our families gather to celebrate both the{' '}
                  <strong>Nikah (After Asr Prayer)</strong> and the{' '}
                  <strong>Reception (Night 6:00 PM)</strong> on <strong>November 8, 2026</strong>.
                </p>

                <div className="venue-landmarks">
                  <div className="landmark-chip">
                    <span>📍 Landmark:</span>
                    <strong>Thazhe Chovva, NH-66 Corridor, Kannur</strong>
                  </div>
                  <div className="landmark-chip">
                    <span>🚆 Nearest Rail:</span>
                    <strong>Kannur South / Kannur Main Railway Station</strong>
                  </div>
                </div>

                <div className="venue-cta-row">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Sukoon+Thazhe+Chovva+Kannur"
                    target="_blank"
                    rel="noreferrer"
                    className="enter-invitation-btn venue-map-btn"
                  >
                    <Navigation size={17} />
                    <span>Get Directions to ‘Sukoon’, Thazhe Chovva</span>
                  </a>
                </div>
              </div>

              {/* Stylized Interactive Route Compass Card */}
              <div className="venue-compass-col">
                <div className="ornate-map-frame">
                  <svg viewBox="0 0 320 280" className="venue-illustrated-map">
                    {/* Decorative grid lines */}
                    <line x1="0" y1="70" x2="320" y2="70" stroke="#D4AF37" strokeOpacity="0.18" />
                    <line x1="0" y1="140" x2="320" y2="140" stroke="#D4AF37" strokeOpacity="0.18" />
                    <line x1="0" y1="210" x2="320" y2="210" stroke="#D4AF37" strokeOpacity="0.18" />
                    <line x1="80" y1="0" x2="80" y2="280" stroke="#D4AF37" strokeOpacity="0.18" />
                    <line x1="160" y1="0" x2="160" y2="280" stroke="#D4AF37" strokeOpacity="0.18" />
                    <line x1="240" y1="0" x2="240" y2="280" stroke="#D4AF37" strokeOpacity="0.18" />

                    {/* Curved Highway Path through Thazhe Chovva */}
                    <path
                      d="M 20 230 Q 110 185, 160 135 T 295 45"
                      stroke="#D4AF37"
                      strokeWidth="3"
                      strokeDasharray="7 5"
                      fill="none"
                    />

                    {/* Pulsing Venue Pin at Center */}
                    <circle cx="160" cy="135" r="34" fill="rgba(212, 175, 55, 0.15)" />
                    <circle cx="160" cy="135" r="18" fill="rgba(212, 175, 55, 0.3)" />
                    <circle cx="160" cy="135" r="8" fill="#FFE599" stroke="#8A6214" strokeWidth="2" />

                    {/* Label Banner */}
                    <rect
                      x="78"
                      y="72"
                      width="164"
                      height="42"
                      rx="10"
                      fill="#0A291E"
                      stroke="#D4AF37"
                      strokeWidth="1.5"
                    />
                    <text
                      x="160"
                      y="91"
                      textAnchor="middle"
                      fill="#FFE599"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="Cinzel Decorative, serif"
                    >
                      ‘SUKOON’
                    </text>
                    <text
                      x="160"
                      y="106"
                      textAnchor="middle"
                      fill="#D4AF37"
                      fontSize="10"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      THAZHE CHOVVA
                    </text>

                    {/* Road Labels */}
                    <text x="58" y="245" fill="#C8B273" fontSize="10">
                      Towards Kannur Town
                    </text>
                    <text x="195" y="42" fill="#C8B273" fontSize="10">
                      NH-66 Thazhe Chovva
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              INTERACTIVE BLESSINGS, DUAS & RSVP WALL
             ------------------------------------------------------------- */}
          <section className="wishes-rsvp-section gsap-reveal-section">
            <div className="section-title-block">
              <span className="section-eyebrow">YOUR PRESENCE IS OUR TREASURE</span>
              <h2 className="section-heading">Send Duas &amp; Confirm Attendance</h2>
              <p className="section-subheading">
                Leave a heartfelt prayer for <strong>Fathima Laila &amp; Yamal</strong> and let us
                know you’ll be joining us at ‘Sukoon’
              </p>
            </div>

            <div className="wishes-layout-grid">
              {/* RSVP & Wish Form */}
              <form className="rsvp-glass-form" onSubmit={handleWishSubmit}>
                <div className="form-group">
                  <label htmlFor="guestNameInput">Your Name / Family Name</label>
                  <input
                    id="guestNameInput"
                    type="text"
                    placeholder="e.g., Ashraf & Family"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="attendingSelect">Ceremonies Attending on Nov 8, 2026</label>
                  <select
                    id="attendingSelect"
                    value={attendingSlot}
                    onChange={(e) => setAttendingSlot(e.target.value)}
                  >
                    <option value="Both Nikah & Reception">
                      Both — Nikah (After Asr) &amp; Reception (6:00 PM)
                    </option>
                    <option value="Nikah (After Asr Prayer)">
                      Nikah — After Asr Prayer at ‘Sukoon’
                    </option>
                    <option value="Reception (Night 6:00 PM)">
                      Reception — Night 6:00 PM at ‘Sukoon’
                    </option>
                    <option value="Sending Duas from Afar">
                      Sending Warm Duas &amp; Blessings from Afar
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="guestWishTextarea">Your Blessing / Dua for Laila &amp; Yamal</label>
                  <textarea
                    id="guestWishTextarea"
                    rows={3}
                    placeholder="Write your heartfelt wishes and prayers for the bride and groom..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="enter-invitation-btn full-width-btn">
                  <Send size={17} />
                  <span>Send Blessing &amp; Celebrate</span>
                </button>

                {rsvpSubmitted && (
                  <div className="rsvp-success-banner">
                    <CheckCircle2 size={18} />
                    <span>Jazakallah Khair! Your blessing for Laila &amp; Yamal has been added.</span>
                  </div>
                )}
              </form>

              {/* Live Wishes Stream */}
              <div className="wishes-stream-col">
                {wishes.map((item) => (
                  <div key={item.id} className="wish-blessing-card">
                    <div className="wish-card-header">
                      <div>
                        <h4 className="wish-author">{item.name}</h4>
                        <span className="wish-slot-tag">{item.attending}</span>
                      </div>
                      <span className="wish-time">{item.time}</span>
                    </div>
                    <p className="wish-body">“{item.message}”</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* -------------------------------------------------------------
              ROYAL FOOTER
             ------------------------------------------------------------- */}
          <footer className="royal-footer gsap-reveal-section">
            <div className="footer-monogram-seal">L ♥ Y</div>
            <h3 className="footer-couple-title">Fathima Laila &amp; Yamal</h3>
            <p className="footer-details">
              Sunday, November 8, 2026 • Nikah After Asr Prayer • Reception Night 6:00 PM
            </p>
            <p className="footer-venue">Venue: ‘Sukoon’, Thazhe Chovva, Kannur</p>
            <button
              type="button"
              onClick={handleReplayInland}
              className="footer-replay-link"
            >
              <RotateCcw size={14} /> Replay 3D Inland Letter Opening
            </button>
          </footer>
        </main>
      )}
    </div>
  );
}
