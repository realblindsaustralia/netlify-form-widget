/* form-widget.js
   Usage:
   <div id="custom-form-widget" data-admin="test1@gmail.com" data-redirect="/thank-you"></div>
   <script src="https://your-cdn/path/form-widget.js"></script>
*/

(function () {
  const container = document.getElementById("custom-form-widget");
  if (!container) return;

  const adminEmail = container.dataset.admin;
  const redirectUrl = container.dataset.redirect || "/thank-you";

  // Load suburbs.json (must be inside /public/suburbs.json in Netlify)
  let suburbData = [];
  fetch("/suburbs.json")
    .then(r => {
      if (!r.ok) throw new Error("Failed to load suburbs.json");
      return r.json();
    })
    .then(data => {
      suburbData = data;
      console.log("✅ Suburbs loaded:", suburbData.length);
    })
    .catch(err => console.error("❌ Suburb JSON load error", err));

  const unlockSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
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

  // --- mobile boxes ---
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
    return digits ? "04" + digits : "";
  }

  function unlockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    if (perk && !perk.classList.contains("unlocked")) {
      perk.classList.add("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.textContent = "🔓";
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "inline-block";
      try { unlockSound.currentTime = 0; unlockSound.play(); } catch {}
    }
  }

  // --- NAME unlock on blur ---
  nameInput.addEventListener("blur", () => {
    if (nameInput.value.trim().length > 1) unlockPerk("name");
  });

  // --- SUBURB autocomplete ---
  let suburbTimer = null;
  suburbInput.addEventListener("input", () => {
    const q = suburbInput.value.trim().toLowerCase();
    if (!q || q.length < 2) {
      suburbSuggestions.style.display = "none";
      suburbSuggestions.innerHTML = "";
      return;
    }
    clearTimeout(suburbTimer);
    suburbTimer = setTimeout(() => {
      const matches = suburbData.filter(
        s => s.suburb.toLowerCase().includes(q) || s.postcode.includes(q)
      ).slice(0, 8);
      suburbSuggestions.innerHTML = "";
      if (matches.length === 0) {
        suburbSuggestions.style.display = "none";
        return;
      }
      matches.forEach(item => {
        const text = `${item.suburb}, ${item.state} ${item.postcode}`;
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
    }, 250);
  });

  // --- MOBILE logic ---
  mobileBoxes.forEach((box, idx) => {
    box.addEventListener("input", () => {
      const val = box.value.replace(/\D/g,"").slice(0,1);
      box.value = val;
      if (val && idx < 7) mobileBoxes[idx+1].focus();
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
    box.addEventListener("blur", () => {
      const digits = mobileBoxes.map(b => b.value).join("");
      if (!digits) mobileBoxes.forEach(b => b.value = "");
    });
  });

  // --- EMAIL unlock ---
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

  // --- MESSAGE merge buttons ---
  messageInput.addEventListener("input", () => {
    if (messageInput.value.trim().length > 0) {
      btnMsg.style.display = "none";
      btnClaim.classList.add("btn-merged");
    } else {
      btnMsg.style.display = "";
      btnClaim.classList.remove("btn-merged");
    }
  });

  // --- SUBMIT ---
  form.addEventListener("submit", async function (e) {
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
})();
