import { useState } from 'react';

export const useFileUpload = (maxSizeMB = 10) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleUpload = (e, errorMessage) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      alert(errorMessage || `File must be smaller than ${maxSizeMB}MB`);
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
  };

  return { file, preview, handleUpload, clearFile };
};
