// js/navigation.js
document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.getElementById('chapter-nav-container-main');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-main) not found in HTML.");
        return;
    }

    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length < 2) { // Expect at least /folder/file.html
        navContainer.style.display = 'none';
        console.warn("Path does not have enough segments to determine folder and file for navigation. Nav will not be displayed.");
        return;
    }

    const currentPageFilename = pathSegments[pathSegments.length - 1];
    const currentUrlFolder = pathSegments[pathSegments.length - 2]; // Folder from the current URL

    const chosenPathKey = 'visualNovelChosenPath';
    const chosenPath = localStorage.getItem(chosenPathKey); // e.g., 'splitcraniectomy' or 'cranialvaultadvanced'

    // IMPORTANT: Ensure chapterDefinitions adhere to the assumptions mentioned above.
    // `file` properties should be filenames only.
    // Example structure (your actual filenames might differ):
    const chapterDefinitions = [
        { id: 1, name: "Welcome", file: "chapter1.html" }, // Implicitly in "nonjourney"
        {
            id: 2, name: "Intro", file: "chapter2.html", hasPopup: true, // Implicitly in "nonjourney"
            popup: [
                { name: "Pronunciation", file: "chapter2#page0" },
                { name: "Video: Craniosynostosis", file: "popup_video.html" },
                { name: "Types", file: "popup_types.html" },
                { name: "Surgical options", file: "popup_surgery_options.html" }
            ]
        },
        { id: 3, name: "Pre-Op", file: "chapter3.html" }, // Path-specific
        { id: 4, name: "Surgery", file: "chapter4.html" }, // Path-specific
        {
            id: 5, name: "Post-Op", file: "chapter5.html", hasPopup: true, // Path-specific
            popup: [
                { name: "Timeline", file: "popup_timeline.html" },
                { name: "Benefit vs Risks", file: "popup_benefits.html" },
            ]
        },
        { id: 6, name: "End", file: "chapter6.html" } // Path-specific
    ];

    // Determine the effective folder context of the current page
    let currentContextualFolder = 'nonjourney'; // Default to nonjourney
    if (chosenPath && currentUrlFolder === chosenPath) {
        currentContextualFolder = chosenPath;
    } else if (currentUrlFolder !== 'nonjourney' && chosenPath && currentUrlFolder !== chosenPath) {
        // If chosenPath is set, but currentUrlFolder is neither 'nonjourney' nor the chosenPath,
        // this might be an unexpected state or a generic page not tied to these contexts.
        // For active state logic, it's safer to assume it's not in a defined nav context.
        console.warn(`Current URL folder "${currentUrlFolder}" does not match chosenPath "${chosenPath}" or "nonjourney". Navigation active states might be affected.`);
        currentContextualFolder = currentUrlFolder; // Or set to null if strict matching is required
    } else {
         currentContextualFolder = currentUrlFolder; // Could be 'nonjourney' or other if no chosenPath
    }


    // Determine the ID of the chapter the user is currently viewing
    let viewerChapterId = null;
    for (const chapterDef of chapterDefinitions) {
        const isPathSpecificChapter = chapterDef.id >= 3;
        // Determine the folder this chapter definition would reside in
        let chapterDefExpectedFolder = isPathSpecificChapter ? chosenPath : 'nonjourney';

        if (isPathSpecificChapter && !chosenPath) {
            // If no path is chosen, path-specific chapters don't have a determined folder yet.
            chapterDefExpectedFolder = null;
        }

        if (chapterDef.file === currentPageFilename && chapterDefExpectedFolder && chapterDefExpectedFolder === currentContextualFolder) {
            viewerChapterId = chapterDef.id;
            break;
        }
        if (chapterDef.popup) {
            for (const subItem of chapterDef.popup) {
                if (subItem.file === currentPageFilename && chapterDefExpectedFolder && chapterDefExpectedFolder === currentContextualFolder) {
                    viewerChapterId = chapterDef.id;
                    break;
                }
            }
        }
        if (viewerChapterId) break;
    }

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        const isTargetChapterPathSpecific = chapter.id >= 3;
        let targetLinkFolder; // The folder name used to construct the link path

        if (isTargetChapterPathSpecific) {
            if (chosenPath) {
                targetLinkFolder = chosenPath;
            } else {
                // Do not render nav items for chapters 3+ if no path has been chosen.
                // The modal will be triggered by links on earlier pages that *point* to these chapters.
                return;
            }
        } else { // Chapters 1, 2 are common
            targetLinkFolder = 'nonjourney';
        }

        // `chapter.file` is assumed to be just the filename.
        // `targetChapterFileForModal` will be this filename, used by the modal to redirect correctly.
        const targetChapterFileForModal = chapter.file || 
                                       (chapter.popup && chapter.popup[0] ? chapter.popup[0].file : 
                                       (isTargetChapterPathSpecific ? `chapter${chapter.id}.html` : 'chapter1.html'));


        let chapterLinkPath = "";
        if (chapter.file) {
            chapterLinkPath = `../${targetLinkFolder}/${chapter.file}`;
        } else if (chapter.hasPopup) { // Main chapter is a non-clickable header for a popup menu
            chapterLinkPath = "javascript:void(0);";
        } else {
            return; // Skip if chapter has no file and no popup items
        }

        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }

        const a = document.createElement('a');
        a.textContent = chapter.name;

        // Modal trigger logic:
        // If on an early chapter (1 or 2, or not on a recognized chapter page) AND
        // the link is for a future path-specific chapter (3+) AND
        // no path has been chosen yet.
        const onEarlyChapterOrNonChapterPage = (viewerChapterId === null || viewerChapterId === 1 || viewerChapterId === 2);

        if (onEarlyChapterOrNonChapterPage && isTargetChapterPathSpecific && !chosenPath) {
            a.href = "javascript:void(0);";
            a.addEventListener('click', (e) => {
                e.preventDefault();
                // Pass the actual target filename for the chapter to the modal
                displayPathSelectionModalInNav(targetChapterFileForModal);
            });
        } else {
            a.href = chapterLinkPath;
        }
        
        if (chapter.hasPopup) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; // Upwards triangle
            if (onEarlyChapterOrNonChapterPage && isTargetChapterPathSpecific && !chosenPath) {
                iconSpan.style.display = 'none'; // Hide icon if link is intercepted by modal
            }
            a.appendChild(iconSpan);
        }

        // Active state for main chapter link
        if (chapter.file && chapter.file === currentPageFilename && targetLinkFolder === currentContextualFolder) {
            a.classList.add('active');
        }
        li.appendChild(a);

        if (chapter.hasPopup && chapter.popup && chapter.popup.length > 0) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            let parentIsActiveFromSub = false;

            chapter.popup.forEach(subItem => {
                // Popups use the same folder context as their parent chapter's link
                const subItemTargetFolder = targetLinkFolder; 
                const subItemFileForModal = subItem.file;

                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;

                if (onEarlyChapterOrNonChapterPage && isTargetChapterPathSpecific && !chosenPath) {
                    subA.href = "javascript:void(0);";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItemFileForModal);
                    });
                } else {
                    if (!subItemTargetFolder) {
                         console.warn("Sub-item cannot determine target folder:", subItem.name, "Parent Chapter ID:", chapter.id);
                         subA.href = "javascript:void(0);"; // Should not happen if parent is valid
                    } else {
                        subA.href = `../${subItemTargetFolder}/${subItem.file}`;
                    }
                }

                if (subItem.file === currentPageFilename && subItemTargetFolder === currentContextualFolder) {
                    subA.classList.add('active-sub-item');
                    parentIsActiveFromSub = true;
                }
                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });
            li.appendChild(popupUl);
            if (parentIsActiveFromSub) {
                a.classList.add('active-parent'); // Style for parent if a sub-item is active
            }
        }
        ul.appendChild(li);
    });

    navElement.appendChild(ul);
    navContainer.innerHTML = ''; 
    navContainer.appendChild(navElement);

    // Event listeners for popups (hover logic)
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        const mainLink = popupLi.querySelector('a'); // Get the main link
        const popupMenu = popupLi.querySelector('.popup-menu');
        let closeTimer = null; 

        // Only attach hover listeners if it's a real link and has a popup menu
        if (mainLink && mainLink.getAttribute('href') !== "javascript:void(0);" && popupMenu) {
            const openMenuByLink = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                popupLi.classList.add('popup-open');
            };
            const hideMenu = () => {
                popupLi.classList.remove('popup-open');
            };
            const startHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); } // Clear existing timer before starting a new one
                closeTimer = setTimeout(hideMenu, 250); 
            };
            const cancelHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            };

            mainLink.addEventListener('mouseenter', openMenuByLink);
            mainLink.addEventListener('mouseleave', startHideTimer);
            popupMenu.addEventListener('mouseenter', cancelHideTimer);
            popupMenu.addEventListener('mouseleave', startHideTimer);
        }
    });

    // Apply body class for theming
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, '');
    const currentChapterDefForTheme = chapterDefinitions.find(c => c.id === viewerChapterId);

    if (chosenPath && currentChapterDefForTheme && currentChapterDefForTheme.id >= 3) {
        document.body.classList.add(`path-${chosenPath}`);
    } else if (currentContextualFolder === 'nonjourney' && (currentChapterDefForTheme && currentChapterDefForTheme.id <=2 || viewerChapterId === null)) {
         // If in 'nonjourney' folder context (either matched to ch1/2 or no specific chapter match but URL is nonjourney)
        document.body.classList.add('journey-nonjourney');
    } else if (chosenPath && currentContextualFolder === chosenPath) {
        // Fallback if current page is in a chosen path folder but not specifically matched to a chapter
        document.body.classList.add(`path-${chosenPath}`);
    }
});


