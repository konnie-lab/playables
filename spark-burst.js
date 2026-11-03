// Canvas adaptation of Konnie-Lab's pixi-blank/src/fx/SparkBurstFX.js.
// Original star texture, 46 particles, drag, gravity and cubic fade.
// No renderer loop runs between bursts or while ambience is paused.
class SparkBurstFX {
  constructor(host, texture, delay, interval = 8000) {
    this.texture = texture;
    this.delay = delay;
    this.interval = interval;
    this.particles = [];
    this.running = false;
    this.timer = null;
    this.frame = null;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = 360;
    this.context = this.canvas.getContext('2d');
    this.context.scale(1.5, 1.5);
    host.append(this.canvas);
  }

  setRunning(running) {
    if (this.running === running) return;
    this.running = running;
    clearTimeout(this.timer);
    cancelAnimationFrame(this.frame);
    this.timer = this.frame = null;
    if (!running) return;
    if (this.particles.length) this.startFrames();
    else this.schedule(this.delay);
  }

  schedule(delay) {
    this.timer = setTimeout(() => {
      this.timer = null;
      this.play();
    }, delay);
  }

  play() {
    if (!this.running) return;
    const random = (min, max) => min + Math.random() * (max - min);
    for (let index = 0; index < 46; index++) {
      this.particles.push({
        x: 120, y: 120,
        vx: Math.cos(random(0, Math.PI * 2)) * random(0, 220) * .4,
        vy: -random(220, 380) * .28,
        size: this.texture.naturalWidth * random(.06, .14) * .6,
        rotation: random(0, Math.PI * 2),
        spin: random(-2.4, 2.4),
        // Keep new stars emerging at the orb's centre while the plume rises.
        age: -index * .32 / 46,
        lifetime: random(.9, 1.38),
      });
    }
    this.startFrames();
  }

  startFrames() {
    this.previousTime = performance.now();
    this.frame = requestAnimationFrame(this.update);
  }

  update = now => {
    this.frame = null;
    if (!this.running) return;
    const dt = Math.min((now - this.previousTime) / 1000, .05);
    this.previousTime = now;
    const context = this.context;
    context.clearRect(0, 0, 240, 240);
    context.globalCompositeOperation = 'lighter';
    for (let index = this.particles.length - 1; index >= 0; index--) {
      const particle = this.particles[index];
      particle.age += dt;
      if (particle.age < 0) continue;
      if (particle.age >= particle.lifetime) {
        this.particles.splice(index, 1);
        continue;
      }
      const step = Math.min(dt, particle.age);
      particle.vx *= .992 ** (step * 60);
      particle.x += particle.vx * step;
      particle.y += particle.vy * step + 140 * step * step;
      particle.vy += 280 * step;
      particle.rotation += particle.spin * step;
      const fade = Math.max(0, (particle.age / particle.lifetime - .62) / .38);
      context.save();
      context.globalAlpha = 1 - fade ** 3;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.drawImage(this.texture, -particle.size / 2, -particle.size / 2, particle.size, particle.size);
      context.restore();
    }
    if (this.particles.length) this.frame = requestAnimationFrame(this.update);
    else this.schedule(this.interval);
  };
}
