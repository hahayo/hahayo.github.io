/**
 * main.js - 導覽、滾動、動畫
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // ============================
    // Hamburger Menu Toggle
    // ============================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============================
    // Header Scroll Effect
    // ============================
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when scrolled down
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================
    // Smooth Scroll for Navigation
    // ============================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================
    // Active Navigation Link
    // ============================
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveNav);
    setActiveNav();

    // ============================
    // ScrollReveal Animations
    // ============================
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'bottom',
            distance: '30px',
            duration: 600,
            delay: 100,
            easing: 'ease-out',
            reset: false
        });

        // Hero
        sr.reveal('.hero-content', { origin: 'left' });

        // About
        sr.reveal('.highlight-card', { interval: 100 });
        sr.reveal('.about-content', { delay: 200 });

        // Projects
        sr.reveal('.filter-container');
        sr.reveal('.project-card', { interval: 100 });

        // Skills
        sr.reveal('.skill-category', { interval: 100 });

        // Contact
        sr.reveal('.contact-content');
    }

    // ============================
    // Skill Progress Bars Animation
    // ============================
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    function animateSkillBars() {
        skillProgressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible && bar.style.width === '0%' || bar.style.width === '') {
                setTimeout(() => {
                    bar.style.width = `${progress}%`;
                }, 100);
            }
        });
    }

    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars();

    // ============================
    // Year in Footer
    // ============================
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const year = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2026', year);
    }
});
