document.addEventListener('DOMContentLoaded', () => {

    // --- Particle.js Background ---
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#4f46e5" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#a0aec0", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
        },
        "retina_detect": true
    });

    // --- Fade-in Animation on Scroll ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    elementsToFadeIn.forEach((el) => observer.observe(el));

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) preloader.classList.add('hidden');
    });

    // --- Hero Section Typing Animation ---
    let typedInstance = null;
    function initializeTypedJs(strings) {
        if (typedInstance) {
            typedInstance.destroy();
        }
        const options = {
            strings: strings,
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            smartBackspace: true
        };
        typedInstance = new Typed('#typed-subtitle', options);
    }

    // Initialize with new strings
    const typedStrings = [
        "Mobile Dev Enthusiast.",
        "Backend Developer.",
        "Software Developer."
    ];
    initializeTypedJs(typedStrings);

    // --- Automatically Fetch GitHub Projects ---
    const GITHUB_USERNAME = 'RaeXp917';
    const projectGrid = document.getElementById('github-project-grid');

    async function fetchGitHubProjects() {
        if (!projectGrid) return;

        // Add the static "Personal Cloud" project first
        const personalCloudCardHTML = `
        <div class="project-card fade-in">
            <div class="project-image">
                <i class="fa-solid fa-cloud" style="font-size: 4rem; color: var(--primary-color);"></i>
            </div>
            <div class="project-content">
                <h3 class="project-title">Personal Cloud</h3>
                <p class="project-description">Self-hosted cloud storage with Seafile in Docker on Windows 11, fronted by a Cloudflare Tunnel for secure access.</p>
                <div class="tech-tags">
                    <span>Docker</span><span>Seafile</span><span>MariaDB</span><span>Cloudflare</span>
                </div>
                <div class="project-links">
                    <a href="https://github.com/RaeXp917/Personal-Cloud" target="_blank" class="cta-button secondary">View on GitHub <i class="fa-brands fa-github"></i></a>
                </div>
            </div>
        </div>`;
        projectGrid.innerHTML = personalCloudCardHTML;

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=10`);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
            const repos = await response.json();
            
            const filteredRepos = repos.filter(repo => !repo.fork && 
                repo.name !== `${GITHUB_USERNAME}.github.io` && 
                repo.name !== GITHUB_USERNAME && 
                repo.name !== 'Context-Nexus-Website' && 
                repo.name !== 'E-efimerevon-inv-managment' && 
                repo.name !== 'On-Duty-Pharmacies-App' &&
                repo.name !== 'Personal-Cloud');
            
            const projectsToShow = filteredRepos.slice(0, 2); // Show 2 more to make a total of 3
            
            projectsToShow.forEach(repo => {
                const projectCardHTML = `
                <div class="project-card fade-in">
                    <div class="project-content">
                        <h3 class="project-title">${repo.name}</h3>
                        <p class="project-description">${repo.description || 'No description provided.'}</p>
                        <div class="tech-tags">
                            ${repo.language ? `<span>${repo.language}</span>` : ''}
                        </div>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank" class="cta-button secondary">View on GitHub <i class="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                </div>`;
                
                projectGrid.insertAdjacentHTML('beforeend', projectCardHTML);
            });
            
            const allCards = document.querySelectorAll('.fade-in');
            allCards.forEach(card => observer.observe(card));

        } catch (error) {
            console.error("Failed to fetch GitHub projects:", error);
            projectGrid.insertAdjacentHTML('beforeend', `<p>Could not load additional projects from GitHub.</p>`);
        }
    }
    fetchGitHubProjects();

    // --- Mobile Hamburger Menu ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNavPanel = document.getElementById('mobile-nav-panel');
    if (hamburgerBtn && mobileNavPanel) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNavPanel.classList.toggle('open');
        });
    }
    
    // --- Smooth Scrolling & Active Nav Link Logic ---
    const allNavLinks = document.querySelectorAll('.top-nav a, .mobile-nav a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                if (mobileNavPanel.classList.contains('open')) {
                    mobileNavPanel.classList.remove('open');
                }
            }
        });
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('main section[id], header[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-links a, .mobile-nav a');

    const navHighlighter = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                navLinksForHighlight.forEach(link => {
                    link.classList.remove('nav-active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav-active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -40% 0px' });

    sections.forEach(section => navHighlighter.observe(section));

    // --- Dropdown Resume Logic ---
    const toggleResumeBtn = document.getElementById('toggle-resume-btn');
    const resumeContainer = document.getElementById('resume-container');

    if (toggleResumeBtn && resumeContainer) {
        toggleResumeBtn.addEventListener('click', () => {
            const isOpen = resumeContainer.classList.toggle('open');
            toggleResumeBtn.textContent = isOpen ? "Hide My Resume" : "View My Resume";
            if (isOpen) {
                setTimeout(() => {
                     resumeContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    }

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the default form submission (page reload)
            
            // Here you would typically send the form data to a backend or a service like EmailJS
            
            // For now, we'll just show a confirmation and reset the form
            alert('Thank you for your message! I will get back to you shortly.');
            contactForm.reset();
        });
    }
});