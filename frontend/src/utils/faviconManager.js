/**
 * FaviconManager - High-Performance Interactive & Animated Favicon Engine
 * Renders crisp 64x64 Retina canvas animations directly into the browser tab icon.
 */

class FaviconManager {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 64;
    this.canvas.height = 64;
    this.ctx = this.canvas.getContext('2d');
    
    this.status = 'idle'; // 'idle' | 'recording' | 'processing' | 'waveform' | 'success' | 'error' | 'away' | 'emoji'
    this.badge = null;
    this.emoji = null;
    this.audioLevel = 0;
    this.animationFrame = null;
    this.angle = 0;
    this.pulse = 0;
    this.pulseDir = 1;
    this.lastFrameTime = 0;
    this.targetFps = 30;
    this.frameInterval = 1000 / this.targetFps;
    
    this.originalTitle = typeof document !== 'undefined' ? document.title : 'Intervibe';
    this.awayMessage = 'Waiting for your answer... 🎙️';
    this.isTabAway = false;
    this.flashTimeout = null;
    this.isListeningVisibility = false;
    
    this.linkElement = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    
    // Find or create favicon link element
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    this.linkElement = link;

    // Track tab visibility
    if (!this.isListeningVisibility) {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.isTabAway = true;
          this.originalTitle = document.title;
          if (this.status === 'idle') {
            this.render();
          }
        } else {
          this.isTabAway = false;
          if (document.title.includes(this.awayMessage)) {
            document.title = this.originalTitle;
          }
          this.render();
        }
      });
      this.isListeningVisibility = true;
    }

    this.startLoop();
  }

  getLink() {
    if (!this.linkElement || !document.head.contains(this.linkElement)) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      this.linkElement = link;
    }
    return this.linkElement;
  }

  setStatus(status) {
    if (this.status === status) return;
    this.status = status;
    this.angle = 0;
    this.render();
  }

  getStatus() {
    return this.status;
  }

  setBadge(count) {
    this.badge = count !== undefined && count !== null ? String(count) : null;
    this.render();
  }

  setEmoji(emojiChar) {
    this.emoji = emojiChar;
    if (emojiChar) {
      this.status = 'emoji';
    } else if (this.status === 'emoji') {
      this.status = 'idle';
    }
    this.render();
  }

  setAudioLevel(level) {
    this.audioLevel = Math.max(0, Math.min(100, level));
  }

  flash(status, duration = 3000) {
    if (this.flashTimeout) {
      clearTimeout(this.flashTimeout);
    }
    const previousStatus = this.status === status ? 'idle' : this.status;
    this.setStatus(status);
    
    this.flashTimeout = setTimeout(() => {
      this.setStatus(previousStatus);
      this.flashTimeout = null;
    }, duration);
  }

  startLoop() {
    if (this.animationFrame) return;

    const loop = (timestamp) => {
      const elapsed = timestamp - this.lastFrameTime;

      if (elapsed > this.frameInterval) {
        this.lastFrameTime = timestamp - (elapsed % this.frameInterval);
        this.updateState();
        this.render();
      }

      this.animationFrame = requestAnimationFrame(loop);
    };

    this.animationFrame = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  updateState() {
    this.angle = (this.angle + 0.08) % (Math.PI * 2);

    // Pulse animation
    this.pulse += 0.04 * this.pulseDir;
    if (this.pulse >= 1) {
      this.pulse = 1;
      this.pulseDir = -1;
    } else if (this.pulse <= 0) {
      this.pulse = 0;
      this.pulseDir = 1;
    }
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = 64;
    const h = 64;
    ctx.clearRect(0, 0, w, h);

    if (this.isTabAway && this.status === 'idle') {
      this.drawAwayState(ctx, w, h);
    } else {
      switch (this.status) {
        case 'recording':
          this.drawRecordingState(ctx, w, h);
          break;
        case 'processing':
          this.drawProcessingState(ctx, w, h);
          break;
        case 'waveform':
          this.drawWaveformState(ctx, w, h);
          break;
        case 'success':
          this.drawSuccessState(ctx, w, h);
          break;
        case 'error':
          this.drawErrorState(ctx, w, h);
          break;
        case 'emoji':
          this.drawEmojiState(ctx, w, h);
          break;
        case 'idle':
        default:
          this.drawIdleState(ctx, w, h);
          break;
      }
    }

    // Render Badge if present
    if (this.badge !== null && this.badge !== undefined && this.badge !== '') {
      this.drawBadge(ctx, w, h);
    }

    // Update Favicon Link URL
    try {
      const link = this.getLink();
      link.type = 'image/png';
      link.href = this.canvas.toDataURL('image/png');
    } catch (err) {
      // Gracefully handle any browser sandbox constraints
    }
  }

  // Draw 8-pointed Intervibe Star Shape
  drawStarPath(ctx, cx, cy, outerRadius, innerRadius) {
    const points = 8;
    const step = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  drawIdleState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const scale = 0.92 + this.pulse * 0.08;

    // Glowing halo
    const haloRadius = 26 * scale;
    const haloGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, haloRadius);
    haloGrad.addColorStop(0, 'rgba(225, 29, 72, 0.45)');
    haloGrad.addColorStop(0.6, 'rgba(147, 51, 234, 0.25)');
    haloGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // Outer Star Gradient
    const outerGrad = ctx.createLinearGradient(0, 0, w, h);
    outerGrad.addColorStop(0, '#E11D48'); // Rose-600
    outerGrad.addColorStop(0.5, '#9333EA'); // Purple-600
    outerGrad.addColorStop(1, '#0284C7'); // Sky-600

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    this.drawStarPath(ctx, cx, cy, 27, 13);
    ctx.fillStyle = outerGrad;
    ctx.fill();

    // Inner Star Gradient
    const innerGrad = ctx.createLinearGradient(w, 0, 0, h);
    innerGrad.addColorStop(0, '#BE123C');
    innerGrad.addColorStop(1, '#7E22CE');
    this.drawStarPath(ctx, cx, cy, 19, 9);
    ctx.fillStyle = innerGrad;
    ctx.fill();

    // Core White Spark
    this.drawStarPath(ctx, cx, cy, 11, 4.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.restore();
  }

  drawRecordingState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Expanding ripple waves
    const ripple1 = (this.angle * 4) % 28;
    const ripple2 = ((this.angle * 4) + 14) % 28;
    
    ctx.strokeStyle = `rgba(244, 63, 94, ${Math.max(0, 1 - ripple1 / 28)})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 14 + ripple1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(225, 29, 72, ${Math.max(0, 1 - ripple2 / 28)})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 14 + ripple2, 0, Math.PI * 2);
    ctx.stroke();

    // Red recording orb
    const orbGrad = ctx.createRadialGradient(cx - 3, cy - 3, 2, cx, cy, 16);
    orbGrad.addColorStop(0, '#FF4D6D');
    orbGrad.addColorStop(0.6, '#E11D48');
    orbGrad.addColorStop(1, '#9F1239');

    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.fill();

    // Inner Audio Dot / Mic symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, 5.5 + this.pulse * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawProcessingState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Glowing Rotating Ring
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle);

    // Orbit arc gradient
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    
    const grad = ctx.createConicGradient(0, 0, 0);
    grad.addColorStop(0, 'rgba(225, 29, 72, 0.1)');
    grad.addColorStop(0.4, '#9333EA');
    grad.addColorStop(0.8, '#06B6D4');
    grad.addColorStop(1, '#E11D48');

    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 1.6);
    ctx.stroke();

    // Glowing orbit head dot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(22, 0, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Center pulsating crystal
    const scale = 0.65 + this.pulse * 0.15;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    this.drawStarPath(ctx, cx, cy, 18, 8);
    ctx.fillStyle = '#9333EA';
    ctx.fill();
    this.drawStarPath(ctx, cx, cy, 10, 4);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
  }

  drawWaveformState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Background circle
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fill();

    // 4 Dynamic Audio Bars
    const barWidth = 6;
    const spacing = 4;
    const count = 4;
    const totalW = count * barWidth + (count - 1) * spacing;
    const startX = cx - totalW / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * (barWidth + spacing);
      // Generate sine wave height
      const dynamicVal = Math.sin(this.angle * 2 + i * 1.2) * 0.5 + 0.5;
      const height = Math.max(8, dynamicVal * 32);
      const y = cy - height / 2;

      const barGrad = ctx.createLinearGradient(0, y, 0, y + height);
      if (i % 2 === 0) {
        barGrad.addColorStop(0, '#F43F5E');
        barGrad.addColorStop(1, '#FB7185');
      } else {
        barGrad.addColorStop(0, '#A855F7');
        barGrad.addColorStop(1, '#38BDF8');
      }

      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, height, 3);
      ctx.fill();
    }
  }

  drawSuccessState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Green emerald gradient orb
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#10B981');
    grad.addColorStop(1, '#059669');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 27, 0, Math.PI * 2);
    ctx.fill();

    // White Checkmark
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx - 3, cy + 8);
    ctx.lineTo(cx + 12, cy - 8);
    ctx.stroke();
  }

  drawErrorState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Crimson gradient orb
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#EF4444');
    grad.addColorStop(1, '#B91C1C');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 27, 0, Math.PI * 2);
    ctx.fill();

    // Exclamation Mark
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(cx - 3, cy - 14, 6, 16, 3);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy + 10, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAwayState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Soft dark circle
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(cx, cy, 27, 0, Math.PI * 2);
    ctx.fill();

    // Glowing gentle eye or sleep spark
    ctx.fillStyle = `rgba(244, 63, 94, ${0.4 + this.pulse * 0.6})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨', cx, cy);
  }

  drawEmojiState(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;

    // Soft backdrop
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.arc(cx, cy, 27, 0, Math.PI * 2);
    ctx.fill();

    // Emoji text
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji || '🚀', cx, cy + 2);
  }

  drawBadge(ctx, w, h) {
    const badgeText = this.badge.length > 3 ? '99+' : this.badge;
    const badgeRadius = 12;
    const badgeX = w - badgeRadius - 2;
    const badgeY = badgeRadius + 2;

    // Drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY + 1, badgeRadius + 1, 0, Math.PI * 2);
    ctx.fill();

    // Red badge background
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
    ctx.fill();

    // White badge border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Badge text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX, badgeY + 0.5);
  }
}

// Global Singleton Instance
export const faviconManager = typeof window !== 'undefined' ? new FaviconManager() : null;
export default faviconManager;
