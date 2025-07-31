// File: src/components/DiscoverStudents.js
import './DiscoverStudents.css';       
import React, { useState } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import * as api from '../services/mockStudentActions';       

// Mock data (unchanged)…
const topStudents = [
  {
    id: 1,
    name: "John Banda",
    program: "BSc Information and Communication Technology",
    year: "Year 3",
    university: "Mzuzu University",
    courses: ["ICT 302", "Data Structures", "Web Development"],
    skills: ["Python", "React", "UI/UX Design"],
    badges: [
      {  
        name: "Gold Web Dev", 
        issuer: "Mzuni ICT Dept", 
        date: "2024-03-15",
        criteria: "Awarded for excellence in capstone project"
      },
      { 
        name: "EPICA Blockchain", 
        issuer: "EPICA Consortium", 
        date: "2024-02-20" 
      }
    ],
    endorsements: [
      { skill: "Python", count: 8, endorsers: ["Alice M.", "Dr. Phiri"] },
      { skill: "React", count: 5, endorsers: ["Grace M."] }
    ],
    projects: [
      {
        title: "FarmConnect Mobile App",
        description: "IoT-based solution for local farmers",
        skillsUsed: ["Python", "React Native", "Agile"],
        link: "https://github.com/johnbanda/farmconnect",
        media: ["screenshot1.jpg", "demo.mp4"]
      }
    ],
    profileStrength: 85,
    availability: "Weekends & Holidays",
    workTypePreference: ["Remote", "On-Campus"],
    paymentPreference: "PayChangu Escrow",
    isVerified: true,
    paymentVerified: true,
    lastActive: "2h ago",
    responseRate: "95%",
    contactCTA: "Request Code Sample",
    hireCTA: "Invite to Project",
    recommendedJobs: [
      {
        skill: "React",
        jobExample: "Frontend Developer Intern",
        cta: "Request Code Sample",
        reason: "Coding skill + GitHub projects required."
      }
    ]
  },
  {
    id: 2,
    name: "Alice Mvula",
    program: "BSc Information and Communication Technology",
    year: "Year 2",
    university: "Mzuzu University",
    courses: ["Design Theory", "Digital Illustration"],
    skills: ["Adobe Photoshop", "UI/UX", "Branding"],
    badges: [
      { 
        name: "Silver Designer", 
        issuer: "Mzuzu Creative Lab", 
        date: "2024-04-01" 
      }
    ],
    endorsements: [
      { skill: "UI/UX", count: 12, endorsers: ["John B.", "Prof. Kanyama"] }
    ],
    projects: [
      {
        title: "Campus Event Branding",
        description: "Designed posters for 2024 Science Fair",
        skillsUsed: ["Adobe Suite", "Typography"],
        link: "https://behance.net/alicemvula",
        media: ["poster1.png", "poster2.png"]
      }
    ],
    profileStrength: 70,
    availability: "Part-Time Evenings",
    workTypePreference: ["Hybrid"],
    paymentPreference: "PayChangu Escrow",
    isVerified: true,
    paymentVerified: false,
    lastActive: "1d ago",
    responseRate: "80%",
    contactCTA: "View Portfolio",
    hireCTA: "Offer Freelance Gig",
    recommendedJobs: [
      {
        skill: "UI/UX",
        jobExample: "UX Design Intern",
        cta: "View Portfolio",
        reason: "Design skill + portfolio proof required."
      }
    ]
  }
];

const newStudents = [
  {
    id: 3,
    name: "David Nyondo",
    program: "BSc Environmental Science",
    year: "Year 1",
    university: "Mzuzu University",
    courses: ["Ecology 101", "GIS Basics"],
    skills: ["Data Analysis", "Research Writing"],
    badges: [],
    endorsements: [
      { skill: "Report Writing", count: 2, endorsers: ["Classmate XYZ"] }
    ],
    projects: [],
    profileStrength: 40,
    availability: "Flexible",
    workTypePreference: ["On-Campus"],
    paymentPreference: "Academic Credit",
    isVerified: true,
    paymentVerified: false,
    lastActive: "3d ago",
    responseRate: "60%",
    contactCTA: "Request CV",
    hireCTA: "Schedule Meeting",
    recommendedJobs: [
      {
        skill: "Data Analysis",
        jobExample: "Mathematics Tutor",
        cta: "Request CV",
        reason: "Year 1–2 students with limited project history."
      }
    ]
  },
  {
    id: 4,
    name: "James Mwale",
    program: "Diploma in Tourism",
    year: "Year 1",
    university: "Mzuzu University",
    courses: ["Hospitality Mgmt", "Eco-Tourism"],
    skills: ["Customer Service", "Event Planning"],
    badges: [],
    endorsements: [],
    projects: [
      {
        title: "Campus Tour Guide Initiative",
        description: "Organized orientation tours for freshmen",
        skillsUsed: ["Leadership", "Public Speaking"]
      }
    ],
    profileStrength: 55,
    availability: "Weekends",
    workTypePreference: ["Remote"],
    paymentPreference: "PayChangu Escrow",
    isVerified: false,
    paymentVerified: false,
    lastActive: "5d ago",
    responseRate: "N/A",
    contactCTA: "Schedule Interview",
    hireCTA: "Invite to Volunteer",
    recommendedJobs: [
      {
        skill: "Event Planning",
        jobExample: "Cultural Festival Organizer",
        cta: "Invite to Volunteer",
        reason: "Community service/event planning."
      }
    ]
  }
];

