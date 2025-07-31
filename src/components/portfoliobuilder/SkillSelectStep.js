// File: src/components/portfoliobuilder/SkillSelectStep.jsx

import React from 'react';

const CORE_SKILLS = [
  'Coding',
  'Video Production',
  'Graphics Design',
  'Research Writing',
  'Tutoring'
];

export default function SkillSelectStep({ data, setData }) {
  // We only ever keep a single-item array in selectedSkills
  const selectedSkill = data.selectedSkills[0] || '';

  const select = skill => {
    // Set exactly one skill, and reset dependent fields
    setData({
      ...data, 
      selectedSkills: [skill],
      about: '',
      projects: [],
      proficiencies: {}
    });
  };

  return (
    <div className="wizard-card">
      <h5>Select Your Primary Skill</h5>
      <small>Choose the one area you want to focus on for your portfolio.</small>
      <div className="core-skills-list mt-3">
        {CORE_SKILLS.map(skill => (
          <label key={skill} className="form-check me-3">
            <input
              type="radio"
              name="primarySkill"
              className="form-check-input"
              value={skill}
              checked={selectedSkill === skill}
              onChange={() => select(skill)}
            />
            <span className="form-check-label">{skill}</span>
          </label>
        ))}
      </div>
      {!selectedSkill && (
        <small className="text-muted d-block mt-2">
          Please pick one skill to continue.
        </small>
      )}
    </div>
  );
}
