// Initialize Lenis for smooth scrolling
const scrollContainer = document.querySelector('.scroll-container');
const isMobile = window.innerWidth <= 768;

const lenis = new Lenis({
  wrapper: isMobile ? window : scrollContainer,
  content: isMobile ? document.body : scrollContainer.querySelector('.section').parentElement,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Setup GSAP
gsap.registerPlugin(ScrollTrigger);

// Tell ScrollTrigger to use the scroll-container for its scroller
const scroller = isMobile ? window : scrollContainer;

// Link Lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
});

gsap.ticker.lagSmoothing(0);

// Animate elements on scroll
const fadeUps = document.querySelectorAll('.fade-up');

fadeUps.forEach((elem) => {
  gsap.fromTo(
    elem,
    {
      y: 40,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: elem,
        scroller: scroller,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
});

// Sidebar active link logic
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-item');

const scrollElement = isMobile ? window : scrollContainer;

scrollElement.addEventListener('scroll', () => {
  let current = '';
  const scrollPosition = isMobile ? window.scrollY : scrollContainer.scrollTop;
  
  sections.forEach((section) => {
    // We calculate offsets slightly differently based on scrolling wrapper
    const sectionTop = isMobile ? section.getBoundingClientRect().top + window.scrollY : section.offsetTop;
    
    if (scrollPosition >= sectionTop - 250) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// Update active states manually on click too
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});
