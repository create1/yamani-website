// ===================================
// Apotheos Website JavaScript
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        }

        lastScroll = currentScroll;
    });

    // ===================================
    // Smooth Scroll for Navigation Links
    // ===================================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===================================
    // Scroll Animations - Fade In On Scroll
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-on-scroll class
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ===================================
    // Parallax Effect for Hero Background
    // ===================================
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // ===================================
    // Active Navigation Link Highlighting
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.style.color = 'var(--accent-eucalyptus)';
                } else {
                    navLink.style.color = '';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ===================================
    // Animated Counter for Statistics
    // ===================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Observe stat numbers and animate when visible
    const statNumbers = document.querySelectorAll('.stat-number, .target-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const text = entry.target.textContent;
                const numbers = text.match(/\d+/);
                
                if (numbers) {
                    const targetNumber = parseInt(numbers[0]);
                    entry.target.classList.add('animated');
                    
                    // Extract prefix and suffix
                    const prefix = text.split(numbers[0])[0];
                    const suffix = text.split(numbers[0])[1];
                    
                    let current = 0;
                    const increment = targetNumber / 60; // 60 frames
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= targetNumber) {
                            entry.target.textContent = prefix + targetNumber + suffix;
                            clearInterval(counter);
                        } else {
                            entry.target.textContent = prefix + Math.floor(current) + suffix;
                        }
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // ===================================
    // Contact Form Handling
    // ===================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Show success message (in production, this would send to a backend)
            alert(`Thank you for reaching out, ${data.name}! We'll get back to you soon at ${data.email}.`);
            
            // Reset form
            contactForm.reset();
            
            // In production, you would send this data to your backend:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                alert('Message sent successfully!');
                contactForm.reset();
            })
            .catch(error => {
                alert('Error sending message. Please try again.');
            });
            */
        });
    }

    // ===================================
    // Card Tilt Effect on Hover
    // ===================================
    const cards = document.querySelectorAll('.content-card, .mission-card, .program-card, .tier-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===================================
    // Membership Tier Button Interactions
    // ===================================
    const tierButtons = document.querySelectorAll('.tier-button');
    
    tierButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tierCard = this.closest('.tier-card');
            const tierName = tierCard.querySelector('.tier-badge').textContent;
            const tierPrice = tierCard.querySelector('.tier-price').textContent;
            
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // Pre-fill contact form with tier information
                setTimeout(() => {
                    const subjectField = document.querySelector('input[name="subject"]');
                    if (subjectField) {
                        subjectField.value = `Interested in ${tierName} Membership (${tierPrice})`;
                    }
                }, 500);
            }
        });
    });

    // ===================================
    // CTA Button Ripple Effect
    // ===================================
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .cta-button {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // Scroll Progress Indicator
    // ===================================
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-eucalyptus), var(--primary-slate));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // ===================================
    // Logo Animation on Page Load
    // ===================================
    const logo = document.querySelector('.logo-text');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            logo.style.transition = 'all 0.8s ease';
            logo.style.opacity = '1';
            logo.style.transform = 'translateY(0)';
        }, 300);
    }

    // ===================================
    // Image Lazy Loading (if images are added later)
    // ===================================
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ===================================
    // Performance: Debounce Scroll Events
    // ===================================
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Apply debounce to scroll-intensive functions
    window.addEventListener('scroll', debounce(highlightNavLink, 10));

    // ===================================
    // Console Message
    // ===================================
    console.log('%c🌟 Welcome to Yamani! 🌟', 'color: #50808E; font-size: 20px; font-weight: bold;');
    console.log('%cBuilding Community Through Innovation, Education & Wellness', 'color: #84B59F; font-size: 14px;');
    console.log('%cNevada City, California', 'color: #69A297; font-size: 12px;');

    // ===================================
    // Easter Egg: Konami Code
    // ===================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Trigger special animation
                document.body.style.animation = 'rainbow 2s linear infinite';
                const rainbowStyle = document.createElement('style');
                rainbowStyle.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(rainbowStyle);
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
                
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // ===================================
    // Accessibility: Focus Visible Polyfill
    // ===================================
    let hadKeyboardEvent = false;
    
    document.addEventListener('keydown', function() {
        hadKeyboardEvent = true;
    });

    document.addEventListener('mousedown', function() {
        hadKeyboardEvent = false;
    });

    document.addEventListener('focusin', function(e) {
        if (hadKeyboardEvent) {
            e.target.classList.add('focus-visible');
        }
    });

    document.addEventListener('focusout', function(e) {
        e.target.classList.remove('focus-visible');
    });

    // Add focus-visible styles
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .focus-visible {
            outline: 3px solid var(--accent-eucalyptus);
            outline-offset: 2px;
        }
        *:focus:not(.focus-visible) {
            outline: none;
        }
    `;
    document.head.appendChild(focusStyle);

    // ===================================
    // Waitlist Form (Formspree)
    // ===================================
    const waitlistForm = document.getElementById('waitlist-form');
    const formSuccess = document.getElementById('form-success');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = waitlistForm.querySelector('button[type="submit"]');
            btn.textContent = 'Submitting...';
            btn.disabled = true;

            const data = new FormData(waitlistForm);

            try {
                const response = await fetch(waitlistForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    waitlistForm.style.display = 'none';
                    formSuccess.style.display = 'block';
                } else {
                    btn.textContent = 'Try Again';
                    btn.disabled = false;
                    alert('Something went wrong. Please try again or email us directly.');
                }
            } catch (err) {
                btn.textContent = 'Try Again';
                btn.disabled = false;
                alert('Something went wrong. Please try again or email us directly.');
            }
        });
    }

    // Contact form (Formspree)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.textContent = 'Message Sent!';
                    contactForm.reset();
                } else {
                    btn.textContent = 'Send Message';
                    btn.disabled = false;
                }
            } catch (err) {
                btn.textContent = 'Send Message';
                btn.disabled = false;
            }
        });
    }

});

// ===================================
// Utility Functions
// ===================================

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll percentage
function getScrollPercentage() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (window.pageYOffset / windowHeight) * 100;
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 80) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}
