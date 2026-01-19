const startDate = new Date('2026-01-18T00:00:00');
const hundredDays = new Date(startDate.getTime() + 100 * 24 * 60 * 60 * 1000);

const notes = [
  '你是夜空里闪的那束光，我想做让你安心的那一束。',
  '和你说话时，心跳像被重新调频，恰好落在你的节奏里。',
  '每一次对视，都像宇宙在把秘密递给我们。',
  '想陪你把日常叠成高级感：咖啡、展览、月光、和你。',
  '你的每一面我都喜欢，而我只想把最柔软的那面给你。'
];

const starCanvas = document.getElementById('starfield');
const starCtx = starCanvas ? starCanvas.getContext('2d') : null;
let stars = [];

const ctaLove = document.getElementById('cta-love');
const ctaNote = document.getElementById('cta-note');
const noteText = document.getElementById('note-text');
const noteBox = document.getElementById('note-box');
const countdownLabel = document.getElementById('countdown-label');
const hundredDayDate = document.getElementById('hundred-day-date');
const nextBirthday = document.getElementById('next-birthday');
const heartsLayer = document.getElementById('hearts');
const memoryGrid = document.getElementById('memory-grid');
const memoryOverlay = document.getElementById('memory-overlay');
const startMemoryBtn = document.getElementById('start-memory');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');

function updateDates() {
  hundredDayDate.textContent = `${hundredDays.getFullYear()}.${String(hundredDays.getMonth() + 1).padStart(2, '0')}.${String(hundredDays.getDate()).padStart(2, '0')}`;
  nextBirthday.textContent = '等你告诉我生日，我来策划惊喜';
  countdownLabel.textContent = '面向 100 天心动打卡';
}

function updateCountdown() {
  const now = new Date();
  const target = hundredDays;
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
}

function setupStarfield() {
  if (!starCanvas || !starCtx) return;
  const area = window.innerWidth * window.innerHeight;
  const count = Math.min(140, Math.floor(area / 9000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * starCanvas.width,
    y: Math.random() * starCanvas.height,
    vx: (Math.random() - 0.5) * 0.08,
    vy: (Math.random() - 0.5) * 0.08,
    size: Math.random() * 1.2 + 0.3,
  }));
}

function resizeStarfield() {
  if (!starCanvas || !starCtx) return;
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  setupStarfield();
}

function drawStarfield() {
  if (!starCanvas || !starCtx) return;
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  for (const star of stars) {
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0) star.x = starCanvas.width;
    if (star.x > starCanvas.width) star.x = 0;
    if (star.y < 0) star.y = starCanvas.height;
    if (star.y > starCanvas.height) star.y = 0;
  }

  for (const star of stars) {
    starCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    starCtx.beginPath();
    starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starCtx.fill();
  }

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        const alpha = 1 - dist / 140;
        starCtx.strokeStyle = `rgba(247, 194, 124, ${alpha * 0.45})`;
        starCtx.lineWidth = 0.6;
        starCtx.beginPath();
        starCtx.moveTo(stars[i].x, stars[i].y);
        starCtx.lineTo(stars[j].x, stars[j].y);
        starCtx.stroke();
      }
    }
  }

  requestAnimationFrame(drawStarfield);
}

function typeWriter(text, element) {
  element.innerHTML = '';
  let idx = 0;
  function tick() {
    element.innerHTML = text.slice(0, idx) + '<span class="cursor">|</span>';
    idx += 1;
    if (idx <= text.length) {
      requestAnimationFrame(() => setTimeout(tick, 36));
    } else {
      element.innerHTML = text;
    }
  }
  tick();
}

function randomNote() {
  const pick = notes[Math.floor(Math.random() * notes.length)];
  noteText.textContent = pick;
}

function flashNote() {
  if (!noteBox) return;
  noteBox.classList.remove('flash');
  void noteBox.offsetWidth; // 强制重绘以重置动画
  noteBox.classList.add('flash');
}

function scrollToNotes() {
  document.querySelector('#notes').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function spawnHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.style.left = `${x - 9}px`;
  heart.style.top = `${y - 9}px`;
  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
}

function scrollToLetter() {
  document.querySelector('#letter').scrollIntoView({ behavior: 'smooth' });
}

