// SPA Router for Smooth Navigation
// Add this to a new file: spa-router.js

class SPARouter {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.cache = new Map();
        this.isFirstLoad = true;
        
        // Initialize router
        this.init();
    }
    
    init() {
        // Register routes
        this.addRoute('/', 'index.html', 'home');
        this.addRoute('/about', 'about.html', 'about');
        this.addRoute('/projects', 'project.html', 'projects');
        
        // Check for redirect from 404.html
        const redirect = sessionStorage.getItem('redirect');
        if (redirect && redirect !== '/') {
            sessionStorage.removeItem('redirect');
            const path = redirect.replace('.html', '');
            history.replaceState(null, '', path);
            this.navigate(path, true);
            return;
        }
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
        
        // Intercept all link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link)) {
                e.preventDefault();
                const path = this.getPathFromUrl(link.href);
                this.navigate(path);
            }
        });
        
        // Mark body as ready and show initial content
        document.body.classList.add('spa-ready');
        
        // Set initial state
        const initialPath = window.location.pathname === '/' ? '/' : window.location.pathname.replace('.html', '');
        const route = this.routes[initialPath];
        if (route) {
            history.replaceState({ page: route.name }, '', initialPath);
            this.currentPage = route.name;
            this.updateNavbar(route.name);
        }
        
        this.isFirstLoad = false;
    }
    
    addRoute(path, file, name) {
        this.routes[path] = { file, name };
    }
    
    isInternalLink(link) {
        // Don't intercept external links or links with target="_blank"
        if (link.target === '_blank' || link.hostname !== window.location.hostname) {
            return false;
        }
        
        // Check if link is internal
        return link.pathname.includes('.html') || 
               link.pathname === '/' || 
               this.routes[link.pathname];
    }
    
    getPathFromUrl(url) {
        const urlObj = new URL(url);
        let path = urlObj.pathname;
        
        // Convert .html to route path
        if (path.includes('index.html')) return '/';
        if (path.includes('about.html')) return '/about';
        if (path.includes('project.html')) return '/projects';
        
        return path;
    }
    
    async navigate(path, replace = false) {
        const route = this.routes[path];
        
        if (!route) {
            console.error('Route not found:', path);
            return;
        }
        
        // Don't reload if already on this page
        if (this.currentPage === route.name && !replace) {
            return;
        }
        
        // Update URL
        const url = path === '/' ? '/' : path;
        if (replace) {
            history.replaceState({ page: route.name }, '', url);
        } else {
            history.pushState({ page: route.name }, '', url);
        }
        
        // Load page content
        await this.loadPage(route.name);
    }
    
    async loadPage(pageName, addToHistory = true) {
        const route = Object.values(this.routes).find(r => r.name === pageName);
        
        if (!route) return;
        
        // Don't reload if already on this page
        if (this.currentPage === route.name) {
            return;
        }
        
        try {
            // Show loading state
            this.showLoadingState();
            
            // Fetch page content (use cache if available)
            let htmlContent;
            if (this.cache.has(route.file)) {
                htmlContent = this.cache.get(route.file);
            } else {
                const response = await fetch(route.file);
                htmlContent = await response.text();
                this.cache.set(route.file, htmlContent);
            }
            
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Extract main content (everything except navbar and footer)
            const newContent = this.extractMainContent(doc);
            
            // Fade out current content
            await this.fadeOut();
            
            // Replace content
            this.replaceContent(newContent);
            
            // Update navbar active state
            this.updateNavbar(pageName);
            
            // Fade in new content
            await this.fadeIn();
            
            // Re-initialize scripts for new page
            this.reinitializeScripts();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            this.currentPage = pageName;
            
        } catch (error) {
            console.error('Error loading page:', error);
            // Fallback to traditional navigation
            window.location.href = route.file;
        }
    }
    
    extractMainContent(doc) {
        // Get all sections between navbar and footer
        const sections = doc.querySelectorAll('body > section, body > .hero, body > .career-timeline-section, body > .capabilities-section, body > .home-projects-section, body > .projects-grid-section, body > .projects-hero, body > .about-photo-row-section');
        
        const container = document.createElement('div');
        sections.forEach(section => {
            container.appendChild(section.cloneNode(true));
        });
        
        return container;
    }
    
    replaceContent(newContent) {
        // Remove all current main sections (keep navbar and footer)
        const currentSections = document.querySelectorAll('body > section, body > .hero, body > .career-timeline-section, body > .capabilities-section, body > .home-projects-section, body > .projects-grid-section, body > .projects-hero, body > .about-photo-row-section');
        currentSections.forEach(section => section.remove());
        
        // Insert new content before footer
        const footer = document.querySelector('.footer-container');
        const children = Array.from(newContent.children);
        children.forEach(child => {
            document.body.insertBefore(child, footer);
        });
    }
    
    updateNavbar(pageName) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        let selector;
        if (pageName === 'home') {
            // Home doesn't have a nav link, skip
            return;
        } else if (pageName === 'about') {
            selector = '.nav-links a[href="/about"]';
        } else if (pageName === 'projects') {
            selector = '.nav-links a[href="/projects"]';
        }
        
        const activeLink = document.querySelector(selector);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    showLoadingState() {
        document.body.style.pointerEvents = 'none';
    }
    
    async fadeOut() {
        const sections = document.querySelectorAll('body > section, body > .hero, body > .career-timeline-section, body > .capabilities-section, body > .home-projects-section, body > .projects-grid-section, body > .projects-hero, body > .about-photo-row-section');
        
        sections.forEach(section => {
            section.style.transition = 'opacity 0.3s ease';
            section.style.opacity = '0';
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    async fadeIn() {
        const sections = document.querySelectorAll('body > section, body > .hero, body > .career-timeline-section, body > .capabilities-section, body > .home-projects-section, body > .projects-grid-section, body > .projects-hero, body > .about-photo-row-section');
        
        sections.forEach(section => {
            section.style.transition = 'opacity 0.3s ease';
            section.style.opacity = '0';
        });
        
        // Force reflow
        sections[0]?.offsetHeight;
        
        sections.forEach(section => {
            section.style.opacity = '1';
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        document.body.style.pointerEvents = 'auto';
    }
    
    reinitializeScripts() {
        // Reinitialize any page-specific functionality
        
        // Career cards
        if (typeof toggleCareerCard === 'function') {
            window.toggleCareerCard = toggleCareerCard;
        }
        
        // Flip cards - reinitialize event listeners
        const flipButtons = document.querySelectorAll('.flip-card-btn');
        if (flipButtons.length > 0) {
            // Remove old event listeners by cloning
            flipButtons.forEach(button => {
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
            });
            
            // Trigger DOMContentLoaded for script.js to reinitialize
            const event = new Event('DOMContentLoaded', {
                bubbles: true,
                cancelable: true
            });
            
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                document.dispatchEvent(event);
            }, 50);
        }
    }
}

// Initialize router immediately (before DOMContentLoaded)
// This prevents the flash by setting up the router as early as possible
if (document.readyState === 'loading') {
    // Add loading class immediately
    document.addEventListener('DOMContentLoaded', () => {
        window.spaRouter = new SPARouter();
    });
} else {
    window.spaRouter = new SPARouter();
}