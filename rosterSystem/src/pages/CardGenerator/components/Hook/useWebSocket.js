import { useState, useEffect, useRef, useCallback } from "react";

const makeKey = (msg) => {
    // best for telegram
    if (msg?.chatId != null && msg?.messageId != null) return `${msg.chatId}-${msg.messageId}`;

    // fallback (try to keep stable)
    return msg?.id ?? msg?.timestamp ?? msg?.date ?? `${msg?.type || "msg"}-${Math.random()}`;
};

const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");

    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    // ✅ Prevent StrictMode double connect (DEV)
    const didInitRef = useRef(false);

    const connect = useCallback(() => {
        // ✅ If already have a socket connecting/open -> do nothing
        if (
            wsRef.current &&
            (wsRef.current.readyState === WebSocket.OPEN ||
                wsRef.current.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        try {
            const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}?token=${encodeURIComponent(
                import.meta.env.VITE_TOKEN_KEY
            )}`;

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                setIsConnected(true);
                setConnectionStatus("Connected");
            };

            ws.onmessage = (event) => {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    // ignore non-json
                    return;
                }

                // ignore system
                if (data?.type === "system") return;

                // ✅ HISTORY: replace list (dedupe)
                if (data?.type === "history" && Array.isArray(data.messages)) {
                    const map = new Map();
                    for (const m of data.messages) {
                        map.set(makeKey(m), m);
                    }
                    setMessages(Array.from(map.values()));
                    return;
                }

                // ✅ MESSAGE UPDATE: replace existing message by key using newData
                if (data?.type === "message_update" && data?.newData) {
                    const updated = data.newData;

                    setMessages((prev) => {
                        const key = makeKey(updated);
                        const idx = prev.findIndex((m) => makeKey(m) === key);

                        if (idx !== -1) {
                            const copy = [...prev];
                            copy[idx] = { ...copy[idx], ...updated }; // merge
                            return copy;
                        }

                        // if user joined late and message not in list yet
                        return [...prev, updated];
                    });

                    return;
                }

                // ✅ NORMAL MESSAGE: append but dedupe / update by key
                setMessages((prev) => {
                    const key = makeKey(data);
                    const idx = prev.findIndex((m) => makeKey(m) === key);

                    // update existing (duplicate / resend / etc.)
                    if (idx !== -1) {
                        const copy = [...prev];
                        copy[idx] = { ...copy[idx], ...data };
                        return copy;
                    }

                    // append new
                    return [...prev, data];
                });
            };

            ws.onerror = () => {
                setConnectionStatus("Error");
            };

            ws.onclose = (event) => {
                setIsConnected(false);

                // auth close
                if (event.code === 1008) {
                    setConnectionStatus("Authentication Failed");
                    return;
                }

                setConnectionStatus("Disconnected");

                // reconnect once timer (avoid stacking timers)
                if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

                reconnectTimeoutRef.current = setTimeout(() => {
                    setConnectionStatus("Reconnecting...");
                    connect();
                }, 3000);
            };
        } catch (err) {
            console.error("WebSocket connect error:", err);
            setConnectionStatus("Error");
        }
    }, []);

    useEffect(() => {
        // ✅ StrictMode guard: run only once in dev
        if (didInitRef.current) return;
        didInitRef.current = true;

        connect();

        return () => {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

            if (wsRef.current) {
                wsRef.current.onopen = null;
                wsRef.current.onmessage = null;
                wsRef.current.onerror = null;
                wsRef.current.onclose = null;
                wsRef.current.close();
                wsRef.current = null;
            }

            didInitRef.current = false;
        };
    }, [connect]);

    const clearMessages = () => setMessages([]);

    return { isConnected, messages, connectionStatus, clearMessages };
};

export default useWebSocket;
