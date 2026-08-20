// js/dashboard.js
// Powers the Dashboard page: protects the route (login required),
// and renders statistics, latest jobs, upcoming events, and announcements.

// Fills in the sidebar with the logged-in user's name/role/avatar
function renderSidebarUser(user) {
  document.getElementById("sidebarAvatar").textContent = getInitials(user.name);
  document.getElementById("sidebarUserName").textContent = user.name;
  document.getElementById("sidebarUserRole").textContent = user.role;

  document.getElementById("welcomeBanner").innerHTML = `
    <h2>Welcome back, ${user.name.split(" ")[0]}! 👋</h2>
    <p>Here's what's happening in your alumni network today.</p>
  `;
}

// Renders the 4 statistics cards
function renderStats(stats) {
  const statsGrid = document.getElementById("dashboardStats");
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${stats.totalAlumni}</div>
      <div class="stat-label">Total Alumni</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${stats.totalStudents}</div>
      <div class="stat-label">Total Students</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${stats.totalJobs}</div>
      <div class="stat-label">Job Posts</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${stats.myConnections}</div>
      <div class="stat-label">My Connections</div>
    </div>
  `;
}

// Renders the "Latest Job Posts" section
function renderDashboardJobs(jobs) {
  const container = document.getElementById("dashboardJobs");

  if (jobs.length === 0) {
    container.innerHTML = `<p>No job posts yet.</p>`;
    return;
  }

  container.innerHTML = jobs
    .map(
      (job) => `
    <div class="list-item">
      <strong>${job.title}</strong> at ${job.company}
      <p style="font-size:0.85rem; color:var(--gray-text);">📍 ${job.location} · ${job.type}</p>
    </div>
  `
    )
    .join("");

  container.innerHTML += `<a href="jobs.html" class="btn btn-outline btn-small mt-20">View All Jobs</a>`;
}

// Renders the "Upcoming Events" section
function renderDashboardEvents(events) {
  const container = document.getElementById("dashboardEvents");

  if (events.length === 0) {
    container.innerHTML = `<p>No upcoming events.</p>`;
    return;
  }

  container.innerHTML = events
    .map(
      (event) => `
    <div class="list-item">
      <strong>${event.image || "📅"} ${event.title}</strong>
      <p style="font-size:0.85rem; color:var(--gray-text);">📅 ${formatDate(event.date)} · 📍 ${event.location}</p>
    </div>
  `
    )
    .join("");

  container.innerHTML += `<a href="events.html" class="btn btn-outline btn-small mt-20">View All Events</a>`;
}

// Renders the "Recent Announcements" section
function renderAnnouncements(announcements) {
  const container = document.getElementById("dashboardAnnouncements");

  container.innerHTML = announcements
    .map(
      (item) => `
    <div class="announcement-item">
      <h4>📢 ${item.title}</h4>
      <p>${item.message}</p>
    </div>
  `
    )
    .join("");
}

// Loads everything needed for the dashboard from the backend
async function loadDashboard() {
  try {
    const data = await api.get("/dashboard", true);

    renderSidebarUser(data.user);
    renderStats(data.stats);
    renderDashboardJobs(data.latestJobs);
    renderDashboardEvents(data.upcomingEvents);
    renderAnnouncements(data.announcements);
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    // If the token is invalid/expired, send the user back to login
    clearSession();
    window.location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Protect this page — only logged-in users can view the dashboard
  const user = requireLogin();
  if (!user) return; // requireLogin() already redirects

  loadDashboard();

  document.getElementById("sidebarLogoutLink").addEventListener("click", (e) => {
    e.preventDefault();
    clearSession();
    window.location.href = "index.html";
  });
});
