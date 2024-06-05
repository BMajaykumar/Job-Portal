function getJobById(id) {
  return jobs.find(job => job.id === id);
}

function createJobElement(job) {
  const li = document.createElement('li');
  li.innerHTML = `
      <div>
          <img src="${jobs.logo}" alt="${job.company} logo" width="50" height="50">
          <strong class="job-title" data-id="${job.id}">${job.title}</strong> at ${job.company} (${job.experience} years experience)
      </div>
      <button class="apply-button" data-id="${job.id}" ${isJobApplied(job.id) ? 'disabled' : ''}>
          ${isJobApplied(job.id) ? 'Applied' : 'Apply'}
      </button>
  `;
  return li;
}
