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
  container.innerHTML = `
    <div class="form-widget">
      <div class="form-left">
        <div class="title">Extra Warranty Perks</div>
        <div class="subtitle">Curtains & Blinds — Fill in your details to reveal exclusive bonuses for your project</div>

        <form id="customForm" autocomplete="off">
          <div class="field">
            <svg class="iconname" xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
              <path d="M13 0.25C20.1602 0.25 26 6.08984 26 13.25C26 20.4609 20.1602 26.25 13 26.25C5.78906 26.25 0 20.4609 0 13.25C0 6.08984 5.78906 0.25 13 0.25ZM13 6.75C10.9688 6.75 9.34375 8.42578 9.34375 10.4062C9.34375 12.4375 10.9688 14.0625 13 14.0625C14.9805 14.0625 16.6562 12.4375 16.6562 10.4062C16.6562 8.42578 14.9805 6.75 13 6.75ZM13 23C15.6406 23 18.0781 21.9336 19.8555 20.1562C19.043 18.0234 17.0117 16.5 14.625 16.5H11.375C8.9375 16.5 6.90625 18.0234 6.09375 20.1562C7.87109 21.9336 10.3086 23 13 23Z" fill="#05967D"/>
            </svg>
            <input class="input" id="cdn_name" name="cdn_name" placeholder="Your Name" />
          </div>

          <div class="field" style="position:relative;">
            <svg class="iconlocation" xmlns="http://www.w3.org/2000/svg" width="20" height="27" viewBox="0 0 20 27" fill="none">
              <path d="M8.53125 25.6406C5.89062 22.3398 0 14.4688 0 10C0 4.61719 4.31641 0.25 9.75 0.25C15.1328 0.25 19.5 4.61719 19.5 10C19.5 14.4688 13.5586 22.3398 10.918 25.6406C10.3086 26.4023 9.14062 26.4023 8.53125 25.6406ZM9.75 13.25C11.5273 13.25 13 11.8281 13 10C13 8.22266 11.5273 6.75 9.75 6.75C7.92188 6.75 6.5 8.22266 6.5 10C6.5 11.8281 7.92188 13.25 9.75 13.25Z" fill="#D4D4D4"/>
            </svg>
            <input class="input" id="suburb" name="suburb" placeholder="Suburb or Postcode (Australia)" />
            <div id="suburb-suggestions" class="suburb-suggestions" style="display:none;"></div>
          </div>

          <div class="field mobile-row">
            <div class="mobile-prefix">
              <svg class="iconphone" xmlns="http://www.w3.org/2000/svg" width="19" height="27" viewBox="0 0 19 27" fill="none">
                <path d="M16.25 0.25C17.5703 0.25 18.6875 1.36719 18.6875 2.6875V23.8125C18.6875 25.1836 17.5703 26.25 16.25 26.25H3.25C1.87891 26.25 0.8125 25.1836 0.8125 23.8125V2.6875C0.8125 1.36719 1.87891 0.25 3.25 0.25H16.25ZM12.1875 23C12.1875 22.5938 11.7812 22.1875 11.375 22.1875H8.125C7.66797 22.1875 7.3125 22.5938 7.3125 23C7.3125 23.457 7.66797 23.8125 8.07422 23.8125H11.375C11.7812 23.8125 12.1875 23.457 12.1875 23Z" fill="#D4D4D4"/>
              </svg>
              04
            </div>
            <div class="mobile-boxes" id="mobile-boxes"></div>
          </div>

          <div class="field email-group">
            <svg class="iconemail" xmlns="http://www.w3.org/2000/svg" width="26" height="20" viewBox="0 0 26 20" fill="none">
              <path d="M23.5625 0.5C24.8828 0.5 26 1.61719 26 2.9375C26 3.75 25.5938 4.46094 24.9844 4.91797L13.9648 13.1953C13.3555 13.6523 12.5938 13.6523 11.9844 13.1953L0.964844 4.91797C0.355469 4.46094 0 3.75 0 2.9375C0 1.61719 1.06641 0.5 2.4375 0.5H23.5625ZM11.0195 14.5156C12.1875 15.3789 13.7617 15.3789 14.9297 14.5156L26 6.1875V16.75C26 18.5781 24.5273 20 22.75 20H3.25C1.42188 20 0 18.5781 0 16.75V6.1875L11.0195 14.5156Z" fill="#D4D4D4"/>
            </svg>
            <input class="input email-input" id="cdn_email" name="cdn_email" placeholder="Email (you@domain.com)" />
            <select class="email-select" id="emailDomain">
              <option value="">Select domain (optional)</option>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@hotmail.com">@hotmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@outlook.com">@outlook.com</option>
            </select>
          </div>

          <div class="field">
            <textarea style="display:none" class="textarea" id="cdn_message" name="cdn_message" placeholder="Leave a message"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-msg" id="btnMsg">Leave A Message 💬</button>
            <button type="submit" class="btn btn-claim" id="btnClaim">Claim Bonus 🚀</button>
          </div>
        </form>
      </div>

      <div class="perks">
        <div class="heading">Your Perks</div>
        <div class="lineperks">
          <p class="paragperk">Each perk unlocks when you complete its matching field on the left</p>
          <div class="lineperk" id="soundToggle">
            <!-- Sound Off Icon (default) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52" fill="none">
              <foreignObject x="-8" y="-8" width="68" height="68"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(4px);clip-path:url(#bgblur_0_154_830_clip_path);height:100%;width:100%"></div></foreignObject>
              <circle cx="26" cy="26" r="25" fill="url(#paint0_linear_154_830)" fill-opacity="0.53" stroke="url(#paint1_linear_154_830)" stroke-opacity="0.7" stroke-width="2"/>
              <path d="M27.2526 36.5057C26.9861 36.5057 26.7236 36.4011 26.5278 36.2053L21.7019 31.3794H19.0505C17.9197 31.3794 17 30.4597 17 29.3288V23.1773C17 22.0464 17.9197 21.1267 19.0505 21.1267H21.7019L26.5278 16.3008C26.821 16.0066 27.2619 15.9194 27.6453 16.0783C28.0288 16.2372 28.2779 16.6115 28.2779 17.0257V35.4804C28.2779 35.8946 28.0288 36.2688 27.6453 36.4278C27.5182 36.48 27.3849 36.5057 27.2526 36.5057Z" fill="white"/>
              <path d="M30.1479 23.4796C29.7476 23.8799 29.7476 24.529 30.1479 24.9293L31.4735 26.255L30.1479 27.5786C29.7476 27.979 29.7476 28.628 30.1479 29.0284C30.5482 29.4287 31.1973 29.4287 31.5977 29.0284L32.9233 27.7028L34.2489 29.0284C34.6493 29.4287 35.2983 29.4287 35.6987 29.0284C36.099 28.628 36.099 27.979 35.6987 27.5786L34.3731 26.255L35.6987 24.9293C36.099 24.529 36.099 23.8799 35.6987 23.4796C35.2318 23.0127 34.6191 23.1094 34.2489 23.4796L32.9233 24.8052L31.5977 23.4796C31.1465 23.0284 30.5458 23.0816 30.1479 23.4796Z" fill="white"/>
              <defs>
                <linearGradient id="paint0_linear_154_830" x1="19" y1="1" x2="43" y2="4" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0C3F25"/>
                  <stop offset="1" stop-color="#1FA560"/>
                </linearGradient>
                <linearGradient id="paint1_linear_154_830" x1="1" y1="26" x2="51" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2FC585"/>
                  <stop offset="0.5" stop-color="#9FFFAB"/>
                  <stop offset="1" stop-color="#4ECE97"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div id="perk-name" class="perk"><span class="uns">Unlock by completing Name</span><div class="icon"><img src="https://cdn-widget.netlify.app/lock.png"></div><div class="meta"><div class="title">Free Installation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">We'll install your blinds with no charge</div></div></div>
        <div id="perk-suburb" class="perk"><span class="uns">Unlock by completing Suburb</span><div class="icon"><img src="https://cdn-widget.netlify.app/lock.png"></div><div class="meta"><div class="title">10% Off Coupon <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Applies to your first order with us</div></div></div>
        <div id="perk-mobile" class="perk"><span class="uns">Unlock by completing Mobile</span><div class="icon"><img src="https://cdn-widget.netlify.app/lock.png"></div><div class="meta"><div class="title">Extended Warranty (2x) <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Twice the warranty period for curtains and blinds</div></div></div>
        <div id="perk-email" class="perk"><span class="uns">Unlock by completing Email</span><div class="icon"><img src="https://cdn-widget.netlify.app/lock.png"></div><div class="meta"><div class="title">Free Measure • Quote • Consultation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Book a visit with zero obligation</div></div></div>
      </div>
    </div>
  `;
  
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
