import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const EmailActivation = () => {
  const { param1, param2 } = useParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/auth/users/activation/${param1}/${param2}/`, {
          method: 'GET',
        });

        if (response.ok) {
          setMessage('Your account has been activated successfully!');
        } else {
          setMessage('There was an issue activating your account. Please check the link or try again.');
        }
      } catch (error) {
        setMessage('An error occurred while trying to activate your account. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    activateAccount();
  }, [param1, param2]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        {loading ? (
          <p className="text-gray-600">Activating your account...</p>
        ) : (
          <p className="text-gray-800">{message}</p>
        )}
      </div>
    </div>
  );
};
