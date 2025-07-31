import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser, FaTools, FaProjectDiagram, FaCheckCircle, FaGlobe
} from 'react-icons/fa';
import api from '../utils/api';        // <-- your axios instance 
import './PortfolioBuilder.css';
import {jwtDecode} from 'jwt-decode';

const CORE_SKILLS = [
  'Coding', 'Video Production', 'Graphics Design', 'Research Writing', 'Tutoring'
];

const INITIAL_DATA = {
  about: '',
  selectedSkills: [],
  projects: [
    { title: '', description: '', evidence: [''], skillsUsed: [] },
  ],
  proficiencies: {},
};

const PortfolioBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg]       = useState('');
  const [linkErrors, setLinkErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const totalSteps = 5;

  // 1) Attach JWT header
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // 2) Load existing portfolio (if any)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
  if (!token) return;            // ←— bail out if not logged in

  const fetchPortfolio = async () => {
      try {
        const { data: resp } = await api.get('/api/portfolio');
        if (resp) {
          setData({
            about: resp.about || '',
            selectedSkills: resp.skills || [],
            proficiencies: resp.proficiencies || {},
            projects: resp.projects.length
              ? resp.projects.map(p => ({
                  title: p.title,
                  description: p.description,
                  evidence: p.evidence,
                  skillsUsed: p.skillsUsed
                }))
              : INITIAL_DATA.projects
          });
        }
      } catch (err) {
        // ignore 404 (no existing portfolio), show other errors
        if (err.response?.status !== 404) {
          setGlobalError('Failed to load your portfolio. Please try again.');
        }
      }
    };
    fetchPortfolio();
  }, []);

  // 3) Validate URLs on preview step
  useEffect(() => {
    if (step === 5) {
      const errors = {};
      data.projects.forEach((proj, idx) => {
        errors[idx] = proj.evidence.map(url => {
          try { new URL(url); return false; }
          catch { return true; }
        });
      });
      setLinkErrors(errors);
    }
  }, [step, data.projects]);

  // 4) Simple step-validation
  const isValid = () => {
  switch (step) {
    case 1:
      return data.about.trim().length > 0;
    case 2:
      return data.selectedSkills.length > 0;
    case 3:
      return data.projects.every(p => {
        if (!p.title.trim() || !p.description.trim()) return false;
        return p.evidence.every(link =>
          typeof link === 'string' && link.trim().length > 0
        );
      });
    case 4:
      return data.selectedSkills.every(skill =>
        !!data.proficiencies[skill]
      );
    case 5:
      return Object.values(linkErrors).flat().every(e => !e);
    default:
      return false;
  }
};

  // 5) Upsert helper to save draft or publish
  const upsert = async (status) => {
    try {
      await api.post('/api/portfolio', {
        about: data.about,
        skills: data.selectedSkills,
        proficiencies: data.proficiencies,
        projects: data.projects,
        status,            // 'draft' or 'published'
      });
      setGlobalError('');
    } catch (err) {
      setGlobalError(
        err.response?.data?.message ||
        'An error occurred. Please try again.'
      );
      throw err;
    }
  };

const handleBack = () => {
   setStep(s => Math.max(1, s - 1));
  };

  // 6) Navigation handlers
