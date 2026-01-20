import { useEffect, useRef, useState, useCallback } from "react";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

export default function useDraggableWindow({
    initialX = 60,
    initialY = 60,
    initialW = 500,
    initialH = 600,
    minW = 320,
    minH = 240,
    maxW = 1200,
    maxH = 1000,
} = {}) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [pos, setPos] = useState({ x: initialX, y: initialY });
    const [size, setSize] = useState({ w: initialW, h: initialH });

    const draggingRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    const resizingRef = useRef(false);
    const resizeStartRef = useRef({ x: 0, y: 0, w: initialW, h: initialH });

    const onHeaderMouseDown = useCallback(
        (e) => {
            if (isFullscreen) return;
            draggingRef.current = true;
            dragOffsetRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
        },
        [isFullscreen, pos.x, pos.y]
    );

    const onResizeMouseDown = useCallback(
        (e) => {
            if (isFullscreen) return;
            resizingRef.current = true;
            resizeStartRef.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
            e.stopPropagation();
            e.preventDefault();
        },
        [isFullscreen, size.w, size.h]
    );

    useEffect(() => {
        const onMove = (e) => {
            if (draggingRef.current) {
                const maxX = window.innerWidth - 200;
                const maxY = window.innerHeight - 60;
                const nextX = clamp(e.clientX - dragOffsetRef.current.x, 0, maxX);
                const nextY = clamp(e.clientY - dragOffsetRef.current.y, 0, maxY);
                setPos({ x: nextX, y: nextY });
            }

            if (resizingRef.current) {
                const dx = e.clientX - resizeStartRef.current.x;
                const dy = e.clientY - resizeStartRef.current.y;
                setSize({
                    w: clamp(resizeStartRef.current.w + dx, minW, maxW),
                    h: clamp(resizeStartRef.current.h + dy, minH, maxH),
                });
            }
        };

        const onUp = () => {
            draggingRef.current = false;
            resizingRef.current = false;
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [minW, minH, maxW, maxH]);

    const toggleFullscreen = useCallback(() => {
        setIsMinimized(false);
        setIsFullscreen((v) => !v);
    }, []);

    const toggleMinimize = useCallback(() => setIsMinimized((v) => !v), []);

    const containerStyle = isFullscreen
        ? { position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 9990 }
        : {
            position: "fixed",
            left: pos.x,
            top: pos.y,
            width: size.w,
            height: isMinimized ? 56 : size.h,
            zIndex: 9990,
        };

    return {
        isFullscreen,
        isMinimized,
        containerStyle,
        onHeaderMouseDown,
        onResizeMouseDown,
        toggleFullscreen,
        toggleMinimize,
        setIsFullscreen,
        setIsMinimized,
    };
}
