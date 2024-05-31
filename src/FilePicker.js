import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FilePicker.css';

const FilePicker = () => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeFile = (file) => () => {
    setFiles(files.filter(f => f !== file));
  };

  

  return (
    <div className="file-picker">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className="file-list">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span>{file.name}</span>
            <button onClick={removeFile(file)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default FilePicker;
