document.addEventListener('DOMContentLoaded', () => {
  // --- 1. PAGE LOADER ---
  const loaderWrapper = document.getElementById('loader-wrapper');
  const loaderProgress = document.getElementById('loader-progress');
  
  if (loaderWrapper && loaderProgress) {
    // Create and insert robot runner above progress bar
    const progressBg = loaderProgress.parentElement;
    const robotContainer = document.createElement('div');
    robotContainer.className = 'loader-robot-container';
    robotContainer.innerHTML = `
      <div class="css-robot waving">
        <div class="robot-head">
          <div class="robot-eyes"></div>
        </div>
        <div class="robot-body">
          <div class="robot-arm arm-left"></div>
          <div class="robot-arm arm-right"></div>
        </div>
        <div class="robot-legs">
          <div class="robot-leg leg-left"></div>
          <div class="robot-leg leg-right"></div>
        </div>
      </div>
    `;
    progressBg.parentNode.insertBefore(robotContainer, progressBg);

    const loaderRobot = robotContainer.querySelector('.css-robot');

    let progress = 0;
    const waveTime = 800; // 800ms waving at the start
    let elapsed = 0;
    const duration = 2000; // Optimized total loading time (2 seconds instead of 2.5)
    const intervalTime = 25;
    
    const loadingInterval = setInterval(() => {
      elapsed += intervalTime;
      
      if (elapsed < waveTime) {
        // Waving state (stay at 0%)
        progress = 0;
        if (loaderRobot && !loaderRobot.classList.contains('waving')) {
          loaderRobot.classList.add('waving');
          loaderRobot.classList.remove('running');
        }
      } else {
        // Running state (increase progress)
        if (loaderRobot && !loaderRobot.classList.contains('running')) {
          loaderRobot.classList.remove('waving');
          loaderRobot.classList.add('running');
        }
        
        const runElapsed = elapsed - waveTime;
        const runDuration = duration - waveTime;
        progress = (runElapsed / runDuration) * 100;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(loadingInterval);
          
          // Fade out page loader
          setTimeout(() => {
            loaderWrapper.classList.add('fade-out');
            document.body.classList.remove('loading'); // Re-enable scroll via class
          }, 300);
        }
      }
      
      loaderProgress.style.width = `${progress}%`;
      if (loaderRobot) {
        loaderRobot.style.left = `${progress}%`;
      }
    }, intervalTime);
  } else {
    document.body.classList.remove('loading');
  }

  // --- 2. MOBILE MENU TOGGLE ---
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 3. STICKY NAVBAR & SCROLL SPY ---
  const headerNav = document.getElementById('header-nav');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Add backdrop-blur background on scroll
    if (window.scrollY > 50) {
      headerNav.classList.add('scrolled');
    } else {
      headerNav.classList.remove('scrolled');
    }

    // Scroll Spy active navigation state
    let scrollY = window.scrollY;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });

  // --- 4. HERO SECTION TYPING ANIMATION ---
  const typingElement = document.getElementById('typewriter');
  if (typingElement) {
    const roles = ["Full Stack Developer", "AI Automation Expert", "AI Integration Specialist"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Speed up deleting
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal typing speed
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at the end of word
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Short pause before next word
      }

      setTimeout(typeEffect, typingSpeed);
    }

    setTimeout(typeEffect, 1000); // Start after initial loader
  }

  // --- 5. SCROLL-REVEAL SYSTEM (INTERSECTION OBSERVER) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- 6. PROJECTS FILTERING (projects.html) ---
  const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (filterTabs.length > 0 && projectCards.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Toggle Active Tab Style
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
          card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
          
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  }

  // --- 6.5 CERTIFICATIONS FILTERING (certifications.html) ---
  const certFilterTabs = document.querySelectorAll('.filter-tab[data-filter]');
  const certCards = document.querySelectorAll('.cert-card[data-category]');

  if (certFilterTabs.length > 0 && certCards.length > 0) {
    certFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        certFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-filter');

        certCards.forEach(card => {
          card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 400);
          }
        });
      });
    });
  }

  // --- 7. TESTIMONIALS CAROUSEL SLIDER ---
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const nextBtn = document.getElementById('slider-next');
  const prevBtn = document.getElementById('slider-prev');
  const dotsContainer = document.getElementById('slider-dots');

  if (track && slides.length > 0) {
    let currentIndex = 0;
    let slideWidth = slides[0].offsetWidth;
    let autoSlideInterval;

    // Generate Dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => moveToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function updateDots() {
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function moveToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
      resetAutoSlide();
    }

    function nextSlide() {
      moveToSlide(currentIndex + 1);
    }

    function prevSlide() {
      moveToSlide(currentIndex - 1);
    }

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', nextSlide);
      prevBtn.addEventListener('click', prevSlide);
    }

    // Auto sliding every 5 seconds
    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    startAutoSlide();

    // Re-calculate slide width on resize
    window.addEventListener('resize', () => {
      slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    });
  }

  // --- 8. COUNTDOWN TIMER (offer.html) ---
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (daysEl && hoursEl && minutesEl && secondsEl) {
    function getEndOfCurrentMonth() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const offerDeadline = getEndOfCurrentMonth().getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = offerDeadline - now;

      if (difference <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // --- 9. FORM VALIDATIONS ---
  const setupFormValidation = (formId, successBannerId) => {
    const form = document.getElementById(formId);
    const successBanner = document.getElementById(successBannerId);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        
        const inputs = form.querySelectorAll('.form-control[required]');
        
        inputs.forEach(input => {
          const errorMsg = input.nextElementSibling;
          
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
            if (errorMsg && errorMsg.classList.contains('error-message')) {
              errorMsg.textContent = 'This field is required.';
              errorMsg.style.display = 'block';
            }
          } else if (input.type === 'email' && !validateEmail(input.value)) {
            isValid = false;
            input.classList.add('invalid');
            if (errorMsg && errorMsg.classList.contains('error-message')) {
              errorMsg.textContent = 'Please enter a valid email address.';
              errorMsg.style.display = 'block';
            }
          } else if (input.id === 'message' && input.value.trim().length < 10) {
            isValid = false;
            input.classList.add('invalid');
            if (errorMsg && errorMsg.classList.contains('error-message')) {
              errorMsg.textContent = 'Message must be at least 10 characters long.';
              errorMsg.style.display = 'block';
            }
          } else {
            input.classList.remove('invalid');
            if (errorMsg && errorMsg.classList.contains('error-message')) {
              errorMsg.style.display = 'none';
            }
          }
        });

        if (isValid) {
          if (successBanner) {
            successBanner.style.display = 'block';
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          form.reset();
          setTimeout(() => {
            if (successBanner) successBanner.style.display = 'none';
          }, 6000);
        }
      });

      const fields = form.querySelectorAll('.form-control');
      fields.forEach(field => {
        field.addEventListener('input', () => {
          if (field.classList.contains('invalid')) {
            field.classList.remove('invalid');
            const errorMsg = field.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
              errorMsg.style.display = 'none';
            }
          }
        });
      });
    }
  };

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  setupFormValidation('contact-form', 'contact-success');
  setupFormValidation('claim-form', 'claim-success');

  // --- 10. BACKGROUND STARFIELD (SPACE EFFECT - PERFORMANCE OPTIMIZED) ---
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let stars = [];
  const maxStars = 75; // Reduced from 150 to optimize performance

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.4, // sizes from 0.4px to 1.6px
        alpha: Math.random(),
        twinkleSpeed: 0.003 + Math.random() * 0.005,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        vx: (Math.random() - 0.5) * 0.03, // Throttled drift speed
        vy: (Math.random() - 0.5) * 0.03
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';

    stars.forEach(star => {
      // Slow drift
      star.x += star.vx;
      star.y += star.vy;

      // Wrap around edges
      if (star.x > canvas.width) star.x = 0;
      if (star.x < 0) star.x = canvas.width;
      if (star.y > canvas.height) star.y = 0;
      if (star.y < 0) star.y = canvas.height;

      // Twinkle logic
      star.alpha += star.twinkleSpeed * star.twinkleDirection;
      if (star.alpha >= 0.95) {
        star.alpha = 0.95;
        star.twinkleDirection = -1;
      } else if (star.alpha <= 0.15) {
        star.alpha = 0.15;
        star.twinkleDirection = 1;
      }

      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      // Draw as simple rectangles instead of circles for canvas rendering efficiency
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });

    requestAnimationFrame(animateStars);
  }

  // Throttled window resizing
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200);
  });
  
  resizeCanvas();
  animateStars();

  // --- 11. FAQ ACCORDION TOGGLE ---
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // --- 12. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}); // <-- END of DOMContentLoaded

