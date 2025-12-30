/* ===================================================================
   PORTFOLIO JAVASCRIPT
   ===================================================================
   
   TABLE OF CONTENTS:
   1. CAREER CARD FUNCTIONALITY (Expand/Collapse)
   2. MOBILE NAVIGATION (Burger Menu)
   3. FLIP CARD FUNCTIONALITY (Project Cards)
   4. NAVBAR SCROLL DETECTION
   5. DYNAMIC COPYRIGHT YEAR
   
   TROUBLESHOOTING:
   - Career cards not expanding: Check section 1
   - Mobile menu not working: Check section 2
   - Cards not flipping: Check section 3
   - Navbar not changing on scroll: Check section 4
   - Copyright year not updating: Check section 5
   =================================================================== */

/* ================================
   1. CAREER CARD FUNCTIONALITY
   Used on: index.html
   Function: Toggles expand/collapse of career card details
   ================================ */
function toggleCareerCard(button) {
    const careerCard = button.closest('.career-card');
    const expandedContent = careerCard.querySelector('.career-expanded-content');
    const readMoreBtn = careerCard.querySelector('.career-read-more');
    
    if (expandedContent.classList.contains('expanded')) {
        // Collapse
        expandedContent.classList.remove('expanded');
        readMoreBtn.classList.remove('hidden');
        careerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Expand
        expandedContent.classList.add('expanded');
        readMoreBtn.classList.add('hidden');
        setTimeout(() => {
            expandedContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

/* ================================
   2. MOBILE NAVIGATION (Burger Menu)
   Used on: All pages (mobile view only)
   Function: Toggles mobile navigation menu
   CSS: styles.css - BURGER MENU section
   ================================ */
document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (burgerBtn && navLinks) {
        burgerBtn.addEventListener('click', function() {
            burgerBtn.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            
            if (!navLinks.classList.contains('mobile-open')) {
                navLinks.classList.add('mobile-closing');
                setTimeout(() => {
                    navLinks.classList.remove('mobile-closing');
                }, 300);
            }
        });
        
        // Close menu when clicking on a link
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                burgerBtn.classList.remove('active');
                navLinks.classList.remove('mobile-open');
            });
        });
    }
});

