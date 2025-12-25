// Career Card Expand/Collapse Functionality
function toggleCareerCard(button) {
    const careerCard = button.closest('.career-card');
    const expandedContent = careerCard.querySelector('.career-expanded-content');
    const readMoreBtn = careerCard.querySelector('.career-read-more');
    
    if (expandedContent.classList.contains('expanded')) {
        // Collapse
        expandedContent.classList.remove('expanded');
        readMoreBtn.classList.remove('hidden');
        // Smooth scroll to top of card
        careerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // Expand
        expandedContent.classList.add('expanded');
        readMoreBtn.classList.add('hidden');
        // Smooth scroll to show expanded content
        setTimeout(() => {
            expandedContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Mobile Navigation Toggle
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

// Flip Card Functionality
document.addEventListener('DOMContentLoaded', function() {
    const flipButtons = document.querySelectorAll('.flip-card-btn');
    
    flipButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.project-card');
            card.classList.toggle('flipped');
        });
    });
});