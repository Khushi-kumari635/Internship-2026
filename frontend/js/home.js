// js/home.js
// Loads dynamic content for the Home Page: community stats and
// a small preview of alumni profiles.

async function loadHomeStats() {
  try {
    // We don't have a public "stats" endpoint, so we reuse the
    // alumni and jobs/events lists and just count them client-side.
    const [alumni, jobs, events] = await Promise.all([
      api.get("/alumni"),
      api.get("/jobs"),
      api.get("/events"),
    ]);

    // Students count isn't public, so we estimate using a friendly message instead.
    const statsContainer = document.getElementById("homeStats");
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-number">${alumni.length}+</div>
        <div class="stat-label">Alumni Members</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${jobs.length}+</div>
        <div class="stat-label">Job Posts</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${events.length}+</div>
        <div class="stat-label">Upcoming Events</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">100%</div>
        <div class="stat-label">Free to Join</div>
      </div>
    `;

    // Show a preview of up to 3 alumni cards
    const previewContainer = document.getElementById("homeAlumniPreview");
    const previewAlumni = alumni.slice(0, 3);

    if (previewAlumni.length === 0) {
      previewContainer.innerHTML = `<p class="text-center">No alumni profiles yet. Run the seed script to add sample data!</p>`;
      return;
    }

    previewContainer.innerHTML = previewAlumni
      .map(
        (a) => `
      <div class="card">
        <div class="alumni-card-header">
          <div class="avatar">${getInitials(a.fullName)}</div>
          <div>
            <h3>${a.fullName}</h3>
            <p>${a.jobTitle || "Alumni"} at ${a.currentCompany || "N/A"}</p>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--gray-text);">${a.department} · Batch of ${a.graduationYear}</p>
        <div>
          ${(a.skills || []).slice(0, 3).map((s) => `<span class="tag">${s}</span>`).join("")}
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading home page data:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadHomeStats);
