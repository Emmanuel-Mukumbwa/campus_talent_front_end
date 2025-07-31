// File: src/components/portfoliobuilder/templates.js

export const BIO_TEMPLATES = {
  Coding: [
    "I’m a Full-Stack Developer with experience building web apps in React and Node.",
    "I specialize in algorithmic challenges and data-driven frontend features.",
    "I build responsive, mobile-first sites for student organizations.",
    "I’ve created RESTful APIs in Express and integrated them with modern React frontends.",
    "I’m passionate about optimizing performance and accessibility in web applications."
  ],
  "Video Production": [
    "I’m a Video Producer skilled in Adobe Premiere Pro and After Effects.",
    "I create engaging short-form videos for social media campaigns.",
    "I’ve scripted, shot, and edited documentary-style pieces for campus events.",
    "I specialize in motion graphics and animated explainer videos.",
    "I craft narrative-driven content that resonates with student audiences."
  ],
  "Graphics Design": [
    "I’m a Graphic Designer proficient in Adobe Illustrator and Photoshop.",
    "I design logos, posters, and branding collateral for student organizations.",
    "I create data-driven infographics to make complex ideas digestible.",
    "I specialize in typography and layout for print and digital media.",
    "I combine visual storytelling with clean, modern design principles."
  ],
  "Research Writing": [
    "I’m a Research Writer experienced in APA and MLA academic styles.",
    "I’ve authored literature reviews and case studies for university projects.",
    "I specialize in structuring complex arguments into clear, concise reports.",
    "I conduct qualitative and quantitative analyses to support research findings.",
    "I deliver well-cited, original content tailored to scholarly audiences."
  ],
  Tutoring: [
    "I’m a Peer Tutor with a track record of boosting student grades.",
    "I specialize in one-on-one sessions for mathematics and statistics.",
    "I create custom lesson plans that adapt to each learner’s pace.",
    "I use interactive methods to make challenging concepts accessible.",
    "I’ve helped students prepare for exams with targeted practice exercises."
  ]
};

export const PROJECT_TEMPLATES = {
  Coding: [
    {
      label: "Responsive Portfolio Website",
      description: "Built a mobile-friendly portfolio site using React and Bootstrap.",
      evidenceLabel: "GitHub repo link"
    }, 
    {
      label: "Task Management App",
      description: "Developed a full-stack to-do application with user authentication.",
      evidenceLabel: "GitHub repo link"
    },
    {
      label: "Data Visualization Dashboard",
      description: "Created interactive charts using D3.js and Chart.js.",
      evidenceLabel: "Live demo link"
    },
    {
      label: "Real-Time Chat Application",
      description: "Implemented WebSocket-based chat with Node.js and Socket.io.",
      evidenceLabel: "GitHub repo link"
    },
    {
      label: "E-commerce Product Page",
      description: "Built a dynamic product page with filter and cart functionality.",
      evidenceLabel: "Live site link"
    }
  ],
  "Video Production": [
    {
      label: "Event Highlights Reel",
      description: "Edited a 2-minute highlights video for a campus event.",
      evidenceLabel: "YouTube link"
    },
    {
      label: "Animated Explainer",
      description: "Produced a 60-second motion-graphics explainer.",
      evidenceLabel: "Vimeo link"
    },
    {
      label: "Interview Piece",
      description: "Shot and edited a profile video with multi-camera angles.",
      evidenceLabel: "Google Drive link"
    },
    {
      label: "Social Media Clip",
      description: "Created a vertical video optimized for Instagram Reels.",
      evidenceLabel: "Instagram link"
    },
    {
      label: "Promotional Trailer",
      description: "Crafted a 30-second trailer for an upcoming campus play.",
      evidenceLabel: "YouTube link"
    }
  ],
  "Graphics Design": [
    {
      label: "Logo Design",
      description: "Designed a brand logo with vector illustrations.",
      evidenceLabel: "Dribbble link"
    },
    {
      label: "Event Poster",
      description: "Created a poster layout for a student concert.",
      evidenceLabel: "PNG download link"
    },
    {
      label: "Infographic",
      description: "Developed an infographic to present survey results.",
      evidenceLabel: "PDF download link"
    },
    {
      label: "Social Media Graphic",
      description: "Designed templated graphics for a campus campaign.",
      evidenceLabel: "Instagram link"
    },
    {
      label: "Brand Style Guide",
      description: "Compiled a style guide including typography and color palette.",
      evidenceLabel: "Google Drive link"
    }
  ],
  "Research Writing": [
    {
      label: "Literature Review",
      description: "Conducted a literature review on renewable energy topics.",
      evidenceLabel: "Document link"
    },
    {
      label: "Case Study Report",
      description: "Authored a case study analyzing local business strategies.",
      evidenceLabel: "PDF link"
    },
    {
      label: "Survey Analysis",
      description: "Wrote a report interpreting survey data with charts.",
      evidenceLabel: "Google Sheets link"
    },
    {
      label: "Research Proposal",
      description: "Drafted a proposal for a qualitative research project.",
      evidenceLabel: "Document link"
    },
    {
      label: "Abstract Submission",
      description: "Prepared an abstract for a student research conference.",
      evidenceLabel: "Conference portal link"
    }
  ],
  Tutoring: [
    {
      label: "Math Workshop",
      description: "Led a workshop on calculus problem-solving techniques.",
      evidenceLabel: "Slide deck link"
    },
    {
      label: "Exam Prep Session",
      description: "Organized a group review session with practice quizzes.",
      evidenceLabel: "Quiz link"
    },
    {
      label: "One-on-One Tutorial",
      description: "Conducted private tutoring sessions in statistics.",
      evidenceLabel: "Booking confirmation link"
    },
    {
      label: "Study Guide Creation",
      description: "Designed a comprehensive study guide PDF.",
      evidenceLabel: "PDF link"
    },
    {
      label: "Peer Review Group",
      description: "Facilitated peer review meetings for essay writing.",
      evidenceLabel: "Meeting notes link"
    }
  ]
};

