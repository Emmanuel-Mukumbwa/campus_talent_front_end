// File: src/pages/PortfolioBuilder.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate }               from 'react-router-dom';
import { jwtDecode }                 from 'jwt-decode';
import api                            from '../utils/api';

import AboutStep           from '../components/portfoliobuilder/AboutStep';
import SkillSelectStep     from '../components/portfoliobuilder/SkillSelectStep';
import ProjectStep         from '../components/portfoliobuilder/ProjectStep';
import ProficiencyStep     from '../components/portfoliobuilder/ProficiencyStep';
import PreviewStep         from '../components/portfoliobuilder/PreviewStep';
import WizardNavButtons    from '../components/portfoliobuilder/WizardNavButtons';

import './PortfolioBuilder.css';

const TOTAL_STEPS  = 5;
const INITIAL_DATA = {
  about: '',
  selectedSkills: [],
  projects: [],
  proficiencies: {}
};

export default function PortfolioBuilder() {
  const navigate = useNavigate();

  // ─── Capture studentId from JWT ───────────────────────────────
  const [studentId, setStudentId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const { userId } = jwtDecode(token);
        setStudentId(userId);
      } catch {
        // ignore invalid token
      }
    }
  }, []);

  const [step, setStep]                         = useState(1);
  const [data, setData]                         = useState(INITIAL_DATA);
  const [linkErrors, setLinkErrors]             = useState({});
  const [showAuthModal, setShowAuthModal]       = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg]             = useState('');
  const [globalError, setGlobalError]           = useState('');
  const [uploadsInFlight, setUploadsInFlight]   = useState(false);
  const firstTimeOnStep3                       = useRef(true);

  // 1) Attach JWT header once
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // 2) Load existing portfolio (draft or published)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    (async () => {
      try {
        const { data: resp } = await api.get('/api/portfolio');
        if (!resp) return;

        const loadedProjects = resp.projects.flatMap(p => {
          const tags = Array.isArray(p.skillsUsed) && p.skillsUsed.length
            ? p.skillsUsed
            : (Array.isArray(resp.skills) && resp.skills.length
                ? [resp.skills[0]]
                : []);
          return tags.map(skill => ({
            id:            p.id,
            skill,
            title:         p.title,
            description:   p.description,
            evidence:      p.evidence,
            evidenceLabel: 'Link',
            media:         p.media || []
          }));
        });

        setData({
          about:           resp.about           || '',
          selectedSkills:  resp.skills          || [],
          proficiencies:   resp.proficiencies   || {},
          projects:        loadedProjects
        });
      } catch (err) {
        if (err.response?.status !== 404) {
          setGlobalError('Failed to load your portfolio. Please try again.');
        }
      }
    })();
  }, []);

  // Auto‑draft save upon entering Step 3 (once)
  useEffect(() => {
    if (step === 3 && firstTimeOnStep3.current) {
      firstTimeOnStep3.current = false;
      (async () => {
        try {
          await api.post('/api/portfolio', {
            about:         data.about,
            skills:        data.selectedSkills,
            proficiencies: data.proficiencies,
            projects:      data.projects,
            status:        'draft'
          });

          const { data: fresh } = await api.get('/api/portfolio');
          const refreshedProjects = fresh.projects.flatMap(p => {
            const tags = Array.isArray(p.skillsUsed) && p.skillsUsed.length
              ? p.skillsUsed
              : (Array.isArray(fresh.skills) && fresh.skills.length
                  ? [fresh.skills[0]]
                  : []);
            return tags.map(skill => ({
              id:            p.id,
              skill,
              title:         p.title,
              description:   p.description,
              evidence:      p.evidence,
              evidenceLabel: 'Link',
              media:         p.media || []
            }));
          });

          setData(d => ({
            ...d,
            projects: refreshedProjects
          }));
        } catch (err) {
          console.error('Auto-draft save failed', err);
        }
      })();
    }
  }, [step, data]);

  // 3) Validate URLs on Preview step
  useEffect(() => {
    if (step !== TOTAL_STEPS) return;
    const errors = {};
    data.projects.forEach((proj, i) => {
      errors[i] = proj.evidence.map(url => {
        try { new URL(url); return false; }
        catch { return true; }
      });
    });
    setLinkErrors(errors);
  }, [step, data.projects]);

  const isValid = () => {
    switch (step) {
      case 1: return data.selectedSkills.length > 0;
      case 2: return data.about.trim().length > 0;
      case 3:
        return data.selectedSkills.every(skill => {
          const ps = data.projects.filter(p => p.skill === skill);
          return ps.length > 0 && ps.every(p => p.evidence[0]?.trim().length > 0);
        });
      case 4:
        return data.selectedSkills.every(skill => Boolean(data.proficiencies[skill]));
      case 5:
        return Object.values(linkErrors).flat().every(e => !e);
      default:
        return false;
    }
  };

  // Next / Publish handler
  const handleNext = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    let payload;
    try {
      payload = jwtDecode(token);
    } catch {
      setShowAuthModal(true);
      return;
    }
    if (payload.role !== 'student') {
      setShowAuthModal(true);
      return;
    }

    try {
      // Draft save for steps 1–4
      if (step < TOTAL_STEPS) {
        await api.post('/api/portfolio', {
          about:         data.about,
          skills:        data.selectedSkills,
          proficiencies: data.proficiencies,
          projects:      data.projects,
          status:        'draft'
        });

        const { data: fresh } = await api.get('/api/portfolio');
        const refreshedProjects = fresh.projects.flatMap(p => {
          const tags = Array.isArray(p.skillsUsed) && p.skillsUsed.length
            ? p.skillsUsed
            : (Array.isArray(fresh.skills) && fresh.skills.length
                ? [fresh.skills[0]]
                : []);
          return tags.map(skill => ({
            id:            p.id,
            skill,
            title:         p.title,
            description:   p.description,
            evidence:      p.evidence,
            evidenceLabel: 'Link',
            media:         p.media || []
          }));
        });

        setData(d => ({
          ...d,
          projects: refreshedProjects
        }));
        setGlobalError('');
        setStep(s => s + 1);
        return;
      }

      // Publish on final step
      const resp = await api.post('/api/portfolio', {
        about:         data.about,
        skills:        data.selectedSkills,
        proficiencies: data.proficiencies,
        projects:      data.projects,
        status:        'published'
      });
      setGlobalError('');

      const returnedStatus = resp.data.status || 'published';
      setSuccessMsg(`Your portfolio status is now "${returnedStatus}".`);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('[PortfolioBuilder] upsert error', err);
      setGlobalError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));

  // ── NEW: close success modal & fetch /api/auth/me ─────────────────
  const onSuccessModalContinue = async () => {
    setShowSuccessModal(false);
    try {
      const { data: me } = await api.get('/api/auth/me');
      // me.userId is guaranteed because you’re a student here
      navigate(`/portfolioview/${me.userId}`);
    } catch (err) {
      console.error('Failed to fetch /me after publish', err);
      // fall back to JWT‑decoded studentId
      if (studentId) navigate(`/portfolioview/${studentId}`);
      else navigate('/');
    }
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className="container py-5">
      {/* Authentication Modal */}
      {showAuthModal && (
        <>
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
                  <button className="btn btn-outline-secondary" onClick={() => setShowAuthModal(false)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => { setShowAuthModal(false); navigate('/login'); }}
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Portfolio Published!</h5>
                  <button className="btn-close" onClick={onSuccessModalContinue} />
                </div>
                <div className="modal-body">
                  {successMsg.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success"
                    onClick={onSuccessModalContinue}
                  >
                    Go to Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {/* Global error */}
      {globalError && <div className="alert alert-danger">{globalError}</div>}

      {/* Step indicator */}
      <h4 className="mb-3 text-success">Step {step} of {TOTAL_STEPS}</h4>

      {/* Wizard steps */}
      {step === 1 && <SkillSelectStep data={data} setData={setData} />}
      {step === 2 && <AboutStep data={data} setData={setData} />}
      {step === 3 && (
        <ProjectStep
          data={data}
          setData={setData}
          setUploadsInFlight={setUploadsInFlight}
        />
      )}
      {step === 4 && <ProficiencyStep data={data} setData={setData} />}
      {step === 5 && <PreviewStep data={data} linkErrors={linkErrors} />}

      {/* Navigation buttons */}
      <WizardNavButtons
        step={step}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        isValid={isValid}
        uploadsInFlight={step === 3 ? uploadsInFlight : false}
      />
    </div>
  );
}
