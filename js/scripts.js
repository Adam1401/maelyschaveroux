// scripts.js
document.addEventListener('DOMContentLoaded', function() {
  /* --- Portfolio: modal with carousel --- */
  const cards = Array.from(document.querySelectorAll('.portfolio-card'));
  const modal = document.getElementById('portfolio-modal');

  if (modal) {
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalCarouselTrack = document.getElementById('modal-carousel-track');
    const modalClose = modal.querySelector('.modal-close');
    const carouselPrev = modal.querySelector('.modal-carousel-btn.prev');
    const carouselNext = modal.querySelector('.modal-carousel-btn.next');
    
    let carouselIndex = 0;
    let totalImages = 0;

    function populateCarousel(images) {
      modalCarouselTrack.innerHTML = '';
      images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '';
        modalCarouselTrack.appendChild(img);
      });
      totalImages = images.length;
      carouselIndex = 0;
      updateCarouselPosition();
      // Masquer les boutons si une seule image
      if (carouselPrev) carouselPrev.style.display = totalImages > 1 ? 'block' : 'none';
      if (carouselNext) carouselNext.style.display = totalImages > 1 ? 'block' : 'none';
    }

    function updateCarouselPosition() {
      const offset = -(carouselIndex * 100);
      modalCarouselTrack.style.transform = `translateX(${offset}%)`;
    }

    function openModal(imageList, title, desc) {
      populateCarousel(imageList);
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    cards.forEach(card => {
      card.addEventListener('click', function() {
        const imagesStr = card.getAttribute('data-images') || card.querySelector('img').src;
        const images = imagesStr.split(',').map(s => s.trim());
        const title = card.getAttribute('data-title') || (card.querySelector('h4') ? card.querySelector('h4').textContent : 'Project');
        const desc = card.getAttribute('data-desc') || (card.querySelector('.card-desc') ? card.querySelector('.card-desc').textContent : '');
        openModal(images, title, desc);
      });
    });

    // Carousel controls
    if (carouselPrev) {
      carouselPrev.addEventListener('click', () => {
        carouselIndex = Math.max(0, carouselIndex - 1);
        updateCarouselPosition();
      });
    }
    if (carouselNext) {
      carouselNext.addEventListener('click', () => {
        carouselIndex = Math.min(totalImages - 1, carouselIndex + 1);
        updateCarouselPosition();
      });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  // Filters
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', function(){
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c=>{
        const cat = c.dataset.category;
        if(f === 'all' || f === cat) c.style.display = '';
        else c.style.display = 'none';
      });
    });
  });

  /* --- Testimonial carousel simple --- */
  const carousel = document.getElementById('testimonial-carousel');
  if(carousel){
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-btn.prev');
    const next = carousel.querySelector('.carousel-btn.next');
    let index = 0;
    const cardWidth = carousel.querySelector('.testimonial-card')?.offsetWidth || 320;
    let touchStartX = 0;
    let touchEndX = 0;
    
    function updateCarousel(){
      track.style.transform = `translateX(${-(index * (cardWidth + 12))}px)`;
    }
    
    prev.addEventListener('click', function(){
      index = Math.max(0, index - 1);
      updateCarousel();
    });
    next.addEventListener('click', function(){
      const maxIndex = Math.max(0, track.children.length - Math.floor(carousel.offsetWidth / (cardWidth + 12)));
      index = Math.min(maxIndex, index + 1);
      updateCarousel();
    });

    // Swipe detection for mobile
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe(){
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      const maxIndex = Math.max(0, track.children.length - Math.floor(carousel.offsetWidth / (cardWidth + 12)));
      
      if(diff > swipeThreshold){
        // Swipe left - next slide
        index = Math.min(maxIndex, index + 1);
        updateCarousel();
      } else if(diff < -swipeThreshold){
        // Swipe right - previous slide
        index = Math.max(0, index - 1);
        updateCarousel();
      }
    }

    // optional auto-scroll
    let auto = setInterval(function(){
      const maxIndex = Math.max(0, track.children.length - Math.floor(carousel.offsetWidth / (cardWidth + 12)));
      index = index >= maxIndex ? 0 : index + 1;
      updateCarousel();
    }, 6000);
    carousel.addEventListener('mouseover', ()=> clearInterval(auto));
    carousel.addEventListener('mouseout', ()=> {
      auto = setInterval(function(){
        const maxIndex = Math.max(0, track.children.length - Math.floor(carousel.offsetWidth / (cardWidth + 12)));
        index = index >= maxIndex ? 0 : index + 1;
        updateCarousel();
      }, 6000);
    });
  }

  /* --- Forms removed: contact actions replaced by mailto buttons in HTML --- */
  /* --- Menu latéral mobile --- */
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const menuClose = document.getElementById('menu-close');

if(menuToggle && sideMenu){
  menuToggle.addEventListener('click', ()=> {
    sideMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  menuClose.addEventListener('click', ()=> {
    sideMenu.classList.remove('open');
    document.body.style.overflow = '';
  });

  sideMenu.addEventListener('click', e=>{
    if(e.target === sideMenu){
      sideMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --- Masquer / afficher le header au scroll --- */
let lastScroll = 0;
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  const current = window.scrollY;

  if(current > lastScroll && current > 80){
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }

  lastScroll = current;
});
  /* --- Scroll hint: show at top, hide when scrolled down --- */
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    const topThreshold = 100; // show hint if scrollY < 100px
    const scrollListener = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (scrollY < topThreshold) {
        scrollHint.classList.remove('hidden');
      } else {
        scrollHint.classList.add('hidden');
      }
    };
    // Check initial state
    scrollListener();
    // Update on scroll
    window.addEventListener('scroll', scrollListener, { passive: true });
  }


});