/* ================================
   3. FLIP CARD FUNCTIONALITY (Project Cards)
   Used on: index.html and project.html
   Functions:
   - Flip cards on button click
   - Auto-flip back after delay (configurable via localStorage)
   - Click-to-tilt effect on card front
   - ESC key to close all flipped cards
   - Click on card back to flip back
   CSS: styles.css - 3D CARD EFFECTS and PROJECT CARD sections
   ================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Store timeouts for each card to manage auto-flip-back
    const cardTimeouts = new Map();
    
    // Get auto-flip delay from localStorage or use default (7500ms = 7.5 seconds)
    // To customize: localStorage.setItem('cardAutoFlipDelay', '10000'); // 10 seconds
    // To disable: localStorage.setItem('cardAutoFlipDelay', '0');
    function getAutoFlipDelay() {
        const saved = localStorage.getItem('cardAutoFlipDelay');
        if (saved !== null) {
            const delay = parseInt(saved, 10);
            return isNaN(delay) ? 7500 : delay;
        }
        return 7500; // Default: 7.5 seconds
    }
    
    // Function to clear timeout for a card
    function clearCardTimeout(card) {
        if (cardTimeouts.has(card)) {
            clearTimeout(cardTimeouts.get(card));
            cardTimeouts.delete(card);
        }
    }
    
    // Function to set auto-flip-back timeout (only if delay > 0)
    function setAutoFlipBack(card) {
        clearCardTimeout(card);
        const delay = getAutoFlipDelay();
        
        // Only set auto-flip if delay is greater than 0
        if (delay > 0) {
            const timeout = setTimeout(() => {
                if (card.classList.contains('flipped')) {
                    card.classList.remove('flipped');
                    cardTimeouts.delete(card);
                }
            }, delay);
            cardTimeouts.set(card, timeout);
        }
    }
    
    // Function to flip card with animation class
    function flipCard(card, flipTo) {
        if (flipTo === 'back') {
            card.classList.add('flipped');
            card.classList.add('flipping');
            setTimeout(() => {
                card.classList.remove('flipping');
            }, 600); // Match CSS animation duration
            setAutoFlipBack(card);
        } else {
            card.classList.remove('flipped');
            card.classList.add('flipping');
            setTimeout(() => {
                card.classList.remove('flipping');
            }, 600);
            clearCardTimeout(card);
        }
    }
    
    // ESC key to close flipped cards and remove tilt
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const flippedCards = document.querySelectorAll('.project-card.flipped');
            flippedCards.forEach(card => {
                card.classList.remove('tilted');
                flipCard(card, 'front');
            });
            
            // Also remove tilt from any tilted cards
            const tiltedCards = document.querySelectorAll('.project-card.tilted');
            tiltedCards.forEach(card => {
                card.classList.remove('tilted');
            });
            currentlyTiltedCard = null;
        }
    });
    
    // Click-to-tilt functionality for card front (only one card at a time)
    const projectCards = document.querySelectorAll('.project-card');
    let currentlyTiltedCard = null;
    
    projectCards.forEach(card => {
        const cardFront = card.querySelector('.project-card-front');
        
        if (cardFront) {
            // Click to tilt
            cardFront.addEventListener('click', function(e) {
                // Don't tilt if clicking on buttons, links, or interactive elements
                const isInteractiveElement = e.target.closest('button, a, .tooltip-wrapper, .project-actions');
                
                if (!isInteractiveElement && !card.classList.contains('flipped')) {
                    // Remove tilt from previously tilted card
                    if (currentlyTiltedCard && currentlyTiltedCard !== card) {
                        currentlyTiltedCard.classList.remove('tilted');
                    }
                    
                    // Tilt the clicked card
                    card.classList.add('tilted');
                    currentlyTiltedCard = card;
                }
            });
            
            // Remove tilt when mouse leaves the card
            card.addEventListener('mouseleave', function() {
                if (card.classList.contains('tilted')) {
                    card.classList.remove('tilted');
                    if (currentlyTiltedCard === card) {
                        currentlyTiltedCard = null;
                    }
                }
            });
        }
    });
    
    const flipButtons = document.querySelectorAll('.flip-card-btn');
    
    flipButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.project-card');
            
            // Remove tilt when flipping
            card.classList.remove('tilted');
            if (currentlyTiltedCard === card) {
                currentlyTiltedCard = null;
            }
            
            if (card.classList.contains('flipped')) {
                // If already flipped, flip back immediately
                flipCard(card, 'front');
            } else {
                // Flip the card and set auto-flip-back
                flipCard(card, 'back');
            }
        });
    });

    // Click/touch on card back to flip back to original position
    const cardBacks = document.querySelectorAll('.project-card-back');
    
    cardBacks.forEach(cardBack => {
        cardBack.addEventListener('click', function(e) {
            // Don't flip if clicking on buttons, links, or interactive elements
            const isInteractiveElement = e.target.closest('button, a, .tooltip-wrapper');
            
            if (!isInteractiveElement) {
                const card = this.closest('.project-card');
                if (card && card.classList.contains('flipped')) {
                    // Remove tilt when flipping back
                    card.classList.remove('tilted');
                    if (currentlyTiltedCard === card) {
                        currentlyTiltedCard = null;
                    }
                    flipCard(card, 'front');
                }
            }
        });
        
        // Also handle touch events for mobile
        cardBack.addEventListener('touchend', function(e) {
            // Don't flip if touching buttons, links, or interactive elements
            const isInteractiveElement = e.target.closest('button, a, .tooltip-wrapper');
            
            if (!isInteractiveElement) {
                e.preventDefault();
                const card = this.closest('.project-card');
                if (card && card.classList.contains('flipped')) {
                    flipCard(card, 'front');
                }
            }
        });
        
        // Reset auto-flip timer when user interacts with buttons/links on card back
        const interactiveElements = cardBack.querySelectorAll('button, a');
        interactiveElements.forEach(element => {
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.project-card');
                if (card) {
                    // Reset the auto-flip timer when user interacts
                    clearCardTimeout(card);
                    setAutoFlipBack(card);
                }
            });
        });
    });
    
    // Optional: Click outside card to close (disabled by default to avoid conflicts)
    // Uncomment below to enable click-outside-to-close functionality
    /*
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.project-card')) {
            const flippedCards = document.querySelectorAll('.project-card.flipped');
            flippedCards.forEach(card => {
                if (!card.contains(e.target)) {
                    flipCard(card, 'front');
                }
            });
        }
    });
    */

    // Tooltip handling for muted buttons
    const mutedButtons = document.querySelectorAll('.project-btn-filled-mute, .btn-back-filled-mute');
    
    function positionTooltip(button, tooltip) {
        const rect = button.getBoundingClientRect();
        
        // Temporarily show tooltip to measure it
        const wasVisible = tooltip.style.visibility === 'visible';
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
        tooltip.style.display = 'block';
        
        const tooltipRect = tooltip.getBoundingClientRect();
        const tooltipHeight = tooltipRect.height;
        const tooltipWidth = tooltipRect.width;
        
        // Position above the button by default
        let top = rect.top - tooltipHeight - 8;
        let left = rect.left + (rect.width / 2);
        let position = 'above';
        
        // Adjust if tooltip would go off screen
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 10;
        
        // Check left boundary
        if (left - (tooltipWidth / 2) < margin) {
            left = margin + (tooltipWidth / 2);
        }
        
        // Check right boundary
        if (left + (tooltipWidth / 2) > viewportWidth - margin) {
            left = viewportWidth - margin - (tooltipWidth / 2);
        }
        
        // Check top boundary - if tooltip would go off top, show below instead
        if (top < margin) {
            top = rect.bottom + 8;
            position = 'below';
            tooltip.setAttribute('data-position', 'below');
        } else {
            tooltip.removeAttribute('data-position');
        }
        
        tooltip.style.top = top + 'px';
        tooltip.style.left = left + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        if (!wasVisible) {
            tooltip.style.display = '';
        }
    }
    
    function showTooltip(button) {
        const tooltip = button.nextElementSibling;
        if (tooltip && tooltip.classList.contains('custom-tooltip')) {
            // Position tooltip before showing
            positionTooltip(button, tooltip);
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        }
    }
    
    function hideTooltip(button) {
        const tooltip = button.nextElementSibling;
        if (tooltip && tooltip.classList.contains('custom-tooltip')) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        }
    }
    
    mutedButtons.forEach(button => {
        // Desktop: Show tooltip on hover, hide on mouseleave (no auto-dismiss)
        if (window.matchMedia('(hover: hover)').matches) {
            button.addEventListener('mouseenter', function() {
                showTooltip(this);
            });
            
            button.addEventListener('mouseleave', function() {
                hideTooltip(this);
            });
            
            // Reposition tooltip on scroll/resize
            window.addEventListener('scroll', function() {
                const tooltip = button.nextElementSibling;
                if (tooltip && tooltip.classList.contains('custom-tooltip') && 
                    tooltip.style.visibility === 'visible') {
                    positionTooltip(button, tooltip);
                }
            }, true);
            
            window.addEventListener('resize', function() {
                const tooltip = button.nextElementSibling;
                if (tooltip && tooltip.classList.contains('custom-tooltip') && 
                    tooltip.style.visibility === 'visible') {
                    positionTooltip(button, tooltip);
                }
            });
        }
        
        // Mobile: Show/hide tooltip only on click (toggle behavior)
        if (window.matchMedia('(hover: none)').matches) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const tooltip = this.nextElementSibling;
                if (tooltip && tooltip.classList.contains('custom-tooltip')) {
                    const isVisible = tooltip.style.visibility === 'visible' || 
                                     window.getComputedStyle(tooltip).visibility === 'visible';
                    
                    if (isVisible) {
                        hideTooltip(this);
                    } else {
                        showTooltip(this);
                    }
                }
            });
        }
    });
});

/* ================================
   4. NAVBAR SCROLL DETECTION
   Used on: All pages
   Function: Adds 'scrolled' class to navbar when page is scrolled
   CSS: styles.css - NAVBAR section (.navbar.scrolled)
   ================================ */
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

/* ================================
   5. DYNAMIC COPYRIGHT YEAR
   Used on: All pages
   Function: Updates copyright year automatically
   Target: .footer-credit element
   ================================ */
document.addEventListener('DOMContentLoaded', function() {
    const footerCredit = document.querySelector('.footer-credit');
    if (footerCredit) {
        footerCredit.textContent = `Made with Coffee + overthinking. © ${new Date().getFullYear()} HeiyoJun`;
    }
});