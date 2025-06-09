
// When clicking the "Start" button, redirect to the first chapter of the nonjourney html
function startJourney() {
  window.location.href = '/MRPCC/nonjourney/chapter1.html#page0'; 
}

// Basic JavaScript to toggle the lightbox
// You can make any button trigger this. For example, the "Our Team" button.
const ourTeamButton = document.getElementById('ourTeamBtn'); // Or any other button
const learnMoreLightbox = document.getElementById('MainMenuLightbox');
const closeLightboxButton = document.getElementById('mainmenu-closeLightboxBtn');

if (ourTeamButton && learnMoreLightbox && closeLightboxButton) {
    ourTeamButton.addEventListener('click', () => {
        learnMoreLightbox.style.display = 'flex'; // Show lightbox
    });

    closeLightboxButton.addEventListener('click', () => {
        learnMoreLightbox.style.display = 'none'; // Hide lightbox
    });

    // Optional: Close lightbox if user clicks outside the content area
    learnMoreLightbox.addEventListener('click', (event) => {
        if (event.target === learnMoreLightbox) { // Clicked on the overlay itself
            learnMoreLightbox.style.display = 'none';
        }
    });
}

