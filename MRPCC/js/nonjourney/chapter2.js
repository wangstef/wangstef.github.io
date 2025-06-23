const pages = [
   {
        img: "../img/images/Non journey/Ch 2 What is Craniosynostosis_.png",
        showButton: false,
        showTextBox: false,
        text: ""
    },     
    { 
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        text: "Most parents have never heard of craniosynostosis before their child is diagnosed. Click on the button above to hear how it is pronounced.",
        // 🧩 1. ADD AUDIO PROPERTIES
        showAudioButton: true, // Show the button on this page
        audioSrc: "/MRPCC/img/audio/Craniosynostosispronounce_Shelley_v001.mp3" // IMPORTANT: Replace with the actual path to your audio file
    }, 
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        showNextArrow: false,
        showVideoButton: true,
        text: "If parents want to go through with surgical options, the timing is very important, as certain options (ex. Endoscopic strip Craniectomy) can only be done while the skull is still soft and growing. The following video will give a summary of craniosynostosis. "
    },
    {
        img: "../img/images/Slide 16_9 - 1.png",
        showButton: false,
        showTextBox: false,
        text: "",
        youtubeId: "OCecxsDDwWY"
        
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        text: ""
    },
    {
        img: "../img/images/Non journey/BG-wave.png",
        showButton: false,
        showTextBox: true,
        text: ""
    },    
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
  const nextArrow = document.getElementById("nextArrow"); 
   const videoContainer = document.getElementById("videoContainer");
  
//Audio
// 🧩 2. GET REFERENCES TO AUDIO
const audioButton = document.getElementById("audioButton");
const pageAudio = document.getElementById("pageAudio");
const playPauseIcon = document.getElementById("playPauseIcon");

//video
const videoButton = document.getElementById("videoButton");
const playVidIcon = document.getElementById("playVidIcon");

// Icons for play and pause states
const playIconSVG = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 84.86"><title>volume</title><path d="M11.32,19.85H33.89L52.56,1a3.55,3.55,0,0,1,5,0,3.48,3.48,0,0,1,1,2.51h0V81.3a3.56,3.56,0,0,1-6.1,2.49l-18.45-15H11.32A11.35,11.35,0,0,1,0,57.49V31.17A11.37,11.37,0,0,1,11.32,19.85ZM74.71,31.62A3.32,3.32,0,0,1,81,29.51c1.14,3.39,1.69,8.66,1.6,13.67s-.81,9.72-2.19,12.57a3.33,3.33,0,0,1-6-2.91c1-2,1.47-5.76,1.55-9.77a38.19,38.19,0,0,0-1.27-11.45Zm17.14-12.4A3.32,3.32,0,0,1,98,16.67c3.08,7.4,4.75,16.71,4.89,26s-1.21,18.25-4.14,25.51a3.31,3.31,0,0,1-6.15-2.47c2.6-6.44,3.79-14.67,3.67-23s-1.63-16.86-4.41-23.5ZM108.42,8.68a3.32,3.32,0,1,1,6-2.88,89.44,89.44,0,0,1,8.48,37.53c.1,12.58-2.44,25.12-8,35.81a3.31,3.31,0,1,1-5.89-3c5-9.71,7.32-21.17,7.23-32.72a82.47,82.47,0,0,0-7.83-34.7Z"/></svg>';
const pauseIconSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

// Icons for video play
const videoIconSVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"></path></svg>';

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

    // 🧩 6. CONTROL VIDEO BUTTON VISIBILITY AND STATE
       if (page.showVideoButton) {
           videoButton.style.display = "flex"; // Use 'flex' to honor the alignment styles
           playVidIcon.innerHTML = videoIconSVG;
       } else {
           videoButton.style.display = "none";
       }

    // VIDEO CONTAINER LOGIC
       if (page.youtubeId) {
           // If the page has a youtubeId, show the container and create the iframe
           videoContainer.style.display = "block";
           // The '?autoplay=1' makes the video play immediately.
           // The '&rel=0' prevents related videos from showing at the end.
           videoContainer.innerHTML = `
               <div class="video-responsive-wrapper">
                   <iframe
                       src="https://www.youtube.com/embed/${page.youtubeId}?autoplay=1&rel=0"
                       frameborder="0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowfullscreen>
                   </iframe>
               </div>
           `;
       } else {
           // If not, hide the container and REMOVE the iframe.
           // This is crucial to stop the video from playing in the background.
           videoContainer.style.display = "none";
           videoContainer.innerHTML = "";
       }


      // Highlight current progress dot
      const dots = document.querySelectorAll(".progress-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentPage);
      });

            //make next arrow disappear
      if (page.showNextArrow === false) {
        nextArrow.style.display = "none";
    } else {
        nextArrow.style.display = "block"; 
    }

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


videoButton.addEventListener("click", nextPage);

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
  