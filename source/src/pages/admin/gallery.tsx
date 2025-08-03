import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { GalleryInterface } from '@/managers/Models';
import data from '@/Ella.json';

export default function AdminGallery() {
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState<GalleryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<GalleryInterface | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const items = await response.json();
        setGalleryItems(items.length > 0 ? items : data.Art as any);
      } else {
        console.error('Failed to fetch gallery items');
        setGalleryItems(data.Art as any);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setGalleryItems(data.Art as any);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: GalleryInterface) => {
    setEditingItem(item);
  };

  const handleSave = async (updatedItem: GalleryInterface) => {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });

      if (response.ok) {
        const savedItem = await response.json();
        setGalleryItems(items => 
          items.map(item => item.id === savedItem.id ? savedItem : item)
        );
        setEditingItem(null);
      } else {
        console.error('Failed to update gallery item');
        alert('Failed to update item. Please try again.');
      }
    } catch (error) {
      console.error('Error updating gallery item:', error);
      alert('Error updating item. Please try again.');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch('/api/gallery', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: itemId }),
        });

        if (response.ok) {
          setGalleryItems(items => items.filter(item => item.id !== itemId));
        } else {
          console.error('Failed to delete gallery item');
          alert('Failed to delete item. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="loading">Loading gallery...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="admin-gallery">
        {/* Header */}
        <header className="gallery-header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => router.push('/admin')} className="back-btn">
                ← Back to Dashboard
              </button>
              <h1>Gallery Management</h1>
              <p>Manage your artwork collection</p>
            </div>
            <div className="header-right">
              <button onClick={handleUpload} className="btn-primary">
                + Add Artwork
              </button>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <main className="gallery-main">
          <div className="gallery-stats">
            <p>{galleryItems.length} items in gallery</p>
          </div>

          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item">
                <div className="item-image">
                  <img src={item.img} alt={item.title || 'Untitled'} />
                  <div className="item-overlay">
                    <button onClick={() => handleEdit(item)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="item-info">
                  <h3>{item.title || 'Untitled'}</h3>
                  <p className="item-medium">{item.medium}</p>
                  <p className="item-description">{item.description || 'No description'}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Edit Modal */}
        {editingItem && (
          <EditItemModal
            item={editingItem}
            onSave={handleSave}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={(newItem) => {
              setGalleryItems(items => [...items, newItem]);
              setShowUploadModal(false);
            }}
          />
        )}

        <style jsx>{`
          .admin-gallery {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .gallery-header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .back-btn {
            background: none;
            border: none;
            color: white;
            font-weight: 500;
            cursor: pointer;
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
            opacity: 0.9;
          }

          .back-btn:hover {
            opacity: 1;
          }

          .header-left h1 {
            margin: 0;
            font-size: 1.5rem;
            color: white;
            font-weight: 600;
          }

          .header-left p {
            margin: 0.25rem 0 0 0;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          }

          .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }

          .btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
          }

          .gallery-main {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1.5rem;
          }

          .gallery-stats {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 1rem 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .gallery-stats p {
            color: #4a5568;
            margin: 0;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .gallery-item {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .gallery-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }

          .item-image {
            position: relative;
            height: 180px;
            overflow: hidden;
          }

          .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .item-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .item-image:hover .item-overlay {
            opacity: 1;
          }

          .btn-edit, .btn-delete {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.875rem;
          }

          .btn-edit {
            background: rgba(255, 255, 255, 0.9);
            color: #667eea;
          }

          .btn-delete {
            background: rgba(239, 68, 68, 0.9);
            color: white;
          }

          .btn-edit:hover, .btn-delete:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          .item-info {
            padding: 1.25rem;
          }

          .item-info h3 {
            margin: 0 0 0.5rem 0;
            color: #2d3748;
            font-size: 1rem;
            font-weight: 600;
          }

          .item-medium {
            color: #667eea;
            font-weight: 500;
            margin: 0 0 0.5rem 0;
            font-size: 0.875rem;
          }

          .item-description {
            color: #64748b;
            margin: 0;
            font-size: 0.875rem;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-size: 1.2rem;
            color: white;
          }

          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
              gap: 1rem;
              text-align: center;
              padding: 0 1rem;
            }

            .gallery-main {
              padding: 1rem;
            }

            .gallery-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}

// Edit Item Modal Component
function EditItemModal({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: GalleryInterface; 
  onSave: (item: GalleryInterface) => void; 
  onCancel: () => void; 
}) {
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedItem);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Edit Artwork</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={editedItem.title || ''}
              onChange={e => setEditedItem({ ...editedItem, title: e.target.value })}
              placeholder="Artwork title"
            />
          </div>
          
          <div className="form-group">
            <label>Medium</label>
            <input
              type="text"
              value={editedItem.medium || ''}
              onChange={e => setEditedItem({ ...editedItem, medium: e.target.value })}
              placeholder="e.g., Oil on canvas, Digital art"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editedItem.description || ''}
              onChange={e => setEditedItem({ ...editedItem, description: e.target.value })}
              placeholder="Describe your artwork"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Height (px)</label>
            <input
              type="number"
              value={editedItem.height || ''}
              onChange={e => setEditedItem({ ...editedItem, height: Number(e.target.value) })}
              placeholder="400"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Changes
            </button>
          </div>
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
          }

          .modal-content h2 {
            margin: 0 0 1.5rem 0;
            color: #2d3748;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-weight: 500;
          }

          .form-group input,
          .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 1rem;
          }

          .form-group input:focus,
          .form-group textarea:focus {
            outline: none;
            border-color: #667eea;
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
          }

          .btn-cancel, .btn-save {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
          }

          .btn-cancel {
            background: #e2e8f0;
            color: #4a5568;
          }

          .btn-save {
            background: #667eea;
            color: white;
          }

          .btn-cancel:hover {
            background: #cbd5e0;
          }

          .btn-save:hover {
            background: #5a67d8;
          }
        `}</style>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadModal({ 
  onClose, 
  onUpload 
}: { 
  onClose: () => void; 
  onUpload: (item: GalleryInterface) => void; 
}) {
  const [newItem, setNewItem] = useState({
    title: '',
    medium: '',
    description: '',
    height: 400,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.title || !newItem.medium) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', newItem.title);
      formData.append('medium', newItem.medium);
      formData.append('description', newItem.description);
      formData.append('height', newItem.height.toString());
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const createdItem = await response.json();
        onUpload(createdItem);
      } else {
        console.error('Failed to create gallery item');
        alert('Failed to upload artwork. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading artwork:', error);
      alert('Error uploading artwork. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Add New Artwork</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newItem.title}
              onChange={e => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Artwork title"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Medium</label>
            <input
              type="text"
              value={newItem.medium}
              onChange={e => setNewItem({ ...newItem, medium: e.target.value })}
              placeholder="e.g., Oil on canvas, Digital art"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newItem.description}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Describe your artwork"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Height (px)</label>
            <input
              type="number"
              value={newItem.height}
              onChange={e => setNewItem({ ...newItem, height: Number(e.target.value) })}
              placeholder="400"
            />
          </div>

          <div className="form-group">
            <label>Image Upload</label>
            <div className="upload-area" onClick={() => document.getElementById('file-input')?.click()}>
              {selectedFile ? (
                <p>📎 Selected: {selectedFile.name}</p>
              ) : (
                <p>📎 Click to select an image file</p>
              )}
              <input 
                id="file-input"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Add Artwork'}
            </button>
          </div>
        </form>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
          }

          .upload-area {
            border: 2px dashed #e2e8f0;
            border-radius: 4px;
            padding: 2rem;
            text-align: center;
            color: #718096;
            cursor: pointer;
            transition: border-color 0.3s ease;
          }

          .upload-area:hover {
            border-color: #667eea;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-weight: 500;
          }

          .form-group input,
          .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 1rem;
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
          }

          .btn-cancel, .btn-save {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            font-weight: 500;
            cursor: pointer;
          }

          .btn-cancel {
            background: #e2e8f0;
            color: #4a5568;
          }

          .btn-save {
            background: #667eea;
            color: white;
          }
        `}</style>
      </div>
    </div>
  );
}