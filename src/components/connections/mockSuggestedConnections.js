//src/components/connections/mockSuggestedConnections.js
export const suggestedConnections = {
  student: [
   {
      id: 301,
      role: 'recruiter',
      // For a company recruiter
      company: 'TechHub Innovations',
      name: 'Alice Mvula',            // fallback / personal name
      headline: 'CEO & Lead Recruiter',
      //headline: 'Connecting campus talent with tech teams',
      location: 'Mzuzu City',
      opportunities: 4,
      matchedSkills: ['React','CSS','Bootstrap'],
      avatar: 'https://via.placeholder.com/64',
    },
    {
      id: 302,
      role: 'recruiter',
      // For a freelance recruiter
      name: 'Brian Freelance',
      headline: 'Independent career coach & recruiter',
      location: 'Remote',
      opportunities: 2,
      matchedSkills: ['Interview Prep','Resume Writing'],
      avatar: 'https://via.placeholder.com/64',
    },
    // …etc
  ],
  recruiter: [
    {
      id: 201,
      role: 'student',
      name: 'Mercy Nyndo',
      program: 'Data Science — Yr 2',
      location: 'Mzuni Campus',
      majorProjects: 4,
      badges: ['Gold Coder','Hackathon Winner'],
      skillsOverlap: ['Java','Python','Algorithms'],
      avatar: 'https://via.placeholder.com/64',
    },    
     {
      id: 208,
      role: 'student',
      name: 'James Ziba',
      program: 'ICT — Yr 3',
      location: 'Online & On-Campus',
      majorProjects: 5,
      portfolioItems: 7,
      badges: ['Graphic Designer', 'Coding Enthusiast'],
      recentEndorsements: 8,
      skillsOverlap: [
        'Coding', 'Tutoring'
      ],
      avatar: 'https://via.placeholder.com/64',
    },
    // ... other recruiters
  ],
  
};
