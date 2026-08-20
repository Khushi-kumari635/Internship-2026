// js/jobs.js
// Powers the Job Board page: listing jobs, search/filter, viewing
// details, applying to jobs, and (for alumni) posting new jobs.

let allJobs = []; // cache of all jobs fetched from the server

// Renders job cards into the grid
function renderJobCards(jobList) {
  const grid = document.getElementById("jobsGrid");

  if (jobList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">💼</div>
        <p>No jobs found matching your search/filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = jobList
    .map(
      (job) => `
    <div class="card job-card">
      <span class="job-type">${job.type}</span>
      <h3>${job.title}</h3>
      <p class="company-name">${job.company}</p>
      <p style="font-size:0.85rem; color:var(--gray-text);">📍 ${job.location}</p>
      <p style="font-size:0.85rem; color:var(--gray-text);">💰 ${job.salary}</p>
      <div>
        ${(job.skillsRequired || []).slice(0, 3).map((s) => `<span class="tag">${s}</span>`).join("")}
      </div>
      <div class="card-footer">
        <span style="font-size:0.8rem; color:var(--gray-text);">${job.applicants ? job.applicants.length : 0} applicants</span>
        <button class="btn btn-primary btn-small" onclick="openJobDetails('${job._id}')">View Details</button>
      </div>
    </div>
  `
    )
    .join("");
}

// Applies search text + type + location filters to the cached job list
function applyJobFilters() {
  const searchText = document.getElementById("jobSearchInput").value.trim().toLowerCase();
  const type = document.getElementById("jobTypeFilter").value;
  const location = document.getElementById("jobLocationFilter").value.trim().toLowerCase();

  const filtered = allJobs.filter((job) => {
    const matchesSearch =
      !searchText ||
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText);
    const matchesType = !type || job.type === type;
    const matchesLocation = !location || job.location.toLowerCase().includes(location);
    return matchesSearch && matchesType && matchesLocation;
  });

  renderJobCards(filtered);
}

// Loads all jobs from the backend
async function loadJobs() {
  const grid = document.getElementById("jobsGrid");
  grid.innerHTML = `<p class="text-center" style="grid-column:1/-1;">Loading job board...</p>`;

  try {
    allJobs = await api.get("/jobs");
    renderJobCards(allJobs);
  } catch (error) {
    grid.innerHTML = `<p class="text-center" style="grid-column:1/-1; color:var(--danger-red);">Failed to load jobs: ${error.message}</p>`;
  }
}

// Opens the "Job Details" modal for a given job ID (attached to window so
// the inline onclick in the rendered HTML above can call it)
window.openJobDetails = function (jobId) {
  const job = allJobs.find((j) => j._id === jobId);
  if (!job) return;

  const loggedInUser = getCurrentUser();
  const alreadyApplied =
    loggedInUser && job.applicants.some((a) => a.user === loggedInUser.id || a.user?._id === loggedInUser.id);

  const modalContent = document.getElementById("jobDetailsContent");
  modalContent.innerHTML = `
    <span class="job-type">${job.type}</span>
    <h3 class="mt-20">${job.title}</h3>
    <p class="company-name">${job.company} · ${job.location}</p>
    <p style="font-size:0.85rem; color:var(--gray-text); margin:6px 0;">💰 ${job.salary}</p>
    <p style="font-size:0.85rem; color:var(--gray-text); margin-bottom: 10px;">
      Posted by ${job.postedBy?.name || "an alumnus"}
    </p>

    <div class="mt-20">
      <strong>Description</strong>
      <p style="margin-top:6px;">${job.description}</p>
    </div>

    <div class="mt-20">
      <strong>Skills Required</strong>
      <div style="margin-top:6px;">
        ${(job.skillsRequired || []).map((s) => `<span class="tag">${s}</span>`).join("") || "Not specified"}
      </div>
    </div>

    <div id="applyAlert" class="alert mt-20"></div>

    <div style="display:flex; gap:10px; margin-top:20px;">
      <button id="applyBtn" class="btn btn-primary btn-block" ${alreadyApplied ? "disabled" : ""}>
        ${alreadyApplied ? "Already Applied ✓" : "Apply Now"}
      </button>
      <button class="btn btn-outline btn-block" id="closeJobDetailsBtn">Close</button>
    </div>
  `;

  document.getElementById("jobDetailsModal").classList.remove("hidden");

  document.getElementById("closeJobDetailsBtn").addEventListener("click", () => {
    document.getElementById("jobDetailsModal").classList.add("hidden");
  });

  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn && !alreadyApplied) {
    applyBtn.addEventListener("click", async () => {
      if (!getCurrentUser()) {
        window.location.href = "login.html";
        return;
      }
      try {
        await api.post(`/jobs/${job._id}/apply`, {});
        showAlert("applyAlert", "Applied successfully! The alumnus will review your application.", "success");
        applyBtn.disabled = true;
        applyBtn.textContent = "Already Applied ✓";
        loadJobs(); // refresh applicant counts in the background
      } catch (error) {
        showAlert("applyAlert", error.message, "error");
      }
    });
  }
};

// ---- Post Job (alumni only) ----
function setupPostJobFeature() {
  const user = getCurrentUser();
  const postJobBtn = document.getElementById("postJobBtn");

  // Only show the "Post a Job" button to logged-in alumni
  if (user && user.role === "alumni") {
    postJobBtn.classList.remove("hidden");
  }

  postJobBtn.addEventListener("click", () => {
    document.getElementById("postJobModal").classList.remove("hidden");
  });

  document.getElementById("closePostJobModalBtn").addEventListener("click", () => {
    document.getElementById("postJobModal").classList.add("hidden");
  });

  document.getElementById("postJobForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("jobTitleInput").value.trim();
    const company = document.getElementById("companyInput").value.trim();
    const location = document.getElementById("jobLocationInput").value.trim();
    const type = document.getElementById("jobTypeInput").value;
    const salary = document.getElementById("salaryInput").value.trim();
    const skillsRaw = document.getElementById("skillsInput").value.trim();
    const description = document.getElementById("descriptionInput").value.trim();

    if (!title || !company || !location || !description) {
      showAlert("postJobAlert", "Please fill in all required fields.", "error");
      return;
    }

    const skillsRequired = skillsRaw ? skillsRaw.split(",").map((s) => s.trim()) : [];

    try {
      await api.post("/jobs", { title, company, location, type, salary, skillsRequired, description });
      showAlert("postJobAlert", "Job posted successfully!", "success");
      document.getElementById("postJobForm").reset();

      setTimeout(() => {
        document.getElementById("postJobModal").classList.add("hidden");
        loadJobs();
      }, 1000);
    } catch (error) {
      showAlert("postJobAlert", error.message, "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadJobs();
  setupPostJobFeature();

  document.getElementById("jobSearchInput").addEventListener("input", applyJobFilters);
  document.getElementById("jobTypeFilter").addEventListener("change", applyJobFilters);
  document.getElementById("jobLocationFilter").addEventListener("input", applyJobFilters);
});
