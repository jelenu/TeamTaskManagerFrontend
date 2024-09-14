import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const Notifications = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [reconnectTimeout, setReconnectTimeout] = useState(null);

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) {
            console.error("Access token not found in cookies");
            return;
        }

        const createWebSocket = () => {
            const ws = new WebSocket(`ws://localhost:8000/ws/notifications/`);

            ws.onopen = () => {
                console.log("WebSocket Notifications connected");
                setIsConnected(true);
                if (reconnectTimeout) {
                    clearTimeout(reconnectTimeout);
                    setReconnectTimeout(null);
                }
            };

            ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log("Data received from notifications:", data);
            };

            ws.onclose = (e) => {
                console.error("WebSocket unexpectedly closed", e);
                setIsConnected(false);
                if (Cookies.get("accessToken")) {
                    // Retry connection after a delay
                    setReconnectTimeout(setTimeout(createWebSocket, 5000));
                } else {
                    console.log("Access token no longer available, not attempting to reconnect");
                }
            };

            ws.onerror = (e) => {
                console.error("WebSocket connection error", e);
            };

            return () => {
                if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                    ws.close();
                }
            };
        };

        const cleanup = createWebSocket();

        return cleanup;
        // eslint-disable-next-line
    }, []);

    return (
        <div className="text-white pr-2">
            Notifications
            {isConnected ? " (Connected)" : " (Disconnected)"}
        </div>
    );
};
