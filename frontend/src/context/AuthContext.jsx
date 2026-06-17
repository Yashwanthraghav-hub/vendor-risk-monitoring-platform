import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vrmp_token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If token exists, load user profile
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const res = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('vrmp_token', data.token);
        setToken(data.token);
        setUser(data.user);
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network connection failed' };
    }
  };

  const register = async (name, email, password, role, department) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, department })
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Network connection failed' };
    }
  };

  const forgotPassword = async (email, newPassword) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message || 'Password update failed' };
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      return { success: false, error: 'Network connection failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('vrmp_token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    forgotPassword,
    logout,
    isAdmin: () => user?.role === 'Admin',
    isProcurementManager: () => user?.role === 'Procurement Manager',
    isRiskAnalyst: () => user?.role === 'Risk Analyst',
    isAuthorizedForEdit: () => ['Admin', 'Procurement Manager'].includes(user?.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
