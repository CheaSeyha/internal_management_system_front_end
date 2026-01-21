import React from "react";
import jsIcon from "../../../../assets/webIcon/JS_ICON.png";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
function getUsername(from) {
    return (
        from?.username ||
        `${from?.firstName || ""} ${from?.lastName || ""}`.trim() ||
        "Unknown"
    );
}

function getPhotoUrl(obj) {
    if (!obj) return null;
    if (typeof obj === "string") return obj;
    return obj.fileUrl || obj.file_url || obj.url || obj.href || obj.link || null;
}

export default function ChatMessage({ message, onOpenImage, onPickText }) {
    const username = getUsername(message?.from);
    const avatar = message?.from?.profilePhotoUrl || jsIcon;

    // ✅ treat outgoing bot messages as "user side"
    const isMySide = Boolean(message?.from?.isBot && message?.isOutgoing);

    // ✅ Normalize photos into one array (single + album) with robust url support
    const photos = (() => {
        if (message?.type === "photo") {
            const url = getPhotoUrl(message?.photo) || getPhotoUrl(message?.photos?.[0]);
            return url ? [{ fileUrl: url, caption: message.caption || "" }] : [];
        }

        if (message?.type === "photo_album" && Array.isArray(message?.photos)) {
            return message.photos
                .map((p) => ({ fileUrl: getPhotoUrl(p), caption: p?.caption || "" }))
                .filter((p) => Boolean(p.fileUrl));
        }

        return [];
    })();

    const hasPhotos = photos.length > 0;

    const caption =
        message?.caption ||
        (message?.type === "photo_album" ? photos?.[0]?.caption : "") ||
        "";

    // ✅ Layout classes
    const rowClass = isMySide ? "justify-end" : "justify-start";
    const bubbleClass = isMySide
        ? "bg-blue-500 text-white rounded-2xl rounded-tr-none"
        : "bg-muted rounded-2xl rounded-tl-none";

    return (
        <div className={`flex items-start gap-2 ${rowClass}`}>
            {/* Avatar left (other side) */}
            {!isMySide && (
                <img
                    className="w-8 h-8 rounded-full object-cover border border-muted bg-black"
                    src={avatar}
                    alt=""
                />
            )}
            {/* Chat response  */}
            <div className={`max-w-[75%] px-4 py-2 ${bubbleClass}`}>
                {/* Username (optional for my side) */}
                <div className={`flex items-center gap-2 mb-1 ${isMySide ? "justify-end" : "justify-start"}`}>
                    {!isMySide && <span className="text-sm text-neutral-500">{username}</span>}
                    {message?.isEdited && <span className="text-xs opacity-70">(edited)</span>}
                </div>

                {/* TEXT */}
                {message?.type === "text" && message?.text && (
                    <div className="flex items-start gap-2">
                        <p className="break-words flex-1">{message.text}</p>

                        {!isMySide && (
                            <button
                                type="button"
                                onMouseDown={(e) => e.stopPropagation()} // important for draggable window
                                onClick={() => onPickText(message.text)} // ✅ send text upward
                                className="ml-2 rounded-full border p-1 hover:opacity-60 cursor-pointer active:scale-95 hover:bg-muted"
                                title="Insert into Name"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}


                {/* PHOTOS */}
                {hasPhotos && (
                    <PhotoGrid
                        photos={photos}
                        onOpen={(startIndex) =>
                            onOpenImage(
                                photos.map((x) => x.fileUrl),
                                startIndex
                            )
                        }
                        isMySide={isMySide}
                    />
                )}

                {/* Caption */}
                {hasPhotos && caption ? (
                    <p className="mt-2 text-sm break-words">{caption}</p>
                ) : null}

                {/* Timestamp */}
                {message?.timestamp && (
                    <p className={`mt-1 text-[11px] opacity-70 ${isMySide ? "text-right" : ""}`}>
                        {new Date(message.timestamp).toLocaleString()}
                    </p>
                )}


            </div>

            {/* Avatar right (my side) */}
            {isMySide && (
                <img
                    className="w-8 h-8 rounded-full object-cover border border-muted bg-black"
                    src={avatar}
                    alt=""
                />
            )}
        </div>
    );
}

function PhotoGrid({ photos, onOpen, isMySide }) {
    const maxThumbs = 4;
    const thumbs = photos.slice(0, maxThumbs);
    const remaining = photos.length - maxThumbs;

    // Optional: slightly different sizing for my side
    const singleClass = isMySide ? "max-w-[200px]" : "max-w-[220px]";

    if (photos.length === 1) {
        const url = photos[0].fileUrl;
        return (
            <button type="button" className="block" onClick={() => onOpen(0)}>
                <img
                    src={url}
                    alt="telegram-photo"
                    className={`${singleClass} rounded-lg cursor-zoom-in hover:opacity-90 transition`}
                    loading="lazy"
                />
            </button>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            {thumbs.map((p, idx) => {
                const isLastThumb = idx === thumbs.length - 1 && remaining > 0;

                return (
                    <button
                        key={p.fileUrl}
                        type="button"
                        className="relative block"
                        onClick={() => onOpen(idx)}
                    >
                        <img
                            src={p.fileUrl}
                            alt="telegram-photo"
                            className="w-[140px] h-[140px] object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition"
                            loading="lazy"
                        />

                        {isLastThumb && (
                            <div className="absolute inset-0 rounded-lg bg-black/60 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">+{remaining}</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
