import { useState, useRef } from 'react';

export default function ImageUpload({ onFileSelect, currentImage }) {
  const [preview, setPreview] = useState(currentImage || null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect && onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect && onFileSelect(file);
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-brand-400 transition-colors"
      onClick={() => inputRef.current.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="w-full h-56 object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white font-medium text-sm">Click to change</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <span className="text-4xl mb-2">📷</span>
          <p className="text-sm font-medium">Click or drag & drop to upload image</p>
          <p className="text-xs mt-1">JPG, PNG, WEBP up to 5MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
