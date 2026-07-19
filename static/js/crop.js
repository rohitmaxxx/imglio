document.addEventListener("DOMContentLoaded", () => {
    const uploadZone = document.getElementById("upload-zone");
    const fileInput = document.getElementById("file-input");
    const fileName = document.getElementById("file-name");
    const workspace = document.getElementById("crop-workspace");
    const canvas = document.getElementById("crop-canvas");
    const ctx = canvas.getContext("2d");
    const cropSubmit = document.getElementById("crop-submit");

    const cropX = document.getElementById("crop-x");
    const cropY = document.getElementById("crop-y");
    const cropW = document.getElementById("crop-w");
    const cropH = document.getElementById("crop-h");
    const displayX = document.getElementById("display-x");
    const displayY = document.getElementById("display-y");
    const displayW = document.getElementById("display-w");
    const displayH = document.getElementById("display-h");

    let img = null;
    let scale = 1;
    let selecting = false;
    let startX = 0;
    let startY = 0;
    let sel = { x: 0, y: 0, w: 0, h: 0 };

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
            loadFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length) loadFile(fileInput.files[0]);
    });

    function loadFile(file) {
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }
        fileName.textContent = file.name;
        workspace.style.display = "block";
        uploadZone.style.display = "none";

        const reader = new FileReader();
        reader.onload = (e) => {
            img = new Image();
            img.onload = () => {
                const maxW = Math.min(800, workspace.clientWidth - 8 || 800);
                scale = Math.min(1, maxW / img.width);
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);

                // Default selection: center 60%
                const dw = Math.round(img.width * 0.6);
                const dh = Math.round(img.height * 0.6);
                sel = {
                    x: Math.round((img.width - dw) / 2),
                    y: Math.round((img.height - dh) / 2),
                    w: dw,
                    h: dh,
                };
                updateFields();
                draw();
                cropSubmit.disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function updateFields() {
        cropX.value = sel.x;
        cropY.value = sel.y;
        cropW.value = sel.w;
        cropH.value = sel.h;
        displayX.value = sel.x;
        displayY.value = sel.y;
        displayW.value = sel.w;
        displayH.value = sel.h;
    }

    function draw() {
        if (!img) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Dim outside selection
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const sx = sel.x * scale;
        const sy = sel.y * scale;
        const sw = sel.w * scale;
        const sh = sel.h * scale;

        ctx.clearRect(sx, sy, sw, sh);
        ctx.drawImage(img, sel.x, sel.y, sel.w, sel.h, sx, sy, sw, sh);

        ctx.strokeStyle = "#10B981";
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, sy, sw, sh);

        // Corner handles
        const hs = 8;
        ctx.fillStyle = "#10B981";
        [[sx, sy], [sx + sw, sy], [sx, sy + sh], [sx + sw, sy + sh]].forEach(([hx, hy]) => {
            ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
        });
    }

    function canvasPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale,
        };
    }

    canvas.addEventListener("mousedown", (e) => {
        selecting = true;
        const p = canvasPos(e);
        startX = Math.max(0, Math.min(p.x, img.width));
        startY = Math.max(0, Math.min(p.y, img.height));
        sel = { x: Math.round(startX), y: Math.round(startY), w: 1, h: 1 };
        updateFields();
        draw();
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!selecting || !img) return;
        const p = canvasPos(e);
        const curX = Math.max(0, Math.min(p.x, img.width));
        const curY = Math.max(0, Math.min(p.y, img.height));
        sel.x = Math.round(Math.min(startX, curX));
        sel.y = Math.round(Math.min(startY, curY));
        sel.w = Math.round(Math.abs(curX - startX)) || 1;
        sel.h = Math.round(Math.abs(curY - startY)) || 1;
        updateFields();
        draw();
    });

    window.addEventListener("mouseup", () => {
        selecting = false;
    });
});
