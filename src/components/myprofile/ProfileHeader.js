// File: src/components/myprofile/ProfileHeader.jsx

import React, { useRef } from 'react';
import { Image, Button } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import api from '../../utils/api';

export default function ProfileHeader({
  avatarUrl,
  editing,
  localPreview,
  onAvatarChange
}) {
  const fileInputRef = useRef();

  // When pencil clicked, open file picker
  const handleFileSelect = () => fileInputRef.current?.click();

  // When user picks a file, pass it back up
  const handleChange = e => {
    const file = e.target.files[0];
    if (file) onAvatarChange(file);
  };

  // Calculate which URL to show:
  // 1) Local preview (blob://) if present,
  // 2) Absolute avatarUrl if it starts with http(s),
  // 3) Otherwise prefix api.baseURL to the stored path,
  // 4) Fallback default avatar
  let src = '/default-avatar.png';
  if (localPreview) {
    src = localPreview;
  } else if (avatarUrl) {
    if (/^https?:\/\//.test(avatarUrl)) {
      src = avatarUrl;
    } else {
      const base = api.defaults.baseURL?.replace(/\/+$/, '') 
                 || window.location.origin;
      src = `${base}${avatarUrl}`;
    }
  }

  return (
    <div className="d-flex align-items-center mb-4">
      <div style={{ position: 'relative' }}>
        <Image
          src={src}
          roundedCircle
          width={100}
          height={100}
        />
        {editing && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleFileSelect}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                borderRadius: '50%',
                padding: '0.25rem'
              }}
            >
              <Pencil />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
