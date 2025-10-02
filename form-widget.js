(function () {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  const redirectUrl = container.dataset.redirect || "/thank-you";
  const adminEmail = container.dataset.admin;
  container.innerHTML = `
    <div class="form-widget">
      <!-- LEFT FORM -->
      <div class="form-left">
        <h2>Extra Warranty Perks</h2>
        <h3>Curtains & Blinds</h3>
        <p>Fill in your details to reveal exclusive bonuses for your project</p>

        <form id="customForm" autocomplete="off">
          <input type="text" name="name" id="name" placeholder="Your Name" required />
          <div style="position:relative;">
            <input type="text" name="suburb" id="suburb" placeholder="Suburb or Postcode" required />
            <div id="suburb-suggestions" class="suburb-suggestions"></div>
          </div>
          <input type="text" name="mobile" id="mobile" placeholder="04xxxxxxxx" maxlength="10" required />
          <div style="display:flex;">
            <input type="text" name="email" id="email" placeholder="Your Email" required />
            <select id="emailDomain">
              <option value="">Choose</option>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@outlook.com">@outlook.com</option>
            </select>
          </div>
          <textarea name="message" id="message" placeholder="Leave a Message"></textarea>

          <div class="form-buttons">
            <button type="button" class="btn-msg">Leave a Message 💬</button>
            <button type="submit" class="btn-claim">Claim Bonus 🚀</button>
          </div>
        </form>
      </div>

      <!-- RIGHT PERKS -->
      <div class="perks">
        <h3>Your Perks</h3>
        <div id="perk-name" class="perk">🎁 Free Installation – Install blinds free</div>
        <div id="perk-suburb" class="perk">💸 10% Off Coupon – First order</div>
        <div id="perk-mobile" class="perk">📱 Extended Warranty 2x – Double coverage</div>
        <div id="perk-email" class="perk">📧 Free Measure + Quote + Consultation</div>
      </div>
    </div>
  `;

  const form = document.getElementById("customForm");
  const nameField = document.getElementById("name");
  const suburbInput = document.getElementById("suburb");
  const mobileInput = document.getElementById("mobile");
  const emailInput = document.getElementById("email");
  const emailDomain = document.getElementById("emailDomain");
  const suggestionsBox = document.getElementById("suburb-suggestions");

  // 🔊 Sound for unlocking
  const unlockSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

  // Unlock function
  function unlock(field) {
    const perk = document.getElementById(`perk-${field}`);
    if (perk && !perk.classList.contains("unlocked")) {
      perk.classList.add("unlocked");
      unlockSound.play();
    }
  }

  // --- FIELD LOGIC ---
  nameField.addEventListener("blur", () => {
    if (nameField.value.trim().length > 1) unlock("name");
  });

  // Suburb with demo autocomplete (replace with AusPost API if needed)
  suburbInput.addEventListener("input", async () => {
    const query = suburbInput.value.trim();
    if (query.length < 2) return (suggestionsBox.innerHTML = "");

    const res = await fetch(`https://api.zippopotam.us/au/${query}`).catch(() => null);
    if (!res || !res.ok) return;

    const data = await res.json();
    suggestionsBox.innerHTML = "";
    data.places.forEach((place) => {
      const div = document.createElement("div");
      div.textContent = `${place["place name"]}, ${place["state abbreviation"]} ${data["post code"]}`;
      div.onclick = () => {
        suburbInput.value = div.textContent;
        suggestionsBox.innerHTML = "";
        unlock("suburb");
      };
      suggestionsBox.appendChild(div);
    });
  });

  // Mobile with prefilled 04
  mobileInput.value = "04";
  mobileInput.addEventListener("input", () => {
    if (!mobileInput.value.startsWith("04")) {
      mobileInput.value = "04";
    }
    if (mobileInput.value.length === 10) {
      unlock("mobile");
      emailInput.focus();
    }
  });

  // Email with dropdown
  emailDomain.addEventListener("change", () => {
    if (emailDomain.value) {
      emailInput.value = emailInput.value.split("@")[0] + emailDomain.value;
      unlock("email");
    }
  });
  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) unlock("email");
  });

  // ✅ MAIN SUBMIT HANDLER (as you shared)
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: form.querySelector("[name=name]").value,
      suburb: form.querySelector("[name=suburb]").value,
      mobile: mobileInput.value,
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
})();
