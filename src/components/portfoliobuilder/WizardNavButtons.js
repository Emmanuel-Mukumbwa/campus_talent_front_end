// File: src/components/portfoliobuilder/WizardNavButtons.jsx

import React from 'react';

const WizardNavButtons = ({
  step,
  totalSteps,
  onBack,
  onNext,
  isValid,
  uploadsInFlight
}) => (
  <div className="d-flex justify-content-between mt-4">
    <button
      className="btn btn-outline-secondary"
      onClick={onBack}
      disabled={step === 1}
    >
      Back
    </button>
    <button
      className="btn btn-success"
      onClick={onNext}
      disabled={!isValid() || uploadsInFlight}
    >
      {step < totalSteps ? 'Next' : 'Publish Portfolio'}
    </button>
  </div>
);

export default WizardNavButtons;
