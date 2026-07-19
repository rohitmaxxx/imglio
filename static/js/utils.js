/**
 * Shared frontend helpers — reuse across tools.
 * Add new helpers here instead of copying paste in every tool JS file.
 */
window.PixResize = window.PixResize || {};

(function (PR) {
    PR.setupUpload = function ({ zone, input, onFile }) {
        if (!zone || !input) return;

        zone.addEventListener("click", () => input.click());
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.classList.add("dragover");
        });
        zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.classList.remove("dragover");
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                onFile(e.dataTransfer.files[0]);
            }
        });
        input.addEventListener("change", () => {
            if (input.files.length) onFile(input.files[0]);
        });
    };

    PR.readImage = function (file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith("image/")) {
                reject(new Error("Please select an image file."));
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => resolve({ dataUrl: e.target.result, width: img.width, height: img.height, file });
                img.onerror = () => reject(new Error("Could not read image."));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error("Could not read file."));
            reader.readAsDataURL(file);
        });
    };

    PR.formatBytes = function (bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };
})(window.PixResize);
