// Лого: підставляємо SVG інлайном, щоб колір брався з currentColor
fetch('assets/logo-rosette.svg')
  .then(r => r.text())
  .then(svg => document.querySelectorAll('[data-logo]').forEach(el => {
    el.innerHTML = svg;
    const s = el.querySelector('svg');
    s.removeAttribute('width'); s.removeAttribute('height');
    s.style.width = '100%'; s.style.height = 'auto'; s.style.display = 'block';
  }));

// Стрічки: дублюємо вміст, щоб анімація йшла без шва
document.querySelectorAll('.tape-track').forEach(t => {
  const html = t.innerHTML;
  t.innerHTML = html.repeat(4);
});

// Копіювання
const toast = document.getElementById('toast');
let toastTimer;
document.addEventListener('click', e => {
  const el = e.target.closest('[data-copy]');
  if (!el) return;
  navigator.clipboard?.writeText(el.dataset.copy).catch(() => {});
  toast.textContent = 'Скопійовано: ' + el.dataset.copy;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
});

// Меню
const menu = document.getElementById('menu');
const btn = document.getElementById('menuBtn');
const setMenu = open => { menu.dataset.open = open; btn.setAttribute('aria-expanded', open); };
btn.addEventListener('click', () => setMenu(true));
document.getElementById('menuClose').addEventListener('click', () => setMenu(false));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Поточний розділ у кнопці меню
const current = document.getElementById('current');
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) current.textContent = en.target.dataset.label; });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[data-label]:not(#top)').forEach(s => io.observe(s));

// На першому екрані кнопка з лого, після нього бургер і назва розділу
new IntersectionObserver(([en]) => btn.classList.toggle('in-section', !en.isIntersecting), { rootMargin: '-70px 0px 0px 0px' })
  .observe(document.getElementById('top'));

// Відео грають тільки у видимій зоні
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  const vio = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) en.target.play().catch(() => {});
    else en.target.pause();
  }), { rootMargin: '100px 0px' });
  document.querySelectorAll('video.clip').forEach(v => vio.observe(v));
}
