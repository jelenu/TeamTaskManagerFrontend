import React from "react";
// Import Link for navigation
import { Link } from "react-router-dom"; 
// Import custom hook for authentication context
import { useAuth } from "../../context/AuthContext"; 

export const Header = () => {
  // Destructure authentication status and logout function from context
  const { isAuthenticated, logout } = useAuth(); 

  // Function to handle logout action
  const handleLogout = () => {
    // Call logout function from context
    logout(); 
  };

  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">TeamTaskManager</div>
        <div className="flex space-x-4">
          {
            // Conditional rendering based on authentication status
            isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <>
                {/* Link to login page */}
                <Link to="/login">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Login
                  </button>
                </Link>

                {/* Link to registration page */}
                <Link to="/register">
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Register
                  </button>
                </Link>
              </>
            )
          }
        </div>
      </div>
    </header>
  );
};
