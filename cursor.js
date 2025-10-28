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
}


function dot_create(config){
    for(let i=0; i <config.count;i++){

        let element = document.createElement('div');
        element.className = "cursor";

        const t = i / (config.count - 1);
        const opacity = config.opacityStart + (config.opacityEnd - config.opacityStart) * t

        const scale = config.scaleStart + (config.scaleEnd - config.scaleStart )* t;

        element.style.width = `${CONFIG.sizeRem}rem`;
        element.style.height = `${CONFIG.sizeRem}rem`;
        element.style.background = CONFIG.color;
        element.style.opacity = opacity;
        element.style.setProperty('--s', scale);
        element.dataset.baseOpacity = opacity;
        document.body.appendChild(element);
        dots.push(element);
    };
};

addEventListener('pointermove', e => {
  last = { x: e.clientX, y: e.clientY };
}, { passive: true });

setInterval(() => {
  buf.push({ x: last.x, y: last.y });
  if (buf.length > CONFIG.count) buf.shift();
}, CONFIG.interval);

function setPos(element, point) {
  if (!element || !point) return;
  element.style.setProperty('--x', point.x + 'px');
  element.style.setProperty('--y', point.y + 'px');
}

function render() {
  let j = 0;
  for (let i = buf.length - 1; i >= 0 && j < dots.length; i--, j++) {
    setPos(dots[j], buf[i]);
  }
  for (; j < dots.length; j++) { 
    setPos(dots[j], null);
  }
  requestAnimationFrame(render);
}

document.addEventListener('pointerleave', () => {
  dots.forEach(el => el.style.opacity = 0);
});
document.addEventListener('pointerenter', () => {
  dots.forEach(el => el.style.opacity = el.dataset.baseOpacity);
});

dot_create(CONFIG);
render();