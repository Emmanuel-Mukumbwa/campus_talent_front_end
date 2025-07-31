import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
 
export default function LoadMoreButton({ isLoading, onClick, hasMore }) {
  if (!hasMore) return null;
  return (
    <div className="text-center my-2">
      <Button variant="success" onClick={onClick} disabled={isLoading}>
        {isLoading
          ? <Spinner animation="border" size="sm" />
          : 'Load More'}
      </Button>
    </div>
  );
}
