// src/components/portfoliobuilder/ProficiencyStep.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, ProgressBar, Spinner, Row, Col } from 'react-bootstrap';
import api from '../../utils/api';
import { QUIZ_QUESTIONS } from './templates';

const SCORE_TO_LEVEL = (pct) => {
  if (pct >= 80) return 'Expert';
  if (pct >= 50) return 'Intermediate';
  return 'Beginner';
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SkillQuiz({ skill, questions, onComplete }) {
  const total = questions.length;
  const [shuffledQs] = useState(() =>
    shuffleArray(
      questions.map((q) => ({
        question: q.question,
        answers: shuffleArray(q.answers).map((ans) => ({
          text: ans,
          isCorrect: q.answers[q.correctAnswer] === ans
        }))
      }))
    )
  );

  const [qIdx, setQIdx] = useState(0);
  const qIdxRef = useRef(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const selectedRef = useRef(null);
  const resultsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  // keep refs in sync
  useEffect(() => {
    qIdxRef.current = qIdx;
  }, [qIdx]);
  useEffect(() => {
    selectedRef.current = selectedIdx;
  }, [selectedIdx]);

  // proceedNext uses refs to avoid stale closures and hence can be stable
  const proceedNextRef = useRef();
  proceedNextRef.current = () => {
    const currentIdx = qIdxRef.current;
    const q = shuffledQs[currentIdx];
    const picked = (q.answers[selectedRef.current] || {});
    const correct = Boolean(picked.isCorrect);
    const timeTaken = 30 - timeLeft;
    resultsRef.current = [...resultsRef.current, { question: q.question, correct, timeTaken }];

    // reset selection
    setSelectedIdx(null);

    if (currentIdx + 1 < total) {
      setQIdx(currentIdx + 1);
      setTimeLeft(30);
    } else {
      // return final results
      onComplete(resultsRef.current);
    }
  };

  // Timer per question: reset when qIdx changes
  useEffect(() => {
    setTimeLeft(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          // call stable ref
          proceedNextRef.current();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [qIdx, proceedNextRef, shuffledQs, total]);

  const handleNext = () => {
    // call stable ref to proceed
    proceedNextRef.current();
  };

  const q = shuffledQs[qIdx];
  const progress = Math.round((qIdx / total) * 100);

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <strong>{skill} Quiz</strong>
        <small>{qIdx + 1} / {total}</small>
      </Card.Header>
      <Card.Body>
        <ProgressBar now={progress} className="mb-3" />
        <h5 className="mb-3">{q.question}</h5>
        <Row xs={1} md={2} className="g-2">
          {q.answers.map((ans, i) => {
            let variant = 'outline-secondary';
            if (selectedIdx !== null) {
              if (i === selectedIdx) {
                variant = ans.isCorrect ? 'success' : 'danger';
              } else if (ans.isCorrect) {
                variant = 'success';
              }
            }
            return (
              <Col key={i}>
                <Button
                  className="w-100 text-start"
                  disabled={selectedIdx !== null}
                  variant={variant}
                  onClick={() => setSelectedIdx(i)}
                >
                  {ans.text}
                </Button>
              </Col>
            );
          })}
        </Row>
        <div className="text-end mt-3">
          <small className="text-muted me-3">Time left: {timeLeft}s</small>
          <Button variant="primary" disabled={selectedIdx === null} onClick={handleNext}>
            {qIdx + 1 < total ? 'Next Question' : 'Finish Quiz'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default function ProficiencyStep({ data, setData }) {
  const skills = Array.isArray(data.selectedSkills) ? data.selectedSkills : [];
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState({});
  const [currentIdx] = useState(0);
  const [lastResults, setLastResults] = useState(null);

  // 1) Load any existing assessments and lift into parent
  useEffect(() => {
    let mounted = true;
    (async () => {
      const out = {};
      for (const skill of skills) {
        try {
          const { data: asmt } = await api.get(`/api/assessments/${skill}`);
          out[skill] = asmt;
          // lift that level & score_pct up into data.proficiencies
          if (mounted) {
            setData((prev) => ({
              ...prev,
              proficiencies: {
                ...prev.proficiencies,
                [skill]: {
                  level: asmt.level,
                  score_pct: asmt.score_pct
                }
              }
            }));
          }
        } catch {
          // no existing assessment or fetch failed
        }
      }
      if (mounted) {
        setAssessments(out);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [skills, setData]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p className="mt-3">Checking your assessments…</p>
      </div>
    );
  }

  if (!skills.length) {
    return (
      <Card className="shadow-sm p-4 text-center">
        <h5>Select at least one skill to begin your assessment</h5>
      </Card>
    );
  }

  const skill = skills[currentIdx];
  const existing = assessments[skill];

  // 2) Already taken: show summary + feedback
  if (existing) {
    return (
      <Card className="shadow-sm">
        <Card.Header>✅ {skill} Assessment Completed</Card.Header>
        <Card.Body>
          <p>
            <strong>Level:</strong> {existing.level}<br />
            <strong>Score:</strong> {existing.score_pct}%<br />
            <strong>Avg Time:</strong> {existing.time_taken_avg}s<br />
            <strong>Taken on:</strong>{' '}
            {existing.taken_at ? new Date(existing.taken_at).toLocaleDateString() : '—'}
          </p>
          {Array.isArray(existing.details) && existing.details.length > 0 && (
            <div>
              <h6>Question Feedback</h6>
              <ul className="list-unstyled">
                {existing.details.map((d, i) => (
                  <li key={i} className="d-flex align-items-center mb-1">
                    {d.correct ? <span className="text-success me-2">✅</span> : <span className="text-danger me-2">❌</span>}
                    <span>{d.question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {existing.next_allowed_retaken_at && (
            <p className="mt-3 text-muted">
              You can retake this quiz after {new Date(existing.next_allowed_retaken_at).toLocaleDateString()}.
            </p>
          )}
          <p className="text-success">Click “Next” below to continue.</p>
        </Card.Body>
      </Card>
    );
  }

  // 3) Quiz just finished → POST then lift result
  if (lastResults) {
    const correctCount = lastResults.filter((r) => r.correct).length;
    const total = lastResults.length;
    const pct = Math.round((correctCount / total) * 100);
    const avgTime = Math.round(lastResults.reduce((sum, r) => sum + r.timeTaken, 0) / total);

    // submit & lift
    api
      .post(`/api/assessments/${skill}`, {
        score_pct: pct,
        time_taken_avg: avgTime,
        details: lastResults
      })
      .then(({ data: asmt }) => {
        setAssessments((a) => ({ ...a, [skill]: asmt }));
        setData((prev) => ({
          ...prev,
          proficiencies: {
            ...prev.proficiencies,
            [skill]: {
              level: asmt.level,
              score_pct: asmt.score_pct
            }
          }
        }));
        setLastResults(null);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Failed to save assessment', err);
        setLastResults(null);
      });

    return (
      <div className="text-center p-4">
        <Spinner animation="border" />
        <p className="mt-3">Saving your result…</p>
      </div>
    );
  }

  // 4) Render the quiz
  const quizDef = QUIZ_QUESTIONS[skill];
  return (
    <div>
      <h5 className="mb-3">📝 {skill} Assessment</h5>
      <small className="text-muted">
        {`Answer ${quizDef.questions.length} questions — time yourself and prove your skill.`}
      </small>
      <div className="mt-3">
        <SkillQuiz skill={skill} questions={quizDef.questions} onComplete={(results) => setLastResults(results)} />
      </div>
    </div>
  );
}