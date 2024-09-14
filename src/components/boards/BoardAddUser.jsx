import React, { useState } from "react";
import Cookies from "js-cookie";

export const BoardAddUser = ({ boardId }) => {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("standard");
  const [responseMessage, setResponseMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal

  // Function to add a user to the board
  const addUserToBoard = async () => {
    const accessToken = Cookies.get("accessToken");
    const csrfToken = Cookies.get("csrftoken"); // Get the CSRF token from cookies

    if (!accessToken) {
      console.error("Access token not found in cookies");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/taskboard/boards/add_user/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
          },
          credentials: "include", // Ensure cookies are sent with the request
          body: JSON.stringify({
            board_id: boardId,
            user_name: userName,
            role: role,
          }), // Send data in the body
        }
      );

      const data = await response.json();

      setUserName("")
      if (response.ok) {
        console.log("User successfully added to the board", data);
        setResponseMessage(data.message); // Display the success message
      } else {
        console.error("Error adding user to the board:", data.message);
        setResponseMessage(data.message); // Display the error message
      }
    } catch (error) {
      console.error("Error with the request:", error);
      setResponseMessage("An error occurred while trying to add the user.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addUserToBoard();
  };

  // Función para abrir y cerrar el modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Botón que abre el modal */}
      <button
        onClick={toggleModal}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      >
        Add User to Board
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            {/* Botón para cerrar el modal */}
            <button
              onClick={toggleModal}
              className="text-gray-500 hover:text-gray-700 float-right"
            >
              &#x2715;
            </button>

            {/* Formulario dentro del modal */}
            <h2 className="text-2xl mb-4">Add User to Board</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label htmlFor="userName" className="block mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="role" className="block mb-2">
                  Role:
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="standard">Standard</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              >
                Add user to the board
              </button>
            </form>

            {/* Mostrar mensaje de respuesta */}
            {responseMessage && (
              <p className="mt-4 text-center text-red-500">{responseMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
