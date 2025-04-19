document.addEventListener("DOMContentLoaded", function () {
    // SFX Icon
    const sfxIcon = document.createElement("div");
    sfxIcon.id = "sfx-icon";
    sfxIcon.classList.add("sound-on");
    sfxIcon.onclick = toggleSFX;
    document.getElementById("sound-controls").appendChild(sfxIcon);

    // Narration Icon
    const narrationIcon = document.createElement("div");
    narrationIcon.id = "narration-icon";
    narrationIcon.classList.add("sound-on");
    narrationIcon.onclick = toggleNarration;
    document.getElementById("sound-controls").appendChild(narrationIcon);
});

//Add Background Music with toggle button
const bgMusic = new Audio("./audio/BG music.mp3");
bgMusic.loop = true; // Ensure it loops
bgMusic.volume = 0.2; // Adjust volume if needed
bgMusic.play();

document.addEventListener("DOMContentLoaded", function () {
    let bgMusic = document.getElementById("bg-music");
    let soundIcon = document.getElementById("sound-icon");

    let isPlaying = false; // Start with music off

    soundIcon.addEventListener("click", function () {
        if (isPlaying) {
            bgMusic.pause();
            soundIcon.style.backgroundImage = "url('./img/BGSound_Off.png')";
        } else {
            bgMusic.play();
            soundIcon.style.backgroundImage = "url('./img/BGSound_On.png')";
        }
        isPlaying = !isPlaying;
    });
});


// Audio - SFX
const DoorOpen = new Audio("./audio/door.mp3");
const Rustle = new Audio("./audio/rustle.mp3"); 
const Woof = new Audio("./audio/Woof.mp3"); 
const walking = new Audio("./audio/walking_forest.mp3");  
const swoosh = new Audio("./audio/swoosh.mp3"); 
const gasp = new Audio("./audio/gasp.mp3"); 
const mystery = new Audio("./audio/mystery.mp3"); 
const mystery2 = new Audio("./audio/mystery2.mp3"); 
const ghost = new Audio("./audio/ghost.mp3"); 
const waterdroplets = new Audio("./audio/waterdroplets.mp3"); 
const Win = new Audio("./audio/win.mp3"); 
const BigDogBark = new Audio("./audio/bigdogbark.wav"); 
const BeanieWhimper = new Audio("./audio/dogwhimpering.wav");
const Detective = new Audio("./audio/detectivemusic.mp3");
const Notebook = new Audio("./audio/notebook_ding.mp3"); 
const DogRunning = new Audio("./audio/dogrunning.mp3");
const ToadSinging = new Audio("./audio/toad.mp3");
const ding1 = new Audio("./audio/ding1.mp3");
const ding2 = new Audio("./audio/ding2.mp3");
const ding3 = new Audio("./audio/ding3.mp3");

// Audio - Narration
const What = new Audio("./audio/What!.mp3");
const nobeaniewait = new Audio("./audio/NoBeanieWait.mp3"); 
const Hurry = new Audio("./audio/Hurry.mp3"); 
const Thereyouare = new Audio("./audio/Thereyouare.mp3"); 
const StopSinging = new Audio("./audio/stopsinging.mp3");
const DunkDinner = new Audio("./audio/dunkmydinner.mp3");
const justkeepwalking = new Audio("./audio/justkeepwalking.mp3.mp3");
const letmeeat = new Audio("./audio/letmeeat_1.mp3");
const CanYouTellMe = new Audio("./audio/CanYouTellMe.mp3");
const HelloRaccoon = new Audio("./audio/HelloRaccoon.mp3");

// Store SFX & Narration in arrays for better control
const sfxSounds = [
    DoorOpen, Rustle, Woof, walking, swoosh, gasp, mystery, mystery2, ghost, waterdroplets, 
    Win, BigDogBark, BeanieWhimper, Detective, Notebook, DogRunning, ToadSinging, ding1, ding2, ding3
];

