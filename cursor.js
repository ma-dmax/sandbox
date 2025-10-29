const dots = [];
const buf = [];
let last = { x: 0, y: 0 };

const CONFIG = {
  count: 8,
  interval: 12,
  sizeRem: 1.5,
  color: 'rgb(212, 92, 11)',
  opacityStart: 1,
  opacityEnd: 0.15,
  scaleStart: 1,
  scaleEnd: 0.8
};

let samplerId = null;
function startSampler() {
  if (samplerId) clearInterval(samplerId);
  samplerId = setInterval(() => {
    buf.push({ x: last.x, y: last.y });
    if (buf.length > CONFIG.count) buf.shift();
  }, CONFIG.interval);
}

function dot_create(config){
  for (let i = 0; i < config.count; i++){
    const el = document.createElement('div');
    el.className = "cursor";

    const t = (config.count === 1) ? 0 : i / (config.count - 1);
    const opacity = config.opacityStart + (config.opacityEnd - config.opacityStart) * t;
    const scale   = config.scaleStart  + (config.scaleEnd  - config.scaleStart)  * t;

    el.style.width = `${config.sizeRem}rem`;
    el.style.height = `${config.sizeRem}rem`;
    el.style.background = config.color;
    el.style.opacity = opacity;
    el.style.setProperty('--s', scale);
    el.dataset.baseOpacity = opacity;
    document.body.appendChild(el);
    dots.push(el);
  }
}

function destroyDots(){
  while (dots.length) dots.pop().remove();
}

function setPos(el, p) {
  if (!el || !p) return;
  el.style.setProperty('--x', p.x + 'px');
  el.style.setProperty('--y', p.y + 'px');
}

function render() {
  let j = 0;
  for (let i = buf.length - 1; i >= 0 && j < dots.length; i--, j++) {
    setPos(dots[j], buf[i]);
  }
  for (; j < dots.length; j++) setPos(dots[j], null);
  requestAnimationFrame(render);
}

const inputs = document.querySelectorAll('.form_container [data-key]');

function readValue(el) {
  const key = el.dataset.key;
  const type = el.type;
  if (type === 'color') {
    return el.value;
  }
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : CONFIG[key];
}

function syncConfigFromUI() {
  inputs.forEach(el => {
    const key = el.dataset.key;
    CONFIG[key] = readValue(el);
    if (key === 'color' && CONFIG.color.startsWith('#')) {
    }
  });
}

function applyConfig() {
  startSampler();
  destroyDots();
  dot_create(CONFIG);
  while (buf.length > CONFIG.count) buf.shift();
}

inputs.forEach(el => {
  el.addEventListener('input', () => {
    syncConfigFromUI();
    applyConfig();
  });
});

addEventListener('pointermove', e => { last = { x: e.clientX, y: e.clientY }; }, { passive: true });
syncConfigFromUI();
dot_create(CONFIG);
startSampler();
render();
