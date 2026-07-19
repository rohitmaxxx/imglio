document.addEventListener("DOMContentLoaded", () => {
    const uploadZone = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    const fileName = document.getElementById("file-name");
    const toolOptions = document.getElementById("tool-options");
    const previewSection = document.getElementById("preview-section");
    const previewImage = document.getElementById("preview-image");
    const quality = document.getElementById("quality");
    const qualityValue = document.getElementById("quality-value");
    const origSize = document.getElementById("orig-size");

    function setupUpload(onFile) {
        uploadZone.addEventListener("click", () => fileInput.click());
        uploadZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadZone.classList.add("dragover");
        });
        uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));
        uploadZone.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadZone.classList.remove("dragover");
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                onFile(e.dataTransfer.files[0]);
            }
        });
        fileInput.addEventListener("change", () => {
            if (fileInput.files.length) onFile(fileInput.files[0]);
        });
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    setupUpload((file) => {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }
        fileName.textContent = file.name;
        toolOptions.style.display = "block";
        origSize.textContent = formatSize(file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewSection.style.display = "block";
        };
        reader.readAsDataURL(file);
    });

    quality.addEventListener("input", () => {
        qualityValue.textContent = quality.value;
    });
});
