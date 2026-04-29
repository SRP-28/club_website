import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import DroneLoader from '../components/ui/DroneLoader';
import '../styles/Forms.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginAdmin = useAuthStore((state) => state.loginAdmin);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && user.role) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const passwordHash = await hashPassword(password);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Invalid email or password');
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.passwordHash !== passwordHash) {
        throw new Error('Invalid email or password');
      }

      loginAdmin({
        name: userData.name,
        email: userData.email,
        role: userData.role
      });

    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <DroneLoader message="Authenticating..." />}
      <div style={{
        minHeight: '100vh',
        background: '#050608',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(145deg, #0a0c10, #111318)',
          border: '1px solid rgba(247, 194, 117, 0.2)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img 
              src="/assets/club-logo.jpg" 
              alt="Team Vajra Logo" 
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '3px solid #f7c275',
                marginBottom: '15px'
              }} 
            />
            <h1 style={{ color: '#f7c275', fontSize: '1.8rem', fontWeight: 700 }}>TEAM VAJRA</h1>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '5px' }}>Member Portal</p>
          </div>

          {errorMsg && (
            <div style={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid #f44336',
              color: '#f44336',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{ display: 'block', color: '#f7c275', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                id="email" 
                placeholder="your.email@mmcoe.edu.in" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(247, 194, 117, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password" style={{ display: 'block', color: '#f7c275', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
                Password
              </label>
              <input 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(247, 194, 117, 0.3)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #800000 0%, #a00000 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '10px',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <Link to="/" style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '25px',
            color: '#888',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}>
            ← Back to Website
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
