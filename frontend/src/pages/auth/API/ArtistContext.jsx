import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const ArtistContext = createContext();

export const ArtistProvider = ({ children }) => {
  const [artist, setArtist] = useState(() => {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [headers, setHeaders] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? { 'Authorization': `Bearer ${storedToken}` } : null;
  });
  const navigate = useNavigate();

  const redirectBasedOnStatus = (status) => {
    console.log(status);
    ;
    switch (status) {
      case 0:
        navigate('/auth/create-profile/personal-details');
        break;
      case 1:
        navigate('/auth/create-profile/professional-details');
        break;
      case 2:
        navigate('/auth/create-profile/documentation-details');
        break;
      case 3:
        navigate('/auth/profile-status?status=success');
        break;
      case 4:
        navigate('/dashboard');
        break;
      case 5:
        navigate(`/auth/profile-status?status=rejected`);
        break;
      default:
        navigate('/auth/login');
    }
  };
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken || storedToken === 'undefined' || storedToken === 'null') {
        if (![
          '/auth/login', 
          '/auth/signup', 
          '/auth/forgot-password',
          '/auth/payment',
          '/auth/signin',
          '/auth/signup/payment-callback',
          '/auth/reset-password'
        ].includes(window.location.pathname)) {
          navigate('/auth/login');
        }
        return;
      }

      try {
        const decodedToken = jwtDecode(storedToken);
        if (!decodedToken?.id) {
          throw new Error('Invalid token');
        }

        // Only set state if it's different
        setArtist(prev => prev?.id === decodedToken.id ? prev : decodedToken);
        setToken(prev => prev === storedToken ? prev : storedToken);
        setHeaders(prev => prev?.Authorization === `Bearer ${storedToken}` ? prev : { 'Authorization': `Bearer ${storedToken}` });

        // Handle onboarding redirection
        if (window.location.pathname.startsWith('/dashboard') && decodedToken.onboarding_status !== 4) {
          redirectBasedOnStatus(decodedToken.onboarding_status);
        }
      } catch (error) {
        console.error('Token validation error:', error);
        logout();
      }
    };

    verifyToken();
  }, [navigate]);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setArtist(null);
    setToken(null);
    setHeaders(null);
    navigate('/auth/login');
    window.location.reload();
  };

  const login = (token, userData) => {
    try { 
      const decodedToken = jwtDecode(token);
      if (!decodedToken?.id) {
        throw new Error('Invalid token');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));

      setArtist(decodedToken);
      setToken(token);
      setHeaders({ 'Authorization': `Bearer ${token}` });

      redirectBasedOnStatus(decodedToken.onboarding_status);
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
    }
  };

  return (
    <ArtistContext.Provider value={{ artist, setArtist, logout, login, headers }}>
      {children}
    </ArtistContext.Provider>

    //   <ArtistContext.Provider value={{ setArtist, login }}>
    //   {children}
    // </ArtistContext.Provider>
  );
};

export const useArtist = () => useContext(ArtistContext);