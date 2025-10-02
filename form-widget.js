/* form-widget.js
   - drop into your CDN (Netlify) and embed with:
   <div id="custom-form-widget" data-admin="test1@gmail.com" data-redirect="/thank-you"></div>
   <script src="https://your-cdn/path/form-widget.js"></script>
*/

(function () {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  // read config from embed attributes
  const adminEmail = container.dataset.admin;
  const redirectUrl = container.dataset.redirect || "/thank-you";

  // OPTIONAL: AusPost API key (if provided on the div)
  const auspostKey = container.dataset.auspostKey || "";

  // sound for unlocking - hosted public sound (hotlink friendly)
  const unlockSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  unlockSound.volume = 0.7;

  // --- HTML template ---
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
            <div class="mobile-boxes" id="mobile-boxes">
              <!-- 8 boxes will be injected -->
            </div>
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
        <div id="perk-name" class="perk">
          <div class="icon">🔓</div>
          <div class="meta">
            <div class="title">Free Installation <span class="badge" style="display:none">Now unlocked</span></div>
            <div class="desc">We'll install your blinds with no charge</div>
          </div>
        </div>

        <div id="perk-suburb" class="perk">
          <div class="icon">📍</div>
          <div class="meta">
            <div class="title">10% Off Coupon <span class="badge" style="display:none">Now unlocked</span></div>
            <div class="desc">Applies to your first order with us</div>
          </div>
        </div>

        <div id="perk-mobile" class="perk">
          <div class="icon">📱</div>
          <div class="meta">
            <div class="title">Extended Warranty (2x) <span class="badge" style="display:none">Now unlocked</span></div>
            <div class="desc">Twice the warranty period for curtains and blinds</div>
          </div>
        </div>

        <div id="perk-email" class="perk">
          <div class="icon">✉️</div>
          <div class="meta">
            <div class="title">Free Measure • Quote • Consultation <span class="badge" style="display:none">Now unlocked</span></div>
            <div class="desc">Book a visit with zero obligation</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // --- element refs ---
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

  // create 8 mobile single-digit inputs
  const mobileBoxes = [];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement("input");
    el.type = "text";
    el.maxLength = 1;
    el.inputMode = "numeric";
    el.className = "mobile-box";
    el.setAttribute("aria-label", `mobile-digit-${i+1}`);
    mobileBoxesContainer.appendChild(el);
    mobileBoxes.push(el);
  }

  // HELPER: get joined mobile (returns "" if all empty)
  function getMobileValue() {
    const digits = mobileBoxes.map(b => b.value.trim()).join("");
    if (!digits) return ""; // empty -> no 04 prefix
    return "04" + digits;
  }

  // HELPER: set mobile to digits array (pads)
  function setMobileDigits(digitsStr) {
    const chars = (digitsStr || "").slice(0,8).split("");
    for (let i=0;i<8;i++) mobileBoxes[i].value = chars[i] || "";
  }

  // auto-advance & backspace behavior
  mobileBoxes.forEach((box, idx) => {
    box.addEventListener("input", (e) => {
      const val = box.value.replace(/\D/g,"").slice(0,1);
      box.value = val;
      if (val && idx < 7) mobileBoxes[idx+1].focus();
      // if last filled auto move to email
      if (mobileBoxes.every(b => b.value !== "")) {
        unlockPerk("mobile");
        emailInput.focus();
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && idx > 0) {
        mobileBoxes[idx-1].focus();
        mobileBoxes[idx-1].value = "";
      }
    });

    // critical rule: if user clears digits to zero, remove all digits and don't keep 04
    box.addEventListener("blur", () => {
      const digits = mobileBoxes.map(b => b.value).join("");
      if (digits.length === 0) {
        setMobileDigits("");
      }
    });
  });

  // Auto-unlock name on blur
  nameInput.addEventListener("blur", () => {
    if (nameInput.value.trim().length > 1) unlockPerk("name");
  });

  // SUBURB AUTOCOMPLETE: use AusPost if key provided else fallback
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
        // if AusPost API key provided (production)
        if (auspostKey) {
          // AusPost Reflection - requires server proxy in production. Example placeholder:
          // request to your proxy: /api/auspost?query=...
          const res = await fetch(`/api/auspost?query=${encodeURIComponent(q)}`);
          if (res.ok) suggestions = await res.json();
        } else {
          // Fallback: if numeric treat as postcode via Zippopotam (demo)
          if (/^\d{3,4}$/.test(q)) {
            const res = await fetch(`https://api.zippopotam.us/au/${q}`).catch(()=>null);
            if (res && res.ok) {
              const data = await res.json();
              suggestions = data.places.map(p => `${p["place name"]}, ${p["state abbreviation"]} ${data["post code"]}`);
            }
          } else {
            // small local demo list for typical AU suburbs (fallback)
            const demo = [
              "Wantirna South, VIC 3152", "Melbourne, VIC 3000", "Sydney, NSW 2000",
              "Brisbane, QLD 4000", "Adelaide, SA 5000", "Perth, WA 6000"
            ];
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
      } catch (err) {
        // ignore fail silently
        suburbSuggestions.style.display = "none";
      }
    }, 320);
  });

  // click outside to hide suggestions
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target)) {
      suburbSuggestions.style.display = "none";
    }
  });

  // EMAIL domain selection behavior
  emailDomain.addEventListener("change", () => {
    const domain = emailDomain.value;
    const local = (emailInput.value.split("@")[0] || "").trim();
    if (domain) {
      emailInput.value = local ? `${local}${domain}` : `you${domain}`;
      unlockPerk("email");
    }
  });
  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) unlockPerk("email");
  });

  // MESSAGE triggers merge animation for buttons
  messageInput.addEventListener("input", () => {
    const has = messageInput.value.trim().length > 0;
    if (has) {
      btnMsg.style.display = "none";
      btnClaim.classList.add("btn-merged");
      btnClaim.style.flex = "1 1 100%";
    } else {
      btnMsg.style.display = "";
      btnClaim.classList.remove("btn-merged");
      btnClaim.style.flex = "";
    }
  });

  // Unlock helper (adds visual and plays sound once)
  function unlockPerk(key) {
    let id = "perk-" + key;
    // map name->perk id
    if (key === "name") id = "perk-name";
    else if (key === "suburb") id = "perk-suburb";
    else if (key === "mobile") id = "perk-mobile";
    else if (key === "email") id = "perk-email";

    const el = container.querySelector("#" + id);
    if (!el) return;
    if (!el.classList.contains("unlocked")) {
      el.classList.add("unlocked");
      const badge = el.querySelector(".badge");
      if (badge) badge.style.display = "inline-block";
      // play sound (catch errors)
      try { unlockSound.currentTime = 0; unlockSound.play(); } catch (e) {}
    }
  }

  // When any field is programmatically set / selected, call unlockPerk accordingly
  // Name blur handled above. Suburb click handled in suggestions. Mobile handled below.
  // Mobile: when all 8 digits filled we will call unlockPerk("mobile") above.

  // MAIN SUBMIT (your exact pattern preserved)
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // assemble mobile
    const mobile = getMobileValue(); // "" or "04xxxxxxxx"

    const payload = {
      name: nameInput.value.trim(),
      suburb: suburbInput.value.trim(),
      mobile: mobile,
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      admin: adminEmail
    };

    // minimal validation
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

      if (resp.ok) {
        window.location.href = redirectUrl;
      } else {
        alert("❌ Error sending email");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Network error");
    }
  });

  // expose helper for debugging (optional)
  container._getState = () => ({
    name: nameInput.value,
    suburb: suburbInput.value,
    mobile: getMobileValue(),
    email: emailInput.value,
    message: messageInput.value
  });
})();
