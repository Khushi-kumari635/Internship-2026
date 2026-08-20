// js/main.js
// Shared logic used across EVERY page: building the navbar/footer,
// handling login state, mobile menu toggle, and logout.
// This file must be loaded AFTER api.js on every HTML page.

// Returns the initials of a name, e.g. "Rahul Sharma" -> "RS"
// Used to generate simple avatar circles instead of real photos.
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  const initials = parts.map((p) => p[0]).join("").toUpperCase();
  return initials.slice(0, 2);
}

// Builds the navbar HTML and injects it into the page.
// Changes links shown based on whether the user is logged in.
function renderNavbar() {
  const navPlaceholder = document.getElementById("navbar-placeholder");
  if (!navPlaceholder) return;

  const user = getCurrentUser();
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Helper to mark the active nav link
  const isActive = (page) => (currentPage === page ? "active" : "");

  const authLinksHtml = user
    ? `
      <a href="dashboard.html" class="btn btn-outline btn-small">Dashboard</a>
      <button id="logoutBtn" class="btn btn-primary btn-small">Logout</button>
    `
    : `
      <a href="login.html" class="btn btn-outline btn-small">Login</a>
      <a href="register.html" class="btn btn-primary btn-small">Join Now</a>
    `;

  navPlaceholder.innerHTML = `
    <nav class="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-logo">🎓 Alumni<span>Connect</span></a>

        <button class="navbar-toggle" id="navToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <div class="navbar-links" id="navLinks">
          <a href="index.html" class="${isActive("index.html")}">Home</a>
          <a href="directory.html" class="${isActive("directory.html")}">Alumni Directory</a>
          <a href="jobs.html" class="${isActive("jobs.html")}">Job Board</a>
          <a href="events.html" class="${isActive("events.html")}">Events</a>
          <a href="about.html" class="${isActive("about.html")}">About</a>
          <a href="contact.html" class="${isActive("contact.html")}">Contact</a>
        </div>

        <div class="navbar-actions">
          ${authLinksHtml}
        </div>
      </div>
    </nav>
  `;

  // Mobile menu toggle button
  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("show");
  });

  // Logout button (only exists if user is logged in)
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.href = "index.html";
    });
  }
}

// Builds the footer HTML and injects it into the page.
function renderFooter() {
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (!footerPlaceholder) return;

  footerPlaceholder.innerHTML = `
    <footer class="footer">
      <div class="footer-grid">
        <div>
          <h4>🎓 AlumniConnect</h4>
          <p style="opacity:0.85; font-size:0.9rem;">
            Connecting students and alumni to build a stronger community, together.
          </p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="directory.html">Alumni Directory</a></li>
            <li><a href="jobs.html">Job Board</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="about.html">About Us</a></li>
          </ul>
        </div>
        <div>
          <h4>Account</h4>
          <ul>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
            <li><a href="dashboard.html">Dashboard</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>📍 College Campus, Jaipur, Rajasthan</li>
            <li>📧 alumni@college.edu.in</li>
            <li>📞 +91 98765 43210</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 AlumniConnect — A College Alumni Network Platform Project.
      </div>
    </footer>
  `;
}

// Protects a page: if no user is logged in, redirect to login page.
// Call this at the top of pages like dashboard.html.
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

// Simple helper to show a temporary alert box (success/error) inside forms.
function showAlert(elementId, message, type = "error") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.className = `alert alert-${type}`;
  el.style.display = "block";
}

// Format a date string like "2026-08-20" into "20 Aug 2026"
function formatDate(dateString) {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-IN", options);
}

// A simple email validation regex — good enough for a college project
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Adds/removes the "has-error" class on a form-group so its red
// border and error text (see .form-error in style.css) shows up.
function markFieldError(groupId, hasError) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.classList.toggle("has-error", hasError);
}

// Run navbar/footer rendering on every page as soon as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
});
