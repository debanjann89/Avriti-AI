import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  };

  const register = async (name, email, password, otp) => {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/register', { name, email, password, otp });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  };

  const updateProfile = async (profileData) => {
    if (!user) return;
    const res = await axios.put('http://127.0.0.1:8000/api/users/profile', {
      user_id: user.id,
      ...profileData
    });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const updateProfilePicture = async (file) => {
    if (!user) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post(`http://127.0.0.1:8000/api/users/profile-picture?user_id=${user.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const updatedUser = { ...user, profile_picture: res.data.profile_picture };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return res.data.profile_picture;
  };

  const toggleUserRole = async (targetRole) => {
    if (!user) return;
    const res = await axios.put('http://127.0.0.1:8000/api/users/role', {
      user_id: user.id,
      role: targetRole
    });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/users/profile-info?user_id=${user.id}`);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error("Error refreshing user context", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, updateProfilePicture, toggleUserRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

