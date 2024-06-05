document.addEventListener('DOMContentLoaded', () => {
    const jobList = document.getElementById('job-list');
    const searchInput = document.getElementById('search');
    const jobModal = document.getElementById('job-modal');
    const applyModal = document.getElementById('apply-modal');
    const applicationModal = document.getElementById('application-modal');
    const jobDetails = document.getElementById('job-details');
    const applyForm = document.getElementById('apply-form');
    const skillsSelect = document.getElementById('skills');
    const applicationDetails = document.getElementById('application-details');
    const resetButton = document.getElementById('reset-button');

    let selectedJobId = null;

    function renderJobList(filter = '') {
        jobList.innerHTML = '';
        const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(filter.toLowerCase()));
        filteredJobs.forEach(job => {
            const li = document.createElement('li');
            li.className = 'job-card';
            li.innerHTML = `
                <div class="job-header">
                    <strong class="job-title" data-id="${job.id}">${job.title}</strong>
                    <img src="${job.logo}" alt="${job.company} logo" width="50" height="50">
                </div>
                <div class="job-date">Posted on ${job.date}</div>
                <h3>${job.company}</h3>
                <div class="job-tags">
                    ${job.skills.map(skill => `<span>${skill}</span>`).join('')}
                </div>
                <div class="job-footer">
                    <span class="salary">${job.salary}</span>
                    <span class="location">${job.location}</span>
                    <button class="apply-button" data-id="${job.id}" ${isJobApplied(job.id) ? 'disabled' : ''}>
                        ${isJobApplied(job.id) ? 'Applied' : 'Apply'}
                    </button>
                </div>
            `;
            jobList.appendChild(li);
        });
    }

    function openJobModal(job) {
        jobDetails.innerHTML = `
            <img src="${job.logo}" alt="${job.company} logo" width="50" height="50">
            <h2>${job.title}</h2>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Experience Required:</strong> ${job.experience} years</p>
            <p><strong>Skills Required:</strong> ${job.skills.join(', ')}</p>
            <p><strong>Description:</strong> ${job.description}</p>
        `;
        jobModal.style.display = 'flex';
    }

    function openApplicationModal(application) {
        applicationDetails.innerHTML = `
            <h2>Application Details</h2>
            <p><strong>First Name:</strong> ${application.firstName}</p>
            <p><strong>Last Name:</strong> ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Skills:</strong> ${application.skills.join(', ')}</p>
            <p><strong>About Me:</strong></p>
            <div>${application.aboutMe}</div>
        `;
        applicationModal.style.display = 'flex';
    }

    function closeModal(modal) {
        modal.style.display = 'none';
    }

    function populateSkills() {
        skillsList.forEach(skill => {
            const option = document.createElement('option');
            option.value = skill;
            option.text = skill;
            skillsSelect.appendChild(option);
        });
    }

    jobList.addEventListener('click', (event) => {
        if (event.target.classList.contains('job-title')) {
            const jobId = parseInt(event.target.dataset.id, 10);
            const job = getJobById(jobId);
            openJobModal(job);
        } else if (event.target.classList.contains('apply-button')) {
            selectedJobId = parseInt(event.target.dataset.id, 10);
            applyModal.style.display = 'flex';
        } else if (event.target.textContent === 'Applied') {
            const jobId = parseInt(event.target.dataset.id, 10);
            const application = getApplicationDetails(jobId);
            if (application) {
                openApplicationModal(application);
            }
        }
    });

    applyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const application = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            skills: Array.from(document.getElementById('skills').selectedOptions).map(option => option.value),
            aboutMe: document.getElementById('about-me').value
        };
        saveApplication(selectedJobId, application);
        renderJobList(searchInput.value);
        closeModal(applyModal);

        // Open the application details modal after submission
        openApplicationModal(application);

        // Reset the form after submission
        applyForm.reset();
    });

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', () => {
            closeModal(button.closest('.modal'));
        });
    });

    searchInput.addEventListener('input', () => {
        renderJobList(searchInput.value);
    });

    document.getElementById('download-button').addEventListener('click', () => {
        const applicationDetailsElement = document.getElementById('application-details');
        const pdfOptions = {
            filename: 'job_application_details.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf()
            .from(applicationDetailsElement)
            .set(pdfOptions)
            .save();
    });

    document.getElementById('print-button').addEventListener('click', () => {
        const applicationDetailsElement = document.getElementById('application-details');
        printElement(applicationDetailsElement);
    });

    function printElement(element) {
        const domClone = element.cloneNode(true);

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <style>
                        body { font-family: 'Roboto', sans-serif; }
                        .modal-content { margin: 20px; }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
                    ${domClone.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    resetButton.addEventListener('click', () => {
        localStorage.clear();
        alert('Local storage data has been reset.');
        location.reload();
    });

    populateSkills();
    renderJobList();
    applyModal.style.display = 'none';
    applicationModal.style.display = 'none';
});
