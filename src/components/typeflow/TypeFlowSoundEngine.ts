/**
 * TYPEFLOW — Web Audio API Mechanical Keyboard Sound Synthesizer
 * High-fidelity, zero-latency procedural mechanical keyboard audio engine.
 * No external MP3/WAV assets needed; works 100% offline and instantaneously.
 */

import { SoundType } from './types';

class TypeFlowSoundEngine {
  private ctx: AudioContext | null = null;
  private soundType: SoundType = 'thock';
  private volume = 0.6;
  private isInitialized = false;

  constructor() {
    // Lazy initialization on first keypress
  }

  /**
   * Initializes the AudioContext safely within user gesture handling
   */
  public init() {
    if (this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
        console.debug('[TypeFlow:Sound] AudioContext created', { sampleRate: this.ctx.sampleRate });
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          console.debug('[TypeFlow:Sound] AudioContext resumed');
        });
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('[TypeFlow:Sound] Failed to initialize AudioContext:', e);
    }
  }

  public setSoundType(type: SoundType) {
    this.soundType = type;
    console.debug('[TypeFlow:Sound] Sound profile changed:', type);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getSoundType(): SoundType {
    return this.soundType;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Plays a procedural keypress sound based on switch profile
   */
  public playKey(isSpace = false, isError = false) {
    if (this.soundType === 'off' || this.volume <= 0) return;
    this.init();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;

      if (isError) {
        this.playErrorTone(now);
        return;
      }

      switch (this.soundType) {
        case 'thock':
          this.playThock(now, isSpace);
          break;
        case 'clicky':
          this.playClicky(now, isSpace);
          break;
        case 'tactile':
          this.playTactile(now, isSpace);
          break;
        case 'synth':
          this.playSynth(now, isSpace);
          break;
        default:
          break;
      }
    } catch (err) {
      console.debug('[TypeFlow:Sound] Error playing tone:', err);
    }
  }

  /**
   * Deep mechanical thock sound (Gateron Ink / Topre style)
   */
  private playThock(t: number, isSpace: boolean) {
    if (!this.ctx) return;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.volume * (isSpace ? 0.8 : 0.65), t);
    master.connect(this.ctx.destination);

    // 1. Low body oscillator (deep punch)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    const baseFreq = isSpace ? 110 : 155 + (Math.random() * 20 - 10);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.05);

    oscGain.gain.setValueAtTime(1, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(oscGain);
    oscGain.connect(master);
    osc.start(t);
    osc.stop(t + 0.06);

    // 2. High transient pop/click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(800 + Math.random() * 200, t);
    clickOsc.frequency.exponentialRampToValueAtTime(150, t + 0.015);

    clickGain.gain.setValueAtTime(0.3, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(master);
    clickOsc.start(t);
    clickOsc.stop(t + 0.02);
  }

  /**
   * Crisp mechanical click (Cherry MX Blue style)
   */
  private playClicky(t: number, isSpace: boolean) {
    if (!this.ctx) return;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.55, t);
    master.connect(this.ctx.destination);

    // High snap
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    const snapFreq = isSpace ? 1800 : 2400 + (Math.random() * 250 - 125);

    snap.type = 'sawtooth';
    snap.frequency.setValueAtTime(snapFreq, t);
    snap.frequency.exponentialRampToValueAtTime(600, t + 0.02);

    snapGain.gain.setValueAtTime(0.8, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

    snap.connect(snapGain);
    snapGain.connect(master);
    snap.start(t);
    snap.stop(t + 0.025);

    // Low bottom-out echo
    const bot = this.ctx.createOscillator();
    const botGain = this.ctx.createGain();
    bot.type = 'sine';
    bot.frequency.setValueAtTime(isSpace ? 140 : 190, t + 0.01);
    bot.frequency.exponentialRampToValueAtTime(60, t + 0.04);

    botGain.gain.setValueAtTime(0.4, t + 0.01);
    botGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    bot.connect(botGain);
    botGain.connect(master);
    bot.start(t + 0.01);
    bot.stop(t + 0.045);
  }

  /**
   * Subtle dampened mechanical bump (Cherry Brown style)
   */
  private playTactile(t: number, isSpace: boolean) {
    if (!this.ctx) return;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.45, t);
    master.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const freq = isSpace ? 220 : 320 + (Math.random() * 30 - 15);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.035);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  /**
   * Retro 8-bit chip synth blip
   */
  private playSynth(t: number, isSpace: boolean) {
    if (!this.ctx) return;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.35, t);
    master.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const note = isSpace ? 440 : 587 + (Math.random() * 80 - 40);

    osc.type = 'square';
    osc.frequency.setValueAtTime(note, t);
    osc.frequency.setValueAtTime(note * 1.5, t + 0.015);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.035);
  }

  /**
   * Subtle error buzz when wrong key is entered
   */
  private playErrorTone(t: number) {
    if (!this.ctx) return;

    const master = this.ctx.createGain();
    master.gain.setValueAtTime(this.volume * 0.5, t);
    master.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.07);
  }
}

// Export singleton instance
export const soundEngine = new TypeFlowSoundEngine();
