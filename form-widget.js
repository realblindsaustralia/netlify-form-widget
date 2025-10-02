(function () {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  const redirectUrl = container.dataset.redirect || "/thank-you";
  const adminEmail = container.dataset.admin;

  container.innerHTML = `
    <div class="form-widget">
      <div class="form-left">
        <h2>Extra Warranty Perks <br><span>Curains & Blinds</span></h2>
        <p class="subtitle">Fill in your details to reveal exclusive bonuses</p>
        <form id="customForm">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="text" id="suburb" name="suburb" placeholder="Suburb or Postcode" required />
          <div class="mobile-wrapper">
            <span class="prefix">04</span>
            <input type="text" id="mobile" maxlength="8" placeholder="Mobile (8 digits)" required />
          </div>
          <div class="email-wrapper">
            <input type="text" id="email" placeholder="Email" required />
            <div class="email-suggestions"></div>
          </div>
          <textarea name="message" id="message" placeholder="Leave a message"></textarea>
          <div class="form-actions">
            <button type="button" id="msgBtn">💬 Leave a Message</button>
            <button type="submit" id="submitBtn">🚀 Claim Bonus</button>
          </div>
        </form>
        <div id="form-status" style="margin-top:10px; color:green; display:none;">
          ✅ Your message has been sent!
        </div>
      </div>
      <div class="form-right">
        <h3>Your Perks</h3>
        <ul>
          <li data-field="name">🎁 Free Installation</li>
          <li data-field="suburb">💸 10% Off Coupon</li>
          <li data-field="mobile">📱 Extended Warranty (2x)</li>
          <li data-field="email">📧 Free Measure + Quote</li>
        </ul>
      </div>
    </div>
  `;

  const form = document.getElementById("customForm");
  const statusDiv = document.getElementById("form-status");
  const perks = document.querySelectorAll(".form-right li");
  const emailInput = document.getElementById("email");
  const emailSuggestions = document.querySelector(".email-suggestions");
  const mobileInput = document.getElementById("mobile");

  // -------------------------
  // EMAIL AUTOCOMPLETE
  // -------------------------
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  emailInput.addEventListener("input", () => {
    const val = emailInput.value.split("@")[0];
    if (!val) {
      emailSuggestions.innerHTML = "";
      return;
    }
    emailSuggestions.innerHTML = domains
      .map(d => `<div class="suggestion">${val}@${d}</div>`)
      .join("");
    document.querySelectorAll(".suggestion").forEach(s => {
      s.onclick = () => {
        emailInput.value = s.textContent;
        emailSuggestions.innerHTML = "";
        unlock("email");
      };
    });
  });

  // -------------------------
  // MOBILE FIELD UX
  // -------------------------
  mobileInput.addEventListener("input", () => {
    if (mobileInput.value.length === 8) {
      document.getElementById("email").focus();
    }
  });

  // -------------------------
  // PERK UNLOCKING
  // -------------------------
  form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
      unlock(input.name || input.id);
    });
  });

  function unlock(field) {
    const perk = document.querySelector(`.form-right li[data-field="${field}"]`);
    if (perk) {
      perk.classList.add("unlocked");
      playDing();
    }
  }

  // -------------------------
  // SUBMIT HANDLER
  // -------------------------
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: form.querySelector("[name=name]").value,
      suburb: form.querySelector("[name=suburb]").value,
      mobile: "04" + mobileInput.value,
      email: emailInput.value,
      message: form.querySelector("[name=message]").value,
      admin: adminEmail,
    };

    try {
      const response = await fetch(
        "https://cdnwidget.netlify.app/.netlify/functions/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        window.location.href = redirectUrl;
      } else {
        alert("❌ Error sending email");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error");
    }
  });

  // -------------------------
  // SOUND EFFECT
  // -------------------------
  function playDing() {
    const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_6597b6f020.mp3");
    audio.play();
  }
})();
