(function() {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  // Redirect URL (default is /thank-you, but can be customized via data-redirect)
  const redirectUrl = container.dataset.redirect || "/thank-you";

  // Insert form into the container
  container.innerHTML = `
    <form id="customForm">
      <input type="hidden" name="form-name" value="contact">
      <p><input type="text" name="name" placeholder="Your Name" required /></p>
      <p><input type="email" name="email" placeholder="Your Email" required /></p>
      <p><textarea name="message" placeholder="Your Message"></textarea></p>
      <p><button type="submit">Send</button></p>
    </form>
    <div id="form-status" style="margin-top:10px; color:green; display:none;">
      ✅ Your message has been sent!
    </div>
  `;

  const form = document.getElementById("customForm");
  const statusDiv = document.getElementById("form-status");

  // Helper to encode form data
  function encode(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  }

  // Handle form submit
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = {
      "form-name": "contact",
      name: form.querySelector("[name=name]").value,
      email: form.querySelector("[name=email]").value,
      message: form.querySelector("[name=message]").value
    };

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(formData)
      });

      if (response.ok) {
        // If a redirect URL is set, go there
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          // Otherwise, just show a success message
          statusDiv.style.display = "block";
          form.reset();
        }
      } else {
        alert("❌ Something went wrong while submitting the form.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      alert("⚠️ Network error. Please try again later.");
    }
  });
})();
