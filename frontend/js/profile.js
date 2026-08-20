// js/profile.js
// Loads and displays a single Alumni Profile page, based on the
// "id" query parameter in the URL, e.g. profile.html?id=abc123

// Reads a query parameter from the current page URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

let currentAlumniUserId = null; // used when sending internship requests

// Renders the full profile page for a given alumni profile object
function renderProfile(alumni) {
  const container = document.getElementById("profileContainer");
  const loggedInUser = getCurrentUser();

  currentAlumniUserId = alumni.user._id || alumni.user;

  // Only show the "Request Internship" button to logged-in students,
  // and only on someone else's profile (not their own)
  const showInternshipBtn =
    loggedInUser && loggedInUser.role === "student" && loggedInUser.id !== currentAlumniUserId;

  container.innerHTML = `
    <div class="profile-header">
      <div class="avatar avatar-large">${getInitials(alumni.fullName)}</div>
      <div class="profile-header-info">
        <h2>${alumni.fullName}</h2>
        <p class="profile-title">${alumni.jobTitle || "Alumni"} ${alumni.currentCompany ? "at " + alumni.currentCompany : ""}</p>
        <p style="color: var(--gray-text); font-size:0.9rem;">
          🎓 ${alumni.department} (${alumni.degree}) · Batch of ${alumni.graduationYear}
        </p>
        <p style="color: var(--gray-text); font-size:0.9rem;">📍 ${alumni.location || "Not specified"}</p>
        <div class="mt-20">
          ${showInternshipBtn ? `<button id="requestInternshipBtn" class="btn btn-primary">Request Internship Guidance</button>` : ""}
        </div>
      </div>
    </div>

    <div class="profile-section">
      <h3>About</h3>
      <p>${alumni.bio || "This alumnus hasn't added a bio yet."}</p>
    </div>

    <div class="profile-section">
      <h3>Skills</h3>
      <div>
        ${(alumni.skills || []).map((s) => `<span class="tag">${s}</span>`).join("") || "<p>No skills listed.</p>"}
      </div>
    </div>

    <div class="profile-section">
      <h3>Career History</h3>
      ${
        (alumni.careerHistory || []).length > 0
          ? alumni.careerHistory
              .map(
                (job) => `
        <div class="timeline-item">
          <strong>${job.jobTitle}</strong> at ${job.company}
          <p style="font-size:0.85rem; color:var(--gray-text);">${job.duration || ""}</p>
          ${job.description ? `<p style="font-size:0.9rem; margin-top:4px;">${job.description}</p>` : ""}
        </div>
      `
              )
              .join("")
          : "<p>No career history added yet.</p>"
      }
    </div>

    <div class="profile-section">
      <h3>Contact Information</h3>
      <p>📧 Email: ${alumni.user.email || "Not available"}</p>
      <p>📞 Phone: ${alumni.phone || "Not shared"}</p>
    </div>
  `;

  // Wire up the "Request Internship Guidance" button (opens modal)
  const requestBtn = document.getElementById("requestInternshipBtn");
  if (requestBtn) {
    requestBtn.addEventListener("click", () => {
      document.getElementById("internshipModal").classList.remove("hidden");
    });
  }
}

// Loads the alumni profile from the backend using the ?id= in the URL
async function loadProfile() {
  const container = document.getElementById("profileContainer");
  const alumniId = getQueryParam("id");

  if (!alumniId) {
    container.innerHTML = `<p class="text-center">No profile specified. Go back to the <a href="directory.html">Alumni Directory</a>.</p>`;
    return;
  }

  try {
    const alumni = await api.get(`/alumni/${alumniId}`);
    renderProfile(alumni);
  } catch (error) {
    container.innerHTML = `<p class="text-center" style="color:var(--danger-red);">Could not load this profile: ${error.message}</p>`;
  }
}

// ---- Internship Request Modal logic ----
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();

  document.getElementById("closeModalBtn").addEventListener("click", () => {
    document.getElementById("internshipModal").classList.add("hidden");
  });

  document.getElementById("internshipForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const loggedInUser = getCurrentUser();
    if (!loggedInUser) {
      window.location.href = "login.html";
      return;
    }

    const message = document.getElementById("internshipMessage").value.trim();
    if (!message) {
      showAlert("internshipAlert", "Please write a short message before sending.", "error");
      return;
    }

    try {
      await api.post("/internships", {
        alumniUserId: currentAlumniUserId,
        message,
      });
      showAlert("internshipAlert", "Request sent successfully! The alumnus will respond soon.", "success");
      document.getElementById("internshipMessage").value = "";

      setTimeout(() => {
        document.getElementById("internshipModal").classList.add("hidden");
      }, 1500);
    } catch (error) {
      showAlert("internshipAlert", error.message, "error");
    }
  });
});
