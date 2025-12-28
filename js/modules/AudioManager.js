/**
 * AudioManager Module
 * Handles background music playback
 */
export class AudioManager {
  constructor(audioSelector, buttonSelector) {
    this.audio = document.querySelector(audioSelector);
    this.button = document.querySelector(buttonSelector);
    this.playing = false;

    if (!this.audio) return;

    this.init();
  }

  init() {
    // Start muted
    this.audio.volume = 0.3;
    this.audio.muted = true;

    // Button click handler
    if (this.button) {
      this.button.addEventListener('click', () => this.toggle());
    }

    // Update UI on state change
    this.audio.addEventListener('play', () => this.updateUI(true));
    this.audio.addEventListener('pause', () => this.updateUI(false));

    // Initial UI state
    this.updateUI(false);
  }

  /**
   * Toggle play/pause
   */
  toggle() {
    if (this.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Play audio
   */
  play() {
    this.audio.muted = false;
    this.audio.play().then(() => {
      this.playing = true;
      this.updateUI(true);
    }).catch(err => {
      console.log('Audio playback failed:', err);
    });
  }

  /**
   * Pause audio
   */
  pause() {
    this.audio.pause();
    this.playing = false;
    this.updateUI(false);
  }

  /**
   * Check if playing
   */
  isPlaying() {
    return this.playing && !this.audio.paused;
  }

  /**
   * Update button UI
   */
  updateUI(isPlaying) {
    if (!this.button) return;

    const icon = this.button.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isPlaying ? 'volume-2' : 'volume-x');

      // Refresh Lucide icons
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    if (isPlaying) {
      this.button.classList.add('active');
    } else {
      this.button.classList.remove('active');
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(level) {
    this.audio.volume = Math.max(0, Math.min(1, level));
  }

  /**
   * Get current volume
   */
  getVolume() {
    return this.audio.volume;
  }
}
