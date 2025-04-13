// Quiz Interactions

// Get the modal and close button
const modal = document.getElementById('quiz-lightbox');


// Function to close the modal (lightbox)
function closeModal() {
    modal.style.display = 'none'; // Hide the modal
    modal.classList.remove('fade-in'); // Remove fade-in animation when closing
    
    // Enable background scroll again
     document.body.style.overflow = 'auto';
    }




/* // Close the modal if the user clicks outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
}); 
*/


// Handle quiz form submission
const quizForm = document.getElementById('quiz-form');
const quizButton = document.getElementById('quiz-button'); // Get the button

// Handle submit button (image click)
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', function () {
    // Prevent form submission using the image click
    quizForm.dispatchEvent(new Event('submit'));
});

quizForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    // Get selected answer
    const selectedAnswer = document.querySelector('input[name="quiz"]:checked');
    
    if (selectedAnswer) {
        const answer = selectedAnswer.value;

        // Check if the answer is correct (Raccoon is the correct answer)
        let score = (answer === 'Raccoon') ? 1 : 0;

        // Display the result
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
        <p class="result-heading">Your answer: ${answer}</p>
        <p class="result-text">
            ${score ? '<span class="correct">Correct!</span> Time to go get it back!' 
            : '<span class="incorrect">Not quite, </span> check your notes and try again!'}
        </p>
    `;


        // Show the "Continue" button if the answer is correct, otherwise hide it
        quizButton.style.display = score === 1 ? 'block' : 'none';

        // Play the correct or incorrect sound
        const correctSound = new Audio('./audio/correct.mp3');  // Change to your correct sound file
        const incorrectSound = new Audio('./audio/incorrect.mp3'); // Change to your incorrect sound file
        
        if (score === 1) {
            correctSound.play();
        } else {
            incorrectSound.play();
        }

    } else {
        alert("Please select an option!");
    }
});



// Quiz Lightbox Modal Transition Effects
// Add fade-in CSS class for smooth transitions
// Ensure to include CSS for `.fade-in` animation
/*
.fade-in {
    opacity: 0;
    animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}
*/


// Get elements for full-screen gallery
const fullScreenGallery = document.getElementById('full-screen-gallery');
const fullScreenImg = document.getElementById('full-screen-img');
const closeFullScreenBtn = document.getElementById('close-fullscreen');

// Initialize the current image index
let fullScreenIndex = 0;

// Array of image sources
const imageSources = [
    './img/owl.png',
    './img/Notebook-Raccoon.png',
    './img/coyote.png',
    './img/opossum-notepad.png',
    './img/toad-notepad.png',
    './img/fox-notepad.png',
    // Add more image paths here
];

// Open Full-Screen Gallery
function openFullScreenGallery(index) {
    fullScreenIndex = index;  // Set the index of the clicked image
    fullScreenImg.src = imageSources[fullScreenIndex]; // Set the source of the full-screen image
    fullScreenGallery.style.display = 'flex'; // Show the full-screen gallery
}

// Close Full-Screen Gallery
closeFullScreenBtn.addEventListener('click', () => {
    fullScreenGallery.style.display = 'none'; // Hide the full-screen gallery
});

// Event listeners for navigation buttons in the full-screen gallery
document.getElementById('prev-btn').addEventListener('click', () => {
    fullScreenIndex--; // Go to the previous image
    if (fullScreenIndex < 0) fullScreenIndex = imageSources.length - 1; // Loop to last image
    fullScreenImg.src = imageSources[fullScreenIndex];
});

document.getElementById('next-btn').addEventListener('click', () => {
    fullScreenIndex++; // Go to the next image
    if (fullScreenIndex >= imageSources.length) fullScreenIndex = 0; // Loop to first image
    fullScreenImg.src = imageSources[fullScreenIndex];
});






let currentSound = null; // Store the currently playing audio
let correctSound = new Audio('./audio/win.mp3'); // Correct answer sound
let wrongSound = new Audio('./audio/lose.mp3'); // Wrong answer sound
let selectedAnswer = null; // Store the selected answer
let animalIcons = document.querySelectorAll('.animal-icon');  // Get all animal icons

document.querySelectorAll('.animal-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        animalIcons.forEach(i => i.classList.remove('selected'));
        
        // Add 'selected' class to the clicked icon
        icon.classList.add('selected');
        // Stop the previous sound if it's playing
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0; // Reset the audio
        }

        // Play the new sound
        const soundPath = this.dataset.sound;
        currentSound = new Audio(soundPath);
        currentSound.volume = 0.9; 
        currentSound.load();  // Ensure the sound is loaded
        currentSound.play().catch(error => {
            console.error('Error playing sound:', error);  // Log any errors
        });

        // Stop the sound after 3 seconds
        setTimeout(() => {
            if (currentSound) {
                currentSound.pause();
                currentSound.currentTime = 0;
            }
        }, 3000); // 3000ms = 3 seconds

        // Store the selected answer (dataset.correct will be "true" or "false")
        selectedAnswer = this.dataset.correct;
    });
});

