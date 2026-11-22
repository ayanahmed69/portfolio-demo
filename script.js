/**
 * MARUF.DEV - PORTFOLIO INTERACTIVITY SCRIPT
 * High performance, zero external framework dependencies (Pure Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAmbientCanvas();
  initCustomCursor();
  initTypingEffect();
  initCounters();
  initNavScroll();
  initLiquidNavPill();
  initMobileDrawer();
  initSkillsFilter();
  initProjectsFilter();
  initProjectModals();
  initTerminal();
  initContactForm();
  initCopyEmail();
  initLocalClock();
  initLiquidTiltAndGlare();
  initLiquidRipple();
  initScrollReveal();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark & Light Mode with LocalStorage)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  // Check persisted preference or system preference
  const savedTheme = localStorage.getItem('maruf-theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlEl.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('maruf-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ==========================================================================
   2. AMBIENT INTERACTIVE CANVAS (Constellation / Fluid Particle Effect)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Create subtle particles
  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(99, 102, 241, ${this.alpha})`
        : `rgba(99, 102, 241, ${this.alpha * 0.6})`;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = dx / distance;
          const directionY = dy / distance;
          this.x -= directionX * force * 3;
          this.y -= directionY * force * 3;
        }
      }
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * (isDark ? 0.15 : 0.08);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle liquid light ripple pool under mouse
    if (mouse.x !== null && mouse.y !== null) {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
      grad.addColorStop(0, isDark ? 'rgba(6, 182, 212, 0.14)' : 'rgba(99, 102, 241, 0.08)');
      grad.addColorStop(0.5, isDark ? 'rgba(99, 102, 241, 0.07)' : 'rgba(6, 182, 212, 0.04)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. CUSTOM MAGNETIC CURSOR (Desktop only)
   ========================================================================== */