// --- Function to display the path selection modal ---
function displayPathSelectionModalInNav(targetChapterFileOnClick) {
    if (document.getElementById('pathChoiceOverlay')) {
        const existingOverlay = document.getElementById('pathChoiceOverlay');
        existingOverlay.dataset.targetFile = targetChapterFileOnClick; // Update target file
        requestAnimationFrame(() => existingOverlay.classList.add('visible'));
        return;
    }

    const choiceContainer = document.createElement('div');
    choiceContainer.id = 'pathChoiceOverlay';
    choiceContainer.className = 'path-choice-overlay'; 
    choiceContainer.dataset.targetFile = targetChapterFileOnClick; 

    // These IDs will be used as folder names and stored in localStorage
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

    const handlePathSelection = (selectedPathId) => {
        localStorage.setItem('visualNovelChosenPath', selectedPathId);
        let targetFile = document.getElementById('pathChoiceOverlay').dataset.targetFile || `chapter3.html`; // Default to chapter3.html
        
        // Ensure targetFile is just a filename, not a path
        const finalTargetFile = targetFile.split('/').pop(); 

        window.location.href = `../${selectedPathId}/${finalTargetFile}#page0`; // Assumes #page0 is desired
        removeModal();
    };

    document.getElementById('navModalSelectSplit').addEventListener('click', () => handlePathSelection(PATH_SPLIT_CRANIECTOMY_MODAL.id));
    document.getElementById('navModalSelectCV').addEventListener('click', () => handlePathSelection(PATH_CRANIAL_VAULT_ADVANCED_MODAL.id));
    document.getElementById('navModalCancelPathChoice').addEventListener('click', removeModal);

    function removeModal() {
        const overlay = document.getElementById('pathChoiceOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                if (overlay && overlay.parentElement) {
                    overlay.parentElement.removeChild(overlay);
                }
            }, 300); // Match CSS transition duration
        }
    }
}