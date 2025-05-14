document.addEventListener('DOMContentLoaded', function () {
  // --- Create and insert Main Menu button ---
  const button = document.createElement('button');
  button.id = 'mainMenuButton';
  button.className = 'menu-button';
  button.innerText = '🏠 Main Menu';
  document.body.appendChild(button);

  // --- Create and insert modal markup ---
  const modalHTML = `
    <div id="menuModalOverlay" class="modal-overlay hidden">
      <div class="modal-box">
        <p>Are you sure you want to return to the main menu?<br><small>Unsaved progress may be lost.</small></p>
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
  button.addEventListener('click', function () {
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