function initCustomCursor() {
  if (window.innerWidth <= 768) return;

  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  let mouseX = -100, mouseY = -100;
  let outlineX = -100, outlineY = -100;
  let lastX = -100, lastY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.16;
    outlineY += (mouseY - outlineY) * 0.16;

    // Fluid liquid droplet squish and stretch physics
    const vx = mouseX - lastX;
    const vy = mouseY - lastY;
    lastX = mouseX;
    lastY = mouseY;

    const speed = Math.hypot(vx, vy);
    const stretch = Math.min(speed * 0.015, 0.45);
    const angle = Math.atan2(vy, vx) * (180 / Math.PI);

    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) rotate(${angle}deg) scale(${1 + stretch}, ${1 - stretch * 0.6})`;

    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Add hover class on interactive elements
  const interactiveSelector = 'a, button, .project-card, .skill-card, input, textarea, .term-pill-btn';
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   4. TYPING TEXT ANIMATION
   ========================================================================== */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const phrases = [
    'Scalable Web Apps',
    'Immersive User Experiences',
    'Intelligent Full-Stack Systems',
    'High-Performance Microservices',
    'Next-Gen Digital Products'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      delay = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = 1800; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400; // Pause before new phrase starts
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   5. ANIMATED NUMERICAL COUNTERS (Stats)
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach((counter) => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   6. NAVBAR SCROLL EFFECT & BACK TO TOP
   ========================================================================== */
function initNavScroll() {
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header blurred background
    if (scrollPos > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (backToTop) {
      if (scrollPos > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active nav link tracking
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            if (window.updateLiquidNavPill) window.updateLiquidNavPill();
          }
        });
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   6B. LIQUID NAVIGATION CAPSULE PILL
   ========================================================================== */
function initLiquidNavPill() {
  const navList = document.getElementById('nav-list');
  const pill = document.getElementById('nav-liquid-pill');
  const links = document.querySelectorAll('.nav-link');

  if (!navList || !pill || !links.length) return;

  function movePillTo(element) {
    if (!element) {
      pill.style.opacity = '0';
      return;
    }
    const listRect = navList.getBoundingClientRect();
    const linkRect = element.getBoundingClientRect();

    const left = linkRect.left - listRect.left;
    const width = linkRect.width;

    pill.style.left = `${left}px`;
    pill.style.width = `${width}px`;
    pill.style.opacity = '1';
  }

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => movePillTo(link));
  });

  navList.addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.nav-link.active');
    movePillTo(activeLink);
  });

  const activeLink = document.querySelector('.nav-link.active') || links[0];
  setTimeout(() => movePillTo(activeLink), 300);

  window.updateLiquidNavPill = () => {
    const active = document.querySelector('.nav-link.active');
    if (active) movePillTo(active);
  };
}

/* ==========================================================================
   7. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const hamburger = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const backdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   8. SKILLS TAB FILTERING
   ========================================================================== */
function initSkillsFilter() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   9. PROJECTS TAB FILTERING
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   10. PROJECT DETAILS MODAL
   ========================================================================== */
const projectsDatabase = {
  1: {
    title: 'Zenith Real-Time Analytics',
    category: 'Enterprise SaaS & Data Engine',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    description:
      'Zenith is a multi-tenant telemetry and visual analytics platform engineered for modern web-scale organizations. It ingests tens of millions of telemetry events per day via WebSockets and Apache Kafka, storing partitioned historical metrics with TimescaleDB.',
    highlights: [
      'Sub-50ms query response time across billions of ingested data points.',
      'Canvas-based dynamic funnel charts and customizable user journey heatmaps.',
      'Role-based access control (RBAC) with SOC2 compliant audit logging.',
      'Custom alert dispatch engine notifying via Slack, Webhooks, and SMS.'
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TimescaleDB', 'Docker', 'Redis'],
    demoUrl: 'https://example.com/zenith',
    codeUrl: 'https://github.com/example/zenith-analytics'
  },
  2: {
    title: 'Aurora Generative Studio',
    category: 'AI & Creative Workspace',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    description:
      'Aurora provides design teams with an AI-augmented canvas. Users can prompt UI ideas, convert sketch wireframes into clean Tailwind CSS components, and execute automatic WCAG AAA accessibility compliance checks in real time.',
    highlights: [
      'Multi-modal LLM orchestration with streaming token completions.',
      'Instant code generation with live in-browser preview sandbox.',
      'Collaborative multiplayer canvas using WebSockets and CRDTs.',
      'Automated dark/light mode palette generation using color contrast algorithms.'
    ],
    tags: ['Next.js', 'Python', 'FastAPI', 'OpenAI API', 'Tailwind CSS', 'WebSockets'],
    demoUrl: 'https://example.com/aurora',
    codeUrl: 'https://github.com/example/aurora-studio'
  },
  3: {
    title: 'Nova Luxury Living Store',
    category: 'Headless E-Commerce & 3D Interactive Web',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    description:
      'Nova is an ultra-modern headless e-commerce experience designed for high-end interior furnishings. Featuring interactive WebGL product viewers, shoppers can inspect custom fabrics, finishes, and dimensions in photorealistic 3D.',
    highlights: [
      'Interactive Three.js 3D model configurator with dynamic materials & lighting.',
      'Optimized asset delivery pipeline with automatic WebP/AVIF compression.',
      'Instant checkout integration powered by Stripe Elements.',
      '99.8% Core Web Vitals score on mobile and desktop devices.'
    ],
    tags: ['React', 'Three.js', 'Stripe API', 'Shopify Storefront API', 'GSAP'],
    demoUrl: 'https://example.com/nova',
    codeUrl: 'https://github.com/example/nova-store'
  },
  4: {
    title: 'Pulse Server & API Sentinel',
    category: 'Cloud DevOps & Health Monitor',
    img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    description:
      'A resilient infrastructure monitoring daemon and web dashboard designed for distributed multi-cloud services. Tracks HTTP endpoint latencies, SSL certificate expirations, CPU spikes, and memory pressure.',
    highlights: [
      'Distributed ping workers deployed in 12 global cloud regions.',
      'Intelligent anomaly detection reducing false-positive incident alarms by 75%.',
      'Public status page generator with customizable branding and custom domains.',
      'Instant webhook integrations for PagerDuty and Discord.'
    ],
    tags: ['Go', 'Node.js', 'Docker', 'Redis', 'Chart.js', 'Cloudflare Workers'],
    demoUrl: 'https://example.com/pulse',
    codeUrl: 'https://github.com/example/pulse-sentinel'
  },
  5: {
    title: 'NeuroFlow Knowledge Canvas',
    category: 'Visual Graph & Productivity Suite',
    img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    description:
      'NeuroFlow is a personal knowledge management graph tool that helps researchers, software engineers, and writers visualize complex relationships between ideas, documents, and technical notes.',
    highlights: [
      'GPU-accelerated force-directed graph renderer handling 10,000+ interactive nodes.',
      'Offline-first architecture with local SQLite and IndexedDB caching.',
      'Bi-directional linking with full Markdown and LaTeX math support.',
      'Cross-device sync using end-to-end encrypted peer-to-peer WebRTC.'
    ],
    tags: ['HTML5 Canvas', 'TypeScript', 'WebRTC', 'IndexedDB', 'CSS3'],
    demoUrl: 'https://example.com/neuroflow',
    codeUrl: 'https://github.com/example/neuroflow'
  },
  6: {
    title: 'CyberShield Threat Radar',
    category: 'Cybersecurity & Supply Chain Auditor',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    description:
      'An automated vulnerability scanner that integrates into CI/CD pipelines to inspect container images, detect leaked secrets, and identify deprecated open-source package vulnerabilities.',
    highlights: [
      'Automated SBOM (Software Bill of Materials) generation in SPDX and CycloneDX formats.',
      'Scans npm, PyPI, and Docker registry dependencies against CVE feeds.',
      'Real-time Slack notification alerts for critical severity CVEs.',
      'Automated pull requests with verified dependency version bump upgrades.'
    ],
    tags: ['Python', 'FastAPI', 'Vue.js', 'PostgreSQL', 'Docker', 'GitHub API'],
    demoUrl: 'https://example.com/cybershield',
    codeUrl: 'https://github.com/example/cybershield'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');

  if (!modal || !modalBody) return;

  function openProject(id) {
    const data = projectsDatabase[id];
    if (!data) return;

    modalBody.innerHTML = `
      <img src="${data.img}" alt="${data.title}" class="modal-img">
      <span class="project-category">${data.category}</span>
      <h2 class="modal-title" id="modal-title">${data.title}</h2>
      
      <div class="modal-tags">
        ${data.tags.map((tag) => `<span class="tech-tag">${tag}</span>`).join('')}
      </div>

      <p class="modal-desc">${data.description}</p>

      <h4 class="modal-highlights-title"><i class="fa-solid fa-bolt text-accent"></i> Key Innovations & Architecture</h4>
      <ul class="modal-highlights-list">
        ${data.highlights.map((h) => `<li><i class="fa-solid fa-check text-success"></i> ${h}</li>`).join('')}
      </ul>

      <div class="modal-actions">
        <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
        </a>
        <a href="${data.codeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-glass">
          <i class="fa-brands fa-github"></i> Source Code
        </a>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openProject(id);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   11. INTERACTIVE DEVELOPER TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const submitBtn = document.getElementById('terminal-submit-btn');
  const shortcutBtns = document.querySelectorAll('.term-pill-btn');

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: `
Available commands:
  <span class="cmd-highlight">about</span>      - Learn more about who I am
  <span class="cmd-highlight">skills</span>     - Review core technical competencies
  <span class="cmd-highlight">projects</span>   - Discover key portfolio builds
  <span class="cmd-highlight">experience</span> - View timeline and milestones
  <span class="cmd-highlight">hire</span>       - Get direct contact channels
  <span class="cmd-highlight">sudo hire</span>  - Fast-track direct inquiry (Easter egg!)
  <span class="cmd-highlight">clear</span>      - Clear the console screen
  <span class="cmd-highlight">date</span>       - Print current system date & time
  <span class="cmd-highlight">whoami</span>     - Inspect your current identity
    `,
    about: `Maruf | Full-Stack Software Engineer & Creative UI Architect.<br>Focus: High-performance web applications, responsive user interfaces, and scalable backend infrastructure.`,
    skills: `Frontend: React, Next.js, TypeScript, HTML5/CSS3, Three.js<br>Backend: Node.js, Python, FastAPI, Express, PostgreSQL, MongoDB<br>DevOps: Docker, CI/CD, AWS, Cloudflare, Linux CLI`,
    projects: `1. Zenith Real-Time Analytics (SaaS & Big Data)<br>2. Aurora Generative Studio (AI Visual Tool)<br>3. Nova Luxury Living (Interactive 3D Web Store)<br>4. Pulse Sentinel (DevOps Server Monitor)<br>Tip: Scroll up to the Projects section to test live demos!`,
    experience: `• 2024-Present: Lead Full-Stack Developer @ Vertex Digital<br>• 2022-2024: Senior Frontend Engineer @ Hyperion Studio<br>• 2021-2022: Full-Stack Web Developer @ Nexus Labs<br>• 2017-2021: B.Sc. in Computer Science & Engineering (Honors)`,
    hire: `I'm currently open for high-impact full-time roles, contract work, and technical advisory.<br>Email: <a href="mailto:maruf.developer@example.com" class="text-accent">maruf.developer@example.com</a> or use the Contact Form below!`,
    'sudo hire': `🚀 [ACCESS GRANTED - ROOT PRIORITY]:<br>Thank you for initiating VIP contact protocol! Scrolling to the contact form for you...`,
    date: () => `Current Local Time: ${new Date().toLocaleString()}`,
    whoami: `guest@portfolio-guest-session (read/exec permissions: granted)`
  };

  function runCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo input line
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line cmd-echo';
    echoLine.innerHTML = `<span class="terminal-prompt">maruf@dev:~$</span> ${escapeHTML(rawCmd)}`;
    terminalOutput.appendChild(echoLine);

    // Process command
    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
    } else if (commands[cmd]) {
      const resultLine = document.createElement('div');
      resultLine.className = 'terminal-line cmd-result';
      const output = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
      resultLine.innerHTML = output;
      terminalOutput.appendChild(resultLine);

      if (cmd === 'sudo hire') {
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 800);
      }
    } else {
      const errorLine = document.createElement('div');
      errorLine.className = 'terminal-line text-muted';
      errorLine.innerHTML = `Command not recognized: <span style="color:#f43f5e;">${escapeHTML(rawCmd)}</span>. Type <span class="cmd-highlight">help</span> for valid commands.`;
      terminalOutput.appendChild(errorLine);
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleInputSubmit() {
    const val = terminalInput.value;
    if (val.trim()) {
      runCommand(val);
      terminalInput.value = '';
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', handleInputSubmit);
  }

  shortcutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      runCommand(cmd);
    });
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

