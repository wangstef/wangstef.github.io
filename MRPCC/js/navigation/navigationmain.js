// js/navigation.js
document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.getElementById('chapter-nav-container-main');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-main) not found in HTML.");
        return;
    }

    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length < 2) {
        navContainer.style.display = 'none';
        return;
    }

    const currentPageFilename = pathSegments[pathSegments.length - 1];
    const currentFolder = pathSegments[pathSegments.length - 2];
    
    const chosenPathKey = 'visualNovelChosenPath';
    const chosenPath = localStorage.getItem(chosenPathKey);

    // Chapter Definitions (IDs are important for this logic)
    const chapterDefinitions = [
        { id: 1, name: "Welcome", file: "welcome.html", type: "dual" },
        {
            id: 2, name: "Intro", file: "intro_main.html", type: "dual", hasPopup: true,
            popup: [
                { name: "Pronunciation", file: "intro_pronunciation.html" },
                { name: "Animation", file: "intro_animation.html" },
                { name: "Types", file: "intro_types.html" },
                { name: "Surgical options", file: "intro_surgical.html" }
            ]
        },
        { id: 3, name: "Pre-Op", file: "preop.html", type: "dual" }, // These will effectively become pathSpecific after choice
        { id: 4, name: "Surgery", file: "surgery.html", type: "dual" },
        {
            id: 5, name: "Post-Op", file: "postop_main.html", type: "dual", hasPopup: true,
            popup: [
                { name: "Hospital Recovery", file: "postop_hospital.html" },
                { name: "Home Care", file: "postop_homecare.html" },
            ]
        },
        { id: 6, name: "End", file: "end.html", type: "dual" }
    ];

    // Determine the ID of the chapter the user is currently viewing
    let viewerChapterId = null;
    // Determine the effective folder for the current page (takes chosenPath into account)
    let currentEffectiveFolder = chosenPath;
    if (!chosenPath || !path.includes(`/${chosenPath}/`)) { // If no chosenPath or current URL doesn't reflect it
        if (path.includes(`/${currentFolder}/`)) {
            currentEffectiveFolder = currentFolder;
        }
    }
    
    for (const chapterDef of chapterDefinitions) {
        let chapterDefFolderContext = '';
        if (chapterDef.type === "pathSpecific" && chosenPath) {
            chapterDefFolderContext = chosenPath;
        } else if (chapterDef.type === "dual") {
            // For dual types, context is determined by where its files live (e.g., 'endoscopic' or 'cranialvault')
            // We need to check if currentEffectiveFolder matches one of these for dual types
            chapterDefFolderContext = currentEffectiveFolder; // Simplification: assume current folder is relevant for dual type check
        }


        if (chapterDef.file === currentPageFilename && chapterDefFolderContext === currentEffectiveFolder) {
            viewerChapterId = chapterDef.id;
            break;
        }
        if (chapterDef.popup) {
            for (const subItem of chapterDef.popup) {
                if (subItem.file === currentPageFilename && chapterDefFolderContext === currentEffectiveFolder) {
                    viewerChapterId = chapterDef.id; // Use parent chapter's ID for context
                    break;
                }
            }
        }
        if (viewerChapterId) break;
    }
    // console.log("User is currently viewing content related to Chapter ID:", viewerChapterId);

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        let chapterLinkPath = "";
        let linkFolderForContext = ""; // Folder context for the link being created

        if (chapter.type === "pathSpecific" && chosenPath) {
            linkFolderForContext = chosenPath;
        } else if (chapter.type === "dual") {
            // For dual chapters, links point to the version in the *current* journey (pre-choice)
            // or the *chosen* path if that path reuses "dual" type chapters post-choice.
            linkFolderForContext = chosenPath || currentFolder; // Default to currentFolder if no chosenPath
            if (linkFolderForContext !== 'endoscopic' && linkFolderForContext !== 'cranialvault' && !chosenPath) {
                 linkFolderForContext = 'endoscopic'; // Ensure a valid default for pre-choice dual links
            }
        } else {
             // If type is not dual and no chosenPath for pathSpecific, this chapter might not be shown yet
            if (!chosenPath && chapter.id >=3) return; // Don't show Ch3+ if no path chosen
            linkFolderForContext = currentFolder; // Fallback
        }

        if (chapter.file) {
            chapterLinkPath = `../${linkFolderForContext}/${chapter.file}`;
        } else if (chapter.hasPopup) {
            chapterLinkPath = "javascript:void(0);";
        } else {
            return; // Skip if no file and no popup
        }

        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }

        const a = document.createElement('a');
        a.textContent = chapter.name;

        const targetChapterId = chapter.id;
        const isEarlyChapterView = (viewerChapterId === 1 || viewerChapterId === 2);
        const isFutureChapterLink = (targetChapterId >= 3); // Pre-Op, Surgery, Post-Op, End

        if (isEarlyChapterView && isFutureChapterLink && !chosenPath) {
            a.href = "javascript:void(0);";
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPathSelectionModalInNav(chapter.file || (chapter.popup && chapter.popup[0] ? chapter.popup[0].file : 'chapter3.html')); // Pass target file
            });
            if (chapter.hasPopup && a.querySelector('.popup-icon')) { // Hide default popup icon if intercepted
                 // Icon is added later, so we might need to adjust this
            }
        } else {
            a.href = chapterLinkPath;
        }
        
        if (chapter.hasPopup) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; 
            if (isEarlyChapterView && isFutureChapterLink && !chosenPath) {
                iconSpan.style.display = 'none'; // Hide icon if link is intercepted
            }
            a.appendChild(iconSpan);
        }

        // Active state
        if (chapter.file && currentPageFilename === chapter.file && currentEffectiveFolder === linkFolderForContext) {
            a.classList.add('active');
        }

        li.appendChild(a);

        if (chapter.hasPopup && chapter.popup.length > 0) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            let parentIsActiveFromSub = false;

            chapter.popup.forEach(subItem => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;

                if (isEarlyChapterView && isFutureChapterLink && !chosenPath) { // Parent chapter (e.g. Post-Op) is a future link
                    subA.href = "javascript:void(0);";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItem.file); // Pass sub-item's target file
                    });
                } else {
                    subA.href = `../${linkFolderForContext}/${subItem.file}`;
                }

                if (subItem.file === currentPageFilename && currentEffectiveFolder === linkFolderForContext) {
                    subA.classList.add('active-sub-item');
                    parentIsActiveFromSub = true;
                }
                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });
            li.appendChild(popupUl);
            if (parentIsActiveFromSub) {
                a.classList.add('active-parent');
            }
        }
        ul.appendChild(li);
    });

 navElement.appendChild(ul);
    navContainer.innerHTML = ''; 
    navContainer.appendChild(navElement);

    // MODIFIED Event listeners for popups: Trigger on main link hover
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        // Find the main link within this LI, EXCLUDING links that are for modal triggers
        const mainLink = popupLi.querySelector('a:not([href="javascript:void(0);"])');
        const popupMenu = popupLi.querySelector('.popup-menu');

        if (mainLink && popupMenu) { // Ensure both the link and its popup menu exist
            mainLink.addEventListener('mouseenter', function() {
                // 'this' is the mainLink (<a>)
                // Add 'popup-open' to the parent <li> (popupLi) to show the menu
                popupLi.classList.add('popup-open');
            });

            // The mouseleave event should be on the <li> (popupLi)
            // This allows the mouse to move from the link into the opened popup menu
            // without the menu immediately closing.
            popupLi.addEventListener('mouseleave', function() {
                // 'this' is the popupLi (<li>)
                this.classList.remove('popup-open');
            });
        }
    });
    // Apply body class for theming
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');
    if (chosenPath && viewerChapterId && chapterDefinitions.find(c=>c.id === viewerChapterId && (c.type === "pathSpecific" || c.id >=3) )) {
        document.body.classList.add(`path-${chosenPath}`);
    } else if (currentFolder === 'endoscopic' || currentFolder === 'cranialvault') {
        document.body.classList.add(`journey-${currentFolder}`);
    }
});


