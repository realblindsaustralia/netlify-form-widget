(function() {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  const redirectUrl = container.dataset.redirect || "/thank-you";

  container.innerHTML = `
    <form id="customForm" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact">
      <p style="display:none"><label>Don’t fill this out: <input name="bot-field"></label></p>
      <p><input type="text" name="name" placeholder="Your Name" required /></p>
      <p><input type="email" name="email" placeholder="Your Email" required /></p>
      <p><textarea name="message" placeholder="Your Message"></textarea></p>
      <p><button type="submit">Send</button></p>
    </form>
  `;

  const form = document.getElementById("customForm");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        window.location.href = redirectUrl;
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  });
})();