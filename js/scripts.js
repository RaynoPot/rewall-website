/**
 * Rewall Website - Main JavaScript File
 * Features: SVG animations, mobile menu, lightbox modal, smooth interactions
 * Created: 2025-12-15
 */

// ============================================================================
// 1. SVG ANIMATION LOGIC
// ============================================================================

class SVGAnimations {
  constructor() {
    this.svgElements = document.querySelectorAll('svg[data-animate]');
    this.init();
  }

  init() {
    this.svgElements.forEach((svg) => {
      this.setupSVGAnimation(svg);
    });
  }

  setupSVGAnimation(svg) {
    const animationType = svg.getAttribute('data-animate');
    const paths = svg.querySelectorAll('path, circle, rect, polygon');

    switch (animationType) {
      case 'draw':
        this.setupDrawAnimation(paths);
        break;
      case 'float':
        this.setupFloatAnimation(svg);
        break;
      case 'pulse':
        this.setupPulseAnimation(paths);
        break;
      case 'rotate':
        this.setupRotateAnimation(svg);
        break;
      default:
        break;
    }
  }

  setupDrawAnimation(paths) {
    paths.forEach((path, index) => {
      const length = path.getTotalLength ? path.getTotalLength() : 0;
      if (length === 0) return;

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = `draw ${2 + index * 0.2}s ease-in-out forwards`;
      path.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupFloatAnimation(svg) {
    svg.style.animation = 'float 3s ease-in-out infinite';
  }

  setupPulseAnimation(paths) {
    paths.forEach((path, index) => {
      path.style.animation = `pulse 2s ease-in-out infinite`;
      path.style.animationDelay = `${index * 0.1}s`;
    });
  }

  setupRotateAnimation(svg) {
    svg.style.animation = 'rotate 4s linear infinite';
  }
}

// ============================================================================
// 2. MOBILE MENU - HAMBURGER FUNCTIONALITY
// ============================================================================

class MobileMenu {
  constructor() {
    this.hamburger = document.querySelector('[data-hamburger]');
    this.menu = document.querySelector('[data-mobile-menu]');
    this.menuLinks = this.menu ? this.menu.querySelectorAll('a') : [];
    this.isOpen = false;
    this.init();
  }

  init() {
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggle());
    }

    this.menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        this.isOpen &&
        !e.target.closest('[data-mobile-menu]') &&
        !e.target.closest('[data-hamburger]')
      ) {
        this.close();
      }
    });

    // Close menu on resize if window becomes large
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.hamburger.classList.add('active');
    this.menu.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate menu items
    this.animateMenuItems('in');
  }

  close() {
    this.isOpen = false;
    this.hamburger.classList.remove('active');
    this.menu.classList.remove('active');
    document.body.style.overflow = '';

    // Animate menu items
    this.animateMenuItems('out');
  }

  animateMenuItems(direction) {
    this.menuLinks.forEach((link, index) => {
      if (direction === 'in') {
        link.style.animation = `slideInLeft 0.3s ease-out forwards`;
        link.style.animationDelay = `${index * 0.05}s`;
      } else {
        link.style.animation = `slideOutLeft 0.2s ease-in forwards`;
        link.style.animationDelay = `${index * 0.02}s`;
      }
    });
  }
}

// ============================================================================
// 3. LIGHTBOX MODAL - GALLERY FUNCTIONALITY
// ============================================================================

class Lightbox {
  constructor(gallerySelector = '[data-lightbox-gallery]') {
    this.gallery = document.querySelector(gallerySelector);
    this.items = this.gallery ? this.gallery.querySelectorAll('[data-lightbox-item]') : [];
    this.modal = null;
    this.currentIndex = 0;
    this.init();
  }

