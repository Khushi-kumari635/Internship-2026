// js/directory.js
// Powers the Alumni Directory page: fetching alumni, rendering cards,
// live search, and dynamic filters (batch, location, industry).

let allAlumni = []; // cache of all alumni fetched once from the server

// Renders a list of alumni profile objects as cards in the grid
function renderAlumniCards(alumniList) {
  const grid = document.getElementById("alumniGrid");
  const resultCount = document.getElementById("resultCount");

  resultCount.textContent = `Showing ${alumniList.length} alumni`;

  if (alumniList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">🔍</div>
        <p>No alumni found matching your search/filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = alumniList
    .map(
      (a) => `
    <div class="card">
      <div class="alumni-card-header">
        <div class="avatar">${getInitials(a.fullName)}</div>
        <div>
          <h3>${a.fullName}</h3>
          <p>${a.jobTitle || "Alumni"} ${a.currentCompany ? "at " + a.currentCompany : ""}</p>
        </div>
      </div>
      <p style="font-size:0.85rem; color:var(--gray-text);">
        🎓 ${a.department} · Batch of ${a.graduationYear}
      </p>
      <p style="font-size:0.85rem; color:var(--gray-text);">📍 ${a.location || "Location not set"}</p>
      <div>
        ${(a.skills || []).slice(0, 4).map((s) => `<span class="tag">${s}</span>`).join("")}
      </div>
      <div class="card-footer">
        <span style="font-size:0.8rem; color:var(--gray-text);">${a.industry || ""}</span>
        <a href="profile.html?id=${a._id}" class="btn btn-primary btn-small">View Profile</a>
      </div>
    </div>
  `
    )
    .join("");
}

// Fills the filter dropdowns with unique values found in the alumni data
function populateFilterOptions(alumniList) {
  const batchSet = new Set(alumniList.map((a) => a.graduationYear).filter(Boolean));
  const locationSet = new Set(alumniList.map((a) => a.location).filter(Boolean));
  const industrySet = new Set(alumniList.map((a) => a.industry).filter(Boolean));

  const batchFilter = document.getElementById("batchFilter");
  const locationFilter = document.getElementById("locationFilter");
  const industryFilter = document.getElementById("industryFilter");

  [...batchSet].sort((a, b) => b - a).forEach((year) => {
    batchFilter.innerHTML += `<option value="${year}">${year}</option>`;
  });

  [...locationSet].sort().forEach((loc) => {
    locationFilter.innerHTML += `<option value="${loc}">${loc}</option>`;
  });

  [...industrySet].sort().forEach((ind) => {
    industryFilter.innerHTML += `<option value="${ind}">${ind}</option>`;
  });
}

// Applies the current search text + filter selections to the cached alumni list
function applyFilters() {
  const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
  const batch = document.getElementById("batchFilter").value;
  const location = document.getElementById("locationFilter").value;
  const industry = document.getElementById("industryFilter").value;

  const filtered = allAlumni.filter((a) => {
    const matchesSearch = !searchText || a.fullName.toLowerCase().includes(searchText);
    const matchesBatch = !batch || String(a.graduationYear) === batch;
    const matchesLocation = !location || a.location === location;
    const matchesIndustry = !industry || a.industry === industry;
    return matchesSearch && matchesBatch && matchesLocation && matchesIndustry;
  });

  renderAlumniCards(filtered);
}

// Loads all alumni from the backend once, then sets up filter dropdowns
async function loadAlumniDirectory() {
  const grid = document.getElementById("alumniGrid");
  grid.innerHTML = `<p class="text-center" style="grid-column:1/-1;">Loading alumni directory...</p>`;

  try {
    allAlumni = await api.get("/alumni");
    populateFilterOptions(allAlumni);
    renderAlumniCards(allAlumni);
  } catch (error) {
    grid.innerHTML = `<p class="text-center" style="grid-column:1/-1; color:var(--danger-red);">Failed to load alumni: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAlumniDirectory();

  // Live search: filter as the user types (no need to press Enter)
  document.getElementById("searchInput").addEventListener("input", applyFilters);

  // Dynamic filters: re-filter whenever a dropdown changes
  document.getElementById("batchFilter").addEventListener("change", applyFilters);
  document.getElementById("locationFilter").addEventListener("change", applyFilters);
  document.getElementById("industryFilter").addEventListener("change", applyFilters);

  // Clear all filters button
  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("batchFilter").value = "";
    document.getElementById("locationFilter").value = "";
    document.getElementById("industryFilter").value = "";
    renderAlumniCards(allAlumni);
  });
});
