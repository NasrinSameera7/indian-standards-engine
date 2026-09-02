import React, { useCallback, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchByFile } from '../../services/api';
import { SearchContext } from '../../context/SearchContext';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const { setSearchResults, setSearchQuery, setDetectedLanguage } = useContext(SearchContext);
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const selected = acceptedFiles[0];
      if (selected.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
      } else {
        setFile(selected);
        setError(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.tiff']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    // add other optional params here if needed

    try {
      const response = await searchByFile(formData);
      setSearchResults(response.data.results || []);
      setSearchQuery(`Document Search: ${file.name}`);
      setDetectedLanguage(response.data.detected_language || null);
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-600 font-medium">
          {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, DOCX, PNG, JPG, TIFF (Max 10MB)
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {file && !error && (
        <div className="mt-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex items-center">
              <File className="h-8 w-8 text-primary-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:bg-primary-400 transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" /> Upload & Search
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
