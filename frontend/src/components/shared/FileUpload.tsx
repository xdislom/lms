'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
}

export const FileUpload = ({
  onFileSelect,
  accept = 'image/*,application/pdf',
  maxSize = 10,
  label = 'Fayl yuklang',
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected?: File) => {
    setError('');
    if (!selected) return;

    if (selected.size > maxSize * 1024 * 1024) {
      setError(`Fayl hajmi ${maxSize}MB dan oshmasligi kerak.`);
      return;
    }

    setFile(selected);
    onFileSelect(selected);
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 text-sm font-medium">{label}</div>
      {!file ? (
        <div 
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-md cursor-pointer border-muted-foreground/25 hover:bg-muted/50"
        >
          <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Yuklash uchun bosing yoki faylni shu yerga tashlang
          </p>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
          <div className="flex items-center space-x-3 overflow-hidden">
            <UploadCloud className="w-5 h-5 flex-shrink-0 text-primary" />
            <span className="text-sm truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8 text-destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
};
