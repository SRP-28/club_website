import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import useAuthStore from './store/useAuthStore';
import DroneLoader from './components/ui/DroneLoader';
import PageLayout from './components/layout/PageLayout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Achievements from './pages/Achievements';
import Drones from './pages/Drones';
import Gallery from './pages/Gallery';
import Team from './pages/Team';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Editor from './pages/admin/Editor';

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [setUser]);

  if (isLoading) {
    return <DroneLoader message="Preparing for takeoff..." />;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<Home />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="drones" element={<Drones />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="team" element={<Team />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<Legal title="About Us" />} />
          <Route path="privacy-policy" element={<Legal title="Privacy Policy" />} />
          <Route path="disclaimer" element={<Legal title="Disclaimer" />} />
          <Route path="terms-of-service" element={<Legal title="Terms of Service" />} />
          <Route path="*" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/login.html" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard.html" element={<Dashboard />} />
        <Route path="/admin/editor" element={<Editor />} />
        <Route path="/admin/editor.html" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
