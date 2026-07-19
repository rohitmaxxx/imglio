document.addEventListener("DOMContentLoaded", () => {
    const uploadZone = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    const fileName = document.getElementById("file-name");
    const resizeOptions = document.getElementById("resize-options");
    const previewSection = document.getElementById("preview-section");
    const previewImage = document.getElementById("preview-image");
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const maintainAspect = document.getElementById("maintain_aspect");

    let originalWidth = 0;
    let originalHeight = 0;

    uploadZone.addEventListener("click", () => fileInput.click());

    uploadZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadZone.classList.add("dragover");
    });

    uploadZone.addEventListener("dragleave", () => {
        uploadZone.classList.remove("dragover");
    });

    uploadZone.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length) {
            handleFileSelect(fileInput.files[0]);
        }
    });

    function handleFileSelect(file) {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        fileName.textContent = file.name;
        resizeOptions.style.display = "block";

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewSection.style.display = "block";

            const img = new Image();
            img.onload = () => {
                originalWidth = img.width;
                originalHeight = img.height;
                widthInput.value = img.width;
                heightInput.value = img.height;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    widthInput.addEventListener("input", () => {
        if (maintainAspect.checked && originalWidth > 0) {
            const ratio = originalHeight / originalWidth;
            heightInput.value = Math.round(widthInput.value * ratio);
        }
    });

    heightInput.addEventListener("input", () => {
        if (maintainAspect.checked && originalHeight > 0) {
            const ratio = originalWidth / originalHeight;
            widthInput.value = Math.round(heightInput.value * ratio);
        }
    });
});
