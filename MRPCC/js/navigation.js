// js/navigation.js
document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.getElementById('chapter-nav-container');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container) not found in HTML.");
        return;
    }

    const path = window.location.pathname;
    // console.log("Current window.location.pathname:", path);

    const pathSegments = path.split('/').filter(Boolean);
    // console.log("Path segments:", pathSegments);

    if (pathSegments.length < 2) {
        // console.warn("Not enough path segments for a chapter page. Path segments found:", pathSegments.length);
        navContainer.style.display = 'none';
        return;
    }

    const currentPageFilename = pathSegments[pathSegments.length - 1];
    const currentFolder = pathSegments[pathSegments.length - 2];
    
    // console.log("Detected currentPageFilename:", currentPageFilename);
    // console.log("Detected currentFolder:", currentFolder);

    // currentChapterNumber might not be directly used if matching by filename, but can be for ordering
    let currentChapterNumber = NaN; 
    const filenameMatch = currentPageFilename.match(/^chapter(\d+)\.html$/);
    if (filenameMatch && filenameMatch[1]) {
        currentChapterNumber = parseInt(filenameMatch[1]);
    }
    // console.log("Detected currentChapterNumber (if applicable):", currentChapterNumber);


    const chosenPathKey = 'visualNovelChosenPath';
    const chosenPath = localStorage.getItem(chosenPathKey);
    // console.log("localStorage chosenPath:", chosenPath);

    const chapterDefinitions = [
        { name: "Welcome", file: "chapter1.html", type: "dual" }, // Use 'file' as a unique ID for active state if IDs are not numeric
        {
            name: "Intro", file: "chapter2.html", type: "dual", hasPopup: true,
            popup: [
                { name: "Pronunciation", file: "intro_pronunciation.html" },
                { name: "Animation", file: "intro_animation.html" },
                { name: "Types", file: "intro_types.html" },
                { name: "Surgical options", file: "intro_surgical.html" }
            ]
        },
        { name: "Pre-Op", file: "preop.html", type: "dual" },
        { name: "Surgery", file: "surgery.html", type: "dual" }, // Ensure this file will exist
        {
            name: "Post-Op", file: "postop_main.html", type: "dual", hasPopup: true,
            popup: [
                { name: "Timeline", file: "timeline.html" },
                { name: "BenefitsvsRisks", file: "benefits_vs_risks.html" },
            ]
        },
        { name: "End", file: "end.html", type: "dual" } // Ensure this file will exist
    ];

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        // Skip pathSpecific chapters if no chosenPath (relevant for later phases)
        if (chapter.type === "pathSpecific" && !chosenPath) {
            // console.log(`Skipping pathSpecific chapter '${chapter.name}' because chosenPath is not set.`);
            return;
        }

        let chapterLinkPath = "";
        let linkFolderForContext = ""; // Folder context for constructing relative links

        if (chapter.type === "dual") {
            if (currentFolder === 'endoscopic' || currentFolder === 'cranialvault') {
                linkFolderForContext = currentFolder;
            } else {
                // Fallback if current folder is not one of the primary dual paths (e.g. if on a non-chapter page somehow)
                // This case should ideally be caught earlier by checks on pathSegments.length or currentPageFilename
                console.warn(`Unexpected currentFolder ('${currentFolder}') for dual chapter type. Defaulting to 'endoscopic'.`);
                linkFolderForContext = 'endoscopic';
            }
        } else if (chapter.type === "pathSpecific" && chosenPath) {
            linkFolderForContext = chosenPath;
        } else {
            // Should not happen if previous check for pathSpecific & !chosenPath works
            console.warn(`Could not determine linkFolderForContext for chapter '${chapter.name}'. Skipping.`);
            return;
        }
        
        // Construct the main link path
        if (chapter.file) { // If 'file' is defined, it's a navigable link
            chapterLinkPath = `../${linkFolderForContext}/${chapter.file}`;
        } else if (chapter.hasPopup) { // If no 'file' but hasPopup, it only opens menu
            chapterLinkPath = "javascript:void(0);";
        } else {
            console.warn(`Chapter '${chapter.name}' has no file and no popup. Skipping.`);
            return;
        }

        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }

        const a = document.createElement('a');
        a.textContent = chapter.name;
        a.href = chapterLinkPath;

        // Active state for main link
        if (chapter.file && currentPageFilename === chapter.file && currentFolder === linkFolderForContext) {
            a.classList.add('active');
        }
        
        if (chapter.hasPopup) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; // Upward triangle (▲) or use &#9660; (▼) for downward initially
            a.appendChild(iconSpan);
        }

        li.appendChild(a);

        // Create popup menu if defined
        if (chapter.hasPopup && chapter.popup && chapter.popup.length > 0) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            let parentLinkIsActiveDueToSubItem = false;

            chapter.popup.forEach(subItem => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;
                subA.href = `../${linkFolderForContext}/${subItem.file}`;
                
                if (currentPageFilename === subItem.file && currentFolder === linkFolderForContext) {
                    subA.classList.add('active-sub-item');
                    parentLinkIsActiveDueToSubItem = true; // Mark parent for styling
                }
                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });
            li.appendChild(popupUl);

            if (parentLinkIsActiveDueToSubItem) {
                a.classList.add('active-parent'); // Style parent if a sub-item is active
            }
        }
        ul.appendChild(li);
    });

    navElement.appendChild(ul);
    navContainer.innerHTML = ''; 
    navContainer.appendChild(navElement);

 // Event listeners for popups (hover to open/close)
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        // Ensure there's actually a popup menu to show/hide
        const popupMenu = popupLi.querySelector('.popup-menu');
        if (!popupMenu) return;

        popupLi.addEventListener('mouseenter', function() {
            // Optional: Close any other popups that might have been opened by a click (if mixing event types, not needed for pure hover)
            // document.querySelectorAll('.has-popup.popup-open').forEach(otherOpenPopup => {
            //     if (otherOpenPopup !== this) {
            //         otherOpenPopup.classList.remove('popup-open');
            //     }
            // });
            this.classList.add('popup-open');
        });

        popupLi.addEventListener('mouseleave', function() {
            this.classList.remove('popup-open');
        });

        // Keep main link clickable for navigation
        // The main 'a' tag within 'li.has-popup' will still navigate on click.
        // The hover just reveals the sub-menu.
    });

    // Apply body class for path-specific/journey-specific styling
    document.body.className = document.body.className.replace(/\bpath-[a-zA-Z0-9_-]+\b/g, '');
    document.body.className = document.body.className.replace(/\bjourney-[a-zA-Z0-9_-]+\b/g, '');

    if (chapter.type === "pathSpecific" && chosenPath) { // Check if current page context is pathSpecific
         document.body.classList.add(`path-${chosenPath}`);
    } else if (currentFolder === 'endoscopic' || currentFolder === 'cranialvault') { // For dual paths
        document.body.classList.add(`journey-${currentFolder}`);
    }
});