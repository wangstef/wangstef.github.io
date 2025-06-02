// js/navigation.js (adapted for "endoscopic" default)
document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.getElementById('chapter-nav-container-endo');
    if (!navContainer) {
        console.error("Chapter navigation container (#chapter-nav-container-endo) not found in HTML.");
        return;
    }

    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);

    if (pathSegments.length < 2) { // Expect at least /folder/file.html
        navContainer.style.display = 'none';
        console.warn("Path does not have enough segments to determine folder and file. Nav will not be displayed.");
        return;
    }

    const currentPageFilename = pathSegments[pathSegments.length - 1];
    const currentUrlFolder = pathSegments[pathSegments.length - 2]; // Folder from the current URL

    const chosenPathKey = 'visualNovelChosenPath';
    const chosenPath = localStorage.getItem(chosenPathKey); // e.g., 'splitcraniectomy' or 'cranialvaultadvanced'

    // Helper function to determine the expected folder for a chapter
    function getExpectedFolderForChapter(chapterId, currentChosenPathOverride) {
        if (chapterId <= 2) {
            return 'nonjourney';
        } else { // chapterId >= 3
            // Use currentChosenPathOverride if provided (e.g. from localStorage), otherwise default to 'endoscopic'
            return currentChosenPathOverride || 'endoscopic';
        }
    }

    // IMPORTANT: Ensure chapterDefinitions use filenames only for 'file' properties.
    // Example (ensure your filenames match your actual files):
    const chapterDefinitions = [
        { id: 1, name: "Welcome", file: "chapter1.html" },
        {
            id: 2, name: "Intro", file: "chapter2.html", hasPopup: true,
            popup: [
                { name: "Pronunciation", file: "popup_pronunciation.html" },
                { name: "Video: Craniosynostosis", file: "popup_video.html" },
                { name: "Types", file: "popup_types.html" },
                { name: "Surgical options", file: "popup_surgery_options.html" }
            ]
        },
        { id: 3, name: "Pre-Op", file: "chapter3.html" },
        { id: 4, name: "Surgery", file: "chapter4.html" },
        {
            id: 5, name: "Post-Op", file: "chapter5.html", hasPopup: true,
            popup: [
                { name: "Timeline", file: "popup_timeline.html" },
                { name: "Benefit vs Risks", file: "popup_benefits.html" },
            ]
        },
        { id: 6, name: "End", file: "chapter6.html" }
    ];

    // Determine the ID of the chapter the user is currently viewing
    let viewerChapterId = null;
    for (const chapterDef of chapterDefinitions) {
        const chapterDefExpectedFolder = getExpectedFolderForChapter(chapterDef.id, chosenPath);

        if (chapterDef.file === currentPageFilename && chapterDefExpectedFolder === currentUrlFolder) {
            viewerChapterId = chapterDef.id;
            break;
        }
        if (chapterDef.popup) {
            for (const subItem of chapterDef.popup) {
                if (subItem.file === currentPageFilename && chapterDefExpectedFolder === currentUrlFolder) {
                    viewerChapterId = chapterDef.id; // Use parent chapter's ID
                    break;
                }
            }
        }
        if (viewerChapterId) break;
    }
    // console.log("Current URL Folder:", currentUrlFolder, "Chosen Path:", chosenPath, "Viewer Chapter ID:", viewerChapterId);

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        const targetChapterId = chapter.id;
        // Determine the folder this link should point to or represent contextually
        const targetLinkExpectedFolder = getExpectedFolderForChapter(targetChapterId, chosenPath);

        const isTargetChapterPathSpecific = targetChapterId >= 3;

        // Filename for modal targeting (ensure it's just the filename)
        const targetChapterFileForModal = (chapter.file || (chapter.popup && chapter.popup[0] ? chapter.popup[0].file : `chapter${targetChapterId}.html`)).split('/').pop();

        let chapterLinkPath = "";
        if (chapter.file) {
            chapterLinkPath = `../${targetLinkExpectedFolder}/${chapter.file}`;
        } else if (chapter.hasPopup) {
            chapterLinkPath = "javascript:void(0);";
        } else {
            return; // Skip if no file and no popup items
        }

        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }

        const a = document.createElement('a');
        a.textContent = chapter.name;

        const onEarlyChapterForNav = (viewerChapterId === null || viewerChapterId === 1 || viewerChapterId === 2);

        // Modal trigger logic:
        // If on an early chapter (1 or 2, or not on a recognized chapter page) AND
        // the link is for a future path-specific chapter (3+) AND
        // no specific path (like 'splitcraniectomy') has been chosen yet.
        if (onEarlyChapterForNav && isTargetChapterPathSpecific && !chosenPath) {
            a.href = "javascript:void(0);";
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPathSelectionModalInNav(targetChapterFileForModal);
            });
        } else {
            a.href = chapterLinkPath;
        }
        
        if (chapter.hasPopup) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = " &#9650;"; // Upwards triangle
            if (onEarlyChapterForNav && isTargetChapterPathSpecific && !chosenPath) {
                iconSpan.style.display = 'none'; // Hide icon if link is intercepted by modal
            }
            a.appendChild(iconSpan);
        }

        // Active state for main chapter link
        if (chapter.file && chapter.file === currentPageFilename && targetLinkExpectedFolder === currentUrlFolder) {
            a.classList.add('active');
        }
        li.appendChild(a);

        if (chapter.hasPopup && chapter.popup && chapter.popup.length > 0) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            let parentIsActiveFromSub = false;

            chapter.popup.forEach(subItem => {
                // Popups use the same folder context as their parent chapter's link target
                const subItemTargetExpectedFolder = targetLinkExpectedFolder;
                const subItemFileForModal = (subItem.file || '').split('/').pop();

                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;

                if (onEarlyChapterForNav && isTargetChapterPathSpecific && !chosenPath) {
                    subA.href = "javascript:void(0);";
                    subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItemFileForModal);
                    });
                } else {
                    subA.href = `../${subItemTargetExpectedFolder}/${subItem.file}`;
                }

                if (subItem.file === currentPageFilename && subItemTargetExpectedFolder === currentUrlFolder) {
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

    // Event listeners for popups (hover logic)
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        const mainLink = popupLi.querySelector('a');
        const popupMenu = popupLi.querySelector('.popup-menu');
        let closeTimer = null; 

        if (mainLink && mainLink.getAttribute('href') !== "javascript:void(0);" && popupMenu) {
            const openMenuByLink = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                popupLi.classList.add('popup-open');
            };
            const hideMenu = () => {
                popupLi.classList.remove('popup-open');
            };
            const startHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); }
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
    document.body.className = document.body.className.replace(/\b(path-|journey-)[a-zA-Z0-9_-]+\b/g, ''); // Clear old theme classes
    
    let themeClass = '';
    const currentChapterDefinition = chapterDefinitions.find(c => c.id === viewerChapterId);

    if (currentChapterDefinition) {
        if (currentChapterDefinition.id <= 2) {
            themeClass = 'journey-nonjourney'; // Chapters 1 & 2 are always 'nonjourney'
        } else { // Chapters 3+
            themeClass = `path-${chosenPath || 'endoscopic'}`; // Use chosenPath or default to 'endoscopic'
        }
    } else { // No specific chapter identified, theme based on current folder
        if (currentUrlFolder === 'nonjourney') {
            themeClass = 'journey-nonjourney';
        } else if (currentUrlFolder === 'endoscopic' && !chosenPath) {
            // If in endoscopic folder and no specific other path is chosen
            themeClass = 'path-endoscopic';
        } else if (chosenPath && currentUrlFolder === chosenPath) {
            // If in a folder that matches a chosenPath
            themeClass = `path-${chosenPath}`;
        } else if (currentUrlFolder === 'endoscopic' && chosenPath && chosenPath !== 'endoscopic') {
            // Edge case: in 'endoscopic' folder, but a *different* path is chosen. Theme by chosenPath.
             themeClass = `path-${chosenPath}`;
        }
        // If currentUrlFolder is something else entirely, no specific theme class might be applied here.
    }

    if (themeClass) {
        document.body.classList.add(themeClass);
    }
    // console.log("Applied theme class:", themeClass || "none");

});