// --- 13. CV DOWNLOAD FORCE-TRIGGER ---
function downloadCV() {
  const link = document.createElement('a');
  link.href = 'Assets/cv.pdf';
  link.download = 'AGHA-CV.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================
// --- EXTENDED LEAD GEN & CASE STUDY ENGINE ---
// ==========================================

// --- CASE STUDIES DATA STORE ---
const caseStudies = {
  'almustafa': {
    title: 'Al-Mustafa Academy Portal',
    challenge: 'A prominent academy faced manual grading backlogs, certificate issuance delays, and poor operational data oversight.',
    solution: 'Engineered an automated Next.js portal integrated with OpenAI to evaluate student trends. Integrated n8n hooks to automatically render and dispatch PDF credentials.',
    tech: 'Next.js, OpenAI API, MongoDB, n8n, Node.js',
    features: [
      'Automated certification PDF layout rendering engines.',
      'OpenAI-driven profile analytics and study insight tools.',
      'Real-time student progress tracking boards.',
      'n8n sync triggers for admin notifications.'
    ],
    metrics: { val1: '95%', lbl1: 'Admin Work Saved', val2: '1,200+', lbl2: 'PDF Certs Issued', val3: 'Instant', lbl3: 'Student Grade Sync' },
    testimonial: '"AGHA completely transformed our online presence and operations at Almustafa Academy. Automated systems made course certifications seamless." — Agha Talib, Founder'
  },
  'bookship': {
    title: 'The Book Ship E-Commerce',
    challenge: 'An online marketplace struggled to stand out, requiring AI search features and instant summary generation for hundreds of titles.',
    solution: 'Designed a Next.js catalog using Gemini API for automatic content summaries. Integrated Stripe elements for single-click payment and Redis for cache queries.',
    tech: 'Next.js, Gemini API, Stripe, Redis, Postgres',
    features: [
      'Gemini-powered semantic book summaries.',
      'Redis cache layers matching rapid transaction loads.',
      'Fully secure Stripe checkout portals.',
      'Monochrome autolayout catalog designs.'
    ],
    metrics: { val1: '85%', lbl1: 'Summary Accuracy', val2: '50ms', lbl2: 'Cache Query Speed', val3: '2.5x', lbl3: 'Sales Conversion' },
    testimonial: '"Beautiful e-commerce setup. The Gemini summary engine engages customers instantly. Direct Stripe flows simplified buying." — Fakher, Founder'
  },
  'mathematician': {
    title: 'Sir Mujtaba LMS Portal',
    challenge: 'A math training profile lacked mock testing capabilities, scoring trackers, and clean mobile lesson layouts.',
    solution: 'Built a customized LMS dashboard using React and Express.js. Designed interactive mock testing scripts using Zustand state managers and GSAP physics diagrams.',
    tech: 'React.js, Node.js, Express, Zustand, GSAP',
    features: [
      'Mock exam engines with custom timer scripts.',
      'Zustand-driven course trackers.',
      'Hardware-accelerated layout timelines.',
      'Admin grade sheet portals.'
    ],
    metrics: { val1: '40%', lbl1: 'Grades Improved', val2: '3,500+', lbl2: 'Practice Exams Taken', val3: '99.9%', lbl3: 'Exam Uptime' },
    testimonial: '"Custom testing modules worked exactly as envisioned. Students loved the smooth transitions and instant reports." — Sir Mujtaba Kamal, Mathematician'
  },
  'ai-agent': {
    title: 'Automated AI Support System',
    challenge: 'An agency lost 30% of incoming leads due to slow response times and lack of support availability outside of office hours.',
    solution: 'Connected n8n workflows with OpenAI agents to read emails, match inquiries with documentation databases, and resolve tickets instantly.',
    tech: 'n8n, OpenAI API, Supabase vector logs',
    features: [
      'Classification of user inquiry intent.',
      'Automatic vector searching matching resolution sheets.',
      'Back-up alerting triggers to human managers.',
      'Custom customer response dashboards.'
    ],
    metrics: { val1: '80%', lbl1: 'Admin Overhead cut', val2: '92%', lbl2: 'Instant Query Resolution', val3: '3.2x', lbl3: 'Lead Capture Rate' },
    testimonial: '"Our customer support is now fully automated. We save over 20 hours a week, and leads never slip through the cracks." — Operations Director'
  },
  'scraper': {
    title: 'Cognitive Web Scraper',
    challenge: 'A search indexer kept failing due to frequent website layout redesigns and structural modifications on client pages.',
    solution: 'Wrote a Node/Python parsing module utilizing LLM parsing. The script analyzes DOM contexts rather than strict CSS selectors to grab target items.',
    tech: 'Python, Puppeteer, OpenAI API, MongoDB',
    features: [
      'Structure-agnostic context parsing.',
      'Automatic JSON mapping.',
      'Cloud storage cron sync loops.',
      'Proxy rotation and throttling.'
    ],
    metrics: { val1: '98%', lbl1: 'Parsing Reliability', val2: '10x', lbl2: 'Setup Speed', val3: '0%', lbl3: 'Selector Maintenance' },
    testimonial: '"We no longer fix selectors every week. The LLM handles unstructured markup perfectly." — CTO, DataCorp'
  },
  'saas-metrics': {
    title: 'SaaS Analytics Dashboard',
    challenge: 'A SaaS platform needed a central portal to track subscriber metrics, API usage counts, and database load indicators in real time.',
    solution: 'Designed a premium dashboard using React. Structured serverless paths in Supabase to stream real-time database transactions to interactive Canvas charts.',
    tech: 'React, Tailwind CSS, Supabase, ChartJS',
    features: [
      'Real-time streaming charts.',
      'Custom user role authentication.',
      'API rate limit tracking panels.',
      'Automated email reporter schedules.'
    ],
    metrics: { val1: '150ms', lbl1: 'Data Sync Latency', val2: '10k+', lbl2: 'Connected API Keys', val3: '98%', lbl3: 'Client Renewal Rate' },
    testimonial: '"Beautiful, responsive, and fast. The monochrome dashboard gave our team immediate operational clarity." — Co-Founder'
  },
  'scand-store': {
    title: 'Scandinavian E-Commerce Store',
    challenge: 'A luxury furniture brand needed a highly immersive online catalog with complex animations that still loaded under 1.5 seconds.',
    solution: 'Coded a lightweight static store utilizing optimized picture loading arrays, vanilla CSS grid transitions, and CSS custom variables for instant themes.',
    tech: 'HTML5, CSS Variables, vanilla JS',
    features: [
      'Sub-second first contentful paint (FCP).',
      'Ultra-light responsive drawer modals.',
      'Fluid sliding grid layout systems.',
      'Optimized media dimensions.'
    ],
    metrics: { val1: '0.8s', lbl1: 'Page Load Time', val2: '99', lbl2: 'Lighthouse Performance', val3: '18%', lbl3: 'Average Order Up' },
    testimonial: '"The website loads instantly and the layout feels premium. User interactions are incredibly responsive." — Creative Director'
  },
  'devart-clone': {
    title: 'DevArt Art Gallery Repository',
    challenge: 'A community art collection portal required highly responsive photo galleries that scaled proportionally without visual distortion.',
    solution: 'Created a layout utilizing flexbox and CSS Grid. Handled image sizing logic dynamically to minimize layout shifts (CLS) on dynamic content updates.',
    tech: 'HTML5, CSS3 Grid, JavaScript, IntersectionObserver',
    features: [
      'Responsive Masonry layout patterns.',
      'Lazy image loaders and blur placeholders.',
      'Interactive tag categorizations.',
      'Custom lightboxes with smooth swipe triggers.'
    ],
    metrics: { val1: '0.01', lbl1: 'Cumulative Layout Shift', val2: '75%', lbl2: 'Data Usage Reduced', val3: '100k+', lbl3: 'Monthly Pageviews' },
    testimonial: '"An exceptionally clean implementation of image scaling. The lazy loader makes browsing thousands of art items smooth." — Platform Admin'
  },
  'glass-ui': {
    title: 'Glassmorphism UI Component Library',
    challenge: 'Developers needed a clean, ready-to-copy monochrome kit utilizing background-blur properties without sacrificing render performance.',
    solution: 'Engineered a CSS package utilizing variables and optimized backdrop-filter classes. Hardware accelerated key visual elements for smooth sliding animations.',
    tech: 'CSS Variables, Backdrop Filters, HTML5',
    features: [
      'Modular utility copy codes.',
      'Fully responsive autolayout structures.',
      'Contrast-checked accessibility.',
      'Zero external dependency files.'
    ],
    metrics: { val1: '4KB', lbl1: 'Bundle Weight', val2: '12+', lbl2: 'Pre-designed Widgets', val3: '100%', lbl3: 'CSS Validation Score' },
    testimonial: '"The glass effects are gorgeous and perform exceptionally well on mobile browsers." — Front-End Lead'
  },
  'project-board': {
    title: 'AI Kanban Board',
    challenge: 'Team project planners lacked predictive metrics to estimate task completion times, leading to missed sprint windows.',
    solution: 'Developed a drag-and-drop board. Integrated an LLM estimator node in Express that analyzes ticket text history to suggest task complexities and assignees.',
    tech: 'Next.js, Node.js, Express, MongoDB, DnD-Kit',
    features: [
      'Dynamic ticket categorization cards.',
      'AI sprint velocity forecasting.',
      'Real-time socket task updates.',
      'Custom sub-task nesting.'
    ],
    metrics: { val1: '25%', lbl1: 'Sprint Accuracy Up', val2: '2h', lbl2: 'Planner Meeting Saved', val3: '4.8/5', lbl3: 'User Ease Rating' },
    testimonial: '"The drag-and-drop is flawless, and the AI complexity suggestions are surprisingly accurate." — Product Manager'
  },
  'automotive-hud': {
    title: 'Automotive EV Instrument Panel',
    challenge: 'A prototype electric vehicle console required real-time telemetry rendering that matched direct CAN-bus trigger speeds.',
    solution: 'Coded a high-fidelity instrument panel using hardware-accelerated CSS keyframes and optimized requestAnimationFrame updates to rendering needles.',
    tech: 'Figma, CSS Keyframes, requestAnimationFrame',
    features: [
      'Real-time speed and battery HUD dials.',
      'Animated warning overlay indicators.',
      'Interactive control panels.',
      'Strict monochrome theme variables.'
    ],
    metrics: { val1: '60fps', lbl1: 'Render Performance', val2: '<10ms', lbl2: 'Telemetry Input Delay', val3: '100%', lbl3: 'Visual Frame Precision' },
    testimonial: '"The telemetry dial animations render at a locked 60fps. Visual precision matches original CAD specs." — Lead HUD Architect'
  }
};

// --- DYNAMIC MODAL INJECTOR & ENGINE ---
function appendCaseStudyModal() {
  if (document.getElementById('case-study-modal')) return;

  const modalHtml = `
    <div id="case-study-modal" class="modal-overlay" onclick="closeCaseStudyModal(event)">
      <div class="modal-container" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3 id="modal-project-title" class="modal-title">Project Case Study</h3>
          <button class="modal-close" onclick="toggleCaseStudyModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-tabs">
            <button class="modal-tab active" onclick="switchModalTab(this, 'tab-overview')">Overview</button>
            <button class="modal-tab" onclick="switchModalTab(this, 'tab-tech')">Tech Stack</button>
            <button class="modal-tab" onclick="switchModalTab(this, 'tab-results')">Impact Metrics</button>
          </div>
          
          <!-- Tab 1: Overview -->
          <div id="tab-overview" class="modal-tab-content active">
            <h4>The Challenge</h4>
            <p id="modal-challenge-text">Loading...</p>
            <h4>Solution & Approach</h4>
            <p id="modal-solution-text">Loading...</p>
          </div>
          
          <!-- Tab 2: Tech Architecture -->
          <div id="tab-tech" class="modal-tab-content">
            <h4>Engineering Stack</h4>
            <p id="modal-stack-text">Loading...</p>
            <h4>Core Features Implemented</h4>
            <ul id="modal-features-list">
              <!-- Dynamically populated -->
            </ul>
          </div>
          
          <!-- Tab 3: Impact Metrics -->
          <div id="tab-results" class="modal-tab-content">
            <div class="modal-metrics-grid">
              <div class="modal-metric-card">
                <div id="metric-1-val" class="modal-metric-value">0</div>
                <div id="metric-1-lbl" class="modal-metric-label">Metric</div>
              </div>
              <div class="modal-metric-card">
                <div id="metric-2-val" class="modal-metric-value">0</div>
                <div id="metric-2-lbl" class="modal-metric-label">Metric</div>
              </div>
              <div class="modal-metric-card">
                <div id="metric-3-val" class="modal-metric-value">0</div>
                <div id="metric-3-lbl" class="modal-metric-label">Metric</div>
              </div>
            </div>
            <h4>Client Testimonial</h4>
            <p id="modal-testimonial-text" style="font-style: italic;">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  const div = document.createElement('div');
  div.innerHTML = modalHtml.trim();
  document.body.appendChild(div.firstChild);
}

function openCaseStudy(projectId) {
  appendCaseStudyModal();
  const modal = document.getElementById('case-study-modal');
  const data = caseStudies[projectId];
  
  if (!modal || !data) return;

  // Set titles and content
  document.getElementById('modal-project-title').textContent = data.title;
  document.getElementById('modal-challenge-text').textContent = data.challenge;
  document.getElementById('modal-solution-text').textContent = data.solution;
  document.getElementById('modal-stack-text').textContent = data.tech;
  document.getElementById('modal-testimonial-text').textContent = data.testimonial;

  // Build features list
  const list = document.getElementById('modal-features-list');
  list.innerHTML = '';
  data.features.forEach(feat => {
    const li = document.createElement('li');
    li.textContent = feat;
    list.appendChild(li);
  });

  // Set metrics
  document.getElementById('metric-1-val').textContent = data.metrics.val1;
  document.getElementById('metric-1-lbl').textContent = data.metrics.lbl1;
  document.getElementById('metric-2-val').textContent = data.metrics.val2;
  document.getElementById('metric-2-lbl').textContent = data.metrics.lbl2;
  document.getElementById('metric-3-val').textContent = data.metrics.val3;
  document.getElementById('metric-3-lbl').textContent = data.metrics.lbl3;

  // Reset tab to overview
  const tabs = modal.querySelectorAll('.modal-tab');
  tabs.forEach(t => t.classList.remove('active'));
  tabs[0].classList.add('active');

  const contents = modal.querySelectorAll('.modal-tab-content');
  contents.forEach(c => c.classList.remove('active'));
  document.getElementById('tab-overview').classList.add('active');

  // Open modal and lock scroll
  modal.classList.add('active');
  document.body.classList.add('modal-open');
}

function toggleCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

function closeCaseStudyModal(event) {
  toggleCaseStudyModal();
}

function switchModalTab(button, tabId) {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;

  const tabs = modal.querySelectorAll('.modal-tab');
  tabs.forEach(t => t.classList.remove('active'));
  button.classList.add('active');

  const contents = modal.querySelectorAll('.modal-tab-content');
  contents.forEach(c => c.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// --- PROJECT COST PLANNER CALCULATIONS ---
function togglePlannerOption(card) {
  card.classList.toggle('selected');
  const checkbox = card.querySelector('input[type="checkbox"]');
  if (checkbox) {
    checkbox.checked = card.classList.contains('selected');
  }
  updatePlannerCalculations();
}

function updatePlannerCalculations() {
  const cards = document.querySelectorAll('.planner-option-card');
  const slider = document.getElementById('planner-scope-slider');
  const displayVal = document.getElementById('scope-value-display');
  const priceDisplay = document.getElementById('planner-price-display');
  const timelineDisplay = document.getElementById('planner-timeline-display');
  
  if (!slider || !priceDisplay || !timelineDisplay) return;

  let multiplier = 1.0;
  let scopeLabel = 'Medium Integration';
  if (slider.value === '1') {
    multiplier = 0.7;
    scopeLabel = 'Simple Setup';
  } else if (slider.value === '3') {
    multiplier = 1.5;
    scopeLabel = 'Enterprise System';
  }
  displayVal.textContent = scopeLabel;

  let totalPrice = 0;
  let totalDays = 0;

  const pricingMap = {
    'mod-ai': { price: 350, days: 4 },
    'mod-auto': { price: 250, days: 3 },
    'mod-frontend': { price: 500, days: 7 },
    'mod-database': { price: 300, days: 4 }
  };

  cards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      const id = checkbox.id;
      if (pricingMap[id]) {
        totalPrice += pricingMap[id].price;
        totalDays += pricingMap[id].days;
      }
    }
  });

  let finalPrice = Math.round(totalPrice * multiplier);
  let finalDaysMin = Math.round(totalDays * multiplier * 0.85);
  let finalDaysMax = Math.round(totalDays * multiplier * 1.2);
  
  if (finalDaysMin < 2) finalDaysMin = 2;
  if (finalDaysMax < 4) finalDaysMax = 4;

  if (totalPrice === 0) {
    priceDisplay.innerHTML = '$0 <span>(20% Off Included)</span>';
    timelineDisplay.textContent = '0 Days';
  } else {
    priceDisplay.innerHTML = `$${finalPrice} <span>(20% Off Included)</span>`;
    timelineDisplay.textContent = `${finalDaysMin}–${finalDaysMax} Days`;
  }
}

function prefillContactFormFromPlanner() {
  const cards = document.querySelectorAll('.planner-option-card');
  const slider = document.getElementById('planner-scope-slider');
  const messageBox = document.getElementById('message');
  
  if (!messageBox) return;

  let selectedModules = [];
  const pricingMap = {
    'mod-ai': 'AI Chatbots & Agents',
    'mod-auto': 'n8n Workflow Sync',
    'mod-frontend': 'Custom Web Portal',
    'mod-database': 'Database & Custom API'
  };

  cards.forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      if (pricingMap[checkbox.id]) {
        selectedModules.push(pricingMap[checkbox.id]);
      }
    }
  });

  let complexity = 'Medium';
  if (slider.value === '1') complexity = 'Simple';
  if (slider.value === '3') complexity = 'Enterprise';

  const priceStr = document.getElementById('planner-price-display').textContent.split(' ')[0];
  const timelineStr = document.getElementById('planner-timeline-display').textContent;

  let messageText = `Hi AGHA,\n\nI calculated a project plan using your Planner widget:\n`;
  messageText += `- Modules Needed: ${selectedModules.join(', ') || 'None'}\n`;
  messageText += `- System Size: ${complexity}\n`;
  messageText += `- Ballpark Estimate: ${priceStr}\n`;
  messageText += `- Projected Timeline: ${timelineStr}\n\n`;
  messageText += `I would like to claim my 20% discount slot and discuss building this custom system.`;

  messageBox.value = messageText;
  
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- GLOBAL ATTACHMENTS FOR WINDOW TRIGGER ACTIONS ---
window.openCaseStudy = openCaseStudy;
window.toggleCaseStudyModal = toggleCaseStudyModal;
window.closeCaseStudyModal = closeCaseStudyModal;
window.switchModalTab = switchModalTab;
window.togglePlannerOption = togglePlannerOption;
window.updatePlannerCalculations = updatePlannerCalculations;
window.prefillContactFormFromPlanner = prefillContactFormFromPlanner;