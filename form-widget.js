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
  const typeSound = new Audio("https://cdn-widget.netlify.app/typeSound.wav");
  unlockSound.volume = 0.7;
  typeSound.volume = 0.4;
  let soundEnabled = true;

  // --- HTML ---
  container.innerHTML = `...` // keep your same HTML structure (omitted for brevity)
  
  // --- AUDIO TOGGLE ---
  const soundToggle = container.querySelector("#soundToggle");
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      // 🔊 Sound ON icon
      soundToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
      <foreignObject x="-8" y="-8" width="68" height="68"><div xmlns="http://www.w3.org/1999/xhtml"
      style="backdrop-filter:blur(4px);clip-path:url(#bgblur_on);height:100%;width:100%"></div></foreignObject>
      <circle cx="26" cy="26" r="25" fill="url(#paint0)" fill-opacity="0.53"
      stroke="url(#paint1)" stroke-opacity="0.7" stroke-width="2"/>
      <path d="M27.25 36.5C26.99 36.5 26.72 36.4 26.53 36.2L21.7 31.38H19.05C17.92 31.38 17 30.46 17 29.33V23.18C17 22.05 17.92 21.13 19.05 21.13H21.7L26.53 16.3C26.82 16.01 27.26 15.92 27.65 16.08C28.03 16.24 28.28 16.61 28.28 17.03V35.48C28.28 35.89 28.03 36.27 27.65 36.43C27.52 36.48 27.38 36.5 27.25 36.5Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd"
      d="M34.04 17.38C34.51 16.87 35.28 16.87 35.75 17.38C37.93 19.71 39.28 22.94 39.28 26.5C39.28 30.06 37.93 33.29 35.75 35.62C35.28 36.13 34.51 36.13 34.04 35.62C33.57 35.12 33.57 34.3 34.04 33.8C35.79 31.93 36.87 29.35 36.87 26.5C36.87 23.65 35.79 21.07 34.04 19.2C33.57 18.7 33.57 17.88 34.04 17.38Z" fill="white"/>
      <defs><linearGradient id="paint0" x1="19" y1="1" x2="43" y2="4" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0C3F25"/><stop offset="1" stop-color="#1FA560"/></linearGradient>
      <linearGradient id="paint1" x1="1" y1="26" x2="51" y2="26" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2FC585"/><stop offset="0.5" stop-color="#9FFFAB"/><stop offset="1" stop-color="#4ECE97"/>
      </linearGradient></defs></svg>`;
    } else {
      // 🔇 Sound OFF icon
      soundToggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
      <foreignObject x="-8" y="-8" width="68" height="68"><div xmlns="http://www.w3.org/1999/xhtml"
      style="backdrop-filter:blur(4px);clip-path:url(#bgblur_off);height:100%;width:100%"></div></foreignObject>
      <circle cx="26" cy="26" r="25" fill="url(#paint0)" fill-opacity="0.53"
      stroke="url(#paint1)" stroke-opacity="0.7" stroke-width="2"/>
      <path d="M27.25 36.5C26.99 36.5 26.72 36.4 26.53 36.2L21.7 31.38H19.05C17.92 31.38 17 30.46 17 29.33V23.18C17 22.05 17.92 21.13 19.05 21.13H21.7L26.53 16.3C26.82 16.01 27.26 15.92 27.65 16.08C28.03 16.24 28.28 16.61 28.28 17.03V35.48C28.28 35.89 28.03 36.27 27.65 36.43C27.52 36.48 27.38 36.5 27.25 36.5Z" fill="white"/>
      <path d="M30.15 23.48C29.75 23.88 29.75 24.53 30.15 24.93L31.47 26.26L30.15 27.58C29.75 27.98 29.75 28.63 30.15 29.03C30.55 29.43 31.2 29.43 31.6 29.03L32.92 27.7L34.25 29.03C34.65 29.43 35.3 29.43 35.7 29.03C36.1 28.63 36.1 27.98 35.7 27.58L34.37 26.26L35.7 24.93C36.1 24.53 36.1 23.88 35.7 23.48C35.23 23.01 34.62 23.11 34.25 23.48L32.92 24.81L31.6 23.48C31.15 23.03 30.55 23.08 30.15 23.48Z" fill="white"/>
      </svg>`;
    }
  });

  // --- safe sound wrapper ---
  function safePlay(audio) {
    if (!soundEnabled) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch {}
  }

  // --- add refs ---
  const form = container.querySelector("#customForm");
  const nameInput = container.querySelector("#cdn_name");
  const suburbInput = container.querySelector("#suburb");
  const suburbSuggestions = container.querySelector("#suburb-suggestions");
  const mobileBoxesContainer = container.querySelector("#mobile-boxes");
  const emailInput = container.querySelector("#cdn_email");
  const emailDomain = container.querySelector("#emailDomain");
  const messageInput = container.querySelector("#cdn_message");
  const btnMsg = container.querySelector("#btnMsg");
  const btnClaim = container.querySelector("#btnClaim");
  const iconname = container.querySelector(".iconname");
  const iconemail = container.querySelector(".iconemail");
  const iconphone = container.querySelector(".iconphone");
  const iconlocation = container.querySelector(".iconlocation");

  // --- MOBILE INPUT boxes ---
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
    const digits = mobileBoxes.map((b) => b.value.trim()).join("");
    return digits ? "04" + digits : "";
  }

  // --- UNLOCK/LOCK functions ---
  function unlockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    if (perk && !perk.classList.contains("unlocked")) {
      perk.classList.add("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.innerHTML = `<img src="https://cdn-widget.netlify.app/unlock.png">`;
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "inline-block";
      safePlay(unlockSound);
    }
  }

  function lockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    if (perk && perk.classList.contains("unlocked")) {
      perk.classList.remove("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.innerHTML = `<img src="https://cdn-widget.netlify.app/lock.png">`;
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "none";
    }
  }

  // --- INPUT EVENTS ---
  const inputs = container.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => safePlay(typeSound));
  });

  // --- NAME ---
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

  // --- SUBURB autocomplete ---
  suburbInput.addEventListener("input", async () => {
    const query = suburbInput.value.trim();
    if (query.length < 2) {
      suburbSuggestions.innerHTML = "";
      suburbSuggestions.style.display = "none";
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

  // --- MOBILE ---
  mobileBoxes.forEach((box, idx) => {
    box.addEventListener("input", () => {
      const val = box.value.replace(/\D/g, "").slice(0, 1);
      box.value = val;
      safePlay(typeSound);
      if (val && idx < 7) mobileBoxes[idx + 1].focus();

      if (mobileBoxes.every((b) => b.value !== "")) {
        unlockPerk("mobile");
      } else {
        lockPerk("mobile");
      }
    });
  });

  // --- EMAIL ---
  emailDomain.addEventListener("change", () => {
    const domain = emailDomain.value;
    const local = (emailInput.value.split("@")[0] || "").trim();
    if (domain) {
      emailInput.value = local ? `${local}${domain}` : `you${domain}`;
      unlockPerk("email");
      iconemail.classList.add("iconcolored");
    } else if (!emailInput.value.includes("@")) {
      lockPerk("email");
      iconemail.classList.remove("iconcolored");
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) {
      unlockPerk("email");
      iconemail.classList.add("iconcolored");
    } else {
      lockPerk("email");
      iconemail.classList.remove("iconcolored");
    }
  });

  btnMsg.addEventListener("click", () => {
    messageInput.style.display =
      messageInput.style.display === "none" ? "block" : "none";
    if (messageInput.style.display === "block") messageInput.focus();
  });

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
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const all = ["name", "suburb", "mobile", "email"];
    const ok = all.every((k) =>
      container.querySelector(`#perk-${k}`).classList.contains("unlocked")
    );
    if (!ok) {
      alert("⚠️ Please complete all fields to unlock all perks before submitting.");
      return;
    }
    const payload = {
      name: nameInput.value.trim(),
      suburb: suburbInput.value.trim(),
      mobile: getMobileValue(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      admin: adminEmail,
    };
    try {
      const resp = await fetch(
        "https://cdn-widget.netlify.app/.netlify/functions/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (resp.ok) {
        window.location.href = redirectUrl;
      } else {
        alert("❌ Error sending email");
      }
    } catch (err) {
      alert("⚠️ Network error");
    }
  });
})();
