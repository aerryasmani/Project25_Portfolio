/* ================================
   CAREER CARD FUNCTIONALITY
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
   MOBILE NAVIGATION
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
   FLIP CARD FUNCTIONALITY
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
    
    // ESC key to close flipped cards
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            const flippedCards = document.querySelectorAll('.project-card.flipped');
            flippedCards.forEach(card => {
                flipCard(card, 'front');
            });
        }
    });
    
    const flipButtons = document.querySelectorAll('.flip-card-btn');
    
    flipButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const card = this.closest('.project-card');
            
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

    // Tooltip click handling for mobile/touch devices
    // Desktop hover tooltips work via CSS, this only handles touch interactions
    const mutedButtons = document.querySelectorAll('.project-btn-filled-mute, .btn-back-filled-mute');
    
    mutedButtons.forEach(button => {
        // Only handle touch events, not mouse clicks (to preserve hover tooltips on desktop)
        button.addEventListener('touchstart', function(e) {
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('custom-tooltip')) {
                // Show tooltip on touch
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
                
                // Hide tooltip after 3 seconds
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                }, 3000);
            }
        });
        
        // Also handle click for devices that don't support hover well
        button.addEventListener('click', function(e) {
            // Only handle if it's a touch device (no hover support)
            if (window.matchMedia('(hover: none)').matches) {
                const tooltip = this.nextElementSibling;
                if (tooltip && tooltip.classList.contains('custom-tooltip')) {
                    // Toggle tooltip visibility on touch devices
                    const isVisible = tooltip.style.visibility === 'visible' || 
                                     window.getComputedStyle(tooltip).visibility === 'visible';
                    
                    if (isVisible) {
                        tooltip.style.opacity = '0';
                        tooltip.style.visibility = 'hidden';
                    } else {
                        tooltip.style.opacity = '1';
                        tooltip.style.visibility = 'visible';
                        
                        // Hide tooltip after 3 seconds
                        setTimeout(() => {
                            tooltip.style.opacity = '0';
                            tooltip.style.visibility = 'hidden';
                        }, 3000);
                    }
                }
            }
        });
    });
});

/* ================================
   NAVBAR SCROLL DETECTION
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