const narrationSounds = [
    What, nobeaniewait, Hurry, Thereyouare, StopSinging, DunkDinner, justkeepwalking, letmeeat, CanYouTellMe, HelloRaccoon
];

// Sound toggles
let sfxEnabled = true;
let narrationEnabled = true;

// Toggle SFX
function toggleSFX() {
    sfxEnabled = !sfxEnabled;
    document.getElementById("sfx-icon").style.backgroundImage = sfxEnabled 
        ? "url('./img/SFX_On.png')" 
        : "url('./img/SFX_Off.png')";
}

// Toggle Narration
function toggleNarration() {
    narrationEnabled = !narrationEnabled;
    document.getElementById("narration-icon").style.backgroundImage = narrationEnabled 
        ? "url('./img/Narration_On.png')" 
        : "url('./img/Narration_Off.png')";
}


// Function to play a sound
function playSound(sound) {
    if (sfxSounds.includes(sound) && !sfxEnabled) return;
    if (narrationSounds.includes(sound) && !narrationEnabled) return;

    sound.currentTime = 0; // Restart sound if it's already playing
    sound.play();
}

// Function to loop a sound a set number of times
function playSoundLoop(sound, times) {
    if (sfxSounds.includes(sound) && !sfxEnabled) return;
    if (narrationSounds.includes(sound) && !narrationEnabled) return;

    let count = 0;
    sound.play();
    sound.addEventListener("ended", function () {
        if ((sfxSounds.includes(sound) && !sfxEnabled) || 
            (narrationSounds.includes(sound) && !narrationEnabled)) return;

        count++;
        if (count < times) {
            sound.currentTime = 0; // Reset to start
            sound.play(); // Play again
        }
    });
}

// Toggle buttons
// const sfxButton = document.createElement("button");
// sfxButton.textContent = "SFX: ON";
// sfxButton.onclick = toggleSFX;
// document.body.appendChild(sfxButton);

// const narrationButton = document.createElement("button");
// narrationButton.textContent = "Narration: ON";
// narrationButton.onclick = toggleNarration;
// document.body.appendChild(narrationButton);

// Start looping ToadSinging (fixing argument)
playSoundLoop(ToadSinging, 4);


// Initialize ScrollMagic controller
var controller = new ScrollMagic.Controller();


// Create a timeline animation with GSAP
const timeline = gsap.timeline({ paused: true });

// Set initial positions for images that need to be flipped
gsap.set("#Bush-Left2", { scaleX: -1 });
gsap.set("#Tree-Left2", { scaleX: -1 });
gsap.set("#Beanie-tail", { scaleX: -1 });
gsap.set("#Beanie-behind2", { scale:1.5 });
gsap.set("#quiz-button", { opacity: 0, pointerEvents: "none" });


// Opening Scene 1 
// Scoll down animation
let scrollAnim;

// Initial animation on page load
function startScrollAnim() {
  // Re-create the animation if it's been killed
  scrollAnim = gsap.to("#scroll", {
    opacity: 1,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });

  // Make sure it's visible and displayed
  gsap.set("#scroll", {
    display: "block"
  });
}

// Hide animation and element
function hideScrollAnim() {
  if (scrollAnim) scrollAnim.kill();
  gsap.set("#scroll", { display: "none" });
}

// Start animation on load
startScrollAnim();

// Listen for scroll events
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    // Hide when scrolling down
    hideScrollAnim();
  } else {
    // Re-show when at top
    startScrollAnim();
  }
});


// //Paw animation (needs fixing)
// let pawTimeline;

// function startPawAnim() {
//   // Create the timeline for paw animations
//   pawTimeline = gsap.timeline({ ease: "power1.inOut" });

//   for (let i = 1; i <= 18; i++) {
//     pawTimeline.from(`#paw${i}`, {
//       opacity: 0,
//       duration: 200
//     });
//   }
// }

