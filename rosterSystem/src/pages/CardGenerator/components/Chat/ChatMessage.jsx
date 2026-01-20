import React from "react";

export default function ChatMessage({ message, onOpenImage }) {
    const username =
        message?.from?.username ||
        `${message?.from?.firstName || ""} ${message?.from?.lastName || ""}`.trim() ||
        "Unknown";

    const avatar = message?.from?.profilePhotoUrl || "https://via.placeholder.com/32";

    return (
        <div className="flex items-start gap-2">
            <img className="w-8 h-8 rounded-full object-cover" src={avatar} alt="" />

            <div className="max-w-[75%] bg-muted px-4 py-2 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-neutral-500">{username}</span>
                    {message?.isEdited && <span className="text-xs text-neutral-400">(edited)</span>}
                </div>

                {message?.type === "text" && message?.text && (
                    <p className="text-sm break-words">{message.text}</p>
                )}

                {message?.type === "photo" && message?.photo?.fileUrl && (
                    <div className="space-y-2">
                        <button type="button" className="block" onClick={() => onOpenImage(message.photo.fileUrl)}>
                            <img
                                src={message.photo.fileUrl}
                                alt="telegram-photo"
                                className="max-w-[220px] rounded-lg cursor-zoom-in hover:opacity-90 transition"
                                loading="lazy"
                            />
                        </button>

                        {message?.caption && <p className="text-sm break-words">{message.caption}</p>}
                    </div>
                )}

                {message?.timestamp && (
                    <p className="mt-1 text-[11px] text-neutral-400">{new Date(message.timestamp).toLocaleString()}</p>
                )}
            </div>
        </div>
    );
}
