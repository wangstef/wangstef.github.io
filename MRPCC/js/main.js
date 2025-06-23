
// When clicking the "Start" button, redirect to the first chapter of the nonjourney html
 function startJourney() {
   window.location.href = '/MRPCC/nonjourney/tutorial.html'; 
 }


// Button for our team button
// Get the HTML elements
const infoButton = document.getElementById('ourTeamBtn');
const lightbox = document.getElementById('lightbox');

// Function to toggle the lightbox's visibility
function toggleLightbox() {
  lightbox.classList.toggle('hidden');
}

// Add a click event listener to the "Learn More" button
infoButton.addEventListener('click', toggleLightbox);
