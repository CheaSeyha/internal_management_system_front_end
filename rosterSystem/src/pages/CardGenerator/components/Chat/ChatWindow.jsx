import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWebSocket from "../Hook/useWebSocket"; // adjust if needed
import { X, Expand, Maximize2, RotateCw, ChevronLeft, ChevronRight, RotateCwSquare } from "lucide-react";
import useDraggableWindow from "./useDraggableWindow";
import ChatMessage from "./ChatMessage";
import ImageViewerWindow from "./ImageViewer";

export default function ChatWindow() {
    const { isConnected, messages, connectionStatus, clearMessages } = useWebSocket();

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

    // ✅ Image viewer now supports album (array) + start index
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

    return (
        <>
            {/* Chat Window */}
            <div
                style={containerStyle}
                className="bg-sidebar rounded-xl flex flex-col shadow-lg border border-border overflow-hidden"
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
                        </span>



                        <Button variant="outline" size="sm" onMouseDown={(e) => e.stopPropagation()} onClick={toggleFullscreen}>
                            {isFullscreen ? <Maximize2 /> : <Expand />}
                        </Button>

                        <Button variant="outline" size="sm" onMouseDown={(e) => e.stopPropagation()} onClick={toggleMinimize}>
                            <X />
                        </Button>
                    </div>
                </div>

                {/* Body */}
                {!isMinimized && (
                    <>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-3">
                                {messages.map((message, index) => {
                                    const key =
                                        message?.chatId != null && message?.messageId != null
                                            ? `${message.chatId}-${message.messageId}`
                                            : message?.timestamp ?? message?.date ?? index;

                                    return (
                                        <ChatMessage
                                            key={key}
                                            message={message}
                                            onOpenImage={(images, startIndex) => openImageViewer(images, startIndex)}
                                        />
                                    );
                                })}
                            </div>
                        </ScrollArea>

                        {/* Input (UI only) */}
                        <div className="p-4 border-t border-border flex gap-2">
                            <Input placeholder="Type a message..." />
                            <Button disabled={!isConnected}>Send</Button>
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

            {/* ✅ Image Viewer supports Prev/Next */}
            <ImageViewerWindow
                open={viewerOpen}
                images={viewerImages}
                startIndex={viewerIndex}
                onClose={closeImageViewer}
            />
        </>
    );
}
