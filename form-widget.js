(function() {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  const redirectUrl = container.dataset.redirect || "/thank-you";
  const adminEmail = container.dataset.admin;

  container.innerHTML = `
    <form id="customForm">
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

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = {
      name: form.querySelector("[name=name]").value,
      email: form.querySelector("[name=email]").value,
      message: form.querySelector("[name=message]").value,
      admin: adminEmail
    };

    try {
      const response = await fetch("https://cdnwidget.netlify.app/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          statusDiv.style.display = "block";
          form.reset();
        }
      } else {
        alert("❌ Error sending email");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error");
    }
  });
})();