// Audio manager combining the uploaded wedding nasheed (/wedding-music.mp3)
// with tactile Web Audio API chimes for the inland letter unfolding.

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgMusic = null;
    this.isMusicPlaying = false;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((fn) =>
      fn({ muted: this.muted, isMusicPlaying: this.isMusicPlaying })
    );
  }

  ensureMusicElement() {
    if (!this.bgMusic && typeof window !== 'undefined') {
      this.bgMusic = new Audio('/wedding-music.mp3');
      this.bgMusic.loop = true;
      this.bgMusic.preload = 'auto';
      this.bgMusic.volume = 0.85;

      this.bgMusic.addEventListener('play', () => {
        this.isMusicPlaying = true;
        this.notify();
      });
      this.bgMusic.addEventListener('pause', () => {
        this.isMusicPlaying = false;
        this.notify();
      });
    }
    return this.bgMusic;
  }

  startWeddingMusic({ restart = false } = {}) {
    const audio = this.ensureMusicElement();
    if (!audio) return;

    if (restart) {
      audio.currentTime = 0;
    }

    audio.muted = this.muted;
    if (audio.paused) {
      audio.play().catch(() => {
        // Fallback if browser requires another interaction
      });
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    const audio = this.ensureMusicElement();
    if (audio) {
      audio.muted = this.muted;
      if (!this.muted && audio.paused) {
        audio.play().catch(() => {});
      }
    }
    this.notify();
    return this.muted;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSealCrack() {
    // Start the uploaded wedding music immediately when breaking the seal to open the inland
    this.startWeddingMusic();

    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.07, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.75);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.8);
      });
    } catch {
      // Ignore audio errors if blocked by browser policy
    }
  }

  playPaperUnfold(step = 0) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const baseFreqs = [392.0, 440.0, 493.88, 587.33, 659.25];
      const freq = baseFreqs[step % baseFreqs.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.35);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }

  playRevealChord() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chord = [261.63, 329.63, 392.0, 493.88, 587.33, 783.99, 1046.5];
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);

        gain.gain.setValueAtTime(0.001, now + i * 0.09);
        gain.gain.linearRampToValueAtTime(0.05, now + i * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 1.9);
      });
    } catch {
      // Ignore
    }
  }
}

export const soundFX = new SoundManager();