const handleNext = async () => {
  // 1) Ensure user is logged in
  const token = localStorage.getItem('authToken');
 if (!token) {
    // Show modal instead of direct redirect
    return setShowAuthModal(true);
  }

  // 2) Decode & check role
  let payload;
  try {
    payload = jwtDecode(token);
  } catch (err) {
     // Show modal on invalid token
    return setShowAuthModal(true);
  }
  if (payload.role !== 'student') {
    // Only students can build a portfolio
    // reuse same modal
    return setShowAuthModal(true);
  }

    // 3) Proceed with your existing upsert + step logic
  try {
    if (step < totalSteps) {
      await upsert('draft');
      setStep(s => s + 1);
    } else {
      await upsert('published');
      setSuccessMsg('Your portfolio has been published successfully!\nURL: https://campustalent.io/u/123');
      setShowSuccessModal(true);
    }
    setGlobalError(''); // clear any prior errors
  } catch {
    // on error, stay on current step
  }
};

  // Your existing renderStep() untouched:
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-card">
            <h5><FaUser className="me-2 text-success" /> Tell us about yourself</h5>
            <small>What skills are you most excited to apply in real-world projects?</small>
            <textarea
              className="form-control mt-2"
              rows="4"
              placeholder="e.g., Mzuzu University Web Developer | Passionate about EdTech Solutions"
              value={data.about}
              onChange={e => setData({ ...data, about: e.target.value })}
            />
          </div>
        );

      case 2:
        return (
          <div className="wizard-card">
            <h5><FaTools /> Select Your Core Skills</h5>
            <small>(pick any you like from our focus areas)</small>
            <div className="core-skills-list mb-2">
              {CORE_SKILLS.map(skill => (
                <label key={skill} className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={data.selectedSkills.includes(skill)}
                    onChange={() => {
                      const sel = data.selectedSkills.includes(skill)
                        ? data.selectedSkills.filter(s => s !== skill)
                        : [...data.selectedSkills, skill];
                      setData({ ...data, selectedSkills: sel });
                    }}
                  />
                  <span className="form-check-label">{skill}</span>
                </label>
              ))}
            </div>
            <p className="text-muted">
              You’ve selected {data.selectedSkills.length} skill
              {data.selectedSkills.length === 1 ? '' : 's'}.
            </p>
          </div>
        );

      case 3:
        return (
          <div className="wizard-card">
            <h5><FaProjectDiagram /> Project Showcase</h5>
            <small>Prove skills through tangible campus work.</small>
            {data.projects.map((p, i) => (
              <div key={i} className="project-entry mb-4">
                <input
                  className="form-control mb-2"
                  placeholder="Project Title (e.g., FarmConnect Mobile App)"
                  value={p.title}
                  onChange={e => {
                    const arr = [...data.projects];
                    arr[i].title = e.target.value;
                    setData({ ...data, projects: arr });
                  }}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description (e.g., Developed an app used by 50+ local farmers.)"
                  value={p.description}
                  onChange={e => {
                    const arr = [...data.projects];
                    arr[i].description = e.target.value;
                    setData({ ...data, projects: arr });
                  }}
                />
                <label>Evidence Links (GitHub, YouTube, Google Drive, etc.)</label>
                {p.evidence.map((link, j) => (
                  <div key={j} className="input-group mb-2">
                    <input
                      className={`form-control${step === 5 && linkErrors[i]?.[j] ? ' is-invalid' : ''}`}
                      placeholder="Paste a public link"
                      value={link}
                      onChange={e => {
                        const arr = [...data.projects];
                        arr[i].evidence[j] = e.target.value;
                        setData({ ...data, projects: arr });
                      }}
                    />
                    {p.evidence.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          const arr = [...data.projects];
                          arr[i].evidence = arr[i].evidence.filter((_, k) => k !== j);
                          setData({ ...data, projects: arr });
                        }}
                      >Remove</button>
                    )}
                  </div>
                ))}
                {p.evidence.length < 5 && (
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm mb-2"
                    onClick={() => {
                      const arr = [...data.projects];
                      arr[i].evidence.push('');
                      setData({ ...data, projects: arr });
                    }}
                  >+ Add another link</button>
                )}
                <div>
                  <label>Skills Used</label>
                  <div>
                    {data.selectedSkills.map(skill => (
                      <label key={skill} className="form-check me-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={p.skillsUsed.includes(skill)}
                          onChange={() => {
                            const arr = [...data.projects];
                            arr[i].skillsUsed = p.skillsUsed.includes(skill)
                              ? p.skillsUsed.filter(s => s !== skill)
                              : [...p.skillsUsed, skill];
                            setData({ ...data, projects: arr });
                          }}
                        />
                        <span className="form-check-label">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {data.projects.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={() => {
                      setData({
                        ...data,
                        projects: data.projects.filter((_, idx) => idx !== i)
                      });
                    }}
                  >Remove Project</button>
                )}
              </div>
            ))}
            {data.projects.length < 3 && (
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => {
                  setData({
                    ...data,
                    projects: [
                      ...data.projects,
                      { title: '', description: '', evidence: [''], skillsUsed: [] }
                    ]
                  }); 
                }}
              >+ Add Project</button>
            )}
          </div>
        );

      case 4:
        return (
          <div className="wizard-card">
            <h5><FaCheckCircle /> Set Skill Proficiency</h5>
            <small>Choose your level for each selected skill</small>
            {data.selectedSkills.map(skill => (
              <div key={skill} className="mb-3">
                <label className="form-label">{skill}</label>
                <select
                  className="form-select"
                  value={data.proficiencies[skill] || ''}
                  onChange={e =>
                    setData({
                      ...data,
                      proficiencies: {
                        ...data.proficiencies,
                        [skill]: e.target.value
                      }
                    })
                  }
                >
                  <option value="" disabled>
                    -- Select proficiency --
                  </option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="wizard-card">
            <h5><FaGlobe /> Preview & Publish</h5>
            <div className="mb-3">
              <strong>About:</strong>
              <div className="border rounded p-2">{data.about}</div>
            </div>
            <div className="mb-3">
              <strong>Core Skills:</strong>
              <ul>
                {data.selectedSkills.map(skill => (
                  <li key={skill}>
                    {skill} ({data.proficiencies[skill]})
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <strong>Projects:</strong>
              {data.projects.map((p, i) => (
                <div key={i} className="border rounded p-2 mb-2">
                  <div><b>Title:</b> {p.title}</div>
                  <div><b>Description:</b> {p.description}</div>
                  <div>
                    <b>Evidence:</b>
                    <ul>
                      {p.evidence.map((url, j) => (
                        <li key={j} className={linkErrors[i]?.[j] ? 'text-danger' : ''}>
                          {url}
                          {linkErrors[i]?.[j] && <span> (Invalid URL)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <b>Skills Used:</b> {p.skillsUsed.join(', ') || 'None'}
                  </div>
                </div>
              ))}
            </div>
            <div className="alert alert-info">
              Review your info. If all looks good, click "Publish Portfolio"!
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container py-5">
      {showAuthModal && (
  <>
    {/* Modal */}
    <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Authentication Required</h5>
            <button type="button" className="btn-close" onClick={() => setShowAuthModal(false)} />
          </div>
          <div className="modal-body">
            <p>You must be logged in as a student to build a portfolio.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowAuthModal(false)}
            >
              Cancel 
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                setShowAuthModal(false);
                navigate('/login');
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
    {/* Backdrop */}
    <div className="modal-backdrop fade show"></div>
  </>
)}

{showSuccessModal && (
  <>
    <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Portfolio Published!</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowSuccessModal(false)}
            />
          </div>
          <div className="modal-body">
            {successMsg.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show"></div>
  </>
)}


      {globalError && (
        <div className="alert alert-danger">
          {globalError}
        </div>
      )}

      <h4 className="mb-3 text-success">
        Step {step} of {totalSteps}
      </h4>

      {renderStep()}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={handleBack}
          disabled={step === 1}
        >
          Back
        </button>
        <button
          className="btn btn-success"
          onClick={handleNext}
          disabled={!isValid()}
        >
          {step < totalSteps ? 'Next' : 'Publish Portfolio'}
        </button>
      </div>
    </div>
  );
};

export default PortfolioBuilder;
