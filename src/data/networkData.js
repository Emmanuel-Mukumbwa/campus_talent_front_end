// File: src/data/networkData.js

// File: src/data/networkData.js
export const mockConnections = [
  // Students
  {
    id: 1,
    role: 'student',
    avatar: 'https://i.pravatar.cc/60?u=john',
    name: 'John Banda',
    program: 'ICT',
    year: 3,
    mutual: 3,
    skillsOverlap: ['Python', 'React', 'UI/UX'],
    online: true,
    location: 'Mzuni Campus',
    rate: 2500,
    rating: 4.8,
    completedProjects: 12,
    lastActive: '2h ago',
    badge: 'Gold Developer'
  },
  {
    id: 2,
    role: 'student',
    avatar: 'https://i.pravatar.cc/60?u=bahat',
    name: 'Bahat Mwale',
    program: 'Tourism',
    year: 2,
    mutual: 1,
    skillsOverlap: ['Customer Service', 'Event Planning'],
    online: false,
    location: 'Off-Campus',
    rate: 1500,
    rating: 4.5,
    completedProjects: 5,
    lastActive: '1d ago'
  },

  // Recruiters (only visible to students)
  /*{
    id: 3,
    role: 'recruiter',
    avatar: 'https://i.pravatar.cc/60?u=alice',
    name: 'Alice Mvula',
    company: 'TechHub Malawi',
    position: 'HR Manager',
    matchedSkills: ['UI/UX', 'Branding'],
    online: true,
    badge: 'Verified Recruiter'
  },
  {
    id: 4,
    role: 'recruiter',
    avatar: 'https://i.pravatar.cc/60?u=prof',
    name: 'Prof. Phiri',
    company: 'Mzuni ICT Dept',
    position: 'Lead Researcher',
    matchedSkills: ['Data Analysis'],
    online: false,
    badge: 'Gold Partner'
  }*/
];

// --- Recommendations ---
export const studentRecs = [
  { title: 'Students in your program', count: 5 },
  { title: 'Shared project collaborators', count: 2 },
];

export const recruiterRecs = [
  { title: 'Top candidates for your gigs', count: 8 },
  { title: 'Recently active students', count: 4 },
];

// --- Growth Data (for chart) ---
export const growthData = [
  { date: 'May 1', value: 5 },
  { date: 'May 5', value: 8 },
  { date: 'May 10', value: 12 },
  { date: 'May 15', value: 15 },
  { date: 'May 20', value: 18 },
];
