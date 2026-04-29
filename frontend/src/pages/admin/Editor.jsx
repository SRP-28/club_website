import React, { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import useAuthStore from '../../store/useAuthStore';
import DroneLoader from '../../components/ui/DroneLoader';
import 'react-quill/dist/quill.snow.css';
import '../../admin.css';

const IMGBB_API_KEY = '5d8f4ec7c4d8b5f6a7c8b9e0f1a2b3c4';

const Editor = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [featured, setFeatured] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!user || !user.role) {
      if (!isLoggingOut.current) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || !editId) return;

    const fetchBlog = async () => {
      try {
        const docRef = doc(db, 'blogs', editId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blog = docSnap.data();

          if (user.role !== 'admin' && blog.authorEmail !== user.email) {
            alert('You do not have permission to edit this post.');
            navigate('/admin/dashboard');
            return;
          }

          setTitle(blog.title || '');
          setCategory(blog.category || 'General');
          setTags((blog.tags || []).join(', '));
          setExcerpt(blog.excerpt || '');
          setLinkedIn(blog.authorLinkedIn || '');
          setFeatured(blog.featured || false);
          setContent(blog.content || '');
          if (blog.featuredImage) {
            setImageUrl(blog.featuredImage);
          }
        } else {
          alert('Blog not found');
          navigate('/admin/dashboard');
        }
      } catch (err) {
        console.error('Error loading blog:', err);
        alert('Failed to load blog: ' + err.message);
      }
    };

    fetchBlog();
  }, [user, editId, navigate]);

  const handleLogout = async () => {
    isLoggingOut.current = true;
    navigate('/blog');
    await logout();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 700 * 1024) {
      alert('⚠️ Image size is too large!\n\nMaximum allowed: 700KB\nYour image: ' + (file.size / 1024).toFixed(0) + 'KB\n\nPlease compress your image or choose a smaller one.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);

    try {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result.split(',')[1]);
        reader.readAsDataURL(file);
      });

      const formData = new FormData();
      formData.append('image', base64);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setImageUrl(result.data.display_url);
      } else {
        throw new Error(result.error?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback: use local file preview
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = () => {
    setImageUrl('');
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 50);
  };

  const saveBlog = async (status) => {
    if (!title.trim() || !excerpt.trim()) {
      alert('Please fill in the title and excerpt');
      return;
    }

    // Strip HTML to count text length
    const plainText = content.replace(/(<([^>]+)>)/gi, "").trim();
    if (plainText.length < 50) {
      alert('Blog content is too short. Please write at least 50 characters.');
      return;
    }

    setIsSaving(true);

    try {
      const blogData = {
        title: title.trim(),
        slug: generateSlug(title.trim()),
        excerpt: excerpt.trim(),
        content,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        featuredImage: imageUrl,
        authorName: user.name,
        authorEmail: user.email,
        authorLinkedIn: linkedIn.trim(),
        status,
        featured,
        updatedAt: Date.now()
      };

      if (editId) {
        await updateDoc(doc(db, 'blogs', editId), blogData);
      } else {
        blogData.publishedAt = Date.now();
        await addDoc(collection(db, 'blogs'), blogData);
      }

      alert(status === 'published' ? 'Blog published successfully!' : 'Draft saved!');
      navigate('/admin/dashboard');

    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to save: ' + err.message);
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  return (
    <>
      {isSaving && <DroneLoader message="Deploying to hangar..." />}
      {isUploading && <DroneLoader message="Uploading asset..." />}
      <div className="admin-container">
        <header className="header">
          <div className="nav">
            <div className="brand">
              <img src="/assets/club-logo.jpg" alt="Team Vajra logo" />
              <div>
                <div className="title">TEAM VAJRA</div>
                <div className="subtitle">Blog Editor</div>
              </div>
            </div>
            <div className="nav-links">
              <Link to="/admin/dashboard">← Dashboard</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          </div>
        </header>

        <main className="editor-container">
          <div className="editor-header">
            <h1>{editId ? 'Edit Blog Post' : 'Create New Blog Post'}</h1>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="title">Blog Title *</label>
              <input 
                type="text" 
                id="title" 
                placeholder="Enter an engaging title..." 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Featured Image</label>
              <input 
                type="file" 
                id="imageFile" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleImageUpload}
              />

              {!imageUrl ? (
                <div 
                  className={`image-upload-area ${isUploading ? 'uploading' : ''}`} 
                  onClick={() => document.getElementById('imageFile').click()}
                >
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">Click to upload image</div>
                  <div className="upload-subtext">PNG, JPG, WEBP (auto-uploaded to cloud)</div>
                  {isUploading && <div className="upload-progress">⏳ Uploading...</div>}
                </div>
              ) : (
                <div className="image-preview-container">
                  <img src={imageUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} />
                  <button type="button" className="remove-image" onClick={removeImage}>×</button>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Tech">Tech</option>
                  <option value="Race Recap">Race Recap</option>
                  <option value="Club Life">Club Life</option>
                  <option value="Learning">Learning</option>
                  <option value="Drone Basics">Drone Basics</option>
                  <option value="Drone Core">Drone Core</option>
                  <option value="Aerodynamics">Aerodynamics</option>
                  <option value="Electronics">Electronics</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input 
                  type="text" 
                  id="tags" 
                  placeholder="e.g. drones, racing, FPV" 
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="excerpt">Short Excerpt *</label>
              <textarea 
                id="excerpt" 
                placeholder="A brief summary that appears on the blog list..." 
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Blog Content *</label>
              <div className="editor-wrapper">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent} 
                  modules={quillModules}
                  placeholder="Write your amazing blog content here..."
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="linkedIn">Your LinkedIn Profile URL (optional)</label>
              <input 
                type="url" 
                id="linkedIn" 
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  style={{ width: 'auto' }} 
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Mark as Featured Post</span>
              </label>
            </div>

            <div className="editor-actions">
              <button 
                type="button" 
                className="btn-publish" 
                onClick={() => saveBlog('published')}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Publish'}
              </button>
              <button 
                type="button" 
                className="btn-save" 
                onClick={() => saveBlog('draft')}
                disabled={isSaving}
              >
                Save as Draft
              </button>
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => {
                  if (window.confirm('Discard changes and go back?')) {
                    navigate('/admin/dashboard');
                  }
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        </main>

        <footer>
          <p>© {new Date().getFullYear()} TEAM VAJRA. All Rights Reserved. | Blog Editor</p>
        </footer>
      </div>
    </>
  );
};

export default Editor;