// function hidePawAnim() {
//   // Set display to 'none' for all paw elements when scrolling down
//   gsap.set("[id^='paw']", { display: "none" });
// }

// function showPawAnim() {
//   // Show paws with display: block and set opacity to 0 initially to start animation smoothly
//   gsap.set("[id^='paw']", { display: "block", opacity: 0 });

//   // Now start the paw animation from the beginning
//   startPawAnim();
// }

// // Listen for scroll events
// window.addEventListener("scroll", () => {
//   if (window.scrollY > 0) {
//     hidePawAnim();  // Hide paw animation when scrolling down
//   } else {
//     showPawAnim();  // Re-show paw animation and restart it when at the top
//   }
// });

  
// Opening Scene 1: Fade to background gradient 
timeline.to("#opening-text", { 
    opacity: 0, 
    duration: 100, 
    ease: "power1.inOut", 
    scrollTrigger: {
        trigger: ".opening",
        start: "top top",  // Start fading when the top of .opening hits the top of the viewport
        end: "bottom top",  // Fully faded when the bottom of .opening reaches the top
        scrub: 1,  // Smooth scrolling effect
        
    }
}, "title")

.to("#sky", {y:"-100vh", duration: 100, ease: "power1.inOut"})
//text 1_1 fades in and out
.to("#text1_1", { opacity: 1, duration: 200, ease: "power1.inOut", onStart: () => playSound(waterdroplets) },"text1_1")
.to("#text1_1", { duration: 400, ease: "power1.inOut" } )
.to("#text1_1", { opacity: 0, duration: 200,   ease: "power1.inOut",  onStart: () => playSound(BeanieWhimper) },)

//text 1_2 fades in and out
.to("#text1_2", { opacity: 1, duration: 200,   ease: "power1.inOut" , onStart: () => playSound(ghost)},"text1_2")
.to("#text1_2", { duration: 400, ease: "power1.inOut"  } )
.to("#text1_2", { opacity: 0, duration: 200,   ease: "power1.inOut" },)



.to("#fade-to-black", { 
    opacity: 1, 
    duration: 200, 
    ease: "power1.inOut"
    // scrollTrigger: {
    //     trigger: "#sky",
    //     start: "bottom bottom",  // When the bottom of #sky reaches the bottom of the viewport
    //     end: "bottom top",  // Fully faded when the bottom of #sky reaches the top of the viewport
    //     scrub: 2, // Smooth scroll effect
    // }
    , onStart: () => playSound(DoorOpen)})
.to("#sky", { 
    opacity: 0, 
    duration: 200, 
    ease: "power1.inOut",}, "skyfade")

.to("#fade-to-black", { duration: 200, ease: "power1.inOut"},"fadetoblack1")
.to("#fade-to-black", { opacity: 0, duration: 200, ease: "power1.inOut"});



