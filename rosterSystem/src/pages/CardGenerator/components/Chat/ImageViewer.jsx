import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import useDraggableWindow from "./useDraggableWindow";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export default function ImageViewerWindow({ open, src, onClose }) {
    const {
        isFullscreen,
        isMinimized,
        containerStyle,
        onHeaderMouseDown,
        onResizeMouseDown,
        toggleFullscreen,
        toggleMinimize,
        setIsFullscreen,
        setIsMinimized,
    } = useDraggableWindow({
        initialX: 120,
        initialY: 90,
        initialW: 560,
        initialH: 420,
        minW: 360,
        minH: 280,
        maxW: 1200,
        maxH: 900,
    });

    // ✅ when open: default small window (not fullscreen, not minimized)
    useEffect(() => {
        if (!open) return;
        setIsFullscreen(false);
        setIsMinimized(false);
        setScale(1);
        setOffset({ x: 0, y: 0 });
    }, [open, setIsFullscreen, setIsMinimized]);

    // zoom/pan
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [draggingImg, setDraggingImg] = useState(false);

    const imgStartRef = useRef({ x: 0, y: 0 });
    const offsetStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!open) return;

        const onMove = (e) => {
            if (!draggingImg) return;
            const dx = e.clientX - imgStartRef.current.x;
            const dy = e.clientY - imgStartRef.current.y;
            setOffset({ x: offsetStartRef.current.x + dx, y: offsetStartRef.current.y + dy });
        };

        const onUp = () => setDraggingImg(false);

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [open, draggingImg]);

    const onWheelZoom = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.15 : 0.15;
        setScale((s) => clamp(Number((s + delta).toFixed(2)), 1, 6));
    };

    const onMouseDownImage = (e) => {
        if (scale <= 1) return;
        setDraggingImg(true);
        imgStartRef.current = { x: e.clientX, y: e.clientY };
        offsetStartRef.current = { ...offset };
    };

    useEffect(() => {
        if (scale === 1) setOffset({ x: 0, y: 0 });
    }, [scale]);

    if (!open) return null;

    return (
        <div
            style={{ ...containerStyle, zIndex: 9999 }}
            className="bg-sidebar rounded-xl flex flex-col shadow-lg border border-border overflow-hidden"
        >
            {/* Header */}
            <div
                className="p-3 border-b border-border flex justify-between items-center select-none cursor-move"
                onMouseDown={onHeaderMouseDown}
            >
                <p className="font-semibold text-sm">Image Viewer</p>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onMouseDown={(e) => e.stopPropagation()} onClick={toggleMinimize}>
                        {isMinimized ? "Restore" : "Minimize"}
                    </Button>

                    <Button variant="outline" size="sm" onMouseDown={(e) => e.stopPropagation()} onClick={toggleFullscreen}>
                        {isFullscreen ? "Exit Full" : "Full"}
                    </Button>

                    <Button variant="outline" size="sm" onMouseDown={(e) => e.stopPropagation()} onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Toolbar */}
                    <div className="p-2 border-b border-border flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setScale((s) => clamp(s + 0.25, 1, 6))}>
                            +
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => setScale((s) => clamp(s - 0.25, 1, 6))}>
                            -
                        </Button>
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
                        <span className="text-xs text-muted-foreground ml-2">Scroll to zoom • Drag image when zoomed</span>
                    </div>

                    {/* Image */}
                    <div className="flex-1 bg-black/80 flex items-center justify-center overflow-hidden" onWheel={onWheelZoom}>
                        <img
                            src={src}
                            alt="photo"
                            draggable={false}
                            onMouseDown={onMouseDownImage}
                            className={`max-w-[95%] max-h-[95%] rounded-lg ${scale > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
                            style={{
                                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                                transformOrigin: "center center",
                                transition: draggingImg ? "none" : "transform 120ms ease-out",
                            }}
                        />
                    </div>

                    {/* Resize handle (window mode only) */}
                    {!isFullscreen && (
                        <div
                            onMouseDown={onResizeMouseDown}
                            className="absolute right-1 bottom-1 w-4 h-4 cursor-se-resize opacity-70"
                            title="Resize"
                        >
                            <div className="w-full h-full relative">
                                <span className="absolute right-0 bottom-0 w-3 h-[2px] bg-muted-foreground/50 rotate-45 origin-bottom-right" />
                                <span className="absolute right-0 bottom-1 w-2 h-[2px] bg-muted-foreground/40 rotate-45 origin-bottom-right" />
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
