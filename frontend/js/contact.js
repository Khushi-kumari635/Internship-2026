// js/contact.js
// Handles validation and (simulated) submission for the Contact Us form.
// Note: This is a demo form — since a dedicated "contact messages" API
// wasn't part of the core requirements, we validate and show a success
// message locally. It can easily be connected to /api/messages later.

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    let valid = true;

    if (name.length < 2) {
      markFieldError("contactNameGroup", true);
      valid = false;
    } else {
      markFieldError("contactNameGroup", false);
    }

    if (!isValidEmail(email)) {
      markFieldError("contactEmailGroup", true);
      valid = false;
    } else {
      markFieldError("contactEmailGroup", false);
    }

    if (message.length < 10) {
      markFieldError("contactMessageGroup", true);
      valid = false;
    } else {
      markFieldError("contactMessageGroup", false);
    }

    if (!valid) return;

    // Simulate a successful submission (no backend endpoint needed for this demo form)
    showAlert("contactAlert", `Thanks ${name}! Your message has been received. We'll get back to you soon.`, "success");
    contactForm.reset();
  });
}
