const pages = [
    { 
        img: "../img/images/Non journey/Ch 2 a.png",
        showButton: false ,
        showTextBox: true,
        text: "Most parents have...."
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
  
  const backgroundImg = document.getElementById("backgroundImg");
  const infoButton = document.getElementById("infoButton");
  const lightbox = document.getElementById("lightbox");
  
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

  // Highlight current progress dot
  const dots = document.querySelectorAll(".progress-dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentPage);
  });

    // 🧩 Always store current page in the hash
    window.location.hash = "#page" + currentPage;
  }  
  
  function nextPage() {
    if (currentPage < pages.length - 1) {
      currentPage++;
      renderPage();
    } else {
      // Go to next chapter
      window.location.href = "chapter2.html";
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
  