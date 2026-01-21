/* ============================================
   NS.Bulan Atelier - Main JavaScript
   Vanilla JavaScript - No Frameworks
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initScrollReveal();
  initCarousel();
  initBlogFilters();
  initContactForm();
  initHeroVideo();
});

/* ============================================
   Hero Video Handler
   ============================================ */
function initHeroVideo() {
  const heroVideo = document.querySelector('.hero-video');
  if (!heroVideo) return;
  
  // Try to play the video
  heroVideo.play().catch(function(error) {
    // Autoplay may be blocked by browser policy
  });
}

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  let lastScroll = 0;

  // Hide/show navigation on scroll
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      nav.classList.remove('hidden');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 80) {
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    const mobileLinks = navMobile.querySelectorAll('.nav-mobile-link');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active nav link based on current page
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
  
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (currentPath === href || 
        (currentPath === '/' && href === 'index.html') ||
        (currentPath.includes('blog') && href.includes('blog')) ||
        (currentPath.includes('contact') && href.includes('contact'))) {
      link.classList.add('active');
    }
  });
}

/* ============================================
   Scroll Reveal Animation
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(function(el) {
    observer.observe(el);
  });
}

/* ============================================
   Image Carousel
   ============================================ */
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const container = carousel.querySelector('.carousel-container');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  
  let currentIndex = 0;
  const totalSlides = slides.length;

  // Create dots
  if (dotsContainer) {
    slides.forEach(function(_, index) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', function() {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    container.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
    
    // Update dots
    const dots = dotsContainer?.querySelectorAll('.carousel-dot');
    dots?.forEach(function(dot, index) {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-play
  let autoplayInterval = setInterval(nextSlide, 5000);

  carousel.addEventListener('mouseenter', function() {
    clearInterval(autoplayInterval);
  });

  carousel.addEventListener('mouseleave', function() {
    autoplayInterval = setInterval(nextSlide, 5000);
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }
}

/* ============================================
   Blog Filters
   ============================================ */
function initBlogFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.article-card[data-category]');
  
  if (filterButtons.length === 0 || blogCards.length === 0) return;

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      // Filter cards
      blogCards.forEach(function(card) {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(function() {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(function() {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Load more functionality
  const loadMoreBtn = document.querySelector('.load-more-btn');
  const hiddenCards = document.querySelectorAll('.article-card.hidden-card');
  
  if (loadMoreBtn && hiddenCards.length > 0) {
    loadMoreBtn.addEventListener('click', function() {
      hiddenCards.forEach(function(card, index) {
        setTimeout(function() {
          card.classList.remove('hidden-card');
          card.style.display = 'block';
          setTimeout(function() {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }, index * 100);
      });
      
      loadMoreBtn.style.display = 'none';
    });
  }
}

/* ============================================
   Contact Form Validation
   ============================================ */
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  const formFields = {
    firstName: {
      element: form.querySelector('#firstName'),
      errorElement: form.querySelector('#firstNameError'),
      validate: function(value) {
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return null;
      }
    },
    lastName: {
      element: form.querySelector('#lastName'),
      errorElement: form.querySelector('#lastNameError'),
      validate: function(value) {
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return null;
      }
    },
    email: {
      element: form.querySelector('#email'),
      errorElement: form.querySelector('#emailError'),
      validate: function(value) {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
      }
    },
    subject: {
      element: form.querySelector('#subject'),
      errorElement: form.querySelector('#subjectError'),
      validate: function(value) {
        if (!value) return 'Please select a subject';
        return null;
      }
    },
    message: {
      element: form.querySelector('#message'),
      errorElement: form.querySelector('#messageError'),
      validate: function(value) {
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        return null;
      }
    }
  };

  // Real-time validation
  Object.keys(formFields).forEach(function(fieldName) {
    const field = formFields[fieldName];
    if (field.element) {
      field.element.addEventListener('blur', function() {
        validateField(fieldName);
      });
      
      field.element.addEventListener('input', function() {
        if (field.element.classList.contains('error')) {
          validateField(fieldName);
        }
      });
    }
  });

  function validateField(fieldName) {
    const field = formFields[fieldName];
    if (!field.element) return true;
    
    const value = field.element.value;
    const error = field.validate(value);
    
    if (error) {
      field.element.classList.add('error');
      if (field.errorElement) {
        field.errorElement.textContent = error;
        field.errorElement.classList.add('visible');
      }
      return false;
    } else {
      field.element.classList.remove('error');
      if (field.errorElement) {
        field.errorElement.classList.remove('visible');
      }
      return true;
    }
  }

  function validateForm() {
    let isValid = true;
    
    Object.keys(formFields).forEach(function(fieldName) {
      if (!validateField(fieldName)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Show loading state
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(function() {
        // Hide form, show success message
        const formWrapper = document.querySelector('.contact-form');
        const successMessage = document.querySelector('.form-success');
        
        if (formWrapper && successMessage) {
          formWrapper.style.display = 'none';
          successMessage.classList.add('visible');
        }
        
        // Reset form
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    }
  });
}

/* ============================================
   Smooth Scroll for anchor links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
