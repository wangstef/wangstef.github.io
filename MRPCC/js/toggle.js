document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('journeyToggle');

    if (!toggle) return;

    const path = window.location.pathname;
    const filename = path.split("/").pop(); // e.g., chapter1.html
    const isEndoscopic = path.includes("/endoscopic/");
    const isCranial = path.includes("/cranialvault/");

    // Set toggle position based on journey
    toggle.checked = isCranial;

    toggle.addEventListener('change', function () {
        let newPath;

        if (isEndoscopic) {
            newPath = path.replace("/endoscopic/", "/cranialvault/");
        } else if (isCranial) {
            newPath = path.replace("/cranialvault/", "/endoscopic/");
        } else {
            alert("Unknown journey folder");
            return;
        }

        // Preserve hash (e.g., #page2)
        const hash = window.location.hash;
        window.location.href = newPath + hash;
    });
});
