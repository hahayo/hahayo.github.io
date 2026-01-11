/**
 * projects.js - 專案載入、篩選、Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const projectsGrid = document.getElementById('projects-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalSlides = document.getElementById('modal-slides');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalVideo = document.getElementById('modal-video');
    const modalDetails = document.getElementById('modal-details');
    const modalActions = document.getElementById('modal-actions');

    let projects = [];
    let swiper = null;

    // Category labels
    const categoryLabels = {
        'n8n': 'n8n 自動化',
        'github': 'GitHub',
        'ai': 'AI 應用',
        'tool': '工具/腳本'
    };

    // ============================
    // Load Projects from JSON
    // ============================
    async function loadProjects() {
        try {
            const response = await fetch('assets/data/projects.json');
            if (!response.ok) throw new Error('Failed to load projects');
            projects = await response.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            projectsGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-muted);">載入專案時發生錯誤</p>';
        }
    }

    // ============================
    // Render Project Cards
    // ============================
    function renderProjects(projectsToRender) {
        projectsGrid.innerHTML = projectsToRender.map(project => `
            <article class="project-card" data-category="${project.category}" data-id="${project.id}">
                <div class="project-card-header">
                    <span class="project-category ${project.category}">${categoryLabels[project.category]}</span>
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-github-link" title="GitHub" onclick="event.stopPropagation()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                    ` : ''}
                </div>
                <div class="project-image">
                    ${project.cover ?
                        `<img src="assets/images/projects/${project.cover}" alt="${project.name}" loading="lazy">` :
                        `<span class="project-image-placeholder">No Image</span>`
                    }
                </div>
                <div class="project-card-body">
                    <h3 class="project-name">${project.name}</h3>
                    <p class="project-desc">${project.desc}</p>
                    <div class="project-metrics">
                        ${project.metrics.map(metric => `<span class="metric-tag">${metric}</span>`).join('')}
                    </div>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="project-card-footer">
                    <button class="project-btn" data-id="${project.id}">查看詳情</button>
                </div>
            </article>
        `).join('');

        // Add click events
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.project-github-link')) {
                    openModal(card.dataset.id);
                }
            });
        });
    }

    // ============================
    // Filter Projects
    // ============================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            if (filter === 'all') {
                renderProjects(projects);
            } else {
                const filtered = projects.filter(p => p.category === filter);
                renderProjects(filtered);
            }
        });
    });

    // ============================
    // Modal Functions
    // ============================
    function openModal(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        // Set title and category
        modalTitle.textContent = project.name;
        modalCategory.textContent = categoryLabels[project.category];
        modalCategory.className = `modal-category ${project.category}`;

        // Set slides
        if (project.images && project.images.length > 0) {
            modalSlides.innerHTML = project.images.map(img => `
                <div class="swiper-slide">
                    <img src="assets/images/projects/${img}" alt="${project.name}" loading="lazy">
                </div>
            `).join('');

            // Initialize or update Swiper
            if (swiper) {
                swiper.destroy(true, true);
            }
            swiper = new Swiper('.modal-swiper', {
                slidesPerView: 1,
                spaceBetween: 10,
                loop: project.images.length > 1,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        } else {
            modalSlides.innerHTML = '<div class="swiper-slide"><span class="project-image-placeholder">No Images</span></div>';
        }

        // Set video
        if (project.video) {
            modalVideoContainer.style.display = 'block';
            if (project.video.includes('youtube.com') || project.video.includes('youtu.be')) {
                // YouTube embed
                const videoId = extractYouTubeId(project.video);
                modalVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            } else {
                // MP4 video
                modalVideo.innerHTML = `<video src="assets/videos/${project.video}" controls></video>`;
            }
        } else {
            modalVideoContainer.style.display = 'none';
            modalVideo.innerHTML = '';
        }

        // Set details
        modalDetails.innerHTML = formatDetails(project.details);

        // Set actions
        let actionsHTML = '';
        if (project.github) {
            actionsHTML += `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
            </a>`;
        }
        if (project.workflow) {
            actionsHTML += `<a href="assets/workflows/${project.workflow}" download class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                下載 JSON
            </a>`;
        }
        if (project.resource) {
            actionsHTML += `<a href="${project.resource}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                相關資源
            </a>`;
        }
        modalActions.innerHTML = actionsHTML || '<p style="color: var(--color-text-muted); text-align: center;">無額外資源</p>';

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Stop video playback
        modalVideo.innerHTML = '';

        // Destroy swiper
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
    }

    // Close modal events
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ============================
    // Helper Functions
    // ============================
    function extractYouTubeId(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    function formatDetails(details) {
        if (!details) return '';

        // Convert \n to HTML
        let html = details
            .replace(/痛點/g, '<strong style="color: var(--color-primary);">痛點</strong>')
            .replace(/解決方案/g, '<strong style="color: var(--color-secondary);">解決方案</strong>')
            .replace(/成效/g, '<strong style="color: var(--color-secondary);">成效</strong>')
            .replace(/技術架構/g, '<strong style="color: var(--color-secondary);">技術架構</strong>')
            .replace(/功能模組/g, '<strong style="color: var(--color-secondary);">功能模組</strong>')
            .replace(/流程/g, '<strong style="color: var(--color-secondary);">流程</strong>')
            .replace(/•/g, '  •')
            .replace(/✓/g, '  ✓');

        return html;
    }

    // ============================
    // Lightbox Functions
    // ============================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(imgSrc) {
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
    }

    // Lightbox events
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose || e.target.closest('.lightbox-close')) {
                closeLightbox();
            }
        });

        // Add click event to modal swiper images
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal-swiper .swiper-slide img')) {
                const img = e.target.closest('.modal-swiper .swiper-slide img');
                openLightbox(img.src);
            }
        });

        // Close lightbox on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // ============================
    // Initialize
    // ============================
    loadProjects();
});
