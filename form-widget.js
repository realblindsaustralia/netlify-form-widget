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

  // --- Sounds ---
  const unlockSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
  unlockSound.volume = 0.7;

  const typeSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"); // you can replace with tick tick mp3
  typeSound.volume = 0.4;

  // --- HTML ---
  container.innerHTML = `
    ... your HTML from before (unchanged) ...
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
  const iconname = container.querySelector(".iconname");
  const iconemail = container.querySelector(".iconemail");
  const iconphone = container.querySelector(".iconphone");
  const iconlocation = container.querySelector(".iconlocation");

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

  // --- unlock / lock logic ---
  function unlockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    if (perk && !perk.classList.contains("unlocked")) {
      perk.classList.add("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.innerHTML = '<img src="https://cdnwidgets.netlify.app/unlock.png">';
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "inline-block";
      try { unlockSound.currentTime = 0; unlockSound.play(); } catch {}
    }
  }

  function lockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    if (perk && perk.classList.contains("unlocked")) {
      perk.classList.remove("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.innerHTML = '<img src="https://cdnwidgets.netlify.app/lock.png">';
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "none";
    }
  }

  // --- NAME unlock/lock ---
  nameInput.addEventListener("blur", () => {
    if (nameInput.value.trim().length > 1) {
      unlockPerk("name");
      nameInput.classList.add("unlocked-input");
      iconname.classList.add("iconcolored");
    } else {
      lockPerk("name");
      nameInput.classList.remove("unlocked-input");
      iconname.classList.remove("iconcolored");
    }
  });

  // --- SUBURB autocomplete using API ---
  suburbInput.addEventListener("input", async () => {
    const query = suburbInput.value.trim();
    if (query.length < 2) {
      suburbSuggestions.innerHTML = "";
      suburbSuggestions.style.display = "none";
      lockPerk("suburb");
      return;
    }

    const res = await fetch(`https://api.zippopotam.us/au/${query}`).catch(() => null);
    if (!res || !res.ok) return;

    const data = await res.json();
    suburbSuggestions.innerHTML = "";
    if (!data.places) return;

    data.places.forEach((place) => {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = `${place["place name"]}, ${place["state abbreviation"]} ${data["post code"]}`;
      div.onclick = () => {
        suburbInput.value = div.textContent;
        suburbSuggestions.innerHTML = "";
        suburbSuggestions.style.display = "none";
        unlockPerk("suburb");
      };
      suburbSuggestions.appendChild(div);
    });
    suburbSuggestions.style.display = "block";
  });

  suburbInput.addEventListener("blur", () => {
    if (suburbInput.value.trim()) {
      unlockPerk("suburb");
      suburbInput.classList.add("unlocked-input");
      iconlocation.classList.add("iconcolored");
    } else {
      lockPerk("suburb");
      suburbInput.classList.remove("unlocked-input");
      iconlocation.classList.remove("iconcolored");
    }
  });

  // --- MOBILE logic ---
  mobileBoxes.forEach((box, idx) => {
    box.addEventListener("input", () => {
      const val = box.value.replace(/\D/g, "").slice(0, 1);
      box.value = val;

      if (val) {
        box.classList.add("unlocked-input");
        iconphone.classList.add("iconcolored");
      } else {
        box.classList.remove("unlocked-input");
        iconphone.classList.remove("iconcolored");
      }

      if (val && idx < 7) mobileBoxes[idx + 1].focus();

      if (mobileBoxes.every(b => b.value !== "")) {
        unlockPerk("mobile");
        emailInput.focus();
      } else {
        lockPerk("mobile");
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && idx > 0) {
        mobileBoxes[idx - 1].focus();
        mobileBoxes[idx - 1].value = "";
        mobileBoxes[idx - 1].classList.remove("unlocked-input");
      }
    });

    box.addEventListener("blur", () => {
      if (!box.value) {
        box.classList.remove("unlocked-input");
      }
    });
  });

  // --- EMAIL unlock/lock ---
  emailDomain.addEventListener("change", () => {
    const domain = emailDomain.value;
    const local = (emailInput.value.split("@")[0] || "").trim();
    if (domain) {
      emailInput.value = local ? `${local}${domain}` : `you${domain}`;
      unlockPerk("email");
      emailInput.classList.add("unlocked-input");
      emailDomain.classList.add("unlocked-input");
      iconemail.classList.add("iconcolored");
    }
    else {
      emailInput.value = local;
      if (!local.includes("@")) {
        lockPerk("email");
        emailInput.classList.remove("unlocked-input");
        emailDomain.classList.remove("unlocked-input");
        iconemail.classList.remove("iconcolored");
      }
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) {
      unlockPerk("email");
      emailInput.classList.add("unlocked-input");
      emailDomain.classList.add("unlocked-input");
      iconemail.classList.add("iconcolored");
    } else {
      lockPerk("email");
      emailInput.classList.remove("unlocked-input");
      emailDomain.classList.remove("unlocked-input");
      iconemail.classList.remove("iconcolored");
    }
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

  // --- PLAY tick sound on typing ---
  function addTypeSound(el) {
    el.addEventListener("input", () => {
      try { typeSound.currentTime = 0; typeSound.play(); } catch {}
    });
  }

  [nameInput, suburbInput, emailInput, messageInput, ...mobileBoxes].forEach(addTypeSound);

  // --- SUBMIT ---
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const allKeys = ["name", "suburb", "mobile", "email"];
    const allUnlocked = allKeys.every(key => {
      const perk = container.querySelector(`#perk-${key}`);
      return perk && perk.classList.contains("unlocked");
    });

    if (!allUnlocked) {
      alert("⚠️ Please complete all fields to unlock all perks before submitting.");
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      suburb: suburbInput.value.trim(),
      mobile: getMobileValue(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      admin: adminEmail
    };

    try {
      const resp = await fetch("https://cdnwidgets.netlify.app/.netlify/functions/send-email", {
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
