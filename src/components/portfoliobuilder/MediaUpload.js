// File: src/components/portfoliobuilder/MediaUpload.jsx
import React, { useRef } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import { FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../../utils/api';

const CONCURRENT_UPLOADS_LIMIT = 3;

// ——————————————————————————————————————————
// Helper: categorize a file or URL into image/video/doc
function fileCategory(arg) {
  const type = arg.type || '';
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  return 'doc';
}

// ——————————————————————————————————————————
// Component: preview based on category
function MediaPreview({ url, category }) {
  if (category === 'image') {
    return <img src={url} style={{ maxWidth: 100, maxHeight: 100 }} alt="" />;
  }
  if (category === 'video') {
    return (
      <video style={{ maxWidth: 120, maxHeight: 80 }} controls>
        <source src={url} type="video/mp4" />
      </video>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      View document
    </a>
  );
}

// ——————————————————————————————————————————

export default function MediaUpload({
  idx,
  projectId,
  media,
  uploads,
  setUploads,
  appendMediaUrl,
  removeMedia,
  moveMedia,
}) {
  const fileInput = useRef();

  const enqueueFiles = fileList => {
    const toAdd = Array.from(fileList).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      url: null
    }));
    setUploads(u => ({
      ...u,
      [idx]: [...(u[idx] || []), ...toAdd]
    }));
    setTimeout(() => processQueue(), 0);
  };

  const processQueue = () => {
    const list = uploads[idx] || [];
    const uploadingCount = list.filter(u => u.status === 'uploading').length;
    const pendingItems  = list.filter(u => u.status === 'pending');
    if (uploadingCount >= CONCURRENT_UPLOADS_LIMIT || !pendingItems.length) return;

    const next = pendingItems[0];
    setUploads(u => ({
      ...u,
      [idx]: u[idx].map(i =>
        i.id === next.id ? { ...i, status: 'uploading' } : i
      )
    }));
    uploadOne(next);
  };

  const uploadOne = async item => {
    const form = new FormData();
    form.append('attachments', item.file);

    try {
      const resp = await api.post(
        `/api/student/portfolio/${projectId}/attachments`,
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: ev => {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setUploads(u => ({
              ...u,
              [idx]: u[idx].map(i =>
                i.id === item.id ? { ...i, progress: pct } : i
              )
            }));
          }
        }
      );
      const [finalUrl] = resp.data.attachments;
      setUploads(u => ({
        ...u,
        [idx]: u[idx].map(i =>
          i.id === item.id
            ? { ...i, status: 'done', url: finalUrl, progress: 100 }
            : i
        )
      }));
      appendMediaUrl(idx, finalUrl);
    } catch {
      setUploads(u => ({
        ...u,
        [idx]: u[idx].map(i =>
          i.id === item.id ? { ...i, status: 'error' } : i
        )
      }));
    } finally {
      setTimeout(() => processQueue(), 0);
    }
  };

  const retry = uploadId => {
    setUploads(u => ({
      ...u,
      [idx]: u[idx].map(i =>
        i.id === uploadId ? { ...i, status: 'pending', progress: 0 } : i
      )
    }));
    processQueue();
  };

  return (
    <div className="mb-3">
      <label className="form-label">Upload Media</label>
      <div
        className="border p-3 text-center mb-2"
        style={{ background: '#f8f9fa', cursor: 'pointer' }}
        onClick={() => fileInput.current.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); enqueueFiles(e.dataTransfer.files); }}
      >
        Drag &amp; drop files or click to select
      </div>
      <input
        type="file"
        multiple
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={e => enqueueFiles(e.target.files)}
      />

      <div className="d-flex flex-wrap gap-2 mt-2">
        {/* In-flight uploads */}
        {(uploads[idx] || []).map(item => {
          const cat = item.status === 'done'
            ? fileCategory({ type: item.url?.endsWith('.mp4') ? 'video/mp4' : 'image/jpg' })
            : fileCategory(item.file);

          return (
            <div key={item.id} className="position-relative">
              {item.status === 'done'
                ? <MediaPreview url={item.url} category={cat} />
                : <img
                    src={item.preview}
                    style={{
                      maxWidth: 100,
                      maxHeight: 100,
                      opacity: item.status === 'error' ? 0.5 : 1
                    }}
                    alt=""
                  />
              }
              <div style={{ width: 100, marginTop: 4 }}>
                {item.status === 'uploading' && (
                  <ProgressBar now={item.progress} label={`${item.progress}%`} striped />
                )}
                {item.status === 'error' && (
                  <Button size="sm" variant="outline-danger" onClick={() => retry(item.id)}>
                    ⚠️ Retry
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {/* Already-saved media */}
        {media.map((url, mIdx) => {
          const cat = fileCategory({ type: url.endsWith('.mp4') ? 'video/mp4' : 'image/jpg' });
          return (
            <div key={mIdx} className="position-relative">
              <MediaPreview url={url} category={cat} />
              <div className="d-flex position-absolute top-0 end-0">
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => moveMedia(idx, mIdx, mIdx - 1)}
                  disabled={mIdx === 0}
                >
                  <FaArrowUp />
                </button>
                <button
                  className="btn btn-sm btn-light"
                  onClick={() => moveMedia(idx, mIdx, mIdx + 1)}
                  disabled={mIdx === media.length - 1}
                >
                  <FaArrowDown />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeMedia(idx, mIdx)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