// Scene 2: House
timeline.to("#House,#Beanie-sad", { opacity:1, duration: 200, ease: "power1.inOut"},"fadetoblack1")
        //Arf! Arf! 1 fades in and out
        .to("#text2_1", {rotation:(3, 3), opacity: 1, duration: 200, ease: "power1.inOut" , onStart: () => playSound(Woof) },"text2_1")
        .to("#text2_1", { duration: 200, ease: "power1.inOut" })
        .to("#text2_1", { opacity: 0, duration: 200, ease: "power1.inOut", onStart: () => playSound(Woof) }, "text2_1out")
         //What your.. fades in and out
         .to("#text2_2", { opacity: 1, duration: 200, ease: "power1.inOut" , onStart: () => playSound(What)})
         .to("#text2_2", { duration: 200, ease: "power1.inOut", onStart: () => playSound(Gasp) }, "text2_2")
         .to("#text2_2", { opacity: 0, duration: 200,   ease: "power1.inOut" },)
        //Beanie sad fades out
        .to("#Beanie-sad", { opacity:0, duration: 200, ease: "power1.inOut", onStart: () => playSound(DogRunning)},"tail_in")
        //Beanie tail fades in
        .to("#Beanie-tail", { opacity:1, duration: 200, ease: "power1.inOut" },"tail_in")
        //Arf! Arf! 2 fades in and out
        .to("#text2_1B", {rotation:(3, 3), opacity: 1, duration: 200,   ease: "power1.inOut", onStart: () => playSound(Woof) },"tail_in")
        .to("#text2_1B", { duration: 200, ease: "power1.inOut" , onStart: () => playSound(Woof)})
        .to("#text2_1B", { opacity: 0, duration: 200, ease: "power1.inOut" },"text2_1Bout" )
        //Beanie tail fades in
        .to("#Beanie-tail", { opacity:0, duration: 200, ease: "power1.inOut" },"text2_1Bout")
        

        //Fade to black
        .to("#fade-to-black", { opacity: 0, duration: 200, ease: "power1.inOut", onStart: () => playSound(swoosh) })
        //House zoom
        .to("#House", { y: "10vh", scale:1.2 , duration: 200, ease: "power1.inOut"},"fadein1")
        .to("#fade-to-black", { opacity: 1, duration: 200, ease: "power1.inOut" }, "fadein1")
        .to("#House,#Beanie-sad", { opacity:0, duration: 200, ease: "power1.inOut"})

         //text 3A fades in and out
         .to("#text3A", {  y: "-60vh", opacity: 1, duration: 200,   ease: "power1.inOut", onStart: () => playSound(nobeaniewait) },"text3A")
         .to("#text3A", { duration: 400, ease: "power1.inOut" }, "text3A")
         .to("#text3A", { opacity: 0, duration: 200,   ease: "power1.inOut" },)
         //text 3B fades in and out
         .to("#text3B", { y: "-60vh", opacity: 1, duration: 200,   ease: "power1.inOut", onStart: () => playSound(Hurry) },"text3B")
         .to("#text3B", { duration: 500, ease: "power1.inOut"}, "text3B")
         .to("#text3B", { opacity: 0, duration: 200,   ease: "power1.inOut" },)



        .to("#House", { opacity: 0, duration: 200, ease: "power1.inOut" })
        .to("#Beanie", { opacity: 0, duration: 200, ease: "power1.inOut" },"fadeout1")
        .to("#fade-to-black", { opacity: 0, duration: 200, ease: "power1.inOut" }, "fadeout1"  )

        

// Scene 3 Enter Woods: Pin the image for a short duration
timeline.to("#Tree-Middle, #Tree-Right, #Bush-Right, #Tree-Left, #Bush-Left, #BG", { duration: 200, ease: "power1.inOut", onStart: () => playSound(ToadSinging)})
       //bush shake
        .to("#Bush-Left", { 
            x: "random(-10, 10)", 
            y: "random(-20, 20)",
            duration: 15, 
            repeat: 8, // ⬅️ Adjust based on duration (0.2s * 15 ≈ 3 seconds)
            yoyo: true, 
            ease: "sine.inOut",
            onStart: () => playSound(Rustle)
        })
        .to("#Bush-Left", { duration: 200, ease: "power1.inOut" })

//Move the image off-screen (one after another)
//Definitions: .to (adding to timeline), x = horizontal, y = vertical, scale = size, duration = time, ease = easing effect, "" = label  = delay

// Scene 4: Encounter Raccoon
        .to("#Bush-Left", { x: "-100vw", y: "-10vh", scale: 1.5, duration: 200, ease: "power.inOut" }, "bush1" )
          //text 4A fades in and out
          .to("#text4A", { opacity: 1, duration: 200,   ease: "power1.inOut", onStart: () => playSound(StopSinging)},"bush1")
          .to("#text4A", { duration: 200, ease: "power1.inOut" }, "text4A")
          .to("#text4A", { opacity: 0, duration: 200,   ease: "power1.inOut" },)
          //text 4B fades in and out
          .to("#text4B", { opacity: 1, duration: 200,   ease: "power1.inOut" , onStart: () => playSound(DunkDinner)})
          .to("#text4B", { duration: 200, ease: "power1.inOut" })
          .to("#text4B", { opacity: 0, duration: 200,   ease: "power1.inOut" })

