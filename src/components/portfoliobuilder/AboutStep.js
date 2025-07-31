// File: src/components/portfoliobuilder/AboutStep.jsx

import React from 'react';
import { BIO_TEMPLATES } from './templates'; 

export default function AboutStep({ data, setData }) {
  const { selectedSkills, about } = data;
  // flatten all templates for the skills the user picked
  const options = selectedSkills.flatMap(skill => BIO_TEMPLATES[skill] || []);

  // if no skill chosen yet, prompt them to pick one first
  if (options.length === 0) {
    return (
      <div className="wizard-card">
        <h5>Tell us about yourself</h5>
        <small className="text-muted">
          Select at least one skill first, then choose a bio template.
        </small>
      </div>
    );
  }

  return (
    <div className="wizard-card">
      <h5>Tell us about yourself</h5>
      <small>Select one of the descriptions below:</small>
      <select
        className="form-select mt-2"
        value={about}
        onChange={e => setData({ ...data, about: e.target.value })}
      >
        <option value="" disabled>
          -- Choose a bio template --
        </option>
        {options.map((tpl, i) => (
          <option key={i} value={tpl}>
            {tpl}
          </option>
        ))}
      </select>
    </div>
  );
}
