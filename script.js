const yes = document.getElementById('yes');
const no = document.getElementById('no');
const msg = document.getElementById('msg');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const gif = document.getElementById('gif');
const hearts = document.getElementById('hearts');

const afterYes = document.getElementById('afterYes');
const finalText = document.getElementById('finalText');
const copyBtn = document.getElementById('copyMsg');
const resetBtn = document.getElementById('reset');
const countdownEl = document.getElementById('countdown');
const bgHearts = document.getElementById('bgHearts');

const KEY = "valentineAccepted_v1";
let chosenPlan = "";

// -------- Personalization via URL params --------
const params = new URLSearchParams(window.location.search);
const toName = params.get('to')?.trim();
const fromName = params.get('from')?.trim();

const TO = toName || "my favorite person";
const FROM = fromName || "me";

function setBaseText() {
  title.textContent = `Will you be my Valentine, ${TO}? 💘`;
  subtitle.textContent = `— from ${FROM} 😌`;
}
setBaseText();

// -------- Background hearts --------
function startBgHearts() {
  if (!bgHearts) return;
  setInterval(() => {
    const el = document.createElement('div');
    el.className = 'bg-heart';
    el.textContent = Math.random() > 0.3 ? '💗' : '💖';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.fontSize = (14 + Math.random() * 22) + 'px';
    el.style.animationDuration = (7 + Math.random() * 7) + 's';
    bgHearts.appendChild(el);
    setTimeout(() => el.remove(), 16000);
  }, 600);
}
startBgHearts();

// -------- Countdown --------
function nextValentines() {
  const now = new Date();
  let year = now.getFullYear();
  const vdayThisYear = new Date(year, 1, 14, 0, 0, 0); // Feb=1
  if (now > vdayThisYear) year += 1;
  return new Date(year, 1, 14, 0, 0, 0);
}

function updateCountdown() {
  if (!countdownEl) return;
  const target = nextValentines();
  const ms = target - new Date();
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));

  if (totalSeconds === 0) {
    countdownEl.textContent = "It’s Valentine’s Day! 💘";
    return;
  }

  const d = Math.floor(totalSeconds / (3600 * 24));
  const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  countdownEl.textContent = `Valentine’s in ${d}d ${h}h ${m}m ${s}s ⏳`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// -------- Celebration effects --------
function popHearts(n = 18) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('div');
    s.className = 'heart';
    s.textContent = Math.random() > 0.25 ? "💖" : "💘";
    s.style.left = Math.random() * w + "px";
    s.style.top = (h - 20) + "px";
    s.style.fontSize = (18 + Math.random() * 22) + "px";
    s.style.animationDuration = (1.8 + Math.random() * 1.8) + "s";
    hearts.appendChild(s);
    setTimeout(() => s.remove(), 3000);
  }
}

function confettiBurst(durationMs = 1200) {
  const end = Date.now() + durationMs;

  (function frame(){
    if (Date.now() >= end) return;

    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'heart';
      p.textContent = ["✨","🎉","💗","💞"][Math.floor(Math.random()*4)];
      p.style.left = (Math.random() * window.innerWidth) + "px";
      p.style.top = (window.innerHeight - 10) + "px";
      p.style.fontSize = (14 + Math.random() * 14) + "px";
      p.style.animationDuration = (1.2 + Math.random() * 1.2) + "s";
      hearts.appendChild(p);
      setTimeout(() => p.remove(), 2500);
    }

    requestAnimationFrame(frame);
  })();
}

// -------- Better "No" behavior --------
const noTexts = [
  "No 🙃",
  "Are you sure? 😭",
  "Pleaseeee 🥺",
  "Think again 😳",
  "Ok last chance 😤",
  "Fine… maybe? 😅",
  "Ok ok YES 😌"
];

let noCount = 0;

function moveNoButton() {
  const pad = 14;
  const rect = no.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - pad;
  const maxY = window.innerHeight - rect.height - pad;

  const x = Math.max(pad, Math.random() * maxX);
  const y = Math.max(pad, Math.random() * maxY);

  no.style.position = "fixed";
  no.style.left = x + "px";
  no.style.top = y + "px";
}

function updateNo() {
  no.textContent = noTexts[Math.min(noCount, noTexts.length - 1)];
  noCount++;

  yes.style.transform = `scale(${1 + noCount * 0.07})`;

  if (noCount <= 4) {
    moveNoButton();
  } else if (noCount === 5) {
    no.style.position = "relative";
    no.style.left = "auto";
    no.style.top = "auto";
  } else if (noCount >= 6) {
    no.textContent = "Ok ok YES 😌";
    no.removeEventListener('pointerdown', updateNo);
    no.addEventListener('click', () => onYes(false), { once: true });
  }
}

no.addEventListener('mouseenter', () => { if (noCount <= 4) moveNoButton(); });
no.addEventListener('pointerdown', updateNo);

// -------- Plan picker --------
document.querySelectorAll('.plan').forEach(btn => {
  btn.addEventListener('click', () => {
    chosenPlan = btn.dataset.plan;
    finalText.textContent = `Locked in: ${chosenPlan} ✅`;
    popHearts(10);
  });
});

function buildFinalMessage() {
  const planLine = chosenPlan ? `Plan: ${chosenPlan}` : `Plan: your choice 😉`;
  return `She said YES! 💘\nTo: ${TO}\nFrom: ${FROM}\n${planLine}\n\nSee you on Valentine’s 🥰`;
}

copyBtn?.addEventListener('click', async () => {
  const text = buildFinalMessage();
  try {
    await navigator.clipboard.writeText(text);
    finalText.textContent = "Copied! Now paste it 😌📋";
    popHearts(12);
  } catch (e) {
    finalText.textContent = "Auto-copy blocked sometimes. Screenshot works too!";
  }
});

resetBtn?.addEventListener('click', () => {
  localStorage.removeItem(KEY);
  location.href = location.origin + location.pathname + window.location.search;
});

// -------- YES handler + state restore --------
function lockNoButton() {
  no.disabled = true;
  no.style.opacity = 0.55;
  no.style.cursor = "not-allowed";
  no.style.position = "relative";
  no.style.left = "auto";
  no.style.top = "auto";
}

function onYes(restoring = false) {
  title.textContent = restoring
    ? `Still my Valentine, ${TO} 😌💞`
    : `Hehehe I knew it, ${TO} 😌💞`;

  subtitle.textContent = "Now it’s official.";
  msg.style.display = "block";
  msg.textContent = "YAYYY!! 🥰";
  afterYes.style.display = "block";

  gif.src = "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif";

  popHearts(28);
  confettiBurst(1200);

  if (navigator.vibrate) navigator.vibrate([30, 40, 30]);

  lockNoButton();
  yes.disabled = true;
  yes.style.opacity = 0.85;

  localStorage.setItem(KEY, "yes");
}

yes.addEventListener('click', () => onYes(false));

(function restoreIfAccepted(){
  if (localStorage.getItem(KEY) === "yes") {
    onYes(true);
  }
})
(function restoreIfAccepted(){
  if (localStorage.getItem(KEY) === "yes") {
    onYes(true);
  }
})();