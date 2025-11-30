document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');

    if (!burgerBtn || !navLinks) return;

    const BREAKPOINT = 768;
    let isMobileMenuOpen = false;

    // Close menu function
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

    // Open menu function
    const openMenu = () => {
        if (isMobileMenuOpen) return;
        
        burgerBtn.classList.add('active');
        navLinks.classList.add('mobile-open');
        navLinks.classList.remove('mobile-closing');
        isMobileMenuOpen = true;
    };

    // Toggle menu
    const toggleMenu = (e) => {
        e.stopPropagation();
        isMobileMenuOpen ? closeMenu() : openMenu();
    };

    // Check if device is mobile/tablet
    const isMobileDevice = () => window.innerWidth <= BREAKPOINT;

    // Burger button click handler
    burgerBtn.addEventListener('click', toggleMenu);

    // Nav links click handler
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

    
});

// Accordion functionality for projects - Hover to expand
document.addEventListener('DOMContentLoaded', () => {
    const accordionItems = document.querySelectorAll('.accordion-item');
    let activeItem = null;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        // Expand on hover
        header.addEventListener('mouseenter', () => {
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Open current item
            item.classList.add('active');
            activeItem = item;
        });
    });

    // Close all when mouse leaves the entire accordion container
    const accordionContainer = document.querySelector('.accordion-container');
    if (accordionContainer) {
        accordionContainer.addEventListener('mouseleave', () => {
            accordionItems.forEach(item => {
                item.classList.remove('active');
            });
            activeItem = null;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const languageText = document.getElementById('language-text');

    // ⭐ Only run if the element exists (on about page)
    if (languageText) {
        const languages = ["English", "Malay", "Japanese"];
        const translations = {
            English: "Hello!",
            Malay: "Hai!",
            Japanese: "こんにちは！"
        };

        let index = 0;

        function updateLanguage() {
            languageText.textContent = translations[languages[index]];
            index = (index + 1) % languages.length;
        }

        updateLanguage();
        setInterval(updateLanguage, 3000);
    }
});

