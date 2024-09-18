import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { BoardAddUser } from "./BoardAddUser";
import { List } from "./lists/List";

export const Board = ({ boardId, boardName }) => {
  const [usernames, setUsernames] = useState([]);
  const [role, setRole] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState(""); // Estado para el nombre de la nueva lista
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.error("Access token not found in cookies");
      return;
    }

    const socket = new WebSocket(`ws://localhost:8000/ws/board/${boardId}/`);

    socket.onopen = () => {
      console.log(`WebSocket Board ${boardName} (ID: ${boardId}) connected`);
    };

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("Data received from boards:", data);

      if (data.type === "initial_data") {
        setUsernames(data.users.map((user) => user.username));
        setRole(data.role);
        setLists(data.lists);
      }
      // Manejar la recepción de una nueva lista
      if (data.action === 'new_list') {
        const newList = {
          ...data.list,
          tasks: [], // Añadir el campo `tasks` con una lista vacía
        };

        setLists((prevLists) => [...prevLists, newList]);

      }

    };

    socket.onclose = (e) => {
      console.error("WebSocket closed unexpectedly", e);
    };

    socket.onerror = (e) => {
      console.error("Error in WebSocket connection", e);
    };

    setWs(socket);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [boardId, boardName]);

  // Función para crear una nueva lista
  const createNewList = (e) => {
    e.preventDefault(); // Evitar el comportamiento predeterminado del formulario

    if (newListName.trim() === "") {
      console.error("List name cannot be empty");
      return;
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          action: "create_list",
          name: newListName,
        })
      );
      setNewListName(""); // Limpiar el campo después de enviar
    }
  };

  return (
    <div className="">
      <div className="flex m-2">
        <div className="font-bold w-1/6 text-center self-center">
          {boardName}
        </div>

        {(role === "creator" || role === "coordinator") && (
          <BoardAddUser boardId={boardId} />
        )}
      </div>

      <div>
        <h3>Role: {role}</h3>
        <h4>Users:</h4>
        <div>
          {usernames.map((username, index) => (
            <div key={index}>{username}</div>
          ))}
        </div>

        <div className="flex mt-4">
          {lists.length > 0 ? (
            lists.map((list, index) => (
              <List key={index} list={list} />
            ))
          ) : (
            <div></div>
          )}

          {/* Formulario para crear una nueva lista */}
        <form onSubmit={createNewList} className="mt-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="p-2 rounded bg-white text-black"
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-500 text-white rounded"
          >
            Create List
          </button>
        </form>
        </div>
        
      </div>
    </div>
  );
};
