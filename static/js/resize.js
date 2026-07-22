/**
 * Resize tool UI — modes are switchable panels.
 * To add a new mode: add a tab button + panel in HTML, then handle it in setMode().
 */
document.addEventListener("DOMContentLoaded", () => {
    const PR = window.Imglio;

    const els = {
        zone: document.getElementById("upload-zone"),
        input: document.getElementById("file-input"),
        fileName: document.getElementById("file-name"),
        options: document.getElementById("resize-options"),
        preview: document.getElementById("preview-section"),
        previewImg: document.getElementById("preview-image"),
        previewMeta: document.getElementById("preview-meta"),
        mode: document.getElementById("mode"),
        width: document.getElementById("width"),
        height: document.getElementById("height"),
        lock: document.getElementById("lock_aspect"),
        percent: document.getElementById("percent"),
        percentLabel: document.getElementById("percent-label"),
        percentHint: document.getElementById("percent-hint"),
        exportToggle: document.getElementById("export-toggle"),
        exportBody: document.getElementById("export-body"),
    };

    let original = { w: 0, h: 0, size: 0, ext: '' };
    let syncing = false;
    let userEditingTarget = false;
    let modeTarget = {
        size: { value: '', unit: 'KB' },
        percent: { value: '', unit: 'KB' },
    };

    function applyModeTarget(mode) {
        const target = modeTarget[mode] || { value: '', unit: 'KB' };
        targetSizeInput.value = target.value || '';
        targetUnitSelect.value = target.unit || 'KB';
    }

    function saveModeTarget(mode) {
        if (!modeTarget[mode]) return;
        modeTarget[mode].value = targetSizeInput.value;
        modeTarget[mode].unit = targetUnitSelect.value;
    }

    function saveCurrentModeState(mode) {
        if (mode === 'size' || mode === 'percent') {
            saveModeTarget(mode);
        }
    }

    function restoreModeState(mode) {
        applyModeTarget(mode);
    }

    function isSizeMode() {
        return els.mode.value === 'size';
    }

    function isPercentMode() {
        return els.mode.value === 'percent';
    }

    // ── Upload ─────────────────────────────────────────
    PR.setupUpload({
        zone: els.zone,
        input: els.input,
        onFile: async (file) => {
                try {
                    const data = await PR.readImage(file);
                    original = { w: data.width, h: data.height, size: file.size, ext: (file.name.split('.').pop() || '').toLowerCase() };
                    els.fileName.textContent = `${file.name} · ${PR.formatBytes(file.size)}`;
                    els.options.hidden = false;
                    els.preview.hidden = false;
                    els.previewImg.src = data.dataUrl;
                    els.width.value = data.width;
                    els.height.value = data.height;
                    updatePreviewMeta();
                } catch (err) {
                    alert(err.message);
                }
        },
    });

    // ── Mode tabs ──────────────────────────────────────
    document.querySelectorAll(".mode-tab").forEach((tab) => {
        tab.addEventListener("click", () => setMode(tab.dataset.mode));
    });

    function setMode(mode) {
        const currentMode = els.mode.value;
        if (currentMode !== mode) {
            saveCurrentModeState(currentMode);
        }

        els.mode.value = mode;
        document.querySelectorAll(".mode-tab").forEach((t) => {
            t.classList.toggle("active", t.dataset.mode === mode);
        });
        document.querySelectorAll(".mode-panel").forEach((panel) => {
            panel.hidden = panel.dataset.panel !== mode;
        });

        restoreModeState(mode);

        if (mode === 'size' && !modeTarget.size.value) {
            estimateTargetFromSizeDims();
        }
        if (mode === 'percent' && !modeTarget.percent.value) {
            estimateTargetFromPercent();
        }

        updatePreviewMeta();
    }

    // ── Aspect lock (By Size) ──────────────────────────
    els.width.addEventListener("input", () => {
        if (syncing || !els.lock.checked || !original.w) return;
        syncing = true;
        els.height.value = Math.round(Number(els.width.value) * (original.h / original.w)) || 1;
        syncing = false;
        updatePreviewMeta();
    });

    els.height.addEventListener("input", () => {
        if (syncing || !els.lock.checked || !original.h) return;
        syncing = true;
        els.width.value = Math.round(Number(els.height.value) * (original.w / original.h)) || 1;
        syncing = false;
        updatePreviewMeta();
    });

    // ── Percentage ─────────────────────────────────────
    els.percent.addEventListener("input", () => {
        if (syncing) return;
        const p = els.percent.value;
        els.percentLabel.textContent = p + "%";
        els.percentHint.textContent = `Make my image ${p}% of original size.`;
        if (original.w) {
            els.width.value = Math.max(1, Math.round(original.w * p / 100));
            els.height.value = Math.max(1, Math.round(original.h * p / 100));
        }
        updatePreviewMeta();
    });

    // Target size / export format bindings
    const targetSizeInput = document.getElementById("target_size");
    const targetUnitSelect = document.getElementById("target_unit");
    const exportFormatSelect = document.getElementById("export_format");

    function bytesFor(value, unit) {
        const v = Number(value) || 0;
        return unit === 'MB' ? Math.round(v * 1024 * 1024) : Math.round(v * 1024);
    }

    function formatCompressionFactor(format) {
        const f = (format || exportFormatSelect.value || 'original').toLowerCase();
        if (f === 'jpg' || f === 'jpeg') return 0.35;
        if (f === 'webp') return 0.28;
        if (f === 'png') return 1.0;
        // original: infer from original.ext
        if (original.ext && ['jpg','jpeg','webp'].includes(original.ext)) return 0.35;
        return 1.0;
    }

    function estimateBytesForDims(w, h, format) {
        if (!original.w || !original.h || !original.size) return 0;
        const areaRatio = (w * h) / (original.w * original.h);
        const base = original.size;
        const factor = formatCompressionFactor(format);
        return Math.max(1, Math.round(base * areaRatio * factor));
    }

    function isSizeMode() {
        return els.mode.value === 'size';
    }

    function isPercentMode() {
        return els.mode.value === 'percent';
    }

    function estimateTargetFromSizeDims() {
        if (!original.size) return;
        const tw = Number(els.width.value) || original.w;
        const th = Number(els.height.value) || original.h;
        const bytes = estimateBytesForDims(tw, th, exportFormatSelect.value);
        userEditingTarget = true;
        if (bytes >= 1024 * 1024) {
            targetUnitSelect.value = 'MB';
            targetSizeInput.value = (bytes / (1024 * 1024)).toFixed(2);
        } else {
            targetUnitSelect.value = 'KB';
            targetSizeInput.value = Math.max(1, Math.round(bytes / 1024));
        }
        saveModeTarget('size');
        userEditingTarget = false;
        updatePreviewMeta();
    }

    function estimateTargetFromPercent() {
        if (!original.size) return;
        const p = Number(els.percent.value) || 100;
        const tw = Math.max(1, Math.round(original.w * p / 100));
        const th = Math.max(1, Math.round(original.h * p / 100));
        const bytes = estimateBytesForDims(tw, th, exportFormatSelect.value);
        userEditingTarget = true;
        if (bytes >= 1024 * 1024) {
            targetUnitSelect.value = 'MB';
            targetSizeInput.value = (bytes / (1024 * 1024)).toFixed(2);
        } else {
            targetUnitSelect.value = 'KB';
            targetSizeInput.value = Math.max(1, Math.round(bytes / 1024));
        }
        saveModeTarget('percent');
        userEditingTarget = false;
        updatePreviewMeta();
    }

    function estimateSizeDimsFromTarget() {
        if (!original.size || !isSizeMode()) return;
        const bytes = bytesFor(targetSizeInput.value, targetUnitSelect.value);
        if (!bytes) return;
        const factor = formatCompressionFactor(exportFormatSelect.value);
        const desiredAreaRatio = bytes / (original.size * factor);
        const scale = Math.sqrt(Math.max(0.01, desiredAreaRatio));
        const nw = Math.max(1, Math.round(original.w * scale));
        const nh = Math.max(1, Math.round(original.h * scale));
        syncing = true;
        els.width.value = nw;
        els.height.value = nh;
        syncing = false;
        updatePreviewMeta();
    }

    function estimatePercentFromTarget() {
        if (!original.size || !isPercentMode()) return;
        const bytes = bytesFor(targetSizeInput.value, targetUnitSelect.value);
        if (!bytes) return;
        const factor = formatCompressionFactor(exportFormatSelect.value);
        const desiredAreaRatio = bytes / (original.size * factor);
        const scale = Math.sqrt(Math.max(0.01, desiredAreaRatio));
        const p = Math.max(1, Math.round(scale * 100));
        syncing = true;
        els.percent.value = p;
        els.percentLabel.textContent = p + "%";
        els.percentHint.textContent = `Make my image ${p}% of original size.`;
        els.width.value = Math.max(1, Math.round(original.w * p / 100));
        els.height.value = Math.max(1, Math.round(original.h * p / 100));
        syncing = false;
        updatePreviewMeta();
    }

    // When width/height change in size mode, update target estimate.
    els.width.addEventListener('input', () => {
        if (syncing) return;
        if (isSizeMode()) {
            estimateTargetFromSizeDims();
        }
    });
    els.height.addEventListener('input', () => {
        if (syncing) return;
        if (isSizeMode()) {
            estimateTargetFromSizeDims();
        }
    });

    // When percent changes, update target estimate in percent mode.
    els.percent.addEventListener('input', () => {
        if (syncing) return;
        const p = els.percent.value;
        els.percentLabel.textContent = p + "%";
        els.percentHint.textContent = `Make my image ${p}% of original size.`;
        if (original.w) {
            els.width.value = Math.max(1, Math.round(original.w * p / 100));
            els.height.value = Math.max(1, Math.round(original.h * p / 100));
        }
        if (isPercentMode()) {
            estimateTargetFromPercent();
        }
        updatePreviewMeta();
    });

    // When export format changes, re-estimate for the current mode.
    exportFormatSelect.addEventListener('change', () => {
        if (isSizeMode()) estimateTargetFromSizeDims();
        if (isPercentMode()) estimateTargetFromPercent();
    });
    targetUnitSelect.addEventListener('change', () => {
        if (isSizeMode()) estimateSizeDimsFromTarget();
        if (isPercentMode()) estimatePercentFromTarget();
        saveModeTarget(els.mode.value);
    });

    // When user edits target size, update the active mode.
    targetSizeInput.addEventListener('input', () => {
        if (userEditingTarget === true) return;
        userEditingTarget = true;
        if (isSizeMode()) estimateSizeDimsFromTarget();
        if (isPercentMode()) estimatePercentFromTarget();
        saveModeTarget(els.mode.value);
        userEditingTarget = false;
    });

    // ── Social presets ─────────────────────────────────
    document.querySelectorAll(".social-card").forEach((card) => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".social-card").forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            els.width.value = card.dataset.w;
            els.height.value = card.dataset.h;
            els.lock.checked = true;
            const picked = document.getElementById("social-picked");
            if (picked) {
                picked.textContent = `Selected: ${card.querySelector(".social-name").textContent} (${card.dataset.w}×${card.dataset.h})`;
            }
            updatePreviewMeta();
        });
    });

    // ── Export collapse ────────────────────────────────
    els.exportToggle.addEventListener("click", () => {
        const open = els.exportBody.hidden;
        els.exportBody.hidden = !open;
        els.exportToggle.setAttribute("aria-expanded", open ? "true" : "false");
        els.exportToggle.classList.toggle("collapsed", !open);
    });

    function updatePreviewMeta() {
        if (!original.w) return;
        const mode = els.mode.value;
        let tw = Number(els.width.value) || original.w;
        let th = Number(els.height.value) || original.h;
        if (mode === "percent") {
            const p = Number(els.percent.value) || 100;
            tw = Math.max(1, Math.round(original.w * p / 100));
            th = Math.max(1, Math.round(original.h * p / 100));
        }

        let meta = `· ${original.w}×${original.h} → ${tw}×${th}`;
        // show estimated size if available
        const estBytes = estimateBytesForDims(tw, th, exportFormatSelect.value);
        if (estBytes) {
            meta += ` · est ${PR.formatBytes(estBytes)}`;
        }
        els.previewMeta.textContent = meta;
    }
});

// ── Guarantee correct target before submit ─────────────
const resizeForm = document.getElementById("resize-form");
resizeForm.addEventListener("submit", () => {
    const currentMode = els.mode.value; // 'size' | 'percent' | 'social'

    // Only 'size' and 'percent' modes have their own saved target
    if (currentMode === 'size' || currentMode === 'percent') {
        const saved = modeTarget[currentMode] || { value: '', unit: 'KB' };
        targetSizeInput.value = saved.value || '';
        targetUnitSelect.value = saved.unit || 'KB';
    }
    // 'social' mode: leave target_size input as-is (whatever user set there)
});