const startDate = new Date(); // Placeholder for future use
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
const bdayDaysEl = document.getElementById('bday-days');
const bdayHoursEl = document.getElementById('bday-hours');
const bdayMinutesEl = document.getElementById('bday-minutes');

function updateDates() {
  nextBirthday.textContent = '大年初九 · 2月25日';
  countdownLabel.textContent = '距离生日还有';
}

function updateCountdown() {
  // Since we're focusing on the birthday countdown, 
  // this function is no longer needed for the 100-day countdown
  // The birthday countdown is handled separately
}

function updateBirthdayCountdown() {
  const now = new Date();
  // Set target to Feb 25, 2026 (the actual birthday)
  let target = new Date(2026, 1, 25); // Month is 0-indexed (February = 1)
  
  // If birthday has already passed, we'll still count down to the 2026 date
  // as that's the specific date mentioned
  
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  bdayDaysEl.textContent = String(days).padStart(2, '0');
  bdayHoursEl.textContent = String(hours).padStart(2, '0');
  bdayMinutesEl.textContent = String(minutes).padStart(2, '0');
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
  
  // Add random rotation for more dynamic effect
  const rotation = Math.random() * 360;
  heart.style.transform = `rotate(${rotation}deg)`;
  
  // Set random destination for the floating animation
  const endX = (Math.random() - 0.5) * 100; // Random horizontal movement (-50 to 50px)
  const endY = -(100 + Math.random() * 100); // Move upward (between -100 and -200px)
  
  heart.style.setProperty('--end-x', `${endX}px`);
  heart.style.setProperty('--end-y', `${endY}px`);
  
  setTimeout(() => heart.remove(), 4000); // Match the animation duration
}

// Enhanced heart rain effect
function createHeartRain() {
  // Check if on mobile device to reduce number of hearts for performance
  const isMobile = window.innerWidth <= 768;
  const heartCount = isMobile ? 5 : 15; // Fewer hearts on mobile
  
  for (let i = 0; i < heartCount; i++) {
    setTimeout(() => {
      // Random position along the width of the screen
      const x = Math.random() * window.innerWidth;
      const y = -20; // Start above the viewport
      
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      
      // Add random size variation
      const size = 0.8 + Math.random() * 0.7;
      heart.style.width = `${18 * size}px`;
      heart.style.height = `${18 * size}px`;
      
      // Add random rotation
      const rotation = Math.random() * 360;
      heart.style.transform = `rotate(${rotation}deg)`;
      
      // Set random destination for the floating animation
      const endX = (Math.random() - 0.5) * 150; // Random horizontal movement (-75 to 75px)
      const endY = -(150 + Math.random() * 150); // Move upward (between -150 and -300px)
      
      heart.style.setProperty('--end-x', `${endX}px`);
      heart.style.setProperty('--end-y', `${endY}px`);
      
      heartsLayer.appendChild(heart);
    }, i * 300); // Stagger the creation
  }
}



// Create floating hearts periodically
setInterval(() => {
  // Adjust frequency based on device type for performance
  const isMobile = window.innerWidth <= 768;
  const spawnChance = isMobile ? 0.6 : 0.7; // Lower chance on mobile (40% on mobile, 30% on desktop)
  
  if (Math.random() > spawnChance) { // 30% chance to spawn hearts (40% on mobile)
    createHeartRain();
  }
}, 8000); // Increased interval for more elegant spacing

// Create interactive hearts that follow mouse movement slightly delayed
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Function to create trailing hearts behind the mouse
function createMouseTrailingHearts() {
  // Check if on mobile device to reduce number of hearts for performance
  const isMobile = window.innerWidth <= 768;
  const heartCount = isMobile ? 1 : 2; // Fewer hearts on mobile for elegance
  
  // Create a few hearts near the mouse position with slight offset
  for (let i = 0; i < heartCount; i++) {
    setTimeout(() => {
      const offsetX = (Math.random() - 0.5) * 60; // Wider spread
      const offsetY = (Math.random() - 0.5) * 60;
      
      spawnHeart(mouseX + offsetX, mouseY + offsetY);
    }, i * 150); // Slower stagger for elegance
  }
}

// Create trailing hearts periodically
setInterval(createMouseTrailingHearts, 1200); // Slower interval for elegance

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
      // Only spawn one heart per click for elegance
      spawnHeart(e.clientX, e.clientY);
    }
  });
}

function initLetter() {
  const text = '胡沁玲：\n遇见你是我最美好的期待。作为水瓶座的你，拥有独特的创新思维和自由精神，这让我深深着迷。特别期待在大年初九（2月25日）你的生日那天能和你见面，陪你一起度过这个特殊的日子。希望能成为你生日记忆中最温暖的一部分，与你共同迎接新的一岁。未来不管晴天或雨天，我都想在你身边，把每个普通日子调成我们专属的高阶浪漫频道。—— 骆邹阳';
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
  updateBirthdayCountdown(); // Focus on birthday countdown
  setInterval(updateBirthdayCountdown, 1000 * 30); // Update birthday countdown every 30 seconds
  attachEvents();
  initLetter();
  randomNote();
  resizeStarfield();
  drawStarfield();
  window.addEventListener('resize', resizeStarfield);
  initGame();
}

document.addEventListener('DOMContentLoaded', init);