//pinning the scene
.to("#Raccoon", { duration: 200, ease: "power1.inOut" })
//Notebook 1: Raccoon
        .to("#Notebook-Raccoon", { y: "-48vw", scale: 1.5, duration: 60, ease: "power0.out", onStart: () => playSound(Notebook)}, "notebook1" )
        //pinning the notebook
        .to("#Notebook-Raccoon", { duration: 500, ease: "power1.inOut" } )
        .to("#Notebook-Raccoon", { y: "10vw", scale: 1.5, duration: 300, ease: "power1.inOut" }, "notebook2" )
        
          //text 4C fades in and out
          .to("#text4C", { opacity: 1, duration: 200,   ease: "power1.inOut", onStart: () => playSound(HelloRaccoon) },"text4C")
          .to("#text4C", { duration: 200, ease: "power1.inOut" } )
          .to("#text4C", { opacity: 0, duration: 200,   ease: "power1.inOut" })

          //Raccoon jumps
          .to("#Raccoon", { y: "-10vw",  duration: 10, rotation: -10, ease: "power0.out" }, "text4C")
          .to("#Raccoon", { y: "0vw", duration: 10, rotation: 0, ease: "power0.out" })
          //text 4D_1 fades in and out
          .to("#text4D_1", { opacity: 1, duration: 200,   ease: "power1.inOut" })
          .to("#text4D_1", { duration: 200, ease: "power1.inOut" , onStart: () => playSound(justkeepwalking) },"text4D_1")
          //text 4D_2 fades in and out
          .to("#text4D_2", { duration: 200, ease: "power1.inOut"})
          .to("#text4D_2", { opacity: 1, duration: 200,   ease: "power1.inOut" })
          .to("#text4D_2", { scale: 1.2, duration: 200, repeat: 1, yoyo: true, ease: "sine.inOut",transformOrigin: "center center" , onStart: () => playSound(letmeeat)},"text4D_2")

          //Raccoon jumps 2
          .to("#Raccoon", { x: "random(-10, 10)", 
            y: "random(-20, 20)",
            duration: 15, 
            repeat: 8, // ⬅️ Adjust based on duration (0.2s * 15 ≈ 3 seconds)
            yoyo: true, 
            ease: "sine.inOut" },"text4D_2")
          .to("#Raccoon", { y: "0vw", duration: 10, rotation: 0, ease: "power0.out" })
            
          //let me eat in peace
          .to("#text4D_2", { duration: 200, ease: "power1.inOut" })
          //text 4D fades together
          .to("#text4D_2", { opacity: 0, duration: 200,   ease: "power1.inOut" }, "text4Dfadeout")
          .to("#text4D_1", { opacity: 0, duration: 200,   ease: "power1.inOut" }, "text4Dfadeout")

        //things leaves
        .to("#Puddle", { y: "100vw", scale: 1.5, duration: 200, ease: "power1.inOut", onStart: () => playSound(walking)},"move1" )
        .to("#Raccoon", { x: "-100vw", scale: 1.5, duration: 200, ease: "power1.inOut", onStart: () => playSound(walking)},"move1" )
        .to("#Tree-Left", { x: "-100vw", scale: 1.5, duration: 200, ease: "power1.inOut" },"move1" )
        .to("#Bush-Right", { x: "100vw", scale: 1.5, duration: 200, ease: "power1.inOut" }, "move1" )
        .to("#Tree-Right", { x: "150vw", y: "-10vh", scale: 1.5, duration: 200, ease: "power1.inOut" }, "move1" ) //y position change so it goes higher
        .to("#Tree-Middle", { x: "-100vw", scale: 1.5, duration: 200, ease: "power1.inOut" }, "move1" )


    

