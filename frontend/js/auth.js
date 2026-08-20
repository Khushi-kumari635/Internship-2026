// js/auth.js
// Handles client-side form validation and submission logic for
// both the Login page and the Register page.

// ---- Form-specific logic below (isValidEmail & markFieldError now live in main.js) ----

// ===========================================================
// LOGIN FORM LOGIC
// ===========================================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // ---- Validation ----
    let valid = true;

    if (!isValidEmail(email)) {
      markFieldError("emailGroup", true);
      valid = false;
    } else {
      markFieldError("emailGroup", false);
    }

    if (password.length < 6) {
      markFieldError("passwordGroup", true);
      valid = false;
    } else {
      markFieldError("passwordGroup", false);
    }

    if (!valid) return;

    // ---- Submit to backend ----
    try {
      const result = await api.post("/auth/login", { email, password }, false);
      saveSession(result.token, result.user);
      showAlert("formAlert", "Login successful! Redirecting to your dashboard...", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } catch (error) {
      showAlert("formAlert", error.message, "error");
    }
  });
}

// ===========================================================
// REGISTER FORM LOGIC
// ===========================================================
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  const roleSelect = document.getElementById("role");
  const gradYearGroup = document.getElementById("gradYearGroup");
  const currentYearGroup = document.getElementById("currentYearGroup");

  // Toggle "Graduation Year" (alumni) vs "Current Year" (student) fields
  function toggleRoleFields() {
    if (roleSelect.value === "alumni") {
      gradYearGroup.classList.remove("hidden");
      currentYearGroup.classList.add("hidden");
    } else {
      gradYearGroup.classList.add("hidden");
      currentYearGroup.classList.remove("hidden");
    }
  }
  roleSelect.addEventListener("change", toggleRoleFields);
  toggleRoleFields(); // run once on page load

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const department = document.getElementById("department").value;
    const graduationYear = document.getElementById("graduationYear").value;
    const currentYear = document.getElementById("currentYear").value;

    // ---- Validation ----
    let valid = true;

    if (name.length < 2) {
      markFieldError("nameGroup", true);
      valid = false;
    } else {
      markFieldError("nameGroup", false);
    }

    if (!isValidEmail(email)) {
      markFieldError("emailGroup", true);
      valid = false;
    } else {
      markFieldError("emailGroup", false);
    }

    if (password.length < 6) {
      markFieldError("passwordGroup", true);
      valid = false;
    } else {
      markFieldError("passwordGroup", false);
    }

    if (role === "alumni" && !graduationYear) {
      markFieldError("gradYearGroup", true);
      valid = false;
    } else {
      markFieldError("gradYearGroup", false);
    }

    if (!valid) return;

    // ---- Submit to backend ----
    try {
      const payload = {
        name,
        email,
        password,
        role,
        department,
        graduationYear: graduationYear ? Number(graduationYear) : undefined,
        currentYear: currentYear ? Number(currentYear) : undefined,
      };

      const result = await api.post("/auth/register", payload, false);
      saveSession(result.token, result.user);
      showAlert("formAlert", "Account created successfully! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } catch (error) {
      showAlert("formAlert", error.message, "error");
    }
  });
}
