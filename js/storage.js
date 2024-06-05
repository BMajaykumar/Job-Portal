function saveApplication(jobId, application) {
  let applications = JSON.parse(localStorage.getItem('applications')) || {};
  applications[jobId] = application;
  localStorage.setItem('applications', JSON.stringify(applications));
}

function getApplications() {
  return JSON.parse(localStorage.getItem('applications')) || {};
}

function isJobApplied(jobId) {
  const applications = getApplications();
  return jobId in applications;
}

function getApplicationDetails(jobId) {
  const applications = getApplications();
  return applications[jobId];
}
