import React, { useEffect } from "react";
import Cookies from "js-cookie";
import {BoardAddUser} from "./BoardAddUser"


export const Board = ({ boardId, boardName }) => {
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.error("No se encontró el token de acceso en las cookies");
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/board/${boardId}/`);

    ws.onopen = () => {
      console.log(`WebSocket Board ${boardName} (ID: ${boardId}) conectado`);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Datos recibidos del boards:", data);
    };

    ws.onclose = (e) => {
      console.error("WebSocket cerrado inesperadamente", e);
    };

    ws.onerror = (e) => {
      console.error("Error en la conexión WebSocket", e);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [boardId, boardName]);

  return (
    <div>
      <div> {boardName}</div>
      <BoardAddUser boardId={boardId} />

    </div>
  );
};
