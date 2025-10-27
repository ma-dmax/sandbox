const cursor = document.querySelector('.cursor');

window.addEventListener('pointermove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});
document.addEventListener("mouseleave", () => {
  cursor.style.opacity = 0;
});
document.addEventListener("mouseenter", () => {
  cursor.style.opacity = 1;
});