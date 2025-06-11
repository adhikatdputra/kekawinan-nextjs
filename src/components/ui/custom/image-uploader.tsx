import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';

export default function ImageUpload({ 
  placeholder = "w-64 h-64 bg-blue-400 rounded-lg",
  icon: IconComponent = Camera,
  iconSize = 24,
  defaultValue = "",
  onChange = (file: File | null, imageUrl: string | null) => { void file; void imageUrl; },
  accept = "image/*",
  maxSize = 1 * 1024 * 1024, // 1MB default
  showDeleteButton = true,
  uploadText = "Click to upload image",
  className = ""
}) {
  const [image, setImage] = useState<string | null>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > maxSize) {
        alert(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (!e.target?.result) return;
        const imageUrl = e.target.result as string;
        setImage(imageUrl);
        onChange(file, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImage(null);
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setImage(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className={`relative w-fit ${className}`}>
      <div
        className={`
          ${placeholder} 
          cursor-pointer 
          border-2 
          border-dashed 
          border-gray-300 
          hover:border-gray-400 
          transition-colors 
          duration-200 
          flex 
          items-center 
          justify-center 
          overflow-hidden
          ${isDragging ? 'border-blue-500 bg-blue-50' : ''}
          ${image ? 'border-solid border-gray-200' : ''}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <Image
            src={image}
            alt="Uploaded"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 p-4">
            <IconComponent size={iconSize} className="mb-2" />
            <p className="text-sm text-center font-medium">{uploadText}</p>
            <p className="text-xs text-center mt-1 text-gray-400">
              Drag & drop or click to browse
            </p>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {image && showDeleteButton && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200 shadow-lg"
          aria-label="Delete image"
        >
          <X size={16} />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}