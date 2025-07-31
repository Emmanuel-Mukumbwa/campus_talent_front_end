// File: src/components/applications/TaskChecklist.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

/**
 * @param {{ items: string[] }} props
 */
export default function TaskChecklist({ items }) {
  return (
    <ul className="p-0" style={{ listStyle: 'none' }}>
      {items.map((task, i) => (
        <li key={i}>
          <Form.Check 
            type="checkbox" 
            id={`task-${i}`} 
            label={task} 
            checked 
            readOnly 
          />
        </li>
      ))}
    </ul>
  );
}
