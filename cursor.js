/* === НАСТРОЙКИ === */
const CONFIG = {
  count: 10,          // сколько точек в хвосте
  interval: 15,      // раз в сколько мс писать точку
  sizeRem: 1.5,       // базовый размер (rem) — берётся из твоего CSS, но можем переопределить
  color: 'rgb(212, 92, 11)', // цвет точек
  opacityStart: 1,    // непрозрачность самой свежей
  opacityEnd: 0.15    // непрозрачность самой старой
};

/* === СОЗДАЁМ ЭЛЕМЕНТЫ === */
const dots = [];
for (let i = 0; i < CONFIG.count; i++) {
  const el = document.createElement('div');
  el.className = 'cursor'; // используем твой базовый класс
  // Градиент прозрачности от новой к старой
  const t = CONFIG.count === 1 ? 0 : i / (CONFIG.count - 1);
  const opacity = CONFIG.opacityStart + (CONFIG.opacityEnd - CONFIG.opacityStart) * t;

  // Опционально можно чуть уменьшать размер к хвосту:
  // const scale = 1 - 0.35 * t; // раскомментируй, если хочешь taper
  // el.style.scale = String(scale);

  // Переопределяем/уточняем пару свойств напрямую
  el.style.width = `${CONFIG.sizeRem}rem`;
  el.style.height = `${CONFIG.sizeRem}rem`;
  el.style.background = CONFIG.color;
  el.style.opacity = opacity;           // задаём плавный градиент
  el.dataset.baseOpacity = opacity;     // запомним для восстановления после hide/show
  document.body.appendChild(el);
  dots.push(el);
}

/* === СБОР ПОЗИЦИЙ С РОВНЫМ ИНТЕРВАЛОМ === */
const buf = [];                // последние позиции, макс = count
let last = { x: 0, y: 0 };

addEventListener('pointermove', e => {
  last = { x: e.clientX, y: e.clientY };
}, { passive: true });

setInterval(() => {
  buf.push({ x: last.x, y: last.y });
  if (buf.length > CONFIG.count) buf.shift();
}, CONFIG.interval);

/* === ОТРИСОВКА === */
function setPos(el, p) {
  if (!el || !p) return;
  el.style.setProperty('--x', p.x + 'px');
  el.style.setProperty('--y', p.y + 'px');
}

function render() {
  const n = buf.length;
  // dots[0] — самая свежая, dots[последняя] — самая старая
  for (let i = 0; i < dots.length; i++) {
    const idx = n - 1 - i; // 0 → свежая, 1 → чуть старше, …
    setPos(dots[i], idx >= 0 ? buf[idx] : null);
  }
  requestAnimationFrame(render);
}
render();

/* === СКРЫВАТЬ/ПОКАЗЫВАТЬ ВСЕ ТОЧКИ === */
document.addEventListener('pointerleave', () => {
  dots.forEach(el => el.style.opacity = 0);
});
document.addEventListener('pointerenter', () => {
  dots.forEach(el => el.style.opacity = el.dataset.baseOpacity);
});

                          /*/ Не совсем олд версия/*/ 

/*const cursor  = document.querySelector('.cursor');
const cursor2 = document.querySelector('.c2');
const cursor3 = document.querySelector('.c3');

const cursors_pos = [];
const MAX = 3;
const INTERVAL = 25; // каждые 100 мс фиксируем позицию

let last = { x: 0, y: 0 };

// слушаем мышь, просто обновляем последнюю позицию
addEventListener('pointermove', e => {
  last = { x: e.clientX, y: e.clientY };
}, { passive: true });

// раз в INTERVAL добавляем позицию в массив
setInterval(() => {
  cursors_pos.push({ x: last.x, y: last.y });
  if (cursors_pos.length > MAX) cursors_pos.shift(); // храним только последние MAX
}, INTERVAL);

function setPos(el, p) {
  if (!el || !p) return;
  el.style.transform = `translate(${p.x}px, ${p.y}px)`;
}

// отрисовка
function draw() {
  const n = cursors_pos.length;
  setPos(cursor,  n >= 1 ? cursors_pos[n-1] : null); // новая
  setPos(cursor2, n >= 2 ? cursors_pos[n-2] : null); // средняя
  setPos(cursor3, n >= 3 ? cursors_pos[0]   : null); // старая
  requestAnimationFrame(draw);
}
draw();

// прячем/показываем курсоры при выходе/входе
document.addEventListener('pointerleave', () => {
  [cursor, cursor2, cursor3].forEach(el => el && (el.style.opacity = 0));
});
document.addEventListener('pointerenter', () => {
  [cursor, cursor2, cursor3].forEach(el => el && (el.style.opacity = 1));
});

*/


                          /*/ Олд версия/*/ 

/*const cursor = document.querySelector('.cursor');
const cursor2 = document.querySelector('.c2');
const cursor3 = document.querySelector('.c3');

let cursors_pos = [];

function addCursorPos(x, y) {
  cursors_pos.push({ x, y });
  if (cursors_pos.length > 3) {
    cursors_pos.shift();
  }
}

const buf = [];
const MAX = 3, WINDOW = 300;

addEventListener('pointermove', e => {
  const now = performance.now();
  buf.push({ t: now, x: e.clientX, y: e.clientY });
  const cut = now - WINDOW;
  while (buf.length && buf[0].t < cut) buf.shift();
  while (buf.length > MAX) buf.shift();
});

function draw_cursor(){
 const newest = buf[buf.length - 1];
  const mid    = buf[buf.length - 2];
  const oldest = buf[0];

  setPos(cursor,  newest);
  setPos(cursor2, mid);
  setPos(cursor3, oldest);
}


function setPos(el, p) {
  if (!el || !p) return;
  el.style.transform = `translate(${p.x}px, ${p.y}px)`;
}

window.addEventListener('pointermove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});


document.addEventListener("pointerleave", () => {
  cursor.style.opacity = 0;
});
document.addEventListener("pointerenter", () => {
  cursor.style.opacity = 1;
});*/