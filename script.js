/* ========== IMAGES (placeholder SVGs with monospace label) ========== */
/* Toned, striped placeholders labeled for what should go there.
   Referenced as CSS variables. Swap for real photography when available. */
function placeholder({label, h1, h2, stripeOp = 0.05}){
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000' preserveAspectRatio='xMidYMid slice'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='${h1}'/>
      <stop offset='1' stop-color='${h2}'/>
    </linearGradient>
    <pattern id='s' width='14' height='14' patternUnits='userSpaceOnUse' patternTransform='rotate(22)'>
      <rect width='14' height='14' fill='transparent'/>
      <line x1='0' y1='0' x2='0' y2='14' stroke='#ffffff' stroke-opacity='${stripeOp}' stroke-width='1'/>
    </pattern>
    <radialGradient id='v' cx='50%' cy='45%' r='70%'>
      <stop offset='.55' stop-color='#000' stop-opacity='0'/>
      <stop offset='1' stop-color='#000' stop-opacity='.55'/>
    </radialGradient>
  </defs>
  <rect width='1600' height='1000' fill='url(#g)'/>
  <rect width='1600' height='1000' fill='url(#s)'/>
  <rect width='1600' height='1000' fill='url(#v)'/>
  <g font-family='JetBrains Mono, monospace' font-size='20' fill='#ffffff' fill-opacity='.55'>
    <text x='40' y='60'>[ image ]</text>
    <text x='40' y='960'>${label}</text>
  </g>
</svg>`.trim();
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const rootPrefix = document.body.dataset.root || '';
const img = (name) => `url("${rootPrefix}img/${name}")`;

const imgs = {
  hero:   img('hero-oak.jpg'),
  about:  img('ranch-dog.jpg'),
  room1:  img('lodge.jpg'),
  room2:  img('bunkhouse-porch.jpg'),
  room3:  img('after-supper.jpg'),
  j1:     img('pointer.jpg'),
  j2:     img('creek.jpg'),
  j3:     img('clays-station.jpg'),
  cta:    img('pond.jpg'),
};

const r = document.documentElement.style;
r.setProperty('--hero-img', imgs.hero);
r.setProperty('--about-img', imgs.about);
r.setProperty('--room1', imgs.room1);
r.setProperty('--room2', imgs.room2);
r.setProperty('--room3', imgs.room3);
r.setProperty('--j1', imgs.j1);
r.setProperty('--j2', imgs.j2);
r.setProperty('--j3', imgs.j3);
r.setProperty('--cta-img', imgs.cta);
r.setProperty('--news-img', img('pond.jpg'));

/* ========== BEHAVIOR ========== */

/* ---------- Slide-out drawer (extras menu) ---------- */
const drawer = document.getElementById('drawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');
const menuBtn = document.getElementById('menuBtn');
const drawerClose = document.getElementById('drawerClose');
function openDrawer(){
  drawer.classList.add('open');
  drawerBackdrop.removeAttribute('hidden');
  requestAnimationFrame(() => drawerBackdrop.classList.add('open'));
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer(){
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
  setTimeout(() => { if (!drawer.classList.contains('open')) drawerBackdrop.setAttribute('hidden', ''); }, 460);
}
if (menuBtn && drawer && drawerBackdrop){
  menuBtn.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer(); });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
}

/* ---------- Announcement bar dismiss ---------- */
const announce = document.getElementById('announce');
const announceClose = document.getElementById('announceClose');
if (announce && announceClose){
  if (sessionStorage.getItem('rbh-announce-dismissed') === '1'){
    announce.classList.add('dismissed');
    document.documentElement.style.setProperty('--announce-h', '0px');
  }
  announceClose.addEventListener('click', () => {
    announce.classList.add('dismissed');
    document.documentElement.style.setProperty('--announce-h', '0px');
    try { sessionStorage.setItem('rbh-announce-dismissed', '1'); } catch(e){}
  });
}

/* ---------- Nav solid on scroll + sticky booking bar ---------- */
const nav = document.getElementById('nav');
const bookbar = document.getElementById('bookbar');
let bbDismissed = false;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('solid', y > 60);
  if (!bbDismissed) {
    bookbar.classList.toggle('visible', y > window.innerHeight * 0.85);
  }
});
const bbClose = document.getElementById('bbClose');
if (bbClose) bbClose.addEventListener('click', () => {
  bbDismissed = true; bookbar.classList.remove('visible');
});

/* ---------- Hero still: photography carries the open. Film is a CTA. ---------- */

/* ---------- Hero word rotator ---------- */
const rotWords = document.querySelectorAll('.rot-word');
if (rotWords.length){
  let rotIdx = 0;
  setInterval(() => {
    const cur = rotWords[rotIdx];
    rotIdx = (rotIdx + 1) % rotWords.length;
    const next = rotWords[rotIdx];
    cur.classList.remove('active'); cur.classList.add('leaving');
    setTimeout(() => cur.classList.remove('leaving'), 700);
    next.classList.add('active');
  }, 2600);
}

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Animated counters ----------
   Replace the element's content with a text node + the preserved <sup>.
   Only the number (computed locally) is ever assigned as text. */
const counters = document.querySelectorAll('[data-counter]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.counter, 10);
    const sup = el.querySelector('sup');
    const numNode = document.createTextNode('0');
    el.replaceChildren(numNode);
    if (sup) el.appendChild(sup);
    const fmt = (n) => n.toLocaleString('en-US');
    const dur = 1800;
    const start = performance.now();
    function step(now){
      const t = Math.min(1, (now - start)/dur);
      const eased = 1 - Math.pow(1 - t, 3);
      numNode.nodeValue = fmt(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    cio.unobserve(el);
  });
}, {threshold: 0.4});
counters.forEach(el => cio.observe(el));

/* ---------- Hover parallax on .tilt cards ---------- */
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left)/rect.width - 0.5;
    const y = (e.clientY - rect.top)/rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x*3}deg) rotateX(${-y*3}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---------- Testimonial slider ---------- */
const slides = document.querySelectorAll('.q-slide');
const dots = document.querySelectorAll('.q-dot');
let qi = 0;
function go(i){
  qi = (i + slides.length) % slides.length;
  slides.forEach((s,k) => s.classList.toggle('active', k===qi));
  dots.forEach((d,k) => d.classList.toggle('active', k===qi));
}
const qPrev = document.getElementById('qPrev');
const qNext = document.getElementById('qNext');
if (qPrev) qPrev.addEventListener('click', () => go(qi-1));
if (qNext) qNext.addEventListener('click', () => go(qi+1));
dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
if (slides.length) setInterval(() => go(qi+1), 7000);

/* ---------- Newsletter popup at 10% scroll ---------- */
const newsModal = document.getElementById('newsModal');
const newsBackdrop = document.getElementById('newsBackdrop');
const newsClose = document.getElementById('newsClose');
const newsForm = document.getElementById('newsForm');
const newsThanks = document.getElementById('newsThanks');
const NEWS_KEY = 'rbh-news-shown';
let newsShown = false;

function openNews(){
  if (newsShown) return;
  if (sessionStorage.getItem(NEWS_KEY) === '1') { newsShown = true; return; }
  newsShown = true;
  try { sessionStorage.setItem(NEWS_KEY, '1'); } catch(e){}
  newsModal.hidden = false;
  newsBackdrop.hidden = false;
  newsModal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    newsBackdrop.classList.add('open');
    newsModal.classList.add('open');
  });
}
function closeNews(){
  newsModal.classList.remove('open');
  newsBackdrop.classList.remove('open');
  newsModal.setAttribute('aria-hidden', 'true');
  setTimeout(() => {
    newsModal.hidden = true;
    newsBackdrop.hidden = true;
  }, 420);
}

if (newsModal){
  const onScrollNews = () => {
    const doc = document.documentElement;
    const max = (doc.scrollHeight - window.innerHeight) || 1;
    const pct = window.scrollY / max;
    if (pct >= 0.10) {
      openNews();
      window.removeEventListener('scroll', onScrollNews);
    }
  };
  /* Luxury: no interrupt. The list is offered, never forced. */
  newsClose.addEventListener('click', closeNews);
  newsBackdrop.addEventListener('click', closeNews);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newsModal.classList.contains('open')) closeNews();
  });
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsEmail');
    const phone = document.getElementById('newsPhone');
    const name = document.getElementById('newsName');
    if (!name.value.trim() || !email.checkValidity() || !phone.value.trim()){
      [name, email, phone].forEach(f => { if (!f.checkValidity() || !f.value.trim()) f.style.borderColor = '#b8381f'; });
      return;
    }
    newsForm.hidden = true;
    newsThanks.hidden = false;
    setTimeout(closeNews, 4200);
  });
}

const inquire = document.getElementById('inquireForm');
if (inquire){
  inquire.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(inquire);
    const body = [...fd.entries()].map(([k,v]) => `${k}: ${v}`).join('\n');
    const mail = `mailto:Hunting@RedBankOutfitters.com?subject=${encodeURIComponent('Hunt inquiry — Red Bank Outfitters')}&body=${encodeURIComponent(body)}`;
    inquire.classList.add('sent');
    window.location.href = mail;
  });
}

/* ---------- Smooth anchor scroll ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - 60, behavior:'smooth'});
  });
});
