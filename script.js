document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    if (window.feather) {
        feather.replace();
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        if (window.feather) {
            feather.replace();
        }
    });

    // Close mobile menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Typing animation
    const typingText = document.getElementById('typing-text');
    const roles = ['Frontend Developer', 'UI/UX Designer', 'Web Enthusiast'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function typeRole() {
        if (!typingText) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            charIndex--;
            typingText.textContent = currentRole.substring(0, charIndex);
        } else {
            charIndex++;
            typingText.textContent = currentRole.substring(0, charIndex);
        }

        let typingSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            isWaiting = true;
            setTimeout(() => {
                isDeleting = true;
                isWaiting = false;
                typeRole();
            }, 1500);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            isWaiting = true;
            setTimeout(() => {
                isWaiting = false;
                typeRole();
            }, 500);
            return;
        }

        if (!isWaiting) {
            setTimeout(typeRole, typingSpeed);
        }
    }

    typeRole();

    // Neon flicker effect
    const neonElements = document.querySelectorAll('.neon-text, .neon-border, .neon-button, .neon-icon');

    function flicker(element) {
        const originalOpacity = window.getComputedStyle(element).opacity;
        element.style.opacity = (Math.random() * 0.2 + 0.8).toString();
        setTimeout(() => {
            element.style.opacity = originalOpacity;
        }, 50);
    }

    setInterval(() => {
        neonElements.forEach(element => {
            if (Math.random() < 0.05) {
                flicker(element);
            }
        });
    }, 1000);

    // Parallax effect
    let ticking = false;
    const parallaxElements = document.querySelectorAll('section');

    function updateParallax(scrollPos) {
        parallaxElements.forEach((section) => {
            const offset = section.offsetTop;
            const speed = 0.5;
            if (window.innerHeight + scrollPos > offset) {
                const yPos = ((scrollPos - offset) * speed);
                section.style.backgroundPosition = `50% ${yPos}px`;
            }
        });
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax(scrollPos);
            });
            ticking = true;
        }
    });

    // Scroll animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            } else {
                entry.target.classList.remove('animate');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.skill-card, .project-card, .hobby-card').forEach(element => {
        observer.observe(element);
    });

    // Initialize particles.js
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Form submission handling
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        var json = JSON.stringify(object);

        formStatus.textContent = 'Sending...';
        formStatus.className = 'form-status';

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                formStatus.textContent = json.message;
                formStatus.className = 'form-status success';
                form.reset();
            } else {
                console.log(response);
                formStatus.textContent = json.message;
                formStatus.className = 'form-status error';
            }
        })
        .catch(error => {
            console.log(error);
            formStatus.textContent = 'Something went wrong!';
            formStatus.className = 'form-status error';
        })
        .then(function() {
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        });
    });
});