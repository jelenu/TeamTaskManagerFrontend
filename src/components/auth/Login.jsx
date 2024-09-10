import React, { useState, useEffect } from "react";
// Import useNavigate for programmatic navigation
import { useNavigate } from "react-router-dom";
// Import custom hook for authentication context
import { useAuth } from "../../context/AuthContext";
import Cookies from 'js-cookie';
 
export const Login = () => {
  // State variables to store username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Destructure login function from authentication context
  const { login } = useAuth();

  // Effect to check if user is already authenticated
  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      // Navigate back if an access token is present
      navigate(-1);
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Prepare login data
    const loginData = {
      username: username,
      password: password,
    };

    try {
      // Send login request to the server
      const response = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      // Parse response JSON
      const data = await response.json();

      // Check if tokens are received
      if (data.access && data.refresh) {
        // Log tokens to the console
        console.log("JWT Token:", data);

        // Call login function with tokens
        login(data.access, data.refresh);

        // Clear input fields and error message
        setUsername("");
        setPassword("");
        setErrorMessage(null);

        // Navigate back after successful login
        navigate("/");
      } else {
        // Set error message if login fails
        setErrorMessage(data.detail);
      }
    } catch (error) {
      // Set error message if there's an exception
      setErrorMessage("Login failed. Please check your credentials.");

      // Log error to the console
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {/* Display error message if present */}
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {/* Form with submit handler */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              // Update username state on change
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              // Update password state on change
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
