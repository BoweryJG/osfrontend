import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileUploadButton({ setPrompt }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('text') || file.name.match(/\.(md|json|csv)$/i)) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPrompt(ev.target.result);
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file type. Please upload a .txt, .md, .json, or .csv file.');
    }
    e.target.value = '';
  };

  return (
    <Tooltip title="Upload text file (.txt, .md, .json, .csv)">
      <IconButton component="label" color="primary" sx={{ ml: 1 }}>
        <UploadFileIcon />
        <input
          type="file"
          accept=".txt,.md,.json,.csv"
          hidden
          onChange={handleFileChange}
        />
      </IconButton>
    </Tooltip>
  );
}
