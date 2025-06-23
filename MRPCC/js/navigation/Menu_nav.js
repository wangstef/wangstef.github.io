// MRPCC/js/navigation/navigation-main-menu.js
document.addEventListener('DOMContentLoaded', function () {
    // --- ADDED: Inject CSS for the flipping triangle animation ---
    const style = document.createElement('style');
    style.textContent = `
        .nav-icon.popup-icon {
            transition: transform 0.2s ease-in-out;
            display: inline-block;
            margin-left: 5px;
        }
        .has-popup.popup-open > a > .nav-icon.popup-icon {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
    // --- END OF INJECTED CSS ---

    const navContainer = document.getElementById('chapter-nav-container-main');
    if (!navContainer) {
        return; // Silently fail if nav container isn't on the page
    }

    const chapterDefinitions = [
        { id: 1, name: "Welcome", file: "chapter1.html" },
        {
            id: 2, name: "Intro", file: "chapter2.html", hasPopup: true,
            popup: [
                { name: "Pronunciation", file: "chapter2.html#page1" },
                { name: "Video: Craniosynostosis", file: "chapter2.html#page3" },
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

    const navElement = document.createElement('nav');
    const ul = document.createElement('ul');

    chapterDefinitions.forEach(chapter => {
        // Since we are on the main menu, we know we always want to go to the "nonjourney" path initially.
        // The path-specific chapters (3+) will be handled by the modal logic.
        const targetFolder = "nonjourney";

        const li = document.createElement('li');
        if (chapter.hasPopup) {
            li.classList.add('has-popup');
        }
        
        const a = document.createElement('a');
        a.textContent = chapter.name;

        // For main menu, all chapters link to the nonjourney folder initially.
        // The modal will appear for chapters 3+ to let the user select a specific path.
        const chapterFile = chapter.file || (chapter.popup && chapter.popup[0] ? chapter.popup[0].file : `chapter${chapter.id}.html`);
        let linkPath = `${targetFolder}/${chapterFile}`;

        // Chapters 3 and above should trigger the path selection modal.
        if (chapter.id >= 3) {
            a.href = "javascript:void(0);";
            a.addEventListener('click', (e) => {
                e.preventDefault();
                displayPathSelectionModalInNav(chapterFile);
            });
        } else {
            a.href = linkPath;
        }
        
        // --- ADDED: Create and append the triangle icon to the link ---
        if (chapter.hasPopup) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'nav-icon popup-icon';
            iconSpan.innerHTML = ' &#9650;'; // Upwards triangle character
            a.appendChild(iconSpan);
        }
        // --- END OF ADDED CODE ---
        
        li.appendChild(a);

        if (chapter.hasPopup && chapter.popup) {
            const popupUl = document.createElement('ul');
            popupUl.className = 'popup-menu';
            chapter.popup.forEach(subItem => {
                const subLi = document.createElement('li');
                const subA = document.createElement('a');
                subA.textContent = subItem.name;
                
                const subItemPath = `${targetFolder}/${subItem.file}`;

                if(chapter.id >= 3) {
                    subA.href = "javascript:void(0);";
                     subA.addEventListener('click', (e) => {
                        e.preventDefault();
                        displayPathSelectionModalInNav(subItem.file);
                    });
                } else {
                    subA.href = subItemPath;
                }
                subLi.appendChild(subA);
                popupUl.appendChild(subLi);
            });
            li.appendChild(popupUl);
        }
        ul.appendChild(li);
    });

    navElement.appendChild(ul);
    navContainer.innerHTML = '';
    navContainer.appendChild(navElement);

    // This block handles the popup hover visibility
    document.querySelectorAll('.has-popup').forEach(popupLi => {
        const mainLink = popupLi.querySelector('a');
        const popupMenu = popupLi.querySelector('.popup-menu');
        let closeTimer = null; 

        // Only attach hover listeners if it has a real popup menu
        if (mainLink && popupMenu) {
            const openMenu = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
                popupLi.classList.add('popup-open');
            };

            const hideMenu = () => {
                popupLi.classList.remove('popup-open');
            };

            const startHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); }
                closeTimer = setTimeout(hideMenu, 250); // Delay before hiding
            };

            const cancelHideTimer = () => {
                if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            };

            mainLink.addEventListener('mouseenter', openMenu);
            mainLink.addEventListener('mouseleave', startHideTimer);
            popupMenu.addEventListener('mouseenter', cancelHideTimer);
            popupMenu.addEventListener('mouseleave', startHideTimer);
        }
    });

    // Note: The `displayPathSelectionModalInNav` function must be available.
    // Ensure it's either in this file or a globally accessible script that is loaded on the page.
});