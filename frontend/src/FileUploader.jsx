import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from './actions';

const FileUploader = ({ setData, setLoading, openModal, data }) => {
  const [files, setFiles] = useState([]);
  const uploadsRef = useRef({});
  const latestFilesRef = useRef([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      progress: 0,
      uploading: true,
      error: null
    }));
  
    // Clear existing files before adding the new one
    setFiles(newFiles);
  
    // Store the latest file to be uploaded
    latestFilesRef.current = newFiles;
  
  }, []);
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf']
    }
  });

  useEffect(() => {
    // Start uploading for each new file
    latestFilesRef.current.forEach(fileInfo => {
      startUpload(fileInfo.id);
    });
    // Clear the reference after starting uploads
    latestFilesRef.current = [];
  }, [files]);

  const startUpload = (id) => {
    const fileInfo = files.find(f => f.id === id);
    if (!fileInfo) return;

    const chunkSize = 512 * 1024; // 512 KB chunks
    let uploaded = fileInfo.progress * fileInfo.size / 100;

    const upload = () => {
      if (uploaded < fileInfo.size) {
        const chunk = Math.min(chunkSize, fileInfo.size - uploaded);
        uploaded += chunk;
        const progress = (uploaded / fileInfo.size) * 100;

        setFiles(prevFiles => 
          prevFiles.map(f => f.id === id ? { ...f, progress, uploading: true } : f)
        );

        uploadsRef.current[id] = setTimeout(upload, 100);
      } else {
        setFiles(prevFiles => 
          prevFiles.map(f => f.id === id ? { ...f, progress: 100, uploading: false } : f)
        );
      }
    };

    upload();
  };

  const stopUpload = (id) => {
    clearTimeout(uploadsRef.current[id]);
    setFiles(prevFiles => 
      prevFiles.map(f => f.id === id ? { ...f, uploading: false } : f)
    );
  };

  const removeFile = (id) => {
    stopUpload(id);
    setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
    setData(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    openModal();
    const file = files[0].file;
    const data = await uploadFile(file);
    setData(data);
    setLoading(false);
  }

  useEffect(() => {
    return () => {
      Object.values(uploadsRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="file-uploader">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the PDF files here ...</p>
        ) : (
          <p>Drag 'n' drop some PDF files here, or click to select files</p>
        )}
      </div>
      {files.map((file) => (
        <div key={file.id} className="file-item">
          <div className="file-info">
            <span className="file-name">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <div className="file-actions">
              {file.progress < 100 && (
                <button 
                  onClick={() => file.uploading ? stopUpload(file.id) : startUpload(file.id)} 
                  className={file.uploading ? "stop-btn" : "start-btn"}
                >
                  {file.uploading ? "Stop" : "Resume"}
                </button>
              )}
              <button onClick={() => removeFile(file.id)} className="remove-btn">Remove</button>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress" style={{ width: `${file.progress}%` }} />
          </div>
          <div className="progress-percentage">{Math.round(file.progress)}%</div>
          {file.error && <div className="error-message">{file.error}</div>}
        </div>
      ))}
      <div className='btn-wrapper'>
        <button onClick={() => handleSubmit()} className="upload-btn primary" disabled={files.length === 0}>Upload</button>
        {
          data && <button onClick={() => openModal()} className="upload-btn secondary">Show Report</button>
        }
      </div>
    </div>
  );
};

export default FileUploader;