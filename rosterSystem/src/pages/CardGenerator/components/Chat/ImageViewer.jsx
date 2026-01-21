import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import useDraggableWindow from "./useDraggableWindow";
import { X, Expand, Maximize2, RotateCw, ChevronLeft, ChevronRight, RotateCwSquare } from "lucide-react";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export default function ImageViewerWindow({ open, images = [], startIndex = 0, onClose }) {
    const {
        isFullscreen,
        isMinimized,
        containerStyle,
        onHeaderMouseDown,
        onResizeMouseDown,
        toggleFullscreen,
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

    // view state
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [draggingImg, setDraggingImg] = useState(false);
    const [rotation, setRotation] = useState(0);

    // album navigation
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const imgStartRef = useRef({ x: 0, y: 0 });
    const offsetStartRef = useRef({ x: 0, y: 0 });

    const currentSrc = images?.[currentIndex] || "";

    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < (images?.length || 0) - 1;

    const prevImage = useCallback(() => {
        if (!hasPrev) return;
        setCurrentIndex((i) => i - 1);
    }, [hasPrev]);

    const nextImage = useCallback(() => {
        if (!hasNext) return;
        setCurrentIndex((i) => i + 1);
    }, [hasNext]);

    // ✅ when open: default small window + reset view
    useEffect(() => {
        if (!open) return;
        setIsFullscreen(false);
        setIsMinimized(false);
        setCurrentIndex(startIndex);
        setScale(1);
        setOffset({ x: 0, y: 0 });
        setRotation(0);
        setDraggingImg(false);
    }, [open, startIndex, setIsFullscreen, setIsMinimized]);

    // reset zoom/pan/rotation when changing image
    useEffect(() => {
        if (!open) return;
        setScale(1);
        setOffset({ x: 0, y: 0 });
        setRotation(0);
        setDraggingImg(false);
    }, [currentIndex, open]);

    // keyboard navigation
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose, prevImage, nextImage]);

    // drag image (only when zoomed)
    useEffect(() => {
        if (!open) return;

        const onMove = (e) => {
            if (!draggingImg) return;
            const dx = e.clientX - imgStartRef.current.x;
            const dy = e.clientY - imgStartRef.current.y;
            setOffset({
                x: offsetStartRef.current.x + dx,
                y: offsetStartRef.current.y + dy,
            });
        };

        const onUp = () => setDraggingImg(false);

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [open, draggingImg]);

    // wheel zoom
    const onWheelZoom = (e) => {
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
                className="p-3 z-9999 w-full bg-none  border-b border-border flex justify-end items-center select-none cursor-move"
                onMouseDown={onHeaderMouseDown}
            >
                <div className="flex items-center gap-2">
                    {/* Rotate */}
                    <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        title="Rotate"
                    >
                        <RotateCwSquare className="w-4 h-4" />
                    </Button>

                    {/* Fullscreen */}
                    <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={toggleFullscreen}
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Maximize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                    </Button>

                    {/* Close */}
                    <Button
                        variant="outline"
                        size="sm"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={onClose}
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Image Area */}
                    <div
                        className="relative flex-1 bg-black/80 flex items-center justify-center overflow-hidden"
                        onWheel={onWheelZoom}
                    >
                        {/* Prev */}
                        {hasPrev && (
                            <button
                                type="button"
                                onClick={prevImage}
                                className="absolute z-9999 left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                title="Previous"
                            >
                                <ChevronLeft />
                            </button>
                        )}

                        {/* Next */}
                        {hasNext && (
                            <button
                                type="button"
                                onClick={nextImage}
                                className="absolute z-9999 right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                                title="Next"
                            >
                                <ChevronRight />
                            </button>
                        )}

                        {/* Image */}
                        <img
                            src={currentSrc}
                            alt="photo"
                            draggable={false}
                            onMouseDown={onMouseDownImage}
                            className={`max-w-[95%] max-h-[95%] rounded-lg ${scale > 1 ? "cursor-grab active:cursor-grabbing" : ""
                                }`}
                            style={{
                                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)`,
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