// --- Function to display the path selection modal (Mostly unchanged) ---
function displayPathSelectionModalInNav(targetChapterFileOnClick) {
    if (document.getElementById('pathChoiceOverlay')) {
        const existingOverlay = document.getElementById('pathChoiceOverlay');
        existingOverlay.dataset.targetFile = targetChapterFileOnClick;
        requestAnimationFrame(() => existingOverlay.classList.add('visible'));
        return;
    }

    const choiceContainer = document.createElement('div');
    choiceContainer.id = 'pathChoiceOverlay';
    choiceContainer.className = 'path-choice-overlay'; 
    choiceContainer.dataset.targetFile = targetChapterFileOnClick; 

    // These IDs are used as folder names and stored in localStorage if chosen.
    // Ensure these IDs match your actual folder names for these specific paths.
    const PATH_SPLIT_CRANIECTOMY_MODAL = {
        id: 'splitcraniectomy', 
        displayText: 'Split Craniectomy Path'
    };
    const PATH_CRANIAL_VAULT_ADVANCED_MODAL = { // This is a specific path, distinct from the "endoscopic" default folder
        id: 'cranialvaultadvanced', 
        displayText: 'Advanced Cranial Vault Path'
    };
    // If "endoscopic" (the default folder) should ALSO be an explicit choice in the modal:
    // const PATH_ENDOSCOPIC_DEFAULT_MODAL = { id: 'endoscopic', displayText: 'Standard Endoscopic Path'};
    // Then add a button for it below.

    choiceContainer.innerHTML = `
        <div class="path-choice-content">
            <h2>Choose Your Path</h2>
            <p>To explore this section, please first select which surgical approach you'd like to follow for the upcoming chapters.</p>
            <div class="path-choice-actions">
                <button id="navModalSelectSplit" class="path-choice-button">${PATH_SPLIT_CRANIECTOMY_MODAL.displayText}</button>
                <button id="navModalSelectCVAdvanced" class="path-choice-button">${PATH_CRANIAL_VAULT_ADVANCED_MODAL.displayText}</button>
                </div>
            <button id="navModalCancelPathChoice" class="path-choice-button" style="background-color: #7f8c8d; margin-top: 15px;">Cancel</button>
        </div>
    `;
    document.body.appendChild(choiceContainer);
    requestAnimationFrame(() => choiceContainer.classList.add('visible'));

    const handlePathSelection = (selectedPathId) => {
        localStorage.setItem('visualNovelChosenPath', selectedPathId);
        let targetFile = document.getElementById('pathChoiceOverlay').dataset.targetFile || `chapter3.html`;
        
        const finalTargetFile = targetFile.split('/').pop(); 

        window.location.href = `../${selectedPathId}/${finalTargetFile}#page0`;
        removeModal();
    };

    document.getElementById('navModalSelectSplit').addEventListener('click', () => handlePathSelection(PATH_SPLIT_CRANIECTOMY_MODAL.id));
    document.getElementById('navModalSelectCVAdvanced').addEventListener('click', () => handlePathSelection(PATH_CRANIAL_VAULT_ADVANCED_MODAL.id));
    // Add event listener for PATH_ENDOSCOPIC_DEFAULT_MODAL button if added.
    
    document.getElementById('navModalCancelPathChoice').addEventListener('click', removeModal);

    function removeModal() {
        const overlay = document.getElementById('pathChoiceOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(() => {
                if (overlay && overlay.parentElement) {
                    overlay.parentElement.removeChild(overlay);
                }
            }, 300); 
        }
    }
}