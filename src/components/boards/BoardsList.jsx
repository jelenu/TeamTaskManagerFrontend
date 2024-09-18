import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const BoardsList = ({ onBoardSelect }) => {
  const [boards, setBoards] = useState([]);
  const [createBoardResponseMessage, setCreateBoardResponseMessage] = useState('');
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const { isAuthenticated, verifyToken } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      const csrfToken = Cookies.get("csrftoken");
      try {
        const response = await fetch(`http://localhost:8000/taskboard/boards/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setBoards(data.boards);
        } else {
          console.error("Error fetching boards:", data.message);
        }
      } catch (error) {
        console.error("Error with the request:", error);
      }
    };

    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    await verifyToken();
    if (!isAuthenticated) {
      navigate("/login"); 
      return;
    }

    if (!newBoardName.trim()) {
      setCreateBoardResponseMessage("Board name cannot be empty");
      return;
    }

    const csrfToken = Cookies.get("csrftoken");
    try {
      const response = await fetch(`http://localhost:8000/taskboard/boards/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ name: newBoardName }),
      });

      const data = await response.json();
      if (response.ok) {
        setBoards((prevBoards) => [...prevBoards, { id: data.board_id, name: data.board_name }]);
        setNewBoardName('');
        setCreateBoardResponseMessage('');
      } else {
        setCreateBoardResponseMessage(data.message);
      }
    } catch (error) {
      setCreateBoardResponseMessage("An error occurred while trying to create the board.");
    }
  };

  const handleBoardClick = (board) => {
    setSelectedBoardId(board.id);
    onBoardSelect(board);
  };

  return (
    <div>
      {boards.length > 0 ? (
        boards.map((board) => (
          <button
            key={board.id}
            className={`w-full p-4 text-left hover:bg-gray-700 ${
              board.id === selectedBoardId ? 'bg-gray-500' : ''
            }`}
            onClick={() => handleBoardClick(board)}
          >
            {board.name}
          </button>
        ))
      ) : (
        <p className="p-4">No boards available</p>
      )}
      <div className="p-2 flex">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter new board name"
          className="p-1 border border-gray-300 text-sm text-black rounded"
        />
        <button
          onClick={handleCreateBoard}
          className="ml-1 p-1 bg-blue-500 text-sm text-white rounded hover:bg-blue-600"
        >
          Create
        </button>
      </div>
      {createBoardResponseMessage && <p className="pl-4 text-red-500">{createBoardResponseMessage}</p>}
    </div>
  );
};
