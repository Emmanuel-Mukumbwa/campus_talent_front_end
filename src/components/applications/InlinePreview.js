// File: src/components/applications/InlinePreview.jsx
import React from 'react';

/**
 * @param {{ url: string; height?: string }} props
 */
export default function InlinePreview({ url, height = '200px' }) {
  const ext = url.split('.').pop()?.toLowerCase();
  if (ext && ['png','jpg','jpeg','gif','bmp'].includes(ext)) {
    return <img src={url} alt="preview" style={{ maxWidth: '100%', height: 'auto' }} />;
  }
  if (ext === 'pdf') {
    return <iframe src={url} title="pdf-preview" width="100%" height={height} />;
  }
  // fallback for docs/code: download link
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      Download attachment
    </a>
  );
}
