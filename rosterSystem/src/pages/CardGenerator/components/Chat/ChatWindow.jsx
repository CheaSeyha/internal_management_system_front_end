import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWebSocket from "../Hook/useWebSocket";
import { X, Expand, Maximize2 } from "lucide-react";
import useDraggableWindow from "./useDraggableWindow";
import ChatMessage from "./ChatMessage";
import ImageViewerWindow from "./ImageViewer";
import axios from "axios";
import messageSound from "../../../../assets/notificationSound/notification-sound.mp3";
import useNotificationSound from "../../../../hooks/useNotificationSound";

export default function ChatWindow() {
    const [message, setMessage] = useState("");
    const playMessageSound = useNotificationSound(messageSound);

    const { isConnected, messages, connectionStatus, clearMessages } = useWebSocket();
    // For Notification chat play sound
    const prevCountRef = useRef(0);

    useEffect(() => {
        if (!Array.isArray(messages)) return;

        // first load → no sound
        if (prevCountRef.current === 0) {
            prevCountRef.current = messages.length;
            return;
        }

        if (messages.length > prevCountRef.current) {
            const lastMessage = messages[messages.length - 1];

            // ✅ play sound only for incoming messages
            if (!lastMessage?.from?.isBot && !lastMessage?.isOutgoing) {
                playMessageSound();
            }
        }

        prevCountRef.current = messages.length;
    }, [messages, playMessageSound]);


    const {
        isFullscreen,
        isMinimized,
        containerStyle,
        onHeaderMouseDown,
        onResizeMouseDown,
        toggleFullscreen,
        toggleMinimize,
    } = useDraggableWindow({
        initialX: 60,
        initialY: 60,
        initialW: 500,
        initialH: 600,
    });

    // ✅ Image viewer supports album
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerImages, setViewerImages] = useState([]);
    const [viewerIndex, setViewerIndex] = useState(0);

    const openImageViewer = (images, startIndex = 0) => {
        setViewerImages(images);
        setViewerIndex(startIndex);
        setViewerOpen(true);
    };

    const closeImageViewer = () => {
        setViewerOpen(false);
        setViewerImages([]);
        setViewerIndex(0);
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const chatID = import.meta.env.VITE_CHAT_ID;
        const token = import.meta.env.VITE_API_AUTH_TOKEN;

        try {
            const send = await axios.post(
                decodeURIComponent(import.meta.env.VITE_RESTAPI_URL) + "/api/bot/send",
                { chatId: chatID, text: message },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(send.data);
        } catch (error) {
            console.log(error);
        } finally {
            setMessage("");
        }
    };

    // =========================================
    // ✅ Auto scroll to bottom + jump button
    // =========================================
    const scrollAreaRef = useRef(null);
    const shouldAutoScrollRef = useRef(true);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const getViewport = () => {
        const root = scrollAreaRef.current;
        if (!root) return null;

        // Radix viewport inside shadcn ScrollArea
        return root.querySelector?.('[data-radix-scroll-area-viewport]') || null;
    };

    const scrollToBottom = (smooth = true) => {
        const viewport = getViewport();
        if (!viewport) return;

        viewport.scrollTo({
            top: viewport.scrollHeight,
            behavior: smooth ? "smooth" : "auto",
        });
    };

    // attach scroll listener
    useEffect(() => {
        if (isMinimized) return;

        const viewport = getViewport();
        if (!viewport) return;

        const threshold = 80; // px: "near bottom"

        const onScroll = () => {
            const distanceFromBottom =
                viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);

            const atBottomNow = distanceFromBottom <= threshold;

            setIsAtBottom(atBottomNow);
            shouldAutoScrollRef.current = atBottomNow; // only auto scroll if user near bottom
        };

        viewport.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // init

        return () => viewport.removeEventListener("scroll", onScroll);
    }, [isMinimized, isFullscreen]);

    // Auto scroll on first load + new messages (only if user didn't scroll up)
    const messageCount = useMemo(() => (Array.isArray(messages) ? messages.length : 0), [messages]);

    useEffect(() => {
        if (isMinimized) return;

        if (shouldAutoScrollRef.current) {
            // instant for stability (images may change height)
            scrollToBottom(false);
            setTimeout(() => scrollToBottom(false), 50);
            setTimeout(() => scrollToBottom(false), 150);
        }
    }, [messageCount, isMinimized]);
    // =========================================

    return (
        <>
            {/* Chat Window */}
            <div
                style={containerStyle}
                className="bg-sidebar rounded-xl flex flex-col shadow-lg border border-border overflow-hidden relative"
            >
                {/* Header */}
                <div
                    className="p-3 border-b border-border flex justify-between items-center select-none cursor-move"
                    onMouseDown={onHeaderMouseDown}
                >
                    <div>
                        <p className="font-semibold text-base">VIP Card Chat</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`text-xs ${isConnected ? "text-green-500" : "text-red-500"}`}>
                            {isConnected ? "Connected" : "Disconnected"}
                            <span className={`w-2 h-2 ml-2 rounded-full inline-block ${isConnected ? "bg-green-500" : "bg-red-500"}`}></span>
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={toggleFullscreen}
                        >
                            {isFullscreen ? <Maximize2 /> : <Expand />}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={toggleMinimize}
                        >
                            <X />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                {!isMinimized && (
                    <>
                        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                            <div className="space-y-3">
                                {messages.map((m, index) => {
                                    const key =
                                        m?.chatId != null && m?.messageId != null
                                            ? `${m.chatId}-${m.messageId}`
                                            : m?.timestamp ?? m?.date ?? index;

                                    return (
                                        <ChatMessage
                                            key={key}
                                            message={m}
                                            onOpenImage={(images, startIndex) => openImageViewer(images, startIndex)}
                                        />
                                    );
                                })}
                            </div>
                        </ScrollArea>

                        {/* ✅ Jump to bottom button */}
                        {!isAtBottom && (
                            <button
                                type="button"
                                onClick={() => {
                                    scrollToBottom(true);
                                    shouldAutoScrollRef.current = true;
                                    setIsAtBottom(true);
                                }}
                                className="absolute right-4 bottom-[84px] bg-primary text-primary-foreground rounded-full w-10 h-10 shadow-md hover:opacity-90 flex items-center justify-center"
                                title="Scroll to bottom"
                            >
                                ↓
                            </button>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-border flex gap-2">
                            <Input
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />

                            <Button onClick={handleSendMessage} disabled={!isConnected || !message.trim()}>
                                Send
                            </Button>
                        </div>

                        {/* Resize handle */}
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

            {/* Image Viewer */}
            <ImageViewerWindow
                open={viewerOpen}
                images={viewerImages}
                startIndex={viewerIndex}
                onClose={closeImageViewer}
            />
        </>
    );
}
