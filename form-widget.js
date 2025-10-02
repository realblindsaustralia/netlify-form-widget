/* form-widget.js */
(function () {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  // read config
  const adminEmail = container.dataset.admin;
  const redirectUrl = container.dataset.redirect || "/thank-you";
  const auspostKey = container.dataset.auspostKey || "";

  // sound for unlock
  const unlockSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  unlockSound.volume = 0.7;

  // --- HTML ---
  container.innerHTML = `
    <div class="form-widget">
      <div class="form-left">
        <div class="title">Extra Warranty Perks</div>
        <div class="subtitle">Curtains & Blinds — Fill in your details to reveal exclusive bonuses for your project</div>

        <form id="customForm" autocomplete="off">
          <div class="field">
            <input class="input" id="name" name="name" placeholder="Your Name" />
          </div>

          <div class="field" style="position:relative;">
            <input class="input" id="suburb" name="suburb" placeholder="Suburb or Postcode (Australia)" />
            <div id="suburb-suggestions" class="suburb-suggestions" style="display:none;"></div>
          </div>

          <div class="field mobile-row">
            <div class="mobile-prefix">04</div>
            <div class="mobile-boxes" id="mobile-boxes"></div>
          </div>

          <div class="field email-group">
            <input class="input email-input" id="email" name="email" placeholder="Email (you@domain.com)" />
            <select class="email-select" id="emailDomain">
              <option value="">Select domain (optional)</option>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@hotmail.com">@hotmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@outlook.com">@outlook.com</option>
            </select>
          </div>

          <div class="field">
            <textarea class="textarea" id="message" name="message" placeholder="Leave a message"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-msg" id="btnMsg">Leave A Message 💬</button>
            <button type="submit" class="btn btn-claim" id="btnClaim">Claim Bonus 🚀</button>
          </div>
        </form>
      </div>

      <div class="perks">
        <div class="heading">Your Perks</div>

        <div id="perk-name" class="perk"><div class="icon">🔒</div><div class="meta"><div class="title">Free Installation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">We'll install your blinds with no charge</div></div></div>

        <div id="perk-suburb" class="perk"><div class="icon">🔒</div><div class="meta"><div class="title">10% Off Coupon <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Applies to your first order with us</div></div></div>

        <div id="perk-mobile" class="perk"><div class="icon">🔒</div><div class="meta"><div class="title">Extended Warranty (2x) <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Twice the warranty period for curtains and blinds</div></div></div>

        <div id="perk-email" class="perk"><div class="icon">🔒</div><div class="meta"><div class="title">Free Measure • Quote • Consultation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Book a visit with zero obligation</div></div></div>
      </div>
    </div>
  `;

  // --- refs ---
  const form = container.querySelector("#customForm");
  const nameInput = container.querySelector("#name");
  const suburbInput = container.querySelector("#suburb");
  const suburbSuggestions = container.querySelector("#suburb-suggestions");
  const mobileBoxesContainer = container.querySelector("#mobile-boxes");
  const emailInput = container.querySelector("#email");
  const emailDomain = container.querySelector("#emailDomain");
  const messageInput = container.querySelector("#message");
  const btnMsg = container.querySelector("#btnMsg");
  const btnClaim = container.querySelector("#btnClaim");

  // create 8 mobile digit boxes
  const mobileBoxes = [];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement("input");
    el.type = "text";
    el.maxLength = 1;
    el.inputMode = "numeric";
    el.className = "mobile-box";
    mobileBoxesContainer.appendChild(el);
    mobileBoxes.push(el);
  }

  function getMobileValue() {
    const digits = mobileBoxes.map(b => b.value.trim()).join("");
    if (!digits) return "";
    return "04" + digits;
  }

  // Unlock/Lock handling
  function unlockPerk(key) {
    const el = container.querySelector("#perk-" + key);
    if (!el) return;
    if (!el.classList.contains("unlocked")) {
      el.classList.add("unlocked");
      el.querySelector(".icon").textContent = "🔓";
      const badge = el.querySelector(".badge");
      if (badge) badge.style.display = "inline-block";
      try { unlockSound.currentTime = 0; unlockSound.play(); } catch {}
    }
  }
  function lockPerk(key) {
    const el = container.querySelector("#perk-" + key);
    if (!el) return;
    if (el.classList.contains("unlocked")) {
      el.classList.remove("unlocked");
      el.querySelector(".icon").textContent = "🔒";
      const badge = el.querySelector(".badge");
      if (badge) badge.style.display = "none";
    }
  }

  // EVENTS (unlock only on BLUR)
  nameInput.addEventListener("blur", () => {
    if (nameInput.value.trim().length > 1) unlockPerk("name"); else lockPerk("name");
  });

  // SUBURB AUTOCOMPLETE (with zippopotam + demo fallback)
  let suburbTimer = null;
  suburbInput.addEventListener("input", () => {
    const q = suburbInput.value.trim();
    if (!q || q.length < 2) {
      suburbSuggestions.style.display = "none";
      suburbSuggestions.innerHTML = "";
      return;
    }
    clearTimeout(suburbTimer);
    suburbTimer = setTimeout(async () => {
      try {
        let suggestions = [];
        if (auspostKey) {
          const res = await fetch(`/api/auspost?query=${encodeURIComponent(q)}`);
          if (res.ok) suggestions = await res.json();
        } else {
          if (/^\\d{3,4}$/.test(q)) {
            const res = await fetch(`https://api.zippopotam.us/au/${q}`).catch(()=>null);
            if (res && res.ok) {
              const data = await res.json();
              suggestions = data.places.map(p => `${p["place name"]}, ${p["state abbreviation"]} ${data["post code"]}`);
            }
          } else {
            const demo = ["Wantirna South, VIC 3152","Melbourne, VIC 3000","Sydney, NSW 2000","Brisbane, QLD 4000","Adelaide, SA 5000","Perth, WA 6000"];
            suggestions = demo.filter(s => s.toLowerCase().includes(q.toLowerCase()));
          }
        }

        suburbSuggestions.innerHTML = "";
        if (suggestions.length === 0) {
          suburbSuggestions.style.display = "none";
          return;
        }
        suggestions.forEach(text => {
          const d = document.createElement("div");
          d.className = "suggestion";
          d.textContent = text;
          d.addEventListener("click", () => {
            suburbInput.value = text;
            suburbSuggestions.style.display = "none";
            unlockPerk("suburb");
          });
          suburbSuggestions.appendChild(d);
        });
        suburbSuggestions.style.display = "block";
      } catch {
        suburbSuggestions.style.display = "none";
      }
    }, 300);
  });
  suburbInput.addEventListener("blur", () => {
    if (suburbInput.value.trim().length > 2) unlockPerk("suburb"); else lockPerk("suburb");
  });
  document.addEventListener("click", e => {
    if (!container.contains(e.target)) suburbSuggestions.style.display = "none";
  });

  // MOBILE (unlock only when full + blur)
  mobileBoxes.forEach((box, idx) => {
    box.addEventListener("blur", () => {
      const allFilled = mobileBoxes.every(b => b.value.trim() !== "");
      if (allFilled) unlockPerk("mobile"); else lockPerk("mobile");
    });
  });

  // EMAIL
  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) unlockPerk("email"); else lockPerk("email");
  });
  emailDomain.addEventListener("change", () => {
    if (emailDomain.value) unlockPerk("email");
  });

  // MESSAGE
  messageInput.addEventListener("input", () => {
    if (messageInput.value.trim()) {
      btnMsg.style.display = "none";
      btnClaim.classList.add("btn-merged");
    } else {
      btnMsg.style.display = "";
      btnClaim.classList.remove("btn-merged");
    }
  });

  // SUBMIT
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const payload = {
      name: nameInput.value.trim(),
      suburb: suburbInput.value.trim(),
      mobile: getMobileValue(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      admin: adminEmail
    };
    if (!payload.name || !payload.email) {
      alert("Please fill at least name and email.");
      return;
    }
    try {
      const resp = await fetch("https://cdnwidget.netlify.app/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp.ok) window.location.href = redirectUrl;
      else alert("❌ Error sending email");
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error");
    }
  });
})();
