/**
 * Portfolio Website JavaScript
 * Handles mobile navigation and language cycling
 */

// ================================
// MOBILE NAVIGATION
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initLanguageCycler();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (!burgerBtn || !navLinks) return;

    const BREAKPOINT = 768;
    let isMobileMenuOpen = false;

    /**
     * Close the mobile menu
     * @param {boolean} animate - Whether to animate the close
     */
    const closeMenu = (animate = true) => {
        if (!isMobileMenuOpen) return;
        
        burgerBtn.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        
        if (animate) {
            navLinks.classList.add('mobile-closing');
            setTimeout(() => {
                navLinks.classList.remove('mobile-closing');
            }, 300);
        }
        
        isMobileMenuOpen = false;
    };

    /**
     * Open the mobile menu
     */
    const openMenu = () => {
        if (isMobileMenuOpen) return;
        
        burgerBtn.classList.add('active');
        navLinks.classList.add('mobile-open');
        navLinks.classList.remove('mobile-closing');
        isMobileMenuOpen = true;
    };

    /**
     * Toggle menu state
     */
    const toggleMenu = (e) => {
        e.stopPropagation();
        isMobileMenuOpen ? closeMenu() : openMenu();
    };

    /**
     * Check if current viewport is mobile
     */
    const isMobileDevice = () => window.innerWidth <= BREAKPOINT;

    // Event Listeners
    burgerBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu(true);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMobileMenuOpen && !e.target.closest('.navbar')) {
            closeMenu(false);
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isMobileDevice() && isMobileMenuOpen) {
                closeMenu(false);
            }
        }, 250);
    });

    // Prevent body scroll when menu is open
    navLinks.addEventListener('wheel', (e) => {
        if (isMobileMenuOpen) {
            e.preventDefault();
        }
    }, { passive: false });
}

// ================================
// LANGUAGE CYCLER (About Page)
// ================================
/**
 * Initialize language text cycling on About page
 */
function initLanguageCycler() {
    const languageText = document.getElementById('language-text');

    if (!languageText) return; // Only run on About page

    const languages = ["English", "Malay", "Japanese"];
    const translations = {
        English: "Hello!",
        Malay: "Hai!",
        Japanese: "こんにちは!"
    };

    let index = 0;

    function updateLanguage() {
        const currentLang = languages[index];
        languageText.textContent = translations[currentLang];
        index = (index + 1) % languages.length;
    }

    // Set initial language
    updateLanguage();
    
    // Update every 3 seconds
    setInterval(updateLanguage, 3000);
}


window.addEventListener("load", () => {
    const splash = document.querySelector(".splash");
        setTimeout(() => {
            splash.style.display = "none";
    }, 2400); // matches ripple + fade timing
});

// Enhanced tooltip functionality for mobile
document.addEventListener('DOMContentLoaded', function() {
    const tooltipWrappers = document.querySelectorAll('.tooltip-wrapper');
    
    tooltipWrappers.forEach(wrapper => {
        const button = wrapper.querySelector('.cta-button-mute');
        
        if (button) {
            // Mobile: Toggle tooltip on click
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if we're on mobile
                if (window.innerWidth <= 768) {
                    // Close all other tooltips first
                    tooltipWrappers.forEach(w => {
                        if (w !== wrapper) {
                            w.classList.remove('active');
                        }
                    });
                    
                    // Toggle current tooltip
                    wrapper.classList.toggle('active');
                }
                
                return false;
            });
        }
    });
    
    // Close tooltip when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            const clickedWrapper = e.target.closest('.tooltip-wrapper');
            
            if (!clickedWrapper) {
                tooltipWrappers.forEach(wrapper => {
                    wrapper.classList.remove('active');
                });
            }
        }
    });
    
    // Close tooltips when scrolling (mobile)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                tooltipWrappers.forEach(wrapper => {
                    wrapper.classList.remove('active');
                });
            }, 100);
        }
    });
});