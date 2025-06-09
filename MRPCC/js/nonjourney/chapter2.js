const pages = [
        { 
        img: "../img/images/Non journey/Ch 2 b.png",
        showButton: false,
        showTextBox: true,
        text: "MAIN MENU",
        // 🧩 1. ADD AUDIO PROPERTIES
        showAudioButton: true, // Show the button on this page
        audioSrc: "/MRPCC/img/audio/Craniosynostosispronounce_Shelley_v001.mp3" // IMPORTANT: Replace with the actual path to your audio file
    }, //showbutton is for lightbox button
    {
        img: "../img/images/Non journey/Ch 2 b.png",
        showButton: true,
        showTextBox: true,
        text: "If parents want to go through with surgical options, the timing is very important, as certain options (ex. Endoscopic strip Craniectomy) can only be done while the skull is still soft and growing. The following video will give a summary of craniosynostosis. "
    },
    {
        img: "../img/images/Non journey/Ch 2 c.png",
        showButton: false,
        showTextBox: false,
        text: ""
    }
  ];

  
  let currentPage = 0;

  //Necessary to determine the current page based on URL hash
  if (window.location.hash && window.location.hash.startsWith("#page")) {
    // console.log("Hash found, attempting to parse...");
    const pageFromHash = parseInt(window.location.hash.substring(5)); // Extracts number after "#page"
    // console.log("Parsed pageFromHash:", pageFromHash);

    if (!isNaN(pageFromHash) && pageFromHash >= 0 && pageFromHash < pages.length) {
        currentPage = pageFromHash;
        // console.log("currentPage successfully set from hash:", currentPage);
    } else {
        // console.warn("pageFromHash is invalid or out of bounds. Sticking with default currentPage.", pageFromHash);
        // Fallback to currentPage = 0 is already handled by initial declaration.
    }
} else {
    // console.log("No '#page' hash found in URL, or hash is not for a page. Using default currentPage.");
}
// console.log("Final currentPage before initial renderPage() call:", currentPage);

  
  const backgroundImg = document.getElementById("backgroundImg");
  const infoButton = document.getElementById("infoButton");
  const lightbox = document.getElementById("lightbox");
  
//Audio
// 🧩 2. GET REFERENCES TO AUDIO
const audioButton = document.getElementById("audioButton");
const pageAudio = document.getElementById("pageAudio");
const playPauseIcon = document.getElementById("playPauseIcon");

// Icons for play and pause states
const playIconSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
const pauseIconSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';



 //set progress bar pages (dots)
  const progressBar = document.getElementById("progressBar");

    // Create one dot per page
    pages.forEach(() => {
      const dot = document.createElement("div");
      dot.classList.add("progress-dot");
      progressBar.appendChild(dot);
    });

  function renderPage() {
  const page = pages[currentPage];
  backgroundImg.src = page.img;
  infoButton.style.display = page.showButton ? "block" : "none";

  const textBox = document.getElementById("textBox");
  const textContent = document.getElementById("textContent");

  if (page.showTextBox) {
    textBox.style.display = "flex"; // changed from "block" for flex layout
    textContent.innerText = page.text;
  } else {
    textBox.style.display = "none";
  }

 // 🧩 3. CONTROL AUDIO BUTTON VISIBILITY AND STATE
    if (page.showAudioButton) {
        audioButton.style.display = "flex";
        // Only update src if it's different to prevent re-loading on same page
        if (pageAudio.getAttribute('src') !== page.audioSrc) {
            pageAudio.src = page.audioSrc;
        }
    } else {
        audioButton.style.display = "none";
        // IMPORTANT: Stop and reset audio if we navigate away from a page with audio
        pageAudio.pause();
        pageAudio.currentTime = 0;
    }
        // Reset icon to 'play' every time the page renders or audio ends
    playPauseIcon.innerHTML = playIconSVG;


  // Highlight current progress dot
  const dots = document.querySelectorAll(".progress-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPage);
  });

    // 🧩 Always store current page in the hash
    window.location.hash = "#page" + currentPage;
  }  
  
// 🧩 4. FUNCTION TO PLAY/PAUSE AUDIO
function toggleAudio() {
    if (pageAudio.paused) {
        pageAudio.play();
        playPauseIcon.innerHTML = pauseIconSVG; // Show pause icon
    } else {
        pageAudio.pause();
        playPauseIcon.innerHTML = playIconSVG; // Show play icon
    }
}

// 🧩 5. EVENT LISTENERS
audioButton.addEventListener("click", toggleAudio);
// When the audio finishes playing, reset the icon to 'play'
pageAudio.addEventListener("ended", () => {
    playPauseIcon.innerHTML = playIconSVG;
});



  //next page and end of chapter 2
  function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        if (typeof renderPage === "function") { // Ensure renderPage is defined
            renderPage();
        } else {
            console.error("renderPage function is not defined in this chapter script.");
        }
    } else {
        // End of Chapter 2 - Redirect to the dedicated path selection page
        // The path_selection.html is in the root, so '../' from 'endoscopic/' or 'cranialvault/'
        window.location.href = "../path_selection.html";
    }
}
  
  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    } else {
      // Go to the last page of Chapter 1
      window.location.href = "chapter1.html#page2";
    }
  }
  
  function toggleLightbox() {
    lightbox.classList.toggle("hidden");
  }
  
  infoButton.addEventListener("click", toggleLightbox);
  
  // Initial render
  renderPage();
  