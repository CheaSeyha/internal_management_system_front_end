import { useRef } from "react";

export default function useNotificationSound(src) {
    const audioRef = useRef(null);

    if (!audioRef.current) {
        audioRef.current = new Audio(src);
        audioRef.current.volume = 0.6; // adjust
    }

    const play = () => {
        if (!audioRef.current) return;

        // rewind in case multiple messages arrive quickly
        audioRef.current.currentTime = 0;

        audioRef.current
            .play()
            .catch(() => {
                // browser may block until user interaction
            });
    };

    return play;
}
