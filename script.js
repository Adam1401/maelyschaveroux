/* ==========================================================================
   MAELYS CHAVEROUX — script.js
   Comportements partagés par les 3 pages.
   ========================================================================== */

/* ── NAV : cache au scroll vers le bas, revient vers le haut ── */
(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  let lastY = window.scrollY;
  const threshold = 80; // ne rien faire tant qu'on n'a pas dépassé cette hauteur

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y <= 0) {
      nav.classList.remove('nav-hidden'); // tout en haut : toujours visible
    } else if (y > lastY && y > threshold) {
      nav.classList.add('nav-hidden'); // on descend : on cache
    } else if (y < lastY) {
      nav.classList.remove('nav-hidden'); // on remonte : on affiche
    }
    lastY = y;
  }, { passive: true });
})();

/* ── AVIS : étoiles + carrousel automatique ──
   Pour modifier les avis : éditez le tableau AVIS_DATA ci-dessous.
   note : chiffre de 1 à 5 (les demis sont acceptés, ex: 4.5) */
const AVIS_DATA = [
  { note: 5, texte: "Maëlys a su me mettre en valeur pour mon mariage tout en respectant ma nature. Maquillage tenu toute la soirée, aucun regret !", auteur: "Camille — Mariée" },
  { note: 5, texte: "Une écoute incroyable et un vrai savoir-faire. Le shooting était parfait grâce à son maquillage lumineux et naturel.", auteur: "Anna — Shooting beauté" },
  { note: 4.5, texte: "Professionnelle, ponctuelle et de très bon conseil. Je recommande les yeux fermés pour un maquillage de cortège.", auteur: "Manon — Demoiselle d'honneur" },
  { note: 5, texte: "Un moment de douceur avant le shooting, et un résultat qui a mis toute l'équipe d'accord. Merci Maëlys !", auteur: "Justine — Shooting publicitaire" }
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

/* ── SERVICES : ouverture d'une pop-up descriptive au clic ──
   Pour modifier les textes : éditez SERVICES_DATA. */
const SERVICES_DATA = {
  bridal: {
    titre: 'Bridal',
    texte: "Le maquillage de mariage est pensé sur-mesure : essai en amont, produits longue tenue et résultat waterproof pour tenir toute la journée (et la nuit !). Une prestation pensée pour vous et, si besoin, pour tout votre cortège."
  },
  commercial: {
    titre: 'Commercial',
    texte: "Publicité, catalogue, contenu de marque : un maquillage impeccable devant l'objectif, pensé pour la lumière et les retouches, en collaboration étroite avec le photographe et la direction artistique."
  },
  fashion: {
    titre: 'Fashion',
    texte: "Éditoriaux et shootings mode : des looks affirmés, créatifs et sur-mesure, pensés en accord avec la direction artistique du shooting, du naturel sublimé au maquillage graphique."
  }
};

(function initServices() {
  const cards = document.querySelectorAll('.service-card');
  const modal = document.getElementById('modal-service');
  if (!cards.length || !modal) return;

  const titleEl = modal.querySelector('.modal-service-title');
  const textEl = modal.querySelector('.modal-service-text');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-service');
      const data = SERVICES_DATA[key];
      if (!data) return;
      titleEl.textContent = data.titre;
      textEl.textContent = data.texte;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
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
