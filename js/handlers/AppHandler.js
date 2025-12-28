/**
 * AppHandler
 * Handles special .app files like countdown, settings, etc.
 */
export class AppHandler {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.intervals = new Map();
  }

  /**
   * Render app content based on appType
   */
  render(container, file) {
    container.classList.add('app');

    const appType = file.appType || 'unknown';

    switch (appType) {
      case 'countdown':
        this.renderCountdown(container, file);
        break;
      case 'audio':
        this.renderAudioPlayer(container, file);
        break;
      default:
        this.renderUnknown(container, file);
    }
  }

  /**
   * Render countdown app
   */
  renderCountdown(container, file) {
    const config = file.config || {};
    const targetDate = new Date(config.targetDate || 'December 31, 2025');
    const title = config.title || 'Countdown';
    const message = config.message || 'Time\'s up!';

    container.innerHTML = `
      <div class="countdown-display">
        <div class="countdown-title">${title}</div>
        <div class="countdown-timer">
          <div class="countdown-unit">
            <span class="countdown-value" id="countdown-days">--</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-unit">
            <span class="countdown-value" id="countdown-hours">--</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-unit">
            <span class="countdown-value" id="countdown-minutes">--</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-unit">
            <span class="countdown-value" id="countdown-seconds">--</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>
        <div class="countdown-message" id="countdown-message" style="display: none;">${message}</div>
      </div>
    `;

    // Update countdown
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const diff = target - now;

      if (diff <= 0) {
        document.getElementById('countdown-days').textContent = '0';
        document.getElementById('countdown-hours').textContent = '0';
        document.getElementById('countdown-minutes').textContent = '0';
        document.getElementById('countdown-seconds').textContent = '0';
        document.getElementById('countdown-message').style.display = 'block';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('countdown-days').textContent = days;
      document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    this.intervals.set(file.path, intervalId);
  }

  /**
   * Render audio player app
   */
  renderAudioPlayer(container, file) {
    const config = file.config || {};
    const title = config.title || 'Audio Player';

    container.innerHTML = `
      <div class="audio-player-app">
        <div class="audio-title">${title}</div>
        <div class="audio-controls">
          <button class="audio-play-btn" id="appAudioToggle">
            <i data-lucide="play"></i>
            <span>Play Music</span>
          </button>
        </div>
        <div class="audio-status" id="appAudioStatus">Paused</div>
      </div>
    `;

    // Refresh icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .audio-player-app {
        text-align: center;
        padding: var(--space-lg);
      }
      .audio-title {
        font-size: var(--font-size-lg);
        color: var(--accent-primary);
        margin-bottom: var(--space-lg);
      }
      .audio-play-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
        padding: var(--space-md) var(--space-lg);
        background: var(--accent-gradient);
        color: var(--bg-primary);
        border-radius: 8px;
        font-weight: 600;
        transition: transform var(--transition-fast);
      }
      .audio-play-btn:hover {
        transform: scale(1.05);
      }
      .audio-play-btn svg {
        width: 20px;
        height: 20px;
      }
      .audio-status {
        margin-top: var(--space-md);
        color: var(--text-secondary);
        font-size: var(--font-size-sm);
      }
    `;
    container.appendChild(style);

    // Connect to audio manager
    const btn = document.getElementById('appAudioToggle');
    const status = document.getElementById('appAudioStatus');

    if (this.audioManager) {
      const updateUI = () => {
        const isPlaying = this.audioManager.isPlaying();
        btn.innerHTML = `
          <i data-lucide="${isPlaying ? 'pause' : 'play'}"></i>
          <span>${isPlaying ? 'Pause Music' : 'Play Music'}</span>
        `;
        status.textContent = isPlaying ? 'Playing' : 'Paused';
        if (window.lucide) {
          window.lucide.createIcons();
        }
      };

      btn.addEventListener('click', () => {
        this.audioManager.toggle();
        updateUI();
      });

      updateUI();
    }
  }

  /**
   * Render unknown app type
   */
  renderUnknown(container, file) {
    container.innerHTML = `
      <div class="unknown-app">
        <i data-lucide="help-circle" style="width: 64px; height: 64px; color: var(--text-tertiary);"></i>
        <p style="color: var(--text-secondary); margin-top: var(--space-md);">
          Unknown application type: ${file.appType || 'none'}
        </p>
      </div>
    `;

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  /**
   * Cleanup when window closes
   */
  cleanup(path) {
    if (this.intervals.has(path)) {
      clearInterval(this.intervals.get(path));
      this.intervals.delete(path);
    }
  }

  /**
   * Check if this handler can handle the file
   */
  static canHandle(file) {
    return file.fileType === 'app' || file.name.endsWith('.app');
  }
}
