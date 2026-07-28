"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "@/components/crop/Crop.module.css";

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface CropCanvasProps {
  previewUrl: string;
  onChange: (rect: CropRect) => void;
}

export default function CropCanvas({ previewUrl, onChange }: CropCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const selectingRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const [scale, setScale] = useState(1);
  const [sel, setSel] = useState<CropRect>({ x: 0, y: 0, w: 1, h: 1 });

  const updateSel = useCallback(
    (rect: CropRect) => {
      setSel(rect);
      onChange(rect);
    },
    [onChange]
  );

  // Load the image once and pick an initial center 60% selection, matching the original tool.
  useEffect(() => {
    if (!previewUrl) return;
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const maxW = Math.min(800, wrap.clientWidth - 8 || 800);
      const nextScale = Math.min(1, maxW / img.width);
      setScale(nextScale);
      canvas.width = Math.round(img.width * nextScale);
      canvas.height = Math.round(img.height * nextScale);

      const dw = Math.round(img.width * 0.6);
      const dh = Math.round(img.height * 0.6);
      updateSel({ x: Math.round((img.width - dw) / 2), y: Math.round((img.height - dh) / 2), w: dw, h: dh });
    };
    img.src = previewUrl;
  }, [previewUrl, updateSel]);

  // Redraw: full image, dimmed overlay, clear + redraw the selected region, selection outline + corner handles.
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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

    const hs = 8;
    ctx.fillStyle = "#10B981";
    ([[sx, sy], [sx + sw, sy], [sx, sy + sh], [sx + sw, sy + sh]] as [number, number][]).forEach(([hx, hy]) => {
      ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
    });
  }, [sel, scale]);

  function canvasPos(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const img = imgRef.current;
    if (!img) return;
    selectingRef.current = true;
    const p = canvasPos(e);
    const startX = Math.max(0, Math.min(p.x, img.width));
    const startY = Math.max(0, Math.min(p.y, img.height));
    startRef.current = { x: startX, y: startY };
    updateSel({ x: Math.round(startX), y: Math.round(startY), w: 1, h: 1 });
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!selectingRef.current) return;
    const img = imgRef.current;
    if (!img) return;
    const p = canvasPos(e);
    const curX = Math.max(0, Math.min(p.x, img.width));
    const curY = Math.max(0, Math.min(p.y, img.height));
    const { x: startX, y: startY } = startRef.current;
    updateSel({
      x: Math.round(Math.min(startX, curX)),
      y: Math.round(Math.min(startY, curY)),
      w: Math.round(Math.abs(curX - startX)) || 1,
      h: Math.round(Math.abs(curY - startY)) || 1,
    });
  }

  useEffect(() => {
    function handleMouseUp() {
      selectingRef.current = false;
    }
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div ref={wrapRef} className={styles["crop-canvas-wrap"]}>
      <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} role="img" aria-label="Drag to select the crop area" />
    </div>
  );
}