// --- Function to display the path selection modal (Must be in this script) ---
function displayPathSelectionModalInNav(targetChapterFileOnClick) {
    if (document.getElementById('pathChoiceOverlay')) {
        // If it exists, just make sure it's visible
        const existingOverlay = document.getElementById('pathChoiceOverlay');
        // Update its internal state if necessary, e.g., the target file
        existingOverlay.dataset.targetFile = targetChapterFileOnClick;
        requestAnimationFrame(() => existingOverlay.classList.add('visible'));
        return;
    }

    const choiceContainer = document.createElement('div');
    choiceContainer.id = 'pathChoiceOverlay';
    choiceContainer.className = 'path-choice-overlay'; // Uses styles from styles.css
    choiceContainer.dataset.targetFile = targetChapterFileOnClick; // Store the intended target

    const PATH_SPLIT_CRANIECTOMY_MODAL = {
        id: 'splitcraniectomy',
        displayText: 'Split Craniectomy Path'
    };
    const PATH_CRANIAL_VAULT_ADVANCED_MODAL = {
        id: 'cranialvaultadvanced',
        displayText: 'Advanced Cranial Vault Path'
    };

    choiceContainer.innerHTML = `
        <div class="path-choice-content">
            <h2>Choose Your Path</h2>
            <p>To explore this section, please first select which surgical approach you'd like to follow for the upcoming chapters.</p>
            <div class="path-choice-actions">
                <button id="navModalSelectSplit" class="path-choice-button">${PATH_SPLIT_CRANIECTOMY_MODAL.displayText}</button>
                <button id="navModalSelectCV" class="path-choice-button">${PATH_CRANIAL_VAULT_ADVANCED_MODAL.displayText}</button>
            </div>
            <button id="navModalCancelPathChoice" class="path-choice-button" style="background-color: #7f8c8d; margin-top: 15px;">Cancel</button>
        </div>
    `;
    document.body.appendChild(choiceContainer);
    requestAnimationFrame(() => choiceContainer.classList.add('visible'));

    document.getElementById('navModalSelectSplit').addEventListener('click', function() {
        localStorage.setItem('visualNovelChosenPath', PATH_SPLIT_CRANIECTOMY_MODAL.id);
        const targetFile = document.getElementById('pathChoiceOverlay').dataset.targetFile || 'chapter3.html';
        window.location.href = `../${PATH_SPLIT_CRANIECTOMY_MODAL.id}/${targetFile}#page0`;
        removeModal();
    });

    document.getElementById('navModalSelectCV').addEventListener('click', function() {
        localStorage.setItem('visualNovelChosenPath', PATH_CRANIAL_VAULT_ADVANCED_MODAL.id);
        const targetFile = document.getElementById('pathChoiceOverlay').dataset.targetFile || 'chapter3.html';
        window.location.href = `../${PATH_CRANIAL_VAULT_ADVANCED_MODAL.id}/${targetFile}#page0`;
        removeModal();
    });

    document.getElementById('navModalCancelPathChoice').addEventListener('click', function() {
        removeModal();
    });

    function removeModal() {
        const overlay = document.getElementById('pathChoiceOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            // Optional: remove the element from DOM after transition for cleanliness
            setTimeout(() => {
                if (overlay && overlay.parentElement) {
                    overlay.parentElement.removeChild(overlay);
                }
            }, 300); // Match CSS transition duration
        }
    }
}