// File: src/components/portfoliobuilder/templates.js
// …existing BIO_TEMPLATES and PROJECT_TEMPLATES…

// File: src/components/portfoliobuilder/templates.js

export const QUIZ_QUESTIONS = {
  Coding: {
    quizTitle: "Coding Skills Assessment",
    quizSynopsis: "10 questions on HTML, CSS & JavaScript fundamentals.",
    questions: [
      {
        question: "Which HTML tag is used for hyperlinks?",
        answers: ["<link>", "<a>", "<href>", "<hyper>"],
        correctAnswer: 1
      },
      {
        question: "In CSS, which property sets the background color of an element?",
        answers: ["font-color", "bgcolor", "background-color", "color-bg"],
        correctAnswer: 2
      },
      {
        question: "What does “DOM” stand for in web development?",
        answers: [
          "Document Object Model",
          "Data Object Mapping",
          "Digital Order Management",
          "Document Oriented Markup"
        ],
        correctAnswer: 0
      },
      {
        question: "Which JavaScript method converts a JSON string into an object?",
        answers: ["JSON.parse()", "JSON.stringify()", "toJSON()", "parseJSON()"],
        correctAnswer: 0
      },
      {
        question: "Which symbol is used to denote a CSS class selector?",
        answers: [".", "#", ":", "*"],
        correctAnswer: 0
      },
      {
        question: "How do you declare a variable that cannot be reassigned in JavaScript?",
        answers: ["var", "let", "const", "immutable"],
        correctAnswer: 2
      },
      {
        question: "What’s the time complexity of binary search on a sorted array?",
        answers: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
        correctAnswer: 1
      },
      {
        question: "Which HTML attribute specifies an alternate text for an image?",
        answers: ["alt", "title", "src", "caption"],
        correctAnswer: 0
      },
      {
        question: "In JavaScript, which operator is used for strict equality (value + type)?",
        answers: ["==", "===", "=", "=>"],
        correctAnswer: 1
      },
      {
        question: "Which CSS property controls the space between lines of text?",
        answers: ["letter-spacing", "line-height", "text-spacing", "word-spacing"],
        correctAnswer: 1
      }
    ]
  },

  "Video Production": {
    quizTitle: "Video Production Assessment",
    quizSynopsis: "10 questions on editing, composition & formats.",
    questions: [
      {
        question: "Which frame rate is standard for film production?",
        answers: ["24 fps", "30 fps", "60 fps", "120 fps"],
        correctAnswer: 0
      },
      {
        question: "What does “FPS” stand for in video terminology?",
        answers: [
          "Frames Per Second",
          "File Processing Speed",
          "First Person Shooter",
          "Formats Per Segment"
        ],
        correctAnswer: 0
      },
      {
        question: "Which color space is best suited for web video?",
        answers: ["CMYK", "RGB", "YUV", "Lab"],
        correctAnswer: 1
      },
      {
        question: "Which editing software is commonly used for motion graphics?",
        answers: [
          "Adobe Premiere Pro",
          "Final Cut Pro",
          "Adobe After Effects",
          "DaVinci Resolve"
        ],
        correctAnswer: 2
      },
      {
        question: "What’s the purpose of a B-roll in video editing?",
        answers: [
          "Primary interview footage",
          "Background audio track",
          "Supplementary footage to support the main shot",
          "Color grading preset"
        ],
        correctAnswer: 2
      },
      {
        question: "Which codec provides high compression with good quality for web streaming?",
        answers: ["H.264", "MPEG-2", "AVI", "WMV"],
        correctAnswer: 0
      },
      {
        question: "What does the term “jump cut” refer to?",
        answers: [
          "A sudden change in audio track",
          "A small cut within the same shot causing a jump in time",
          "An edit between two completely different scenes",
          "Adding a jump scare effect"
        ],
        correctAnswer: 1
      },
      {
        question: "Which microphone type is best for on-camera interviews?",
        answers: ["Condenser mic", "Lavalier mic", "USB mic", "Ribbon mic"],
        correctAnswer: 1
      },
      {
        question: "What is “color grading” in post-production?",
        answers: [
          "Adding subtitles",
          "Adjusting the color and look of footage",
          "Cutting out bad takes",
          "Recording new audio"
        ],
        correctAnswer: 1
      },
      {
        question: "Which resolution is considered Full HD?",
        answers: ["720 × 480", "1280 × 720", "1920 × 1080", "3840 × 2160"],
        correctAnswer: 2
      }
    ]
  },

  // You can add similar 10-question arrays for Graphics Design, Research Writing, and Tutoring
};
