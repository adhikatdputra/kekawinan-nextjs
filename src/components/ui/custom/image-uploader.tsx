import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUpload({ 
  placeholder = "w-64 h-64 bg-blue-400 rounded-lg",
  icon: IconComponent = Camera,
  iconSize = 24,
  defaultValue = "",
  onChange = (file: File | null, imageUrl: string | null) => { void file; void imageUrl; },
  accept = "image/*",
  maxSize = 1 * 1024 * 1024, // 1MB default
  showDeleteButton = true,
  uploadText = "Pilih foto",
  className = ""
}) {
  const [image, setImage] = useState<string | null>(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > maxSize) {
        toast.error(`Ukuran foto maksimal ${Math.round(maxSize / 1024 / 1024)}MB`);
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
        role="button"
        tabIndex={0}
        aria-label={image ? "Ganti foto" : uploadText}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`${placeholder} flex cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed border-brand-line transition-colors duration-200 hover:border-brand-leaf focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-focus ${
          isDragging ? "border-brand-focus bg-brand-sky" : ""
        } ${image ? "border-solid" : ""}`}
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
          <div className="flex flex-col items-center justify-center p-3 text-center text-brand-muted">
            <IconComponent size={iconSize} className="mb-1.5 text-brand-leaf" aria-hidden="true" />
            <p className="text-sm font-bold text-brand-ink">{uploadText}</p>
            <p className="mt-0.5 text-xs">atau tarik ke sini</p>
          </div>
        )}
      </div>

      {/* Delete Button */}
      {image && showDeleteButton && (
        <button
          onClick={handleDelete}
          type="button"
          className="absolute top-1 right-1 grid size-8 place-items-center rounded-full bg-white text-brand-rose shadow-md ring-1 ring-brand-line transition-colors hover:bg-brand-pink focus-visible:outline-3 focus-visible:outline-brand-focus"
          aria-label="Hapus foto"
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
        tabIndex={-1}
      />
    </div>
  );
}