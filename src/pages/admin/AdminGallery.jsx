import React, { useState, useRef } from 'react';
import { useContent } from '../../context/ContentContext';
import { 
  Images, Eye, EyeOff, Trash2, GripVertical, 
  Plus, Save, CheckCircle, Upload, RefreshCw
} from 'lucide-react';

export default function AdminGallery() {
  const { content, updateContent, saveToServer } = useContent();
  const images = content.gallery?.images || [];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    setSaving(true);
    await saveToServer();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateImages = (newImages) => {
    updateContent('gallery', 'images', newImages);
  };

  // Toggle visibility
  const toggleVisibility = (id) => {
    updateImages(images.map(img => img.id === id ? { ...img, visible: !img.visible } : img));
  };

  // Delete image
  const deleteImage = (id) => {
    if (confirm('¿Eliminar esta imagen del carrusel?')) {
      updateImages(images.filter(img => img.id !== id));
    }
  };

  // Update caption
  const updateCaption = (id, caption) => {
    updateImages(images.map(img => img.id === id ? { ...img, caption } : img));
  };

  // Add image by URL
  const addImageByUrl = () => {
    if (!newImageUrl.trim()) return;
    const newImg = {
      id: Date.now(),
      src: newImageUrl.trim(),
      caption: newCaption.trim(),
      visible: true
    };
    updateImages([...images, newImg]);
    setNewImageUrl('');
    setNewCaption('');
  };

  // Drag and drop reordering
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(dropIndex, 0, moved);
    updateImages(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const visibleCount = images.filter(i => i.visible).length;
  const hiddenCount = images.filter(i => !i.visible).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="admin-card glass-panel">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] rounded-xl flex items-center justify-center">
              <Images size={24} />
            </div>
            <div>
              <h2 className="text-lg font-heading text-[var(--admin-text)] uppercase tracking-wider">
                Gallery &amp; Press Media
              </h2>
              <p className="text-sm text-[var(--admin-text-secondary)]">
                {visibleCount} visible · {hiddenCount} hidden · {images.length} total
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-button admin-button-primary flex items-center gap-2"
          >
            {saving ? (
              <><RefreshCw size={16} className="animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle size={16} /> Saved!</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Add new image */}
      <div className="admin-card glass-panel">
        <h3 className="text-sm font-heading uppercase tracking-widest text-[var(--admin-text)] mb-4 flex items-center gap-2">
          <Plus size={16} /> Add New Image
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="admin-label">Image URL</label>
            <input
              type="text"
              className="admin-input"
              placeholder="/gallery/filename.webp or https://..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImageByUrl()}
            />
          </div>
          <div>
            <label className="admin-label">Caption (optional)</label>
            <input
              type="text"
              className="admin-input"
              placeholder="Description..."
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addImageByUrl()}
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={addImageByUrl}
            disabled={!newImageUrl.trim()}
            className="admin-button admin-button-primary flex items-center gap-2"
          >
            <Plus size={16} /> Add to Carousel
          </button>
          <p className="text-xs text-[var(--admin-text-secondary)] mt-2">
            Use paths like <code className="bg-[var(--admin-bg)] px-1 rounded">/gallery/filename.webp</code> for images already uploaded to the server.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="admin-card glass-panel bg-[var(--admin-accent)]/5 border border-[var(--admin-accent)]/20">
        <p className="text-sm text-[var(--admin-text-secondary)] flex items-start gap-2">
          <GripVertical size={16} className="mt-0.5 shrink-0 text-[var(--admin-accent)]" />
          <span>
            <strong className="text-[var(--admin-text)]">Drag</strong> the grip handle to reorder images ·{' '}
            <Eye size={13} className="inline" /> / <EyeOff size={13} className="inline" /> to show/hide from carousel without deleting ·{' '}
            <Trash2 size={13} className="inline" /> to permanently remove
          </span>
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={img.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`admin-card glass-panel p-3 transition-all duration-200 ${
              !img.visible ? 'opacity-50' : ''
            } ${
              dragOverIndex === index && dragIndex !== index
                ? 'ring-2 ring-[var(--admin-accent)] scale-[1.02]'
                : ''
            } ${dragIndex === index ? 'opacity-30 scale-95' : ''}`}
          >
            {/* Image Preview */}
            <div className="relative aspect-square overflow-hidden rounded-lg mb-3 bg-[var(--admin-bg)]">
              <img
                src={img.src}
                alt={img.caption || `Image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing bg-black/40 backdrop-blur-sm rounded p-1 text-white">
                <GripVertical size={14} />
              </div>
              {/* Order Badge */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs rounded px-1.5 py-0.5 font-mono">
                #{index + 1}
              </div>
              {/* Hidden badge */}
              {!img.visible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-white text-xs bg-black/60 px-2 py-1 rounded">HIDDEN</span>
                </div>
              )}
            </div>

            {/* Caption */}
            <input
              type="text"
              className="admin-input text-xs mb-3"
              placeholder="Add caption..."
              value={img.caption || ''}
              onChange={(e) => updateCaption(img.id, e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleVisibility(img.id)}
                title={img.visible ? 'Hide from carousel' : 'Show in carousel'}
                className={`flex-1 py-1.5 rounded text-xs flex items-center justify-center gap-1 transition-colors ${
                  img.visible
                    ? 'bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/20'
                    : 'bg-[var(--admin-bg)] text-[var(--admin-text-secondary)] hover:bg-[var(--admin-accent)]/10'
                }`}
              >
                {img.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                {img.visible ? 'Visible' : 'Hidden'}
              </button>
              <button
                onClick={() => deleteImage(img.id)}
                title="Delete permanently"
                className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="admin-card glass-panel text-center py-20">
          <Images size={48} className="mx-auto mb-4 text-[var(--admin-text-secondary)] opacity-30" />
          <p className="text-[var(--admin-text-secondary)]">No images in the gallery yet. Add one above.</p>
        </div>
      )}
    </div>
  );
}
