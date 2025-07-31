// Each returns a promise that resolves after 500ms
export const requestCodeSample = studentId =>
  new Promise(res => setTimeout(() => res(`Requested code sample for ${studentId}`), 500));

export const viewPortfolio = (studentId) =>
  new Promise(res => setTimeout(() => res(`Viewed portfolio of ${studentId}`), 500));

export const requestCV = studentId =>
  new Promise(res => setTimeout(() => res(`Requested CV from ${studentId}`), 500));

export const inviteToProject = (studentId, project) =>
  new Promise(res => setTimeout(() => res(`Invited ${studentId} to project ${project}`), 500));

export const offerFreelanceGig = (studentId) =>
  new Promise(res => setTimeout(() => res(`Offered freelance gig to ${studentId}`), 500));

export const suggestMentorship = (studentId) =>
  new Promise(res => setTimeout(() => res(`Suggested mentorship to ${studentId}`), 500));

// mockStudentActions.js
export function scheduleInterview(studentId, { type, when, location, meetLink }) {
  console.log('Scheduling interview:', { studentId, type, when, location, meetLink });
  return Promise.resolve();
}
export const completeProfile = (studentId) =>
  new Promise(res => setTimeout(() => res(`Redirected ${studentId} to profile wizard`), 500));

export const inviteVolunteer = (studentId) =>
  new Promise(res => setTimeout(() => res(`Invited ${studentId} to volunteer event`), 500));

export const enablePayChangu = (studentId) =>
  new Promise(res => setTimeout(() => res(`Enabled PayChangu for ${studentId}`), 500));
