document.addEventListener("DOMContentLoaded", () => {
    const uploadZone = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    const fileName = document.getElementById("file-name");
    const toolOptions = document.getElementById("tool-options");
    const previewSection = document.getElementById("preview-section");
    const previewImage = document.getElementById("preview-image");
    const angleInput = document.getElementById("angle");
    const customAngle = document.getElementById("custom-angle");
    const angleLabel = document.getElementById("angle-label");
    const rotateBtns = document.querySelectorAll(".rotate-btn");

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
            handleFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length) handleFile(fileInput.files[0]);
    });

    function handleFile(file) {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }
        fileName.textContent = file.name;
        toolOptions.style.display = "block";

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewSection.style.display = "block";
            applyPreview();
        };
        reader.readAsDataURL(file);
    }

    function setAngle(deg) {
        const normalized = ((deg % 360) + 360) % 360;
        angleInput.value = normalized;
        customAngle.value = normalized;
        angleLabel.textContent = normalized;
        rotateBtns.forEach((btn) => {
            const a = parseInt(btn.dataset.angle, 10);
            const n = ((a % 360) + 360) % 360;
            btn.classList.toggle("active", n === normalized);
        });
        applyPreview();
    }

    function applyPreview() {
        previewImage.style.transform = `rotate(${angleInput.value}deg)`;
    }

    rotateBtns.forEach((btn) => {
        btn.addEventListener("click", () => setAngle(parseInt(btn.dataset.angle, 10)));
    });

    customAngle.addEventListener("input", () => setAngle(parseInt(customAngle.value, 10)));
});
