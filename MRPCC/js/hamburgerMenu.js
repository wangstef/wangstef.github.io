// File: js/hamburgerMenu.js

document.addEventListener('DOMContentLoaded', () => {
    // Get the necessary elements from the DOM
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const menuDropdown = document.getElementById('menu-dropdown');

    // Check if both elements exist to avoid errors
    if (hamburgerBtn && menuDropdown) {
        // Add a click event listener to the hamburger button
        hamburgerBtn.addEventListener('click', (event) => {
            // Stop the click from propagating to the document event listener below
            event.stopPropagation(); 
            
            // Toggle the 'active' class on the dropdown menu to show/hide it
            menuDropdown.classList.toggle('active');

            // Toggle the 'open' class on the button for the 'X' animation
            hamburgerBtn.classList.toggle('open');
            
            // Update aria-expanded for accessibility
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
        });

        // Optional: Close the menu if the user clicks anywhere else on the page
        document.addEventListener('click', () => {
            if (menuDropdown.classList.contains('active')) {
                menuDropdown.classList.remove('active');
                hamburgerBtn.classList.remove('open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Prevent the menu from closing when clicking inside it
        menuDropdown.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
});