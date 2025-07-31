import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const role       = localStorage.getItem('userRole');
  const userId     = Number(localStorage.getItem('userId'));
  const { studentId } = useParams();

  if (!isLoggedIn) {
    // Save reason before redirecting
    localStorage.setItem('redirectMessage', 'You must be logged in to access that page.');
    return <Navigate to="/redirecting" replace />;
  }

  if (role === 'student' && studentId && Number(studentId) !== userId) {
    localStorage.setItem('redirectMessage', 'You can only view your own portfolio.');
    return <Navigate to="/redirecting" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    localStorage.setItem('redirectMessage', 'Access denied. Your account role does not allow that.');
    return <Navigate to="/redirecting" replace />;
  }

  return children;
}
