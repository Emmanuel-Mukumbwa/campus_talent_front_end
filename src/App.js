import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import GlobalNavbar from './components/GlobalNavbar';
import AdminNavbar from './components/AdminNavbar'; 
import HomePage from './pages/HomePage';
import PortfolioBuilder from './pages/PortfolioBuilder';
import CreateGigWizard from './pages/CreateGigWizard';
import EditGigWizard from './pages/EditGigWizard';
import MyNetwork from './pages/MyNetwork';
import Gigs from './pages/Gigs';
import ApplyGigWizard from './pages/ApplyGigWizard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import EndorseWizard from './pages/EndorseWizard';
import Footer from './components/Footer';
import StudentApplications from './pages/StudentApplications';
import StudentApplicationDetail from './pages/StudentApplicationDetail';
import RecruiterApplications from './pages/RecruiterApplications';
import RecruiterApplicationDetail from './pages/RecruiterApplicationDetail';
import PortfolioView from './pages/PortfolioView';
import GetStarted from './pages/GetStarted';
import RecruiterVerification from './pages/RecruiterVerification';
import MyProfile from './pages/MyProfile';
import FeesPage from './pages/FeesPage';
import EscrowCheck from './pages/EscrowCheck';
import EscrowDetail from './pages/EscrowDetail';
import RecruiterApplicationReview from './pages/RecruiterApplicationReview';
import Redirecting from './pages/Redirecting';
import Messages      from './pages/Messages';
import Conversation  from './pages/Conversation';
import GigDetail from './pages/GigDetail';

import SubscriptionPage     from './pages/SubscriptionPage';
import SubscriptionStatus   from './pages/SubscriptionStatus';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import GigManagement from './pages/admin/GigManagement';
import ApplicationTracking from './pages/admin/ApplicationTracking';
import VerificationsList from './pages/admin/VerificationsList';
import VerificationDetail from './pages/admin/VerificationDetail';
import SkillsPage      from './pages/admin/SkillsPage';
import ManageSubscriptions from './pages/admin/ManageSubscriptions';
import Notifications from './pages/Notifications';
import Terms        from './pages/Terms';
import Disclaimer   from './pages/Disclaimer';

function NotFound() {
  return (
    <div className="text-center py-5">
      <h2>404 – Page Not Found</h2>
      <p>The page you’re looking for doesn’t exist.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}

function App() {
  const userRole = localStorage.getItem('userRole') || '';
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = userRole === 'admin';

  return (
    <Router>
      {/* ✅ Conditionally render the correct navbar */}
      {!isAdmin && (
        <GlobalNavbar unreadCount={5}>
          {isLoggedIn && userRole === 'student' && (
            <Link className="nav-link" to="/student/applications">
              My Applications
            </Link>
          )}
        </GlobalNavbar>
      )}

      {isAdmin && (
        <AdminNavbar />
      )}

      <div className="App" style={{ paddingTop: '70px' }}>
        <main>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/getstarted" element={<GetStarted />} />
            <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
            <Route path="/post-job" element={<CreateGigWizard />} />
            <Route path="/fees" element={<FeesPage />} />
            <Route path="/escrow-check" element={<EscrowCheck />} />
            <Route path="/escrow/:tx_ref" element={<EscrowDetail />} />
            <Route path="/recruiter/applications/:gigId/:appId/review" element={<RecruiterApplicationReview />}/>
            <Route path="/redirecting" element={<Redirecting />} />
            <Route path="/recruiter/publicportfolioview/:studentId" element={<PortfolioView />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} /> 
            <Route path="/subscriptions"       element={<SubscriptionPage />} />
            <Route path="/subscription/status" element={<SubscriptionStatus />} />
            {/*<Route path="/gigs/:id" element={<GigDetail />} />*/}

            {/* Protected: any logged-in user */}
             <Route
              path="/gigs/:id"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter']}>
                  <GigDetail />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/mynetwork"
              element={
                <ProtectedRoute>
                  <MyNetwork />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Gigs userRole={userRole} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs/edit/:gigId"
              element={
                <ProtectedRoute>
                  <EditGigWizard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/gigs2/:gigId/apply" 
              element={
                <ProtectedRoute>
                  <ApplyGigWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/endorse/:studentId" 
              element={
                <ProtectedRoute>
                  <EndorseWizard />
                </ProtectedRoute>
              }
            />

            {/*// In your router setup
              <Route
                path="/endorse/:studentId"
                element={
                  <ProtectedRoute
                    allowedRoles={['recruiter']}
                    requireFullyVerified={true}
                  >
                    <EndorseWizard />
                  </ProtectedRoute>
                }
              />
              */}

            {/* Student Applications */}
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications/:applicationId"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentApplicationDetail />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Applications */}
            <Route
              path="/recruiter/applications/:gigId"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/applications"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/applications/:gigId/:applicationId"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterApplicationDetail />
                </ProtectedRoute>
              }
            /> 
 
            {/* Portfolio */}
            <Route
              path="/portfolioview/:studentId"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter']}>
                  <PortfolioView />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/recruiter/portfolioview/:studentId"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter']}>
                  <PortfolioView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruiterverification"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterVerification />
                </ProtectedRoute>
              }
            />

            <Route
              path="/myprofile"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter']}>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute allowedRoles={['student', 'recruiter']}>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            {/* ─── Admin Section ───────────────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="gigs" element={<GigManagement />} />
              <Route path="applications" element={<ApplicationTracking />} />
              <Route path="verifications" element={<VerificationsList />} />
              <Route path="verifications/:id" element={<VerificationDetail />} />
              <Route path="/admin/skills"    element={<SkillsPage />} />
              <Route path="/admin/subscriptions" element={<ManageSubscriptions/>} />

            </Route>

            {/* Messaging */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute allowedRoles={['student','recruiter']}>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:otherId"
                element={
                  <ProtectedRoute allowedRoles={['student','recruiter']}>
                    <Conversation />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