  init() {
    // Create modal HTML
    this.createModal();

    // Add click listeners to gallery items
    this.items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });
      item.style.cursor = 'pointer';
    });
  }

  createModal() {
    const modalHTML = `
      <div class="lightbox-modal" data-lightbox-modal>
        <div class="lightbox-overlay" data-lightbox-close></div>
        <div class="lightbox-container">
          <button class="lightbox-close" data-lightbox-close aria-label="Close">
            <span class="close-icon">&times;</span>
          </button>
          <button class="lightbox-nav lightbox-prev" data-lightbox-prev aria-label="Previous">
            <span class="nav-icon">❮</span>
          </button>
          <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="" />
            <div class="lightbox-caption"></div>
          </div>
          <button class="lightbox-nav lightbox-next" data-lightbox-next aria-label="Next">
            <span class="nav-icon">❯</span>
          </button>
          <div class="lightbox-counter">
            <span class="current"></span> / <span class="total"></span>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer.firstElementChild);

    this.modal = document.querySelector('[data-lightbox-modal]');
    this.setupModalListeners();
  }

  setupModalListeners() {
    const closeBtn = this.modal.querySelector('[data-lightbox-close]');
    const prevBtn = this.modal.querySelector('[data-lightbox-prev]');
    const nextBtn = this.modal.querySelector('[data-lightbox-next]');

    closeBtn.addEventListener('click', () => this.close());
    this.modal.querySelector('.lightbox-overlay').addEventListener('click', () => this.close());
    prevBtn.addEventListener('click', () => this.prev());
    nextBtn.addEventListener('click', () => this.next());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;

      switch (e.key) {
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
        case 'Escape':
          this.close();
          break;
      }
    });
  }

  open(index) {
    this.currentIndex = index;
    this.updateLightbox();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateLightbox();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateLightbox();
  }

  updateLightbox() {
    const item = this.items[this.currentIndex];
    const img = this.modal.querySelector('.lightbox-image');
    const caption = this.modal.querySelector('.lightbox-caption');
    const counter = this.modal.querySelector('.lightbox-counter .current');
    const total = this.modal.querySelector('.lightbox-counter .total');

    img.src = item.getAttribute('data-src') || item.src;
    img.alt = item.getAttribute('data-alt') || item.alt || '';
    caption.textContent = item.getAttribute('data-caption') || '';
    counter.textContent = this.currentIndex + 1;
    total.textContent = this.items.length;

    // Add fade animation
    img.style.animation = 'fadeIn 0.3s ease-in-out';
  }
}

// ============================================================================
// 4. SMOOTH INTERACTIONS
// ============================================================================

class SmoothInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupScrollAnimations();
    this.setupButtonInteractions();
    this.setupHoverEffects();
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate-on-scroll]').forEach((element) => {
      observer.observe(element);
    });
  }

  setupButtonInteractions() {
    const buttons = document.querySelectorAll('button, [role="button"], a.btn');

    buttons.forEach((button) => {
      // Add ripple effect on click
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple';

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });

      // Add focus effects
      button.addEventListener('focus', () => {
        button.classList.add('focused');
      });

      button.addEventListener('blur', () => {
        button.classList.remove('focused');
      });
    });
  }

  setupHoverEffects() {
    document.querySelectorAll('[data-hover-scale]').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)';
      });
    });

    document.querySelectorAll('[data-hover-lift]').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-5px)';
        element.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = '';
      });
    });
  }
}

// ============================================================================
// 5. UTILITY FUNCTIONS
// ============================================================================

class Utilities {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.offsetHeight; // Trigger reflow
    element.style.opacity = '1';
  }

  static fadeOut(element, duration = 300) {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = '0';
  }
}

// ============================================================================
// 6. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new SVGAnimations();
  new MobileMenu();
  new Lightbox();
  new SmoothInteractions();

  console.log('✓ Rewall Website Scripts Initialized');
});

// Handle page visibility for performance optimization
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations
    document.querySelectorAll('[style*="animation"]').forEach((el) => {
      el.style.animationPlayState = 'paused';
    });
  } else {
    // Resume animations
    document.querySelectorAll('[style*="animation"]').forEach((el) => {
      el.style.animationPlayState = 'running';
    });
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SVGAnimations,
    MobileMenu,
    Lightbox,
    SmoothInteractions,
    Utilities,
  };
}
