export const mockJobs = [
    { id: 1, title: "Graphic Designer", company: "TechCorp", salary: "MK 200,000" },
    { id: 2, title: "Web Developer", company: "Code Inc.", salary: "MK 250,000" },
  ];
  
  export const fetchJobs = () =>
    new Promise((resolve) => setTimeout(() => resolve(mockJobs), 1000));
  