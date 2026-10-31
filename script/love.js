window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

let canvas, ctx, width, height;
let petals = [];

// === INISIALISASI CANVAS & ANIMASI ===
function initCanvas() {
  canvas = document.getElementById("heart");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Inisialisasi Kelopak Bunga Bertebangan
  initPetals();

  // Mulai Loop Rendering
  requestAnimationFrame(render);
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

// === EFEK KELOPAK BUNGA SAKURA & MAWAR ===
function initPetals() {
  const petalSymbols = ['🌸', '🌺', '🌹', '💖', '✨'];
  const totalPetals = 35;

  petals = [];
  for (let i = 0; i < totalPetals; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 16 + 14, // 14px - 30px
      symbol: petalSymbols[Math.floor(Math.random() * petalSymbols.length)],
      speedY: Math.random() * 1.5 + 1,
      speedX: Math.random() * 0.8 - 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      opacity: Math.random() * 0.5 + 0.5
    });
  }
}

function updateAndDrawPetals() {
  for (let p of petals) {
    p.y += p.speedY;
    p.x += Math.sin(p.y * 0.01) + p.speedX;
    p.rotation += p.rotationSpeed;

    // Reset posisi ketika keluar layar bawah
    if (p.y > height + 20) {
      p.y = -20;
      p.x = Math.random() * width;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = p.opacity;
    ctx.font = `${p.size}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.symbol, 0, 0);
    ctx.restore();
  }
}

// === RENDERING HATI BESAR SOLID (GLOW PINK) ===
let pulseAngle = 0;

function drawBigHeart(centerX, centerY, baseSize) {
  // Efek Detak Hati Smooth (Pulsating)
  pulseAngle += 0.04;
  const scale = 1 + Math.sin(pulseAngle) * 0.05;
  const size = baseSize * scale;

  ctx.save();
  ctx.translate(centerX, centerY);

  // Layer Shadow Glow di Belakang Hati
  ctx.shadowColor = "rgba(255, 77, 109, 0.8)";
  ctx.shadowBlur = 45;

  // Path Hati Solid
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  
  // Kurva Kiri & Kanan
  ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
  ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size * 0.85, 0, size);
  ctx.bezierCurveTo(0, size * 0.85, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
  ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
  ctx.closePath();

  // Warna Gradasi Merah-Pink Lembut
  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "#ff758f");
  gradient.addColorStop(0.5, "#ff4d6d");
  gradient.addColorStop(1, "#c9184a");

  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.restore();
}

// === MAIN LOOP ===
function render() {
  // Latar belakang hitam pekat
  ctx.fillStyle = "#05020a";
  ctx.fillRect(0, 0, width, height);

  // Ukuran Hati Adaptif sesuai Layar (Responsif)
  const isMobile = width < 600;
  const heartSize = isMobile ? Math.min(width, height) * 0.45 : Math.min(width, height) * 0.38;
  const heartX = width / 2;
  const heartY = height / 2.5 - heartSize / 2;

  // Gambar Hati Utama & Kelopak
  drawBigHeart(heartX, heartY, heartSize);
  updateAndDrawPetals();

  requestAnimationFrame(render);
}

// === KONTROL MUSIK & PRESERVE STATE ===
function setupMusic() {
  const music = document.getElementById("backgroundMusic");
  if (!music) return;

  const isMusicPlaying = localStorage.getItem("musicPlaying") === "true";
  const musicCurrentTime = localStorage.getItem("musicCurrentTime") || 0;

  if (isMusicPlaying) {
    music.currentTime = parseFloat(musicCurrentTime);
    music.play().catch((error) => console.log("Playback failed:", error));
  }

  music.addEventListener("play", () => {
    localStorage.setItem("musicPlaying", "true");
  });

  music.addEventListener("pause", () => {
    localStorage.setItem("musicPlaying", "false");
  });

  setInterval(() => {
    if (!music.paused) {
      localStorage.setItem("musicCurrentTime", music.currentTime);
    }
  }, 1000);

  document.addEventListener("click", function startMusic() {
    music.play().catch((error) => console.log("Autoplay prevented:", error));
    document.removeEventListener("click", startMusic);
  }, { once: true });
}

// Proteksi Klik Kanan & Shortcut Copy
document.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
    e.preventDefault();
  }
});

// Jalankan ketika DOM Siap
document.addEventListener("DOMContentLoaded", () => {
  initCanvas();
  setupMusic();
});