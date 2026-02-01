const yes = document.getElementById('yes');
const no = document.getElementById('no');
const msg = document.getElementById('msg');
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const gif = document.getElementById('gif');
const hearts = document.getElementById('hearts');
const bgHearts = document.getElementById('bgHearts');
const afterYes = document.getElementById('afterYes');
const finalText = document.getElementById('finalText');

const KEY = "valentineAccepted_clean";

// -------- Personalization --------
const params = new URLSearchParams(window.location.search);
const TO = params.get('to') || "my favorite person";
const FROM = params.get('from') || "me";

title.textContent = `Will you be my Valentine, ${TO}? 💘`;
subtitle.textContent = `— from ${FROM} 😌`;

// -------- Background hearts --------
setInterval(() => {
  if (bgHearts.childElementCount > 60) return;
  const h = document.createElement('div');
  h.className = 'bg-heart';
  h.textContent = Math.random() > 0.3 ? '💗' : '💖';
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = 14 + Math.random() * 22 + 'px';
  bgHearts.appendChild(h);
  setTimeout(() => h.remove(), 12000);
}, 700);

// -------- Effects --------
function popHearts(n = 20){
  if (hearts.childElementCount > 120) return;
  for (let i = 0; i < n; i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.textContent = Math.random() > 0.3 ? '💖' : '💘';
    h.style.left = Math.random() * window.innerWidth + 'px';
    h.style.top = window.innerHeight + 'px';
    hearts.appendChild(h);
    setTimeout(() => h.remove(), 3000);
  }
}

// -------- NO logic --------
const noTexts = [
  "No 🙃",
  "Are you sure? 😭",
  "Pleaseeee 🥺",
  "Think again 😳",
  "Ok last chance 😤",
  "Ok ok YES 😌"
];

let noCount = 0;

no.addEventListener('pointerdown', () => {
  no.textContent = noTexts[Math.min(noCount, noTexts.length - 1)];
  noCount++;
  yes.style.transform = `scale(${1 + noCount * 0.07})`;

  if (noCount < 5) {
    no.style.position = "fixed";
    no.style.left = Math.random() * (window.innerWidth - 120) + 'px';
    no.style.top = Math.random() * (window.innerHeight - 60) + 'px';
  } else {
    no.addEventListener('click', () => onYes(false), { once: true });
  }
});

// -------- YES --------
function onYes(restoring){
  title.textContent = restoring
    ? `Still my Valentine, ${TO} 😌💞`
    : `I knew it, ${TO} 😌💞`;

  subtitle.textContent = "Now it’s official.";
  msg.style.display = "block";
  afterYes.style.display = "block";
  gif.src = "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif";

  popHearts(30);
  no.disabled = true;
  yes.disabled = true;

  localStorage.setItem(KEY, "yes");
}

yes.addEventListener('click', () => onYes(false));

// -------- Plan selection --------
document.querySelectorAll('.plan').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.plan').forEach(b => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    finalText.textContent = `Locked in: ${btn.dataset.plan} 💖`;
    popHearts(10);
  });
});

// -------- Restore state --------
if (localStorage.getItem(KEY) === "yes") {
  onYes(true);
}
