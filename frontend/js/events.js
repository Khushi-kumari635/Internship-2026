// js/events.js
// Powers the Events page: listing events, filtering by type,
// viewing details, and RSVP functionality.

let allEvents = []; // cache of all events fetched from the server

// Renders event cards into the grid
function renderEventCards(eventList) {
  const grid = document.getElementById("eventsGrid");

  if (eventList.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">🎉</div>
        <p>No events found for this filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = eventList
    .map(
      (event) => `
    <div class="card event-card">
      <div class="event-emoji">${event.image || "📅"}</div>
      <span class="tag">${event.eventType}</span>
      <h3>${event.title}</h3>
      <p class="event-date">📅 ${formatDate(event.date)} · ${event.time}</p>
      <p style="font-size:0.85rem; color:var(--gray-text);">📍 ${event.location}</p>
      <p style="font-size:0.85rem; color:var(--gray-text);">${event.goingCount || 0} people going</p>
      <div class="card-footer">
        <span style="font-size:0.8rem; color:var(--gray-text);">By ${event.organizer}</span>
        <button class="btn btn-primary btn-small" onclick="openEventDetails('${event._id}')">View & RSVP</button>
      </div>
    </div>
  `
    )
    .join("");
}

// Filters cached events by the selected event type
function applyEventFilters() {
  const type = document.getElementById("eventTypeFilter").value;
  const filtered = type ? allEvents.filter((e) => e.eventType === type) : allEvents;
  renderEventCards(filtered);
}

// Loads all events from the backend
async function loadEvents() {
  const grid = document.getElementById("eventsGrid");
  grid.innerHTML = `<p class="text-center" style="grid-column:1/-1;">Loading events...</p>`;

  try {
    allEvents = await api.get("/events");
    renderEventCards(allEvents);
  } catch (error) {
    grid.innerHTML = `<p class="text-center" style="grid-column:1/-1; color:var(--danger-red);">Failed to load events: ${error.message}</p>`;
  }
}

// Opens the Event Details modal, including RSVP buttons
window.openEventDetails = async function (eventId) {
  const event = allEvents.find((e) => e._id === eventId);
  if (!event) return;

  const modalContent = document.getElementById("eventDetailsContent");
  const loggedInUser = getCurrentUser();

  modalContent.innerHTML = `
    <div class="event-emoji">${event.image || "📅"}</div>
    <span class="tag">${event.eventType}</span>
    <h3 class="mt-20">${event.title}</h3>
    <p class="event-date">📅 ${formatDate(event.date)} · ${event.time}</p>
    <p style="font-size:0.9rem; color:var(--gray-text); margin: 6px 0;">📍 ${event.location}</p>
    <p style="font-size:0.9rem; color:var(--gray-text);">Organized by ${event.organizer}</p>

    <div class="mt-20">
      <strong>About this Event</strong>
      <p style="margin-top:6px;">${event.description}</p>
    </div>

    <p class="mt-20"><strong>${event.goingCount || 0}</strong> people are going</p>

    <div id="rsvpStatusBox" class="mt-20"></div>
    <div id="rsvpAlert" class="alert mt-20"></div>

    <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;" id="rsvpButtons">
      <!-- RSVP buttons injected below -->
    </div>

    <button class="btn btn-outline btn-block mt-20" id="closeEventDetailsBtn">Close</button>
  `;

  document.getElementById("eventDetailsModal").classList.remove("hidden");
  document.getElementById("closeEventDetailsBtn").addEventListener("click", () => {
    document.getElementById("eventDetailsModal").classList.add("hidden");
  });

  const rsvpButtonsContainer = document.getElementById("rsvpButtons");

  if (!loggedInUser) {
    // Not logged in: prompt them to log in to RSVP
    rsvpButtonsContainer.innerHTML = `<a href="login.html" class="btn btn-primary btn-block">Login to RSVP</a>`;
    return;
  }

  // Logged in: show RSVP option buttons
  rsvpButtonsContainer.innerHTML = `
    <button class="btn btn-primary btn-small" data-status="Going">✅ Going</button>
    <button class="btn btn-outline btn-small" data-status="Interested">⭐ Interested</button>
    <button class="btn btn-outline btn-small" data-status="Not Going">❌ Not Going</button>
  `;

  // Check and display the user's current RSVP status for this event
  try {
    const { status } = await api.get(`/events/${eventId}/my-rsvp`, true);
    const statusBox = document.getElementById("rsvpStatusBox");
    if (status) {
      const badgeClass = status === "Going" ? "badge-going" : "badge-interested";
      statusBox.innerHTML = `Your current RSVP: <span class="badge ${badgeClass}">${status}</span>`;
    }
  } catch (error) {
    console.error("Could not fetch RSVP status:", error);
  }

  // Attach click handlers to each RSVP button
  rsvpButtonsContainer.querySelectorAll("button[data-status]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await api.post(`/events/${eventId}/rsvp`, { status: btn.dataset.status });
        showAlert("rsvpAlert", `RSVP updated to "${btn.dataset.status}"!`, "success");
        loadEvents(); // refresh "going" counts in the background
      } catch (error) {
        showAlert("rsvpAlert", error.message, "error");
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  document.getElementById("eventTypeFilter").addEventListener("change", applyEventFilters);
});
