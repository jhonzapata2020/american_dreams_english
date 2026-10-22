'use client'

/**
 * High-End Acoustic Web Audio API Synthesizer for American Dreams Store
 * Synthesizes velvet luxury chimes, haptic feedback and shopping chimes
 * without external MP3 files or network latency.
 */
class StoreAudioSynthesizer {
  private ctx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  /**
   * Crisp, warm pop when opening a modal, switching images, or picking a size
   */
  playPop() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(480, now)
      osc.frequency.exponentialRampToValueAtTime(920, now + 0.06)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch {}
  }

  /**
   * Ultra-luxurious Apple Pay style double-chime when adding an item to the cart
   * Harmonic D5 (587.33Hz) + A5 (880Hz) with golden shimmer
   */
  playAddToCart() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const now = ctx.currentTime

      const chords = [
        { freq: 587.33, start: 0.0, dur: 0.28, vol: 0.12 },
        { freq: 880.00, start: 0.05, dur: 0.32, vol: 0.14 },
        { freq: 1174.66, start: 0.09, dur: 0.35, vol: 0.09 }
      ]

      chords.forEach(({ freq, start, dur, vol }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + start)

        gain.gain.setValueAtTime(vol, now + start)
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + start)
        osc.stop(now + start + dur)
      })
    } catch {}
  }

  /**
   * Smooth velvet swoosh when opening the sliding cart drawer
   */
  playDrawerOpen() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.12)

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.14)
    } catch {}
  }

  /**
   * Celebratory chime when a payment succeeds
   */
  playSuccess() {
    try {
      const ctx = this.getContext()
      if (!ctx) return
      const now = ctx.currentTime

      const notes = [523.25, 659.25, 783.99, 1046.50] // C major arpeggio
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.07)

        gain.gain.setValueAtTime(0.12, now + i * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + i * 0.07)
        osc.stop(now + i * 0.07 + 0.42)
      })
    } catch {}
  }
}

export const storeAudio = new StoreAudioSynthesizer()
