/**
 * Web Audio API synthesizer for realistic queue calling chimes
 * and Text-to-Speech announcement with Web Speech API.
 */

class SoundController {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policy
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public isSpeechEnabled(): boolean {
    return this.speechEnabled;
  }

  /**
   * Play classic 2-tone or 3-tone attention chime (e.g. Airport/Bank chime)
   */
  public playChime(type: 'call' | 'joined' | 'complete' | 'alert' = 'call') {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'call') {
        // High-low-high airport style attention chime: F5 (698.46Hz) -> A5 (880Hz) -> C6 (1046.5Hz)
        const notes = [
          { freq: 659.25, time: 0.0, duration: 0.25 }, // E5
          { freq: 880.00, time: 0.22, duration: 0.28 }, // A5
          { freq: 1174.66, time: 0.45, duration: 0.45 }, // D6
        ];

        notes.forEach(({ freq, time, duration }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + time);

          gain.gain.setValueAtTime(0.001, now + time);
          gain.gain.exponentialRampToValueAtTime(0.25, now + time + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + time);
          osc.stop(now + time + duration);
        });
      } else if (type === 'joined') {
        // Upward gentle confirmation tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'complete') {
        // Pleasant success chord
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0.001, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.06 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.35);
        });
      } else if (type === 'alert') {
        // Subtle warning tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(370, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio fallback without interrupting UI
    }
  }

  /**
   * Spoken audio announcement for public display / TV screen
   */
  public announceToken(tokenNumber: string, counterNumber?: number, customerName?: string) {
    if (!this.soundEnabled || !this.speechEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // stop pending

      const counterText = counterNumber ? `to Counter number ${counterNumber}` : 'to the service counter';
      const nameText = customerName ? `for ${customerName}` : '';
      const text = `Token ${tokenNumber.split('').join(' ')} ${nameText}, please proceed ${counterText}.`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 0.9;

      // Small delay after chime
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore
        }
      }, 500);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundController();
