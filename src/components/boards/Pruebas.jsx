import React, { useEffect, useState } from 'react';
import { Header } from '../layout/Header';

export const Pruebas = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Obtener el token de localStorage
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('No se encontró el token de acceso en localStorage');
      return;
    }

    // Crear la conexión WebSocket incluyendo el token en la URL
    const boardId = 2; /* ID del board */
    const ws = new WebSocket(`ws://localhost:8000/ws/board/${boardId}/?token=${accessToken}`);

    ws.onopen = () => {
      console.log('WebSocket conectado');
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const action = data['action'];

      // Añadir mensaje al estado de mensajes
      setMessages((prevMessages) => [...prevMessages, action]);
    };

    ws.onclose = () => {
      console.error('WebSocket cerrado inesperadamente');
    };

    setSocket(ws);

    // Limpiar la conexión WebSocket cuando el componente se desmonte
    return () => {
      ws.close();
    };
  }, []);

  // Función para enviar un mensaje a través de WebSocket
  const sendUpdate = (action) => {
    if (socket) {
      socket.send(JSON.stringify({
        'action': action,
      }));
    }
  };

  return (
    <div>
      <Header />
      <div>
        <h2>Mensajes recibidos:</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
        <button onClick={() => sendUpdate('update')}>Enviar actualización</button>
      </div>
    </div>
  );
};
