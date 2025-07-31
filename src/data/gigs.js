// File: src/data/gigs.js
//8115503644cde7454d26ab45d7b6daba
// --- Mock gig postings for each role ---
export const mockGigs = {
  student: [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechHub Malawi',
      location: 'Mzuzu City',
      duration: '3-month Gig',
      skills: ['React', 'JavaScript'],
      deadline: '2025-06-30',
    },
    {
      id: 2,
      title: 'Data Analysis ',
      company: 'Campus Analytics',
      location: 'Remote',
      duration: '6-month GIg',
      skills: ['Python', 'SQL'],
      deadline: '2025-07-15',
    },
    // …you can add more student gigs here
  ],
  recruiter: [
    {
      id: 101,
      title: 'App Developer',
      applicants: 42,
      topMatches: 8,
    }, 
    {
      id: 102,
      title: 'UX Design Gig',
      applicants: 27,
      topMatches: 5,
    },
    // …you can add more recruiter gigs here
  ],
};

// --- Recommendation counts for each role ---
export const studentRecs = [
  { title: 'Gigs matching your Python skills', count: 4 },
  { title: 'Popular Gigs in Tutoring',          count: 6 },
];

export const recruiterRecs = [
  { title: 'Students with React badges',    count: 12 },
  { title: 'High-response-rate candidates', count:  3 },
];

// --- Analytics metrics for each role ---
export const studentAnalytics = {
  applied:  8,
  response: '75%',   // shown as percentage + progress bar
};

export const recruiterAnalytics = {
  views:         '1,200',
  topApplicant: 'John Banda (React)',
};
