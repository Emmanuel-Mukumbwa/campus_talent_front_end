import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default function ApplicationStep({ gig, app, setApp, errors, requirements }) {
  const onReqChange = (type, value, index = null) => {
    setApp(a => {
      const reqs = { ...a.requirements };
      if (Array.isArray(reqs[type])) {
        if (index == null && Array.isArray(value)) {
          reqs[type] = value;
        } else if (index != null) {
          reqs[type][index] = value;
        }
      } else {
        reqs[type] = value;
      }
      return { ...a, requirements: reqs };
    });
  };

  const addReference = () => {
    setApp(a => {
      const refs = [...(a.requirements.references || [])];
      refs.push('');
      return { ...a, requirements: { ...a.requirements, references: refs } };
    });
  };

  // Always render values as strings (or list of strings)
  const renderValue = (val) => {
    if (Array.isArray(val)) {
      return val.map((v, i) => <div key={i}>{String(v.name ?? v)}</div>);
    }
    if (typeof val === 'object' && val !== null) {
      return <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(val)}</pre>;
    }
    return String(val ?? '');
  };

  // Always produce a string label
  const labelText = (r) => {
    const text = r.details ?? r.type.replace(/_/g, ' ');
    return String(text);
  };

  return (
    <div className="wizard-card">
      <h5>Step 2: Your Application Requirements</h5>
      <small>Complete all required fields below before preview.</small>

      {/* Dynamic Requirements Inputs */}
      {requirements.map(r => (
        <div className="mt-3" key={r.id}>
          <label>
            {labelText(r)}
            {r.required && <span className="text-danger">*</span>}
          </label>

          {r.type === 'cover_letter' && (
            <Form.Control
              as="textarea"
              rows={3}
              value={app.requirements.cover_letter || ''}
              isInvalid={!!errors.cover_letter}
              onChange={e => onReqChange('cover_letter', e.target.value)}
            />
          )}

          {r.type === 'resume_upload' && (
          <input
          name="resume_upload"              // ← IMPORTANT: match your FormData field
              type="file"
              multiple
              accept="application/pdf"
              onChange={e => onReqChange('resume_upload', Array.from(e.target.files))}
            />
          )}

          {r.type === 'portfolio_link' && (
            <Form.Control
              type="url"
              value={app.requirements.portfolio_link || ''}
              isInvalid={!!errors.portfolio_link}
              onChange={e => onReqChange('portfolio_link', e.target.value)}
            />
          )}

          {r.type === 'references' && (
            <>
              {app.requirements.references?.map((ref, i) => (
                <Form.Control
                  key={i}
                  type="text"
                  className="mb-1"
                  placeholder="Reference details"
                  value={ref}
                  isInvalid={!!errors.references}
                  onChange={e => onReqChange('references', e.target.value, i)}
                />
              ))}
              <Button variant="link" onClick={addReference}>
                + Add another reference
              </Button>
            </>
          )}

          {r.type === 'code_sample' && (
          <input
          name="code_sample"            // ← IMPORTANT: match your FormData field
              type="file"
              multiple
              onChange={e => onReqChange('code_sample', Array.from(e.target.files))}
            />
          )}

          {r.type === 'other' && (
            <Form.Control
              type="text"
              value={app.requirements.other || ''}
              isInvalid={!!errors.other}
              onChange={e => onReqChange('other', e.target.value)}
            />
          )}

          <Form.Control.Feedback type="invalid">
            {errors[r.type]}
          </Form.Control.Feedback>
        </div>
      ))}

      {/* Preview */}
      <div className="mt-4">
        <h6>Preview</h6>
        <dl>
          <dt>Gig</dt>
          <dd>{gig.title}</dd>

          <dt>Budget</dt>
          <dd>MWK {gig.payment_amount?.toLocaleString()}</dd>

          <dt>Duration</dt>
          <dd>{String(app.duration ?? gig.duration)}</dd>

          <dt>Deliverables</dt>
          <dd>{String(app.deliverables ?? gig.deliverables)}</dd>

          {app.attachments.length > 0 && (
            <>
              <dt>Files</dt>
              <dd>
                <ul>
                  {app.attachments.map((f, i) => (
                    <li key={i}>{String(f.name)}</li>
                  ))}
                </ul>
              </dd>
            </>
          )}

          {/* Dynamic Requirements Preview */}
          {requirements.map(r => {
            const val = app.requirements[r.type];
            return (
              <React.Fragment key={r.id}>
                <dt>{labelText(r)}</dt>
                <dd>{renderValue(val)}</dd>
              </React.Fragment>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
