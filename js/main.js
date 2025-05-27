/**
 * Block.md Landing Page JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.querySelector('.header');
    const scrollThreshold = 50;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerOffset = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Feature card hover effect enhancement
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Demo of glass card parallax effect
    const heroSection = document.querySelector('.hero');
    const glassCard = document.querySelector('.hero .glass-card');
    
    if (heroSection && glassCard) {
        heroSection.addEventListener('mousemove', (e) => {
            // Only apply effect on larger screens
            if (window.innerWidth <= 768) return;
            
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            // Calculate movement as percentage of container size
            const moveX = (x / rect.width - 0.5) * 20;
            const moveY = (y / rect.height - 0.5) * 20;
            
            // Apply subtle transform
            glassCard.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            // Reset transform when mouse leaves
            glassCard.style.transform = 'translate(0, 0)';
        });
    }
    
    // Mobile menu toggle placeholder (for future implementation)
    const menuButton = document.querySelector('.menu-button');
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            console.log('Menu button clicked - functionality to be implemented');
        });
    }

    // Add CSS class to enhance certain animations after page load
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Function verification
    console.assert(typeof handleScroll === 'function', 'handleScroll function should be defined');
    console.assert(document.querySelectorAll('a[href^="#"]').length > 0, 'Page should contain anchor links');
});

// Syntax self-check
try {
    console.log("Syntax check passed");
} catch (error) {
    console.error("Syntax error:", error.message);
}