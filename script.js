/* ==========================================================================
   DoItFun - Premium Cinematic Interactive Logic (Canvas Particles & Sensei Tour)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 0. Atmospheric Canvas Particle Engine (Sakura Petals & Golden Sparks)
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('atmospheric-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
    });

    let mouse = { x: null, y: null, radius: 100 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Particle Class representing drifting sakura petals and glowing golden sparks
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height; // Start above viewport
        this.size = Math.random() * 4 + 1.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.colorType = Math.random() > 0.45 ? 'spark' : 'sakura'; // Gold sparks vs Sakura petals
        
        // Sakura petal rotational parameters
        this.angle = Math.random() * 360;
        this.spinSpeed = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // Gentle wind sway
        this.angle += this.spinSpeed;

        // Interaction with cursor (particles drift away)
        if (mouse.x != null && mouse.y != null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (mouse.radius - distance) / mouse.radius;
            let directionX = forceDirectionX * force * 3;
            let directionY = forceDirectionY * force * 3;
            this.x += directionX;
            this.y += directionY;
          }
        }

        // Reset if drifted off-screen
        if (this.y > height || this.x < 0 || this.x > width) {
          this.reset();
          this.y = -10; // Start at very top again
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        if (this.colorType === 'spark') {
          // Glowing Gold Spark
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffd700';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ffd700';
          ctx.fill();
        } else {
          // Drifting Sakura Petal
          ctx.translate(this.x, this.y);
          ctx.rotate((this.angle * Math.PI) / 180);
          ctx.beginPath();
          // Draw simple oval petal shape
          ctx.ellipse(0, 0, this.size * 1.5, this.size, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#ffb7c5';
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ff007f';
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Populate particles
    const initParticles = () => {
      const quantity = Math.min(Math.floor(width / 18), 80);
      for (let i = 0; i < quantity; i++) {
        particlesArray.push(new Particle());
        // Stagger their initial heights to cover the screen on start
        particlesArray[i].y = Math.random() * height;
      }
    };
    initParticles();

    // Render loop
    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    };
    animateParticles();
  }

  // ------------------------------------------------------------------------
  // 1. Neon Cursor Spotlight & Navbar Effect
  // ------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let xp = 0, yp = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorGlow.style.opacity = '1';
    });

    // Lag loops for organic cursor tracking
    function animateSpotlight() {
      xp += (mouseX - xp) * 0.08;
      yp += (mouseY - yp) * 0.08;
      
      cursorGlow.style.left = xp + 'px';
      cursorGlow.style.top = yp + 'px';
      
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile navigation drawer toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navbar.classList.toggle('mobile-active');
      mobileToggle.classList.toggle('active');
    });
  }

  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('mobile-active');
      if (mobileToggle) mobileToggle.classList.remove('active');
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ------------------------------------------------------------------------
  // 2. 3D Parallax Mouse Tilt on Cards
  // ------------------------------------------------------------------------
  const tiltElements = document.querySelectorAll('.tilt-element');
  tiltElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((centerY - y) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      
      const shadowX = -rotateY * 2.5;
      const shadowY = rotateX * 2.5;
      element.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(255, 215, 0, 0.12), 0 25px 50px rgba(0,0,0,0.6)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      element.style.boxShadow = '';
    });
  });

  // ------------------------------------------------------------------------
  // 3. Sensei DoItFun dialogue Walkthrough (Master Old Widget)
  // ------------------------------------------------------------------------
  const walkthroughWidget = document.getElementById('walkthrough-widget');
  const dialogueText = document.getElementById('dialogue-text');
  const btnNext = document.getElementById('btn-next');
  const btnSkip = document.getElementById('btn-skip');
  const avatarEmoji = walkthroughWidget ? walkthroughWidget.querySelector('.avatar-emoji') : null;

  const tourDialogues = [
    {
      text: "Konnichiwa, Wanderer! 🌸 Selamat datang di kuil web DoItFun. Mari saya tunjukkan website dengan estetika termahal sejagat digital.",
      emoji: "⛩️",
      anchor: "#hero"
    },
    {
      text: "Langkah pertamamu selesai! Coba lihat bento grid fitur di bawah ini. Kami memahat setiap baris kode dengan ketajaman tebasan Katana! ⚔️",
      emoji: "⚔️",
      anchor: "#features"
    },
    {
      text: "Kami juga meletakkan Gulungan Karya portofolio premium. Desain kami terbukti menghipnotis perhatian audiens brand Anda! 🏮",
      emoji: "🏮",
      anchor: "#portfolio"
    },
    {
      text: "Ingin membangun kuil bisnismu sendiri? Gunakan Kalkulator Investasi interaktif di bawah ini untuk melihat rincian mahar secara transparan! 🌸",
      emoji: "🌸",
      anchor: "#pricing"
    },
    {
      text: "Kirim pesan ke Kuil Hubungi Kami untuk ritual konsultasi gratis bersamaku sekarang! Kuil DoItFun siap mewujudkan kejayaanmu! 🐉",
      emoji: "🐉",
      anchor: "#contact"
    }
  ];

  let currentStep = 0;
  let typewritingInterval;

  const typewrite = (text) => {
    clearInterval(typewritingInterval);
    dialogueText.textContent = '';
    let index = 0;
    
    typewritingInterval = setInterval(() => {
      dialogueText.textContent += text[index];
      index++;
      if (index >= text.length) {
        clearInterval(typewritingInterval);
      }
    }, 25);
  };

  const startWalkthrough = () => {
    if (!walkthroughWidget) return;
    setTimeout(() => {
      walkthroughWidget.classList.add('visible');
      typewrite(tourDialogues[0].text);
    }, 3000); // Appear after 3 seconds of load
  };
  startWalkthrough();

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentStep++;
      if (currentStep < tourDialogues.length) {
        const step = tourDialogues[currentStep];
        
        // Update avatar emoji icon
        if (avatarEmoji) {
          avatarEmoji.textContent = step.emoji;
          gsap.fromTo(avatarEmoji, { scale: 0.5, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.5)' });
        }

        // Typewrite text
        typewrite(step.text);
        
        // Smoothly scroll browser to the section anchor
        const element = document.querySelector(step.anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (currentStep === tourDialogues.length - 1) {
          btnNext.textContent = "Selesai ✖";
        }
      } else {
        // Finalized
        walkthroughWidget.classList.remove('visible');
      }
    });
  }

  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      walkthroughWidget.classList.remove('visible');
    });
  }

  // ------------------------------------------------------------------------
  // 4. Interactive Cost Calculator
  // ------------------------------------------------------------------------
  const calcTotalElement = document.getElementById('calc-total');
  const webTypeRadios = document.querySelectorAll('input[name="web_type"]');
  const addOnCheckboxes = document.querySelectorAll('.check-card input[type="checkbox"]');
  const orderButton = document.getElementById('btn-order-now');

  const basePrices = {
    landing: 1500000,
    company: 3000000,
    ecommerce: 5000000
  };

  let currentTotal = basePrices.landing;

  const radioCards = document.querySelectorAll('.radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const input = card.querySelector('input');
      input.checked = true;
      calculateTotal();
    });
  });

  const checkCards = document.querySelectorAll('.check-card');
  checkCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT') return;
      const input = card.querySelector('input');
      input.checked = !input.checked;
      card.classList.toggle('checked', input.checked);
      calculateTotal();
    });
  });

  addOnCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      checkbox.closest('.check-card').classList.toggle('checked', checkbox.checked);
      calculateTotal();
    });
  });

  function animatePriceUpdate(targetPrice) {
    const duration = 500;
    const startTime = performance.now();
    const startPrice = currentTotal;
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      const tempPrice = Math.round(startPrice + (targetPrice - startPrice) * ease);
      
      calcTotalElement.textContent = tempPrice.toLocaleString('id-ID');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        currentTotal = targetPrice;
      }
    }
    requestAnimationFrame(update);
  }

  function calculateTotal() {
    let selectedType = 'landing';
    webTypeRadios.forEach(radio => {
      if (radio.checked) selectedType = radio.value;
    });
    
    let total = basePrices[selectedType];
    addOnCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        total += parseInt(checkbox.value);
      }
    });

    animatePriceUpdate(total);
    updateWhatsAppLink(selectedType, total);
  }

  function updateWhatsAppLink(type, total) {
    if (!orderButton) return;
    const formattedPrice = total.toLocaleString('id-ID');
    const typeLabel = type === 'landing' ? 'Landing Page Shogun' : type === 'company' ? 'Company Profile Samurai' : 'E-Commerce Emperor';
    
    const message = `Halo DoItFun, saya ingin memesan website kelas *${typeLabel}* dengan total investasi *Rp ${formattedPrice}*. Mohon diatur ritual diskusinya.`;
    orderButton.href = `https://wa.me/6282142931584?text=${encodeURIComponent(message)}`;
  }
  updateWhatsAppLink('landing', basePrices.landing);

  // ------------------------------------------------------------------------
  // 5. Contact Form Submission
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const phone = document.getElementById('form-phone').value;
      const msg = document.getElementById('form-message').value;
      
      const text = `Halo DoItFun, nama saya *${name}* (${email} - ${phone}). %0A%0A*Konsep website impian saya:* %0A${msg}`;
      window.open(`https://wa.me/6282142931584?text=${text}`, '_blank');
    });
  }

  // ------------------------------------------------------------------------
  // 6. GSAP Cinematic Scroll Animations
  // ------------------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.navbar', {
      y: -50,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    });

    const heroTimeline = gsap.timeline();
    heroTimeline.from('.badge-glass', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 0.2
    })
    .from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.6')
    .from('.hero-desc', {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    }, '-=0.8')
    .from('.hero-actions', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-stats', {
      opacity: 0,
      y: 15,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8')
    .from('.oriental-screen', {
      scale: 0.8,
      opacity: 0,
      rotation: -30,
      duration: 2,
      ease: 'power3.out'
    }, '-=1.5')
    .from('.spline-container', {
      scale: 0.95,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out'
    }, '-=1.2')
    .from('.floating-glass-card', {
      opacity: 0,
      y: 35,
      stagger: 0.3,
      duration: 1.2,
      ease: 'back.out(1.2)'
    }, '-=0.8');

    // Bento grids stagger fade/slide-up
    gsap.from('.bento-card', {
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // Portfolio items entrance
    gsap.from('.portfolio-item', {
      scrollTrigger: {
        trigger: '.portfolio-grid',
        start: 'top 80%',
      },
      y: 80,
      opacity: 0,
      duration: 1.4,
      stagger: 0.25,
      ease: 'power3.out'
    });

    // Pricing calculator entrance
    gsap.from('.calc-config-card', {
      scrollTrigger: {
        trigger: '.calculator-grid',
        start: 'top 80%',
      },
      x: -60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.calc-result-card', {
      scrollTrigger: {
        trigger: '.calculator-grid',
        start: 'top 80%',
      },
      x: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Contact section entrance
    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });

    gsap.from('.contact-form-wrapper', {
      scrollTrigger: {
        trigger: '.contact-grid',
        start: 'top 80%',
      },
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
  }
});
