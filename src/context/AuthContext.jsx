import React, { createContext, useState, useContext } from 'react';
import Cookies from 'js-cookie';

// Create a context for authentication
const AuthContext = createContext();

// AuthProvider component to provide authentication context to children
export const AuthProvider = ({ children }) => {
    // State to keep track of authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to verify the current access token
    const verifyToken = async () => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            try {
                const response = await fetch("http://127.0.0.1:8000/auth/jwt/verify/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: accessToken }),
                });
                if (response.ok) {
                    // Set authenticated if the token is valid
                    setIsAuthenticated(true); 
                } else {
                     // Try to refresh the token if the verification fails
                    await refreshToken();
                }
            } catch (error) {
                // Attempt to refresh the token if there's an error
                await refreshToken(); 
            }
        } else {
            // Set not authenticated if no token is present
            logout()
        }
    };

    // Function to refresh the access token
    const refreshToken = async () => {
        try {
            const refreshToken = Cookies.get('refreshToken');
            const response = await fetch('http://127.0.0.1:8000/auth/jwt/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken  }),
            });
            const data = await response.json();
            if (data.access) {
                // Update the access token in cookie
                Cookies.set('accessToken', data.access, { secure: true, sameSite: 'strict' });

                // Set authenticated with the new access token
                setIsAuthenticated(true); 
            } else {
                // Set not authenticated if refreshing fails
                logout()
            }
        } catch (error) {
            // Set not authenticated if there's an error
            logout()
        }
    };

    // Function to log in and store tokens in cookie
    const login = (accessToken, refreshToken) => {
        Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
        Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });

        // Set authenticated upon login
        setIsAuthenticated(true); 
    };

    // Function to log out and remove tokens from cookie
    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        // Set not authenticated upon logout
        setIsAuthenticated(false); 
    };


    
    // Provide the context values to children components
    return (
        <AuthContext.Provider value={{ verifyToken, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
