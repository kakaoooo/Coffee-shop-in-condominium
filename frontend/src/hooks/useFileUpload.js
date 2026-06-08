import { useState } from "react";
import { MAX_FILE_SIZE } from "../config/constants";

/**
 * Custom hook for handling file uploads with preview
 * @returns {Object} { file, preview, handleUpload, clear }
 */
export const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleUpload = (e, onError) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      onError?.();
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
  };

  return { file, preview, handleUpload, clear };
};
