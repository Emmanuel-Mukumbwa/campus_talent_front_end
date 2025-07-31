// File: src/components/applications/ApplicationsTable.jsx
import React from 'react';
import { Table } from 'react-bootstrap';

/**
 * A generic table for rendering application rows.
 *
 * @param {Object} props
 * @param {Array<Object>} props.applications
 * @param {Array<{ header: string, field?: string, render?: (app: any) => React.ReactNode }>} props.columns
 */
export default function ApplicationsTable({ applications, columns }) {
  return (
    <Table striped hover responsive className="mt-3">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.header}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {applications.map(app => (
          <tr key={app.id}>
            {columns.map(col => {
              let cell;
              if (col.render) {
                try {
                  cell = col.render(app);
                } catch {
                  cell = '–';
                }
              } else {
                const v = app[col.field];
                cell = v === undefined || v === null ? '–' : v;
              }
              return <td key={col.header}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