// Scene 3: Encounter Beanie
// Zoom
    .to("#Bush-Left2", {  scaleX: -1.5, // Ensures the image stays flipped while scaling
    scaleY: 1.5,  // Only scales vertically
    duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Tree-Left2", { scaleX: -1.5, scaleY: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Bush-Right2", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Tree-Right2", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" ) //y position change so it goes higher
        .to("#Tree-Middle2", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Bush-Left3", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Tree-Right3", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Bush-Right3", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Bush-Left4", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        .to("#Beanie-behind", { scale: 1.5, duration: 500, ease: "power1.inOut" }, "move1" )
        
        

// Pinning
    .to("#Bush-Left2, #Tree-Left2, #Bush-Right2, #Tree-Right2, #Tree-Middle", { duration: 200, ease: "power1.inOut" })
    
        
//Move to reveal beanie
        //make the back ones zoom too
        .to("#Bush-Left2,#Bush-Left2b", { x: "2vw", scaleX: -1.5, scaleY: 1.5, duration: 200, ease: "power.inOut", onStart: () => playSound(Win) }, "move2" )
        .to("#Tree-Middle2,#Tree-Middle2b", { x: "-15vw", scale: 1.5, duration: 200, ease: "power1.inOut" }, "move2" )
        .to("#Bush-Left2b", { opacity:1, duration: 200, ease: "power.inOut" }, "switchtoback" )

        
        //text 5A fades in and out
        .to("#text5A", { opacity: 1, duration: 200,   ease: "power1.inOut", onStart: () => playSound(Thereyouare) })
        .to("#text5A", { duration: 200, ease: "power1.inOut" })
        .to("#text5A", { opacity: 0, duration: 200,   ease: "power1.inOut" },)

        

        //text 5B_1 fades in and out
        .to("#text5B_1", { opacity: 1, duration: 200,   ease: "power1.inOut" },"text5B_1")
        .to("#text5B_1", { duration: 400, ease: "power1.inOut", onStart: () => playSound(BigDogBark)})
        //text 5B_2 fades in and out
        .to("#text5B_2", { opacity: 1, duration: 200,   ease: "power1.inOut" },"text5B_1")
        .to("#text5B_2", { duration: 200, ease: "power1.inOut" })
        .to("#text5B_1, #text5B_2", { opacity: 0, duration: 200,   ease: "power1.inOut" },)
        //text5C fades in and out
        .to("#text5C", { opacity: 1, duration: 200,   ease: "power1.inOut" , onStart: () => playSound(CanYouTellMe) })
        .to("#text5C", { duration: 400, ease: "power1.inOut" })
        .to("#text5C", { opacity: 0, duration: 200,   ease: "power1.inOut" },)
        //text5D_1, then text5D_2, then text5D_3 fades in and then all out
        .to("#text5D_1", { opacity: 1, duration: 200,   ease: "power1.inOut" })
        .to("#text5D_1", { duration: 400, ease: "power1.inOut" , onStart: () => playSound(ding1)})
        .to("#text5D_2", { opacity: 1, duration: 200,   ease: "power1.inOut" })
        .to("#text5D_2", { duration: 400, ease: "power1.inOut" , onStart: () => playSound(ding3)})
        .to("#text5D_3", { opacity: 1, duration: 200,   ease: "power1.inOut" })
        .to("#text5D_3", { duration: 400, ease: "power1.inOut" , onStart: () => playSound(ding2)})
        // .to("#text5D_1, #text5D_2, #text5D_3", { opacity: 0, duration: 200,   ease: "power1.inOut" },)
        .to("#quiz-button", { opacity: 1, duration: 200,   ease: "power1.inOut", pointerEvents: "auto", onStart: () => playSound(mystery2) })

// For Scroll Event
function handleScroll() {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
    timeline.progress(scrollPercentage);
  }
  
  // Add event listeners for scroll 
  window.addEventListener("scroll", handleScroll);

 // Define a function to handle the ArrowDown event
function handleArrowKeyDown(event) {
    if (event.key === "ArrowDown") {
      // Calculate the current time of the timeline in seconds
      const currentTime = timeline.time();
      const totalDuration = timeline.duration(); // Get the total duration of the timeline
  
      // Calculate the new time to seek to
      const increment = totalDuration * 0.05; // Move 5% forward on each key press
      let newTime = currentTime + increment;
  
      // Prevent going beyond the total duration
      if (newTime > totalDuration) {
        newTime = totalDuration;
      }
  
      // Use the seek method to move the timeline to the new position
      timeline.seek(newTime);
    }
  }
  
  // Add event listener for the keydown event
  window.addEventListener("keydown", handleArrowKeyDown);
  





//QUIZ
    document.addEventListener("DOMContentLoaded", function () {
        let quizButton = document.getElementById("quiz-button");
    
        if (quizButton) {
            quizButton.addEventListener("click", function () {
                window.location.href = "quiz.html"; // Redirects to index.html
            });
        }
    });

//scroll down! pulses   
// document.addEventListener("DOMContentLoaded", function () {
    
    // // Page Load Animation
    // gsap.to("#scroll", {
    //     opacity: 1,
    //     duration: 200,
    //     repeat: 16,
    //     yoyo: true,
    //     ease: "power1.inOut",
    //     onComplete: function() {
    //         // Once the animation is done, set the opacity to 0
    //         gsap.to("#scroll", {
    //             opacity: 0,
    //             duration: 0.5  // This will fade it out smoothly
    //         });}
    // });
    
// Create a GSAP timeline
// const pawTimeline = gsap.timeline({ ease: "power1.inOut" });

// Loop through each paw and add a fade-in animation to the timeline
// for (let i = 1; i <= 18; i++) {
//   pawTimeline.from(`#paw${i}`, {
//     opacity: 0,
//     duration: 200
//   });
// }

    
// });


// Create a ScrollMagic scene this puts evertyhing together, triggers the animation when the scroll
// reaches the .container
var scene = new ScrollMagic.Scene({
    triggerElement: ".container", // Start when container enters viewport
    duration: "150%", // Total scroll distance before image fully moves
    triggerHook: 0, // Start effect at middle of viewport
    // reverse: true // resets when you scroll up (uneccessary)
})
.setPin(".container") // Pin the image for a moment
.setTween(timeline) // Attach the GSAP animation
// .addIndicators() // Uncomment to debug (shows scroll markers)
.addTo(controller);



let scrollSpeed = 0.005; // Lower = slower scroll speed
let targetScroll = window.scrollY;
let currentScroll = window.scrollY;
let isAnimating = false;

// Handle smooth scrolling when using mouse wheel or trackpad
window.addEventListener("wheel", (e) => {
    e.preventDefault(); // Prevent default abrupt scrolling
    targetScroll += e.deltaY * scrollSpeed * 10; // Adjust multiplier for speed
    if (!isAnimating) {
        smoothScroll();
    }
}, { passive: false });

// Smooth scrolling function
function smoothScroll() {
    isAnimating = true;
    currentScroll += (targetScroll - currentScroll) * 0.1; // Easing effect
    window.scrollTo(0, currentScroll);

    if (Math.abs(targetScroll - currentScroll) > 0.5) {
        requestAnimationFrame(smoothScroll);
    } else {
        isAnimating = false;
    }
}

// Allow normal scrollbar dragging
window.addEventListener("scroll", () => {
    if (!isAnimating) {
        targetScroll = window.scrollY;
        currentScroll = window.scrollY;
    }
});




//Make the window load faster so there is no delay when beginning scrolling
window.onload = function (){
    controller.update(true);
};




