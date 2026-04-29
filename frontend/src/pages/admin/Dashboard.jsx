import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import DroneLoader from '../../components/ui/DroneLoader';
import '../../admin.css';

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!user || !user.role) {
      if (!isLoggingOut.current) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    
    const fetchBlogs = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const q = query(blogsRef, orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        
        const fetchedBlogs = [];
        snapshot.forEach((docSnap) => {
          fetchedBlogs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setBlogs(fetchedBlogs);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [user]);

  const handleLogout = async () => {
    isLoggingOut.current = true;
    navigate('/blog');
    await logout();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="admin-container">
      <header className="header">
        <div className="nav">
          <div className="brand">
            <img src="/assets/club-logo.jpg" alt="Team Vajra logo" />
            <div>
              <div className="title">TEAM VAJRA</div>
              <div className="subtitle">Blog Dashboard</div>
            </div>
          </div>
          <div className="nav-links">
            <Link to="/blog">View Blog</Link>
            <Link to="/admin/editor" className="btn-new">+ New Post</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="user-bar">
        <span>Welcome, {user.name}</span>
        <span className={`role-badge ${isAdmin ? 'admin' : 'member'}`}>
          {user.role ? user.role.toUpperCase() : 'MEMBER'}
        </span>
      </div>

      <main className="dashboard">
        <div className="dashboard-header">
          <h1>Blog Posts</h1>
          <Link to="/admin/editor" className="btn-primary">+ Create New Post</Link>
        </div>

        <div className="blog-list">
          {loading ? (
            <DroneLoader fullScreen={false} message="Synchronizing with hangar..." />
          ) : blogs.length === 0 ? (
            <div className="empty-state">
              <h3>No blog posts yet</h3>
              <p>Click "Create New Post" to write your first blog!</p>
            </div>
          ) : (
            blogs.map((blog) => {
              const date = blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
              }) : 'Draft';
              
              const canEdit = isAdmin || blog.authorEmail === user.email;
              const canDelete = isAdmin;

              return (
                <div key={blog.id} className="blog-card">
                  <div className="blog-info">
                    <h3>{blog.title || 'Untitled'}</h3>
                    <div className="blog-meta">
                      <span className="date">{date}</span>
                      <span className="author">By {blog.authorName || 'Unknown'}</span>
                      <span className="category">{blog.category || 'General'}</span>
                      <span className={`status ${blog.status === 'published' ? 'published' : 'draft'}`}>
                        {blog.status || 'draft'}
                      </span>
                    </div>
                    <p className="excerpt">{blog.excerpt || ''}</p>
                  </div>
                  <div className="blog-actions">
                    {canEdit && <Link to={`/admin/editor?id=${blog.id}`} className="btn-edit">Edit</Link>}
                    {canDelete && <button onClick={() => handleDelete(blog.id)} className="btn-delete">Delete</button>}
                    <Link to={`/blog#${blog.slug || blog.id}`} className="btn-view" target="_blank" rel="noopener noreferrer">View</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <footer>
        <p>© {new Date().getFullYear()} TEAM VAJRA. All Rights Reserved. | Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default Dashboard;
