/* ==========================================================================
   MAELYS CHAVEROUX — script.js
   Comportements partagés par les 3 pages.
   ========================================================================== */

/* ── NAV : le bandeau ne se modifie plus via JavaScript. */

/* ── AVIS : étoiles + carrousel automatique ──
   Pour modifier les avis : éditez le tableau AVIS_DATA ci-dessous.
   note : chiffre de 1 à 5 (les demis sont acceptés, ex: 4.5) */
const AVIS_DATA = [
  { note: 5, texte: "J’ai eu l’occasion de travailler avec Maelys à plusieurs reprises (shooting commercial, shooting beauté et shooting édito), et ses make-up ont toujours été d’une très grande qualité ! Elle sait être très polyvalente, mais garde toujours une touche élégante et raffinée dans ce qu’elle fait, sans oublier sa gentillesse et sa douceur hors pair ! Je ne peux que vous la conseiller :)", auteur: "Manon — Modèle" },
  { note: 5, texte: "J’ai eu la chance de bénéficier du travail de Maelys lors d’un shooting inspiration mariage, et j’ai adoré le résultat. Elle a su réaliser un maquillage à la fois sophistiqué et naturel, qui mettait parfaitement en valeur les traits du visage, tout en gardant un rendu élégant et délicat. Merci Maelys !", auteur: "Carla — Shooting mariée" },
  { note: 5, texte: "Je recommande à 1000 % Maelys pour votre mariage ou autre événement ! Elle a un vrai talent. Elle maquille divinement bien, je suis plus que ravie de son travail ! Vous pouvez y aller les yeux fermés.", auteur: "@mahe_studio — Créatrice de robe de mariée" },
];

function starsSVG(note) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    const full = note >= i;
    const half = !full && note >= i - 0.5;
    html += `<svg viewBox="0 0 24 24">
      <defs><clipPath id="clip${i}-${Math.random().toString(36).slice(2)}"><rect x="0" y="0" width="${half ? 12 : (full ? 24 : 0)}" height="24"/></clipPath></defs>
      <polygon class="star-empty" points="12 2 15 9 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9 9"/>
      ${full || half ? `<polygon class="star-full" clip-path="url(#clip${i}-${Math.random().toString(36).slice(2)})" points="12 2 15 9 22 9.5 16.5 14.5 18 22 12 18 6 22 7.5 14.5 2 9.5 9 9"/>` : ''}
    </svg>`;
  }
  return html;
}

(function initAvis() {
  const carousel = document.getElementById('avis-carousel');
  const dotsWrap = document.getElementById('avis-dots');
  const globalStarsWrap = document.getElementById('avis-note-globale-stars');
  const globalChiffre = document.getElementById('avis-note-chiffre');
  if (!carousel) return;

  // Moyenne globale
  const moyenne = AVIS_DATA.reduce((s, a) => s + a.note, 0) / AVIS_DATA.length;
  if (globalStarsWrap) globalStarsWrap.innerHTML = starsSVG(moyenne);
  if (globalChiffre) globalChiffre.textContent = moyenne.toFixed(1) + ' / 5';

  // Slides
  AVIS_DATA.forEach((avis, i) => {
    const slide = document.createElement('div');
    slide.className = 'avis-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `
      <p class="avis-texte">"${avis.texte}"</p>
      <div class="stars">${starsSVG(avis.note)}</div>
      <p class="avis-auteur">${avis.auteur}</p>
    `;
    carousel.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'avis-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Avis ' + (i + 1));
    dot.addEventListener('click', () => goToAvis(i));
    dotsWrap.appendChild(dot);
  });

  let current = 0;
  const slides = carousel.querySelectorAll('.avis-slide');
  const dots = dotsWrap.querySelectorAll('.avis-dot');

  function goToAvis(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => {
    goToAvis((current + 1) % slides.length);
  }, 5000);
})();

/* ── MODALES génériques (services + mentions légales) ── */
function openModal(id) {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const m = document.getElementById('modal-' + id);
  if (!m) return;
  m.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── LIGHTBOX : plein écran pour les photos (page book) ── */
let currentImages = [];
let currentIndex = 0;

function openLightbox(images, startIndex) {
  currentImages = images;
  currentIndex = startIndex || 0;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function navLightbox(dir) {
  currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
  renderLightbox();
}
function renderLightbox() {
  const container = document.getElementById('lightbox-img-container');
  if (!container) return;
  container.innerHTML = '';
  const img = new Image();
  img.src = currentImages[currentIndex];
  img.className = 'lightbox-img';
  img.alt = 'Photo ' + (currentIndex + 1);
  container.appendChild(img);
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') navLightbox(1);
  if (e.key === 'ArrowLeft') navLightbox(-1);
  if (e.key === 'Escape') closeLightbox();
});
(function swipeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  let touchStartX = 0;
  lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) navLightbox(dx < 0 ? 1 : -1);
  });
})();

/* Attache le clic plein-écran à toutes les images de groupe (page book) */
document.querySelectorAll('.book-group').forEach(group => {
  const imgs = Array.from(group.querySelectorAll('img'));
  const srcs = imgs.map(i => i.getAttribute('src'));
  imgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(srcs, i));
  });
});

/* ── FADE IN au scroll ── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
