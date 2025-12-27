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
    const flipButtons = document.querySelectorAll('.flip-card-btn');
    
    flipButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.project-card');
            card.classList.toggle('flipped');
        });
    });

    // Tooltip click handling for mobile
    const mutedButtons = document.querySelectorAll('.project-btn-filled-mute, .btn-back-filled-mute');
    
    mutedButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tooltip = this.nextElementSibling;
            if (tooltip && tooltip.classList.contains('custom-tooltip')) {
                // Toggle tooltip visibility
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