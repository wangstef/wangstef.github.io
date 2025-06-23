document.addEventListener('DOMContentLoaded', function () {
  // --- Create and insert Main Menu button ---
 const mainMenuButton = document.getElementById('logo-menu-button');
   // If the button doesn't exist on the page, stop the script to avoid errors.
  if (!mainMenuButton) {
    console.warn('Main menu button with id "logo-menu-button" not found.');
    return; 
  }
  //old main menu button code
  //-----------------------------
  // button.id = 'mainMenuButton';
  // button.className = 'menu-button';
  // button.innerText = 'Main Menu';
  // document.body.appendChild(button);
  //-----------------------------

  // --- Create and insert modal markup ---
  const modalHTML = `
    <div id="menuModalOverlay" class="modal-overlay hidden">
      <div class="modal-box">
        <p>Are you sure you want to return to the main menu?<br><small></small></p>
        <div class="modal-actions">
          <button id="confirmYes" class="modal-button confirm">Yes</button>
          <button id="confirmNo" class="modal-button cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // --- Hardcoded path to index.html (adjust as needed) ---
  const mainMenuPath = '../index.html'; // Change to '../index.html' or './index.html' as needed

  // --- Event: Show modal ---
  mainMenuButton.addEventListener('click', function (event) {
    // ⭐️ BEST PRACTICE: Prevent the link from trying to navigate away
    event.preventDefault(); 
    document.getElementById('menuModalOverlay').classList.remove('hidden');
  });

  // --- Event: Handle modal buttons ---
  document.getElementById('confirmYes').addEventListener('click', function () {
    window.location.href = mainMenuPath;
  });

  document.getElementById('confirmNo').addEventListener('click', function () {
    document.getElementById('menuModalOverlay').classList.add('hidden');
  });
});
