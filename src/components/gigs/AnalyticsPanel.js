import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import api from '../../utils/api';

/**
 * Shows analytics for students or recruiters.
 */
export default function AnalyticsPanel({ role = 'student', reloadTrigger }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setLoading(true);
      try {
        const params = { page: 1, pageSize: 100 };
        const res = await api.get('/api/gigs1', { params });
        if (cancelled) return;

        const { gigs = [], total } = res.data;

        if (role === 'recruiter') {
          const openCount = gigs.filter(g => g.status === 'Open').length;
          const totalApplications = gigs.reduce((sum, g) => sum + (g.applicants || 0), 0);
          const avgApplicants = gigs.length ? (totalApplications / gigs.length).toFixed(1) : '0.0';

          setStats({
            totalGigs: total || gigs.length,
            openGigs: openCount,
            totalApplications,
            avgApplicants,
          });
        } else {
          const appliedGigs = gigs.filter(g => g.isApplied);
          const totalApplied = appliedGigs.length;

          const totalBudget = appliedGigs.reduce((sum, g) => {
            const amt = parseFloat(g.payment_amount ?? 0);
            return sum + (isNaN(amt) ? 0 : amt);
          }, 0);

          const avgBudget = totalApplied
            ? (totalBudget / totalApplied).toFixed(2)
            : '0.00';

          let matchedSkillCount = 0;
          try {
            const userSkillsRes = await api.get('/api/student/skills');
            const userSkills = userSkillsRes.data.skills || [];

            const matchedGigs = gigs.filter(g =>
              g.skills?.some(skill => userSkills.includes(skill.skill))
            );
            matchedSkillCount = matchedGigs.length;
          } catch (err) {
            console.warn('Skill match error:', err.message);
          }

          setStats({
            totalGigs: gigs.length,
            applied: totalApplied,
            avgBudget,
            matchedSkillCount,
          });
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [role, reloadTrigger]);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header as="h6">
        {role === 'student' ? 'Your Application Insights' : 'Recruiter Dashboard'}
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="success" />
          </div>
        ) : role === 'student' ? (
          <>
            <div className="mb-3">
              <small className="text-muted">Total Gigs Available</small>
              <h4 className="text-info">{stats.totalGigs ?? 0}</h4>
            </div>
            <div className="mb-3">
              <small className="text-muted">Applied Gigs</small>
              <h4 className="text-success">{stats.applied ?? 0}</h4>
            </div>
            <div className="mb-3">
              <small className="text-muted">Average Budget of Applied Gigs</small>
              <h4 className="text-warning">
                MK {Number(stats.avgBudget ?? 0).toLocaleString()}
              </h4>
            </div>
            {/*<div>
              <small className="text-muted">Matched Gigs by Skill</small>
              <h4 className="text-primary">{stats.matchedSkillCount ?? 0}</h4>
            </div>*/}
          </>
        ) : (
          <>
            <div className="mb-3">
              <small className="text-muted">Total Gigs</small>
              <h4 className="text-success">{stats.totalGigs ?? 0}</h4>
            </div>
            <div className="mb-3">
              <small className="text-muted">Open Gigs</small>
              <h4 className="text-success">{stats.openGigs ?? 0}</h4>
            </div>
            <div className="mb-3">
              <small className="text-muted">Applications Received</small>
              <h4 className="text-primary">{stats.totalApplications ?? 0}</h4>
            </div>
            <div>
              <small className="text-muted">Avg Applicants per Gig</small>
              <h4 className="text-muted">{stats.avgApplicants ?? '0.0'}</h4>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