/* ==========================================================================
   12. CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset error messages
    document.getElementById('name-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('message-error').textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      document.getElementById('name-error').textContent = 'Please enter your name.';
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      document.getElementById('email-error').textContent = 'Please enter your email.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      document.getElementById('email-error').textContent = 'Please provide a valid email address.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      document.getElementById('message-error').textContent = 'Please enter a message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      document.getElementById('message-error').textContent = 'Message must be at least 10 characters.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending state
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending message...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Thank you! Your message has been sent successfully. I will get back to you shortly.');
    }, 1200);
  });
}

/* ==========================================================================
   13. 1-CLICK EMAIL COPY TO CLIPBOARD
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailLink = document.getElementById('email-address');

  if (!copyBtn || !emailLink) return;

  copyBtn.addEventListener('click', () => {
    const email = emailLink.textContent.trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Email address copied to clipboard!');
  }
}

/* ==========================================================================
   14. LIVE LOCAL TIME CLOCK
   ========================================================================== */
function initLocalClock() {
  const clockEl = document.getElementById('local-clock');
  const yearEl = document.getElementById('current-year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone;
    clockEl.textContent = `${timeString} (${timeZoneString})`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   15. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   16. LIQUID 3D PERSPECTIVE TILT & SPECULAR GLARE PHYSICS
   ========================================================================== */
function initLiquidTiltAndGlare() {
  if (window.innerWidth <= 768) return;

  const tiltTargets = document.querySelectorAll(
    '.glass-panel, .project-card, .skill-card, .avatar-card, .feature-card, .testimonial-card'
  );

  tiltTargets.forEach((card) => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      // Update liquid glare CSS variables
      card.style.setProperty('--mouse-x', `${mouseX}px`);
      card.style.setProperty('--mouse-y', `${mouseY}px`);

      // Calculate 3D tilt angles
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;
      const tiltX = ((mouseY - centerY) / centerY) * -5.5;
      const tiltY = ((mouseX - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)`;
    }

    function onMouseLeave() {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ==========================================================================
   17. LIQUID WATER RIPPLE EFFECT ON CLICK
   ========================================================================== */
function initLiquidRipple() {
  const rippleElements = document.querySelectorAll('.btn, .glass-panel, .filter-btn, .skill-tab-btn, .social-btn');

  rippleElements.forEach((el) => {
    el.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'liquid-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      const diameter = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${diameter}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 750);
    });
  });
}

/* ==========================================================================
   18. FLUID SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    '.section-header, .feature-card, .about-story-card, .skill-card, .project-card, .timeline-item, .terminal-window, .testimonial-card, .contact-card, .contact-form-wrapper'
  );

  elementsToReveal.forEach((el) => {
    el.classList.add('reveal-item');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  elementsToReveal.forEach((el) => observer.observe(el));
}
