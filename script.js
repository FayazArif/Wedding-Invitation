const weddingDate = new Date("2026-10-17T12:00:00+05:30");

const body = document.body;
const openInvite = document.getElementById("openInvite");
const invitation = document.getElementById("invitation");
const musicToggle = document.getElementById("musicToggle");
const weddingMusic = document.getElementById("weddingMusic");
const petalLayer = document.getElementById("petalLayer");
const particleCanvas = document.getElementById("goldParticles");
const scratchCanvas = document.getElementById("scratchCanvas");
const countdown = document.getElementById("countdown");

let musicReady = false;
let scratchRevealed = false;

function openInvitation() {
  if (window.gsap) {
    window.gsap.to("#openingCover", {
      yPercent: -100,
      opacity: 0,
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => body.classList.add("invite-open")
    });
  } else {
    body.classList.add("invite-open");
  }

  invitation.scrollIntoView({ behavior: "smooth", block: "start" });
  tryPlayMusic();
}

async function tryPlayMusic() {
  if (!weddingMusic || musicReady) return;

  try {
    await weddingMusic.play();
    musicReady = true;
    musicToggle.classList.add("is-playing");
  } catch {
    musicReady = false;
  }
}

function toggleMusic() {
  if (!weddingMusic) return;

  if (weddingMusic.paused) {
    weddingMusic.play().then(() => {
      musicReady = true;
      musicToggle.classList.add("is-playing");
    }).catch(() => {
      musicToggle.classList.remove("is-playing");
    });
  } else {
    weddingMusic.pause();
    musicToggle.classList.remove("is-playing");
  }
}

function initRevealAnimations() {
  const panels = document.querySelectorAll(".reveal-panel");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (window.gsap) {
            window.gsap.fromTo(
              entry.target,
              { y: 26, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
            );
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  panels.forEach(panel => observer.observe(panel));
}

function updateCountdown() {
  const now = new Date();
  const distance = Math.max(0, weddingDate - now);
  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.querySelector('[data-unit="days"]').textContent = String(days).padStart(3, "0");
  countdown.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, "0");
  countdown.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, "0");
  countdown.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, "0");
}

function initScratchCard() {
  if (!scratchCanvas) return;

  const ctx = scratchCanvas.getContext("2d", { willReadFrequently: true });
  const resizeObserver = new ResizeObserver(drawScratchCover);
  resizeObserver.observe(scratchCanvas);

  let drawing = false;

  function setCanvasSize() {
    const rect = scratchCanvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    scratchCanvas.width = Math.floor(rect.width * ratio);
    scratchCanvas.height = Math.floor(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawScratchCover() {
    const rect = scratchCanvas.getBoundingClientRect();
    setCanvasSize();
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "#7b4a11");
    gradient.addColorStop(0.28, "#ffe7a0");
    gradient.addColorStop(0.5, "#b9812a");
    gradient.addColorStop(0.72, "#fff7cc");
    gradient.addColorStop(1, "#8f5717");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(7, 5, 4, 0.26)";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = "rgba(255, 247, 231, 0.92)";
    ctx.font = "700 18px Cinzel, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2);
  }

  function scratchAt(event) {
    const rect = scratchCanvas.getBoundingClientRect();
    const point = event.touches ? event.touches[0] : event;
    const x = point.clientX - rect.left;
    const y = point.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(26, rect.width * 0.055), 0, Math.PI * 2);
    ctx.fill();
    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (scratchRevealed) return;

    const pixels = ctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] < 20) transparent++;
    }

    if (transparent / (pixels.length / 16) > 0.42) {
      scratchRevealed = true;
      scratchCanvas.style.transition = "opacity 0.7s ease";
      scratchCanvas.style.opacity = "0";
      scratchCanvas.style.pointerEvents = "none";
      burstPetals(56);
    }
  }

  scratchCanvas.addEventListener("pointerdown", event => {
    drawing = true;
    scratchCanvas.setPointerCapture(event.pointerId);
    scratchAt(event);
  });

  scratchCanvas.addEventListener("pointermove", event => {
    if (!drawing) return;
    scratchAt(event);
  });

  scratchCanvas.addEventListener("pointerup", () => {
    drawing = false;
  });

  scratchCanvas.addEventListener("pointercancel", () => {
    drawing = false;
  });
}

function burstPetals(amount = 34) {
  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.random() * 220 - 110}px`);
    petal.style.setProperty("--fall", `${2.8 + Math.random() * 3.2}s`);
    petal.style.animationDelay = `${Math.random() * 0.5}s`;
    petal.style.transform = `rotate(${Math.random() * 180}deg)`;
    petalLayer.appendChild(petal);
    petal.addEventListener("animationend", () => petal.remove());
  }
}

function initGoldParticles() {
  const ctx = particleCanvas.getContext("2d");
  const particles = [];
  const particleCount = Math.min(90, Math.floor(window.innerWidth / 14));

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    particleCanvas.width = Math.floor(window.innerWidth * ratio);
    particleCanvas.height = Math.floor(window.innerHeight * ratio);
    particleCanvas.style.width = `${window.innerWidth}px`;
    particleCanvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.4 + 0.6,
      speed: Math.random() * 0.35 + 0.08,
      alpha: Math.random() * 0.45 + 0.12
    };
  }

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(particle => {
      particle.y -= particle.speed;
      particle.x += Math.sin((particle.y + particle.size) * 0.015) * 0.16;

      if (particle.y < -8) {
        Object.assign(particle, createParticle(), { y: window.innerHeight + 8 });
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 220, 138, ${particle.alpha})`;
      ctx.shadowColor = "rgba(255, 220, 138, 0.7)";
      ctx.shadowBlur = 10;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  particles.push(...Array.from({ length: particleCount }, createParticle));
  draw();
  window.addEventListener("resize", resize);
}

// Paste your Google Apps Script Web App URL here (ends with /exec).
// See the setup steps shared with you to create it.
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycbywp4e5PlvREhxvWnDSWolOxlN5uknKnLvCiv7wz3jwR-ZU-eaF6BvbF8KZ14jQMj319w/exec";

function initWishesForm() {
  const form = document.getElementById("wishesForm");
  if (!form) return;

  const nameInput = document.getElementById("wishName");
  const messageInput = document.getElementById("wishMessage");
  const hint = document.getElementById("wishHint");
  const submitBtn = form.querySelector(".wishes-submit");

  form.addEventListener("submit", async event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const wish = messageInput.value.trim();

    if (!name || !wish) {
      hint.textContent = "Please enter your name and your wishes.";
      hint.classList.remove("is-success");
      return;
    }

    submitBtn.disabled = true;
    hint.classList.remove("is-success");
    hint.textContent = "Sending your wishes...";

    try {
      await fetch(SHEET_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ name, wish })
      });

      hint.textContent = "JazakAllahu Khairan! Your wishes have been received.";
      hint.classList.add("is-success");
      form.reset();
      burstPetals(28);
    } catch {
      hint.textContent = "Sorry, something went wrong. Please try again.";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

openInvite.addEventListener("click", openInvitation);
musicToggle.addEventListener("click", toggleMusic);
document.addEventListener("pointerdown", tryPlayMusic, { once: true });

initRevealAnimations();
initWishesForm();
initScratchCard();
initGoldParticles();
updateCountdown();
setInterval(updateCountdown, 1000);

if (window.AOS) {
  window.AOS.init({
    once: true,
    duration: 850,
    easing: "ease-out-cubic"
  });
}
