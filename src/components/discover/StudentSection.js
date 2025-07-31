// src/components/discover/StudentSection.jsx
import React from 'react';
import StudentCard from './StudentCard';

export default function StudentSection({
  title,
  students,
  avatars = {},
  onViewPortfolio,
  onSendMessage
}) {
  return (
    <div className="d-flex flex-column gap-3">
      <h5>{title}</h5>
      {students.map(s => (
        <StudentCard
          key={s.id}
          student={{ ...s, avatar_url: avatars[s.id] }}
          onViewPortfolio={onViewPortfolio}
          onSendMessage={onSendMessage}
        />
      ))}
    </div>
  );
}
