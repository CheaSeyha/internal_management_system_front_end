import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export default function ImageViewer({ open, src, onClose }) {
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);

    const dragStartRef = useRef({ x: 0, y: 0 });
    const offsetStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "+" || e.key === "=") setScale((s) => clamp(s + 0.25, 1, 6));
            if (e.key === "-" || e.key === "_") setScale((s) => clamp(s - 0.25, 1, 6));
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            setScale(1);
            setOffset({ x: 0, y: 0 });
            setDragging(false);
        }
    }, [open, src]);

    useEffect(() => {
        if (scale === 1) setOffset({ x: 0, y: 0 });
    }, [scale]);

    useEffect(() => {
        if (!open) return;

        const onMove = (e) => {
            if (!dragging) return;
            const dx = e.clientX - dragStartRef.current.x;
            const dy = e.clientY - dragStartRef.current.y;
            setOffset({ x: offsetStartRef.current.x + dx, y: offsetStartRef.current.y + dy });
        };

        const onUp = () => setDragging(false);

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [open, dragging]);

    const onWheelZoom = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setScale((s) => clamp(Number((s + delta).toFixed(2)), 1, 6));
    };

    const onMouseDownImage = (e) => {
        if (scale <= 1) return;
        setDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        offsetStartRef.current = { ...offset };
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center" onClick={onClose}>
            <div className="absolute top-4 right-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button variant="secondary" size="sm" onClick={() => setScale((s) => clamp(s + 0.25, 1, 6))}>+</Button>
                <Button variant="secondary" size="sm" onClick={() => setScale((s) => clamp(s - 0.25, 1, 6))}>-</Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                        setScale(1);
                        setOffset({ x: 0, y: 0 });
                    }}
                >
                    Reset
                </Button>
                <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
            </div>

            <div
                className="max-w-[95vw] max-h-[90vh] select-none"
                onClick={(e) => e.stopPropagation()}
                onWheel={onWheelZoom}
            >
                <img
                    src={src}
                    alt="photo"
                    draggable={false}
                    onMouseDown={onMouseDownImage}
                    className={`max-w-[95vw] max-h-[90vh] rounded-lg ${scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-out"}`}
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: "center center",
                        transition: dragging ? "none" : "transform 120ms ease-out",
                    }}
                />
            </div>

            <div className="absolute bottom-4 text-white/70 text-xs">
                Scroll to zoom • Drag to move • ESC to close
            </div>
        </div>
    );
}
