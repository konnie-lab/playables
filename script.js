const player = document.getElementById('playable');
const frame = document.getElementById('gameFrame');
const loading = document.getElementById('loadingScreen');
const status = document.getElementById('playerStatus');
const restart = document.getElementById('restartBtn');
const expand = document.getElementById('expandBtn');
const sound = document.getElementById('soundBtn');
let gameSound;
let soundMuted;
const close = document.querySelector('.close-player');
const motion = document.getElementById('motionBtn');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let readyTimer;
let loadDeadline;
let expanded = false;
let previousFocus;
let playerVisible = true;
let gameDocument;
const projects = [
  { id: 'castle', name: 'Castle Duels', url: 'castle-duels/index.html?v=20261103-sound1',
    tagline: 'Small army. Big little battle.', description: ['Merge your units, build your squad, and take on the enemy.', 'A bite-sized battle with a little strategy and a lot of character.'],
    tags: ['3D + 2D', 'MERGE & BATTLE', 'INTERACTIVE DEMO'] },
  { id: 'basketball', name: 'COURTSIDE', url: 'basketball/index.html?v=20261107',
    tagline: 'Your team. Your call.', description: ['Pick your captain, hire a coach, and build a team with a budget that matters.', 'Clutch shots, missed chances, and courtside emotions. Every choice changes the game.'],
    tags: ['2D + SHADERS', 'BASKETBALL MANAGEMENT', 'INTERACTIVE DEMO'] },
];
let projectIndex = 0;
const previousProject = document.getElementById('previousProject');
const nextProject = document.getElementById('nextProject');

document.getElementById('year').textContent = new Date().getFullYear();

// Keep all sprite coordinates in the artwork's 1536 × 1024 space.
const workshop = document.getElementById('workshop');
const artwork = document.querySelector('.workshop-art');

const sparkTexture = new Image();
const sparkBursts = [...document.querySelectorAll('.spell-fx')]
  .map((host, index) => new SparkBurstFX(host, sparkTexture, 1400 + index * 2400, Number(host.dataset.interval) || 8000));
sparkTexture.addEventListener('load', updateWorkshopEffects);
sparkTexture.src = 'assets/castle-workshop/star_fx_yellow.webp';

function updateWorkshopEffects() {
  workshop.classList.toggle('workshop-hidden', document.hidden);
  const running = sparkTexture.complete && sparkTexture.naturalWidth > 0 &&
    projects[projectIndex].id === 'castle' &&
    !document.hidden && !reducedMotion.matches &&
    !document.body.classList.contains('ambience-paused') &&
    !workshop.classList.contains('workshop-offscreen');
  sparkBursts.forEach(effect => effect.setRunning(running));
}

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
  updateWorkshopEffects();
}).observe(workshop);

function updateGamePause() {
  const game = frame.contentWindow?.app;
  if (game) game.pause('portfolio', document.hidden || (!playerVisible && !expanded));
}

function waitForGame() {
  gameSound?.off('soundChanged', syncSoundButton);
  gameSound = null;
  sound.disabled = true;
  clearInterval(readyTimer);
  clearTimeout(loadDeadline);
  readyTimer = setInterval(() => {
    if (!frame.contentWindow?.app?.main?.gameController) return;
    clearInterval(readyTimer);
    clearTimeout(loadDeadline);
    loading.hidden = true;
    restart.disabled = false;
    const game = frame.contentWindow.app;
    gameSound = game.main.soundButton;
    if (soundMuted !== undefined) {
      if (gameSound) gameSound.setMuted(soundMuted);
      else game.audio.muted = soundMuted;
    }
    gameSound?.on('soundChanged', syncSoundButton);
    syncSoundButton(gameSound ? gameSound.muted : game.audio.muted);
    sound.disabled = false;
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

function syncSoundButton(muted) {
  soundMuted = muted;
  sound.setAttribute('aria-pressed', String(!muted));
  sound.title = muted ? 'Turn sound on' : 'Mute sound';
  sound.querySelector('[data-sound-label]').textContent = muted ? 'Sound off' : 'Sound on';
  sound.classList.toggle('is-muted', muted);
}

sound.addEventListener('click', () => {
  const game = frame.contentWindow?.app;
  if (!game) return;
  if (gameSound) gameSound.setMuted(!gameSound.muted);
  else {
    game.audio.muted = !game.audio.muted;
    syncSoundButton(game.audio.muted);
  }
  // Keep audio activation in the trusted click, including clicks outside the iframe.
  frame.contentWindow.app.audio.unlock();
});

function loadProject() {
  clearInterval(readyTimer);
  clearTimeout(loadDeadline);
  loading.hidden = false;
  restart.disabled = true;
  sound.disabled = true;
  gameSound?.off('soundChanged', syncSoundButton);
  gameSound = null;
  const project = projects[projectIndex];
  loading.querySelector('span').textContent = project.name;
  status.textContent = '';
  frame.contentWindow?.app?.destroy();
  frame.title = `${project.name} — interactive playable demo`;
  frame.src = project.url;
}

restart.addEventListener('click', loadProject);

function selectProject(index) {
  projectIndex = (index + projects.length) % projects.length;
  const project = projects[projectIndex];
  workshop.dataset.project = project.id;
  document.getElementById('projectName').textContent = project.name.toUpperCase();
  document.getElementById('projectCount').textContent = `0${projectIndex + 1} / 02`;
  const other = projects[(projectIndex + 1) % projects.length].name;
  previousProject.setAttribute('aria-label', `Previous project: ${other}`);
  nextProject.setAttribute('aria-label', `Next project: ${other}`);
  document.querySelector('.project-title .eyebrow').textContent = `FRESH FROM THE LAB / 00${projectIndex + 1}`;
  document.getElementById('project-title').replaceChildren(document.createTextNode(project.name));
  document.querySelector('.project-title > p:last-child').textContent = project.tagline;
  document.querySelectorAll('.project-description > p').forEach((p, i) => p.textContent = project.description[i]);
  document.querySelectorAll('.project-tags span').forEach((tag, i) => tag.textContent = project.tags[i]);
  document.querySelector('.standalone-link').href = project.url;
  if (expanded) player.setAttribute('aria-label', `${project.name} player`);
  updateWorkshopEffects();
  loadProject();
}

previousProject.addEventListener('click', () => selectProject(projectIndex - 1));
nextProject.addEventListener('click', () => selectProject(projectIndex + 1));
document.querySelectorAll('[data-project-step]').forEach(button => button.addEventListener('click', () => selectProject(projectIndex + Number(button.dataset.projectStep))));
document.querySelector('.project-switcher').addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  selectProject(projectIndex + (event.key === 'ArrowRight' ? 1 : -1));
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
    player.setAttribute('aria-label', `${projects[projectIndex].name} player`);
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
  updateWorkshopEffects();
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
document.addEventListener('visibilitychange', updateWorkshopEffects);
new IntersectionObserver(entries => {
  playerVisible = entries[0].isIntersecting;
  updateGamePause();
}, { threshold: 0 }).observe(frame);
