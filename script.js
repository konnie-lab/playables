const player = document.getElementById('playable');
const frame = document.getElementById('gameFrame');
const loading = document.getElementById('loadingScreen');
const status = document.getElementById('playerStatus');
const restart = document.getElementById('restartBtn');
const expand = document.getElementById('expandBtn');
const close = document.querySelector('.close-player');
const motion = document.getElementById('motionBtn');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let readyTimer;
let loadDeadline;
let expanded = false;
let previousFocus;
let playerVisible = true;
let gameDocument;

document.getElementById('year').textContent = new Date().getFullYear();

// Keep all sprite coordinates in the artwork's 1536 × 1024 space.
const workshop = document.getElementById('workshop');
const artwork = document.querySelector('.workshop-art');

function layoutWorkshop() {
  const width = workshop.clientWidth;
  const height = workshop.clientHeight;
  const mobile = window.matchMedia('(max-width: 720px)').matches;
  const scale = mobile ? 600 / 1024 : Math.max(width / 1536, height / 1024);
  const artWidth = 1536 * scale;
  const artHeight = 1024 * scale;
  artwork.style.width = `${artWidth}px`;
  artwork.style.height = `${artHeight}px`;
  artwork.style.left = `${(width - artWidth) * (mobile ? 0.42 : 0.5)}px`;
  artwork.style.top = `${mobile ? 0 : (height - artHeight) * 0.46}px`;
}

new ResizeObserver(layoutWorkshop).observe(workshop);
layoutWorkshop();
new IntersectionObserver(entries => {
  workshop.classList.toggle('workshop-offscreen', !entries[0].isIntersecting);
}).observe(workshop);

function updateGamePause() {
  const game = frame.contentWindow?.app;
  if (game) game.pause('portfolio', document.hidden || (!playerVisible && !expanded));
}

function waitForGame() {
  clearInterval(readyTimer);
  clearTimeout(loadDeadline);
  readyTimer = setInterval(() => {
    if (!frame.contentWindow?.app?.main?.gameController) return;
    clearInterval(readyTimer);
    clearTimeout(loadDeadline);
    loading.hidden = true;
    restart.disabled = false;
    status.textContent = '';
    if (gameDocument !== frame.contentDocument) {
      gameDocument = frame.contentDocument;
      gameDocument.addEventListener('keydown', event => {
        if (expanded && event.key === 'Escape') setExpanded(false);
      }, true);
    }
    updateGamePause();
  }, 150);
  loadDeadline = setTimeout(() => {
    clearInterval(readyTimer);
    loading.hidden = true;
    restart.disabled = false;
    status.textContent = 'Taking longer than expected? Try Restart or open the game in a new tab below.';
  }, 30000);
}

frame.addEventListener('load', waitForGame);
waitForGame();

restart.addEventListener('click', () => {
  loading.hidden = false;
  restart.disabled = true;
  status.textContent = 'Restarting Castle Duels…';
  frame.src = 'castle-duels/index.html';
  waitForGame();
});

function setExpanded(value) {
  expanded = value;
  if (value) previousFocus = document.activeElement;
  player.classList.toggle('is-expanded', value);
  document.body.classList.toggle('player-expanded', value);
  expand.setAttribute('aria-expanded', String(value));
  expand.innerHTML = value ? '<span aria-hidden="true">⛶</span> Reduce' : '<span aria-hidden="true">⛶</span> Expand';
  if (value) {
    player.setAttribute('role', 'dialog');
    player.setAttribute('aria-modal', 'true');
    player.setAttribute('aria-label', 'Castle Duels player');
    close.focus();
  } else {
    player.removeAttribute('role');
    player.removeAttribute('aria-modal');
    player.removeAttribute('aria-label');
    previousFocus?.focus({ preventScroll: true });
  }
  updateGamePause();
}

expand.addEventListener('click', () => setExpanded(!expanded));
close.addEventListener('click', () => setExpanded(false));

function onPlayerKey(event) {
  if (!expanded) return;
  if (event.key === 'Escape') {
    setExpanded(false);
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...player.querySelectorAll('button:not([disabled]), iframe')];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('keydown', onPlayerKey);

function setAmbiencePaused(paused) {
  document.body.classList.toggle('ambience-paused', paused);
  motion.setAttribute('aria-pressed', String(paused));
  motion.innerHTML = paused ? '<span aria-hidden="true">▷</span> Resume ambience' : '<span aria-hidden="true">Ⅱ</span> Pause ambience';
}

function applyMotionPreference() {
  setAmbiencePaused(reducedMotion.matches);
  motion.disabled = reducedMotion.matches;
  if (reducedMotion.matches) motion.textContent = 'Reduced motion';
}

applyMotionPreference();
motion.addEventListener('click', () => setAmbiencePaused(motion.getAttribute('aria-pressed') !== 'true'));
reducedMotion.addEventListener('change', applyMotionPreference);
document.addEventListener('visibilitychange', updateGamePause);
new IntersectionObserver(entries => {
  playerVisible = entries[0].isIntersecting;
  updateGamePause();
}, { threshold: 0 }).observe(frame);
