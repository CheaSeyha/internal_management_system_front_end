import React from "react";

function getUsername(from) {
    return (
        from?.username ||
        `${from?.firstName || ""} ${from?.lastName || ""}`.trim() ||
        "Unknown"
    );
}

export default function ChatMessage({ message, onOpenImage }) {
    const username = getUsername(message?.from);
    const avatar = message?.from?.profilePhotoUrl || "https://via.placeholder.com/32";

    // ✅ Normalize photos into one array (single + album)
    const photos = (() => {
        if (message?.type === "photo" && message?.photo?.fileUrl) {
            return [{ fileUrl: message.photo.fileUrl, caption: message.caption || "" }];
        }
        if (message?.type === "photo_album" && Array.isArray(message?.photos)) {
            return message.photos.filter((p) => p?.fileUrl);
        }
        return [];
    })();

    const hasPhotos = photos.length > 0;

    // Caption: prefer message.caption, else first photo.caption
    const caption =
        message?.caption ||
        (message?.type === "photo_album" ? photos?.[0]?.caption : "") ||
        "";

    return (
        <div className="flex items-start gap-2">
            <img className="w-8 h-8 rounded-full object-cover" src={avatar} alt="" />

            <div className="max-w-[75%] bg-muted px-4 py-2 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-neutral-500">{username}</span>
                    {message?.isEdited && <span className="text-xs text-neutral-400">(edited)</span>}
                </div>

                {/* TEXT */}
                {message?.type === "text" && message?.text && (
                    <p className="text-sm break-words">{message.text}</p>
                )}

                {/* PHOTOS (single or album) */}
                {hasPhotos && (
                    <PhotoGrid
                        photos={photos}
                        onOpen={(startIndex) =>
                            onOpenImage(
                                photos.map((x) => x.fileUrl),
                                startIndex
                            )
                        }
                    />
                )}

                {/* Caption */}
                {hasPhotos && caption ? (
                    <p className="mt-2 text-sm break-words">{caption}</p>
                ) : null}

                {/* Timestamp */}
                {message?.timestamp && (
                    <p className="mt-1 text-[11px] text-neutral-400">
                        {new Date(message.timestamp).toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
}

function PhotoGrid({ photos, onOpen }) {
    // show at most 4 thumbs; overlay for remaining
    const maxThumbs = 4;
    const thumbs = photos.slice(0, maxThumbs);
    const remaining = photos.length - maxThumbs;

    // 1 image
    if (photos.length === 1) {
        const url = photos[0].fileUrl;
        return (
            <button type="button" className="block" onClick={() => onOpen(0)}>
                <img
                    src={url}
                    alt="telegram-photo"
                    className="max-w-[220px] rounded-lg cursor-zoom-in hover:opacity-90 transition"
                    loading="lazy"
                />
            </button>
        );
    }

    // 2+ images grid
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