export default function DiscoverStudents() {
  const [notifications, setNotifications] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: '',
    body: null,
    onConfirm: null,
    confirmText: '',
  });

  const queueNotification = msg =>
    setNotifications(n => [msg, ...n]);

  const openModal = ({ title, body, onConfirm, confirmText }) =>
    setModalConfig({ show: true, title, body, onConfirm, confirmText });

  const closeModal = () =>
    setModalConfig(m => ({ ...m, show: false }));

  const handleConfirm = () => {
    if (modalConfig.onConfirm) modalConfig.onConfirm();
  };

 const handleCTA = (student, action) => {
    switch (action) {
      case 'Request Code Sample':
        openModal({
          title: 'Request Code Sample',
          body: (
            <>
              <label>GitHub Repo URL</label>
              <input type="url" className="form-control mb-2"
                placeholder="https://github.com/username/repo" />
              <label>Message</label>
              <textarea className="form-control mb-2" rows={3}
                defaultValue={`Hi ${student.name}, could you please share your FarmConnect code sample via the above GitHub repo?`} />
              <small className="text-muted">
                {student.badges.some(b => b.name.includes('Gold Web Dev'))
                  ? 'Student has Gold Web Dev badge 👍'
                  : 'Note: Student lacks the Gold Web Dev badge.'}
              </small>
            </>
          ),
          confirmText: 'Send Request',
          onConfirm: () => {
            api.requestCodeSample(student.id).then(() => {
              queueNotification(`Requested code sample from ${student.name}.`);
              closeModal();
            });
          },
        });
        break;

      case 'View Portfolio':
        openModal({
          title: 'View Portfolio',
          body: (
            <>
              <p>You’re about to view <strong>{student.name}’s</strong> portfolio.</p>
              <p className="text-muted">
                Viewed <strong>{Math.floor(Math.random() * 20) + 1}</strong> times
                {student.badges.some(b => /Designer/.test(b.name)) && ' • Has Designer badge'}
              </p>
            </>
          ),
          confirmText: 'Proceed',
          onConfirm: () => {
            api.viewPortfolio(student.id).then(() => {
              queueNotification(`Viewed ${student.name}’s portfolio.`);
              window.open(`https://portfolio.example.com/${student.id}`, '_blank');
              closeModal();
            });
          },
        });
        break;

      case 'Request CV':
        openModal({
          title: 'Request CV',
          body: (
            <>
              <label>Deadline</label>
              <input type="date" className="form-control mb-2" />
              {/^Year [12]$/.test(student.year) && (
                <p className="text-muted">Good fit: Year 1–2 with limited projects.</p>
              )}
            </>
          ),
          confirmText: 'Request CV',
          onConfirm: () => {
            api.requestCV(student.id).then(() => {
              queueNotification(`Requested CV from ${student.name}.`);
              closeModal();
            });
          },
        });
        break;

      case 'Invite to Project':
        openModal({
          title: 'Invite to Project',
          body: (
            <>
              <label>Project</label>
              <select className="form-select mb-2" id="projectSelect"
                onChange={e => {
                  const custom = document.getElementById('projectCustom');
                  custom.style.display = e.target.value === 'Other...' ? 'block' : 'none';
                }}>
                <option>Campus Cleanup</option>
                <option>App Development Team</option>
                <option>Other...</option>
              </select>
              <input id="projectCustom" className="form-control mb-2"
                placeholder="Custom project name" style={{ display: 'none' }} />
              <label>Role Title</label>
              <input className="form-control mb-2" placeholder="e.g., Frontend Developer" />
              <label>Deadline</label>
              <input type="date" className="form-control" />
            </>
          ),
          confirmText: 'Send Invite',
          onConfirm: () => {
            const sel = document.getElementById('projectSelect').value;
            const project = sel === 'Other...'
              ? document.getElementById('projectCustom').value
              : sel;
            api.inviteToProject(student.id, project).then(() => {
              queueNotification(`Invited ${student.name} to ${project}.`);
              closeModal();
            });
          },
        });
        break;
        case 'Offer Freelance Gig':
                openModal({
                  title: 'Offer Freelance Gig',
                  body: (
                    <>
                      <label>Gig Title</label>
                      <input
                        className="form-control mb-2"
                        defaultValue="Edit YouTube videos"
                      />
                      <label>Budget</label>
                      <input
                        className="form-control mb-2"
                        placeholder="MWK 15,000"
                      />
                      <label>Payment Model</label>
                      <select className="form-select mb-2">
                        <option>Hourly</option>
                        <option>Project-Based</option>
                        <option>Stipend</option>
                      </select>
                      <small className="text-muted">
                        Funds will be held in PayChangu escrow.
                      </small>
                    </>
                  ),
                  confirmText: 'Offer Gig',
                  onConfirm: () => {
                    api.offerFreelanceGig(student.id).then(() => {
                      queueNotification(`Offered freelance gig to ${student.name}.`);
                      closeModal();
                    });
                  },
                });
                break;
        
              case 'Suggest Mentorship':
                openModal({
                  title: 'Suggest Mentorship',
                  body: (
                    <>
                      <label>Choose Mentor</label>
                      <select className="form-select mb-2">
                        <option>Jane Doe (Senior Dev)</option>
                        <option>Prof. Phiri</option>
                      </select>
                      <label>Session Type</label>
                      <select className="form-select mb-2">
                        <option>Video Call</option>
                        <option>Phone Call</option>
                        <option>In Person</option>
                      </select>
                      <label>Schedule</label>
                      <input type="datetime-local" className="form-control" />
                    </>
                  ),
                  confirmText: 'Send Invite',
                  onConfirm: () => {
                    api.suggestMentorship(student.id).then(() => {
                      queueNotification(`Suggested mentorship to ${student.name}.`);
                      closeModal();
                    });
                  },
                });
                break;
        
              case 'Schedule Interview':
          let interviewType = 'Phone Call';
          let location = '';
          let meetLink = '';
          let dateTime = '';
        
          openModal({
            title: 'Schedule Interview',
            body: (
              <>
                <label>Interview Type</label>
                <select
                  className="form-select mb-2"
                  onChange={e => {
                    interviewType = e.target.value;
                    document.getElementById('interview-extra-fields').innerHTML = interviewType === 'In Person'
                      ? `<label>Location</label>
                         <input id="locationInput" class='form-control mb-2' placeholder='Campus Room or Address' />`
                      : interviewType === 'Google Meet'
                      ? `<label>Google Meet Link</label>
                         <input id="meetLinkInput" class='form-control mb-2' placeholder='https://meet.google.com/xyz' />`
                      : '';
                  }}
                >
                  <option>Phone Call</option>
                  <option>Google Meet</option>
                  <option>In Person</option>
                </select>
        
                <div id="interview-extra-fields"></div>
        
                <label>Date & Time</label>
                <input
                  id="interviewDate"
                  type="datetime-local"
                  className="form-control mb-2"
                  onChange={e => dateTime = e.target.value}
                />
                <small className="text-muted">Student TZ: Africa/Blantyre</small>
              </>
            ),
            confirmText: 'Schedule',
            onConfirm: () => {
              const selectedType = interviewType;
              const dt = document.getElementById('interviewDate').value;
              const locationInput = document.getElementById('locationInput');
              const meetLinkInput = document.getElementById('meetLinkInput');
        
              location = locationInput ? locationInput.value : '';
              meetLink = meetLinkInput ? meetLinkInput.value : '';
        
              const info = {
                type: selectedType,
                when: dt,
                location,
                meetLink
              };
        
              api.scheduleInterview(student.id, info).then(() => {
                queueNotification(`Interview (${selectedType}) with ${student.name} scheduled on ${dt}.`);
                closeModal();
              });
            }
          });
          break;
        
              case 'Invite to Volunteer':
                openModal({
                  title: 'Invite to Volunteer',
                  body: (
                    <>
                      <p>
                        <strong>Campus Clean-Up Drive</strong><br />
                        Date: 2025-06-01<br />
                        Location: Main Quad<br />
                        Need 20 volunteers.<br />
                        <em>Bring gloves & masks.</em>
                      </p>
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="volAgree" />
                        <label className="form-check-label" htmlFor="volAgree">
                          I confirm the student meets prerequisites.
                        </label>
                      </div>
                    </>
                  ),
                  confirmText: 'Invite',
                  onConfirm: () => {
                    api.inviteVolunteer(student.id).then(() => {
                      queueNotification(`Invited ${student.name} to volunteer.`);
                      closeModal();
                    });
                  },
                });
                break;
        
              case 'Enable PayChangu':
                openModal({
                  title: 'Enable PayChangu',
                  body: (
                    <>
                      <p>Complete KYC to accept payments:</p>
                      <ul>
                        <li>Upload Government ID</li>
                        <li>Take a Selfie</li>
                        <li>Enter Bank Details</li>
                      </ul>
                      <div className="progress mb-2">
                        <div className="progress-bar" style={{ width: '33%' }}>33%</div>
                      </div>
                    </>
                  ),
                  confirmText: 'Start KYC',
                  onConfirm: () => {
                    api.enablePayChangu(student.id).then(() => {
                      queueNotification(`Enabled PayChangu for ${student.name}.`);
                      closeModal();
                    });
                  },
                });
                break;
        
              case 'Complete Profile':
                openModal({
                  title: 'Complete Profile',
                  body: (
                    <>
                      <p>Profile Strength: {student.profileStrength}%</p>
                      <div className="progress mb-2">
                        <div
                          className="progress-bar"
                          style={{ width: `${student.profileStrength}%` }}
                        >
                          {student.profileStrength}%
                        </div>
                      </div>
                      <p>Missing: Projects, Skills</p>
                    </>
                  ),
                  confirmText: 'Complete Now',
                  onConfirm: () => {
                    queueNotification(`Prompted ${student.name} to complete profile.`);
                    closeModal();
                  },
                });
                break;
        
      default:
        break;
    }
  };

  const renderCard = student => (
  <Card key={student.id} className="shadow-sm student-card">
    {/* --- Header --- */}
    <div className="card-header d-flex justify-content-between align-items-center">
      <h6 className="mb-0">{student.name}</h6>
      <small className="text-muted">
        {student.program} • {student.year}
      </small>

      {student.isVerified && student.badges.length > 0 && student.badges[0].issuer && (
        <div className="card-verified-by">
          ✅ Verified by {student.badges[0].issuer}
        </div>
      )}
    </div>

    {/* --- Body --- */}
    <div className="card-body">
      {/* Skills Section */}
      <h6 className="card-section-title">Skills</h6>
      <div className="mb-2">
        {student.skills.map(s => (
          <span key={s} className="card-pill">{s}</span>
        ))}
      </div>

      {/* Stats Section */}
      <h6 className="card-section-title">Stats</h6>
      <div className="mb-3">
        <span className="card-pill">🛡️ {student.badges.length} Badge{student.badges.length !== 1 && 's'}</span>
        <span className="card-pill">📊 {student.profileStrength}% Strength</span>
        <span className="card-pill">💬 {student.responseRate} Response</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 d-flex">
        <button
          className="btn btn-outline-success me-2 btn-sm"
          onClick={() => handleCTA(student, student.contactCTA)}
        >
          {student.contactCTA}
        </button>
        <button
          className="btn btn-success btn-sm"
          onClick={() => handleCTA(student, student.hireCTA)}
        >
          {student.hireCTA}
        </button>
      </div>
    </div>
  </Card>
);

  return (
    <>
      <div className="container my-5 students-section">
        <h3 className="text-success">Discover student talent at Mzuzu University</h3>
        <div className="row">
            <div className="col-md-6 d-flex flex-column gap-3">
              <h5>Top Talent</h5>
            {topStudents.map(renderCard)}
          </div>
            <div className="col-md-6 d-flex flex-column gap-3">
              <h5>Newly Joined</h5> 
            {newStudents.map(renderCard)}
          </div>
        </div>
      </div>

      {/* Single React-Bootstrap Modal for all CTAs */}
      <Modal
        show={modalConfig.show}
        onHide={closeModal} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalConfig.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalConfig.body}
        </Modal.Body>
        {modalConfig.onConfirm && (
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleConfirm}>
              {modalConfig.confirmText}
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  ); 
}
 