function attachEvents() {
  ctaNote.addEventListener('click', () => {
    randomNote();
    flashNote();
    scrollToNotes();
    spawnHeart(window.innerWidth * 0.6, window.innerHeight * 0.15);
  });

  ctaLove.addEventListener('click', () => {
    scrollToLetter();
    spawnHeart(window.innerWidth * 0.5, window.innerHeight * 0.2);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn')) {
      spawnHeart(e.clientX, e.clientY);
    }
  });
}

function initLetter() {
  const text = '杨文琪：\n遇见你是 2026 年最浪漫的剧情反转。想陪你穿越城市的霓虹，也想在你难过时，把肩膀留给你。未来不管晴天或雨天，我都想在你身边，把每个普通日子调成我们专属的高阶浪漫频道。—— 骆邹阳';
  typeWriter(text, document.getElementById('typewriter'));
}

// 记忆翻牌游戏
const icons = ['🌙', '⭐', '💌', '🎧', '🍰', '🌹'];
let deck = [];
let flipped = [];
let matched = 0;
let moves = 0;
let timeLeft = 60;
let countdownTimer = null;
let gameRunning = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildDeck() {
  deck = shuffle([...icons, ...icons]).map((icon, index) => ({ icon, id: `${icon}-${index}` }));
}

function renderDeck() {
  if (!memoryGrid) return;
  memoryGrid.innerHTML = '';
  deck.forEach((card) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'memory-card';
    cardEl.dataset.id = card.id;
    cardEl.dataset.icon = card.icon;
    cardEl.innerHTML = `
      <div class="memory-inner">
        <div class="front">★</div>
        <div class="back">${card.icon}</div>
      </div>
    `;
    cardEl.addEventListener('click', () => handleFlip(cardEl));
    memoryGrid.appendChild(cardEl);
  });
}

function resetGame() {
  flipped = [];
  matched = 0;
  moves = 0;
  timeLeft = 60;
  movesEl.textContent = moves;
  timeEl.textContent = timeLeft;
  clearInterval(countdownTimer);
  gameRunning = false;
  if (memoryOverlay) {
    memoryOverlay.style.display = 'grid';
    memoryOverlay.textContent = '点击「开始」洗牌';
  }
}

function startCountdown() {
  countdownTimer = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft < 0) timeLeft = 0;
    timeEl.textContent = timeLeft;
    if (timeLeft === 0) {
      endMemoryGame('时间到');
    }
  }, 1000);
}

function handleFlip(cardEl) {
  if (!gameRunning) return;
  if (cardEl.classList.contains('matched') || cardEl.classList.contains('flipped')) return;
  if (flipped.length === 2) return;
  cardEl.classList.add('flipped');
  flipped.push(cardEl);
  if (flipped.length === 2) {
    moves += 1;
    movesEl.textContent = moves;
    const [a, b] = flipped;
    if (a.dataset.icon === b.dataset.icon) {
      a.classList.add('matched');
      b.classList.add('matched');
      matched += 1;
      flipped = [];
      if (matched === icons.length) {
        endMemoryGame('全部找到！');
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = [];
      }, 800);
    }
  }
}

function endMemoryGame(message) {
  if (!gameRunning) return;
  gameRunning = false;
  clearInterval(countdownTimer);
  if (memoryOverlay) {
    memoryOverlay.style.display = 'grid';
    memoryOverlay.textContent = `${message} 步数 ${moves}`;
  }
  startMemoryBtn.textContent = '再玩一次';
}

function startMemoryGame() {
  buildDeck();
  renderDeck();
  resetGame();
  gameRunning = true;
  if (memoryOverlay) {
    memoryOverlay.style.display = 'none';
  }
  startCountdown();
}

function initGame() {
  if (!startMemoryBtn) return;
  startMemoryBtn.addEventListener('click', startMemoryGame);
}

function init() {
  updateDates();
  updateCountdown();
  setInterval(updateCountdown, 1000 * 30);
  attachEvents();
  initLetter();
  randomNote();
  resizeStarfield();
  drawStarfield();
  window.addEventListener('resize', resizeStarfield);
  initGame();
}

document.addEventListener('DOMContentLoaded', init);
