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
  const typeSound = new Audio("https://cdn-form.netlify.app/typeSound.wav");
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
            <input class="input" id="suburb" name="suburb" placeholder="Suburb or Postcode" />
            <div id="suburb-suggestions" class="suburb-suggestions" style="display:none;"></div>
          </div>

          <div class="field">
            <svg class="iconphone" xmlns="http://www.w3.org/2000/svg" width="19" height="27" viewBox="0 0 19 27" fill="none">
              <path d="M16.25 0.25C17.5703 0.25 18.6875 1.36719 18.6875 2.6875V23.8125C18.6875 25.1836 17.5703 26.25 16.25 26.25H3.25C1.87891 26.25 0.8125 25.1836 0.8125 23.8125V2.6875C0.8125 1.36719 1.87891 0.25 3.25 0.25H16.25ZM12.1875 23C12.1875 22.5938 11.7812 22.1875 11.375 22.1875H8.125C7.66797 22.1875 7.3125 22.5938 7.3125 23C7.3125 23.457 7.66797 23.8125 8.07422 23.8125H11.375C11.7812 23.8125 12.1875 23.457 12.1875 23Z" fill="#D4D4D4"/>
            </svg>
            <input class="input" id="cdn_mobile" name="cdn_mobile" placeholder="Mobile" inputmode="numeric" maxlength="10" />
          </div>

          <div class="field email-group">
            <svg class="iconemail" xmlns="http://www.w3.org/2000/svg" width="26" height="20" viewBox="0 0 26 20" fill="none">
              <path d="M23.5625 0.5C24.8828 0.5 26 1.61719 26 2.9375C26 3.75 25.5938 4.46094 24.9844 4.91797L13.9648 13.1953C13.3555 13.6523 12.5938 13.6523 11.9844 13.1953L0.964844 4.91797C0.355469 4.46094 0 3.75 0 2.9375C0 1.61719 1.06641 0.5 2.4375 0.5H23.5625ZM11.0195 14.5156C12.1875 15.3789 13.7617 15.3789 14.9297 14.5156L26 6.1875V16.75C26 18.5781 24.5273 20 22.75 20H3.25C1.42188 20 0 18.5781 0 16.75V6.1875L11.0195 14.5156Z" fill="#D4D4D4"/>
            </svg>
            <input class="input email-input" id="cdn_email" name="cdn_email" placeholder="Email" />
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
        <p class="paragperk">Each perk unlocks when you complete its matching field on the left</p>
        <div id="perk-name" class="perk"><span class="uns">Unlock by completing Name</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">Free Installation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">We'll install your blinds with no charge</div></div></div>
        <div id="perk-suburb" class="perk"><span class="uns">Unlock by completing Suburb</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">10% Off Coupon <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Applies to your first order with us</div></div></div>
        <div id="perk-mobile" class="perk"><span class="uns">Unlock by completing Mobile</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">Extended Warranty (2x) <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Twice the warranty period for curtains and blinds</div></div></div>
        <div id="perk-email" class="perk"><span class="uns">Unlock by completing Email</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">Free Measure • Quote • Consultation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Book a visit with zero obligation</div></div></div>
      </div>
    </div>
  `;

  // --- Helpers ---
  function safePlay(audio) {
    if (!soundEnabled) return;
    try { audio.currentTime = 0; audio.play(); } catch {}
  }

  const form = container.querySelector("#customForm");
  const nameInput = container.querySelector("#cdn_name");
  const suburbInput = container.querySelector("#suburb");
  const suburbSuggestions = container.querySelector("#suburb-suggestions");
  const mobileInput = container.querySelector("#cdn_mobile");
  const emailInput = container.querySelector("#cdn_email");
  const emailDomain = container.querySelector("#emailDomain");
  const messageInput = container.querySelector("#cdn_message");
  const btnMsg = container.querySelector("#btnMsg");
  const btnClaim = container.querySelector("#btnClaim");
  const iconname = container.querySelector(".iconname");
  const iconemail = container.querySelector(".iconemail");
  const iconphone = container.querySelector(".iconphone");
  const iconlocation = container.querySelector(".iconlocation");

  // --- Name unlock ---
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

  const inputs = container.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("input", () => safePlay(typeSound));
  });
  // --- Suburb autocomplete ---
  suburbInput.addEventListener("input", async () => {
    const query = suburbInput.value.trim();
    if (query.length < 2) {
      suburbSuggestions.innerHTML = "";
      suburbSuggestions.style.display = "none";
      return;
    }
    const res = await fetch("https://cdn-form.netlify.app/.netlify/functions/get-suburbs").catch(() => null);
    if (!res || !res.ok) return;
    const allData = await res.json();
    const matches = allData.filter(
      (i) => i.suburb.toLowerCase().includes(query.toLowerCase()) || i.postcode.includes(query)
    );
    suburbSuggestions.innerHTML = "";
    matches.slice(0, 10).forEach((place) => {
      const div = document.createElement("div");
      div.className = "suggestion";
      div.textContent = `${place.suburb}, ${place.state} ${place.postcode}`;
      div.onclick = () => {
        suburbInput.value = div.textContent;
        suburbSuggestions.innerHTML = "";
        suburbSuggestions.style.display = "none";
        unlockPerk("suburb");
      };
      suburbSuggestions.appendChild(div);
    });
    suburbSuggestions.style.display = matches.length ? "block" : "none";
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

  // --- Mobile input logic ---
  mobileInput.addEventListener("focus", () => {
    if (!mobileInput.value.startsWith("04")) {
      mobileInput.value = "04";
    }
  });

  mobileInput.addEventListener("input", () => {
    safePlay(typeSound);
    mobileInput.value = mobileInput.value.replace(/\D/g, "");
  });

  mobileInput.addEventListener("blur", () => {
    if (mobileInput.value.trim() === "04" || mobileInput.value.trim().length < 10) {
      mobileInput.value = "";
      lockPerk("mobile");
      mobileInput.classList.remove("unlocked-input");
      iconphone.classList.remove("iconcolored");
    } else {
      unlockPerk("mobile");
      mobileInput.classList.add("unlocked-input");
      iconphone.classList.add("iconcolored");
    }
  });

  // --- Email unlock ---
  emailDomain.addEventListener("change", () => {
    const domain = emailDomain.value;
    const local = (emailInput.value.split("@")[0] || "").trim();
    if (domain) {
      emailInput.value = local ? `${local}${domain}` : `you${domain}`;
      unlockPerk("email");
      iconemail.classList.add("iconcolored");
      emailInput.classList.add("unlocked-input");
      emailDomain.classList.add("unlocked-input");
    } else if (!emailInput.value.includes("@")) {
      lockPerk("email");
      iconemail.classList.remove("iconcolored");
      emailInput.classList.remove("unlocked-input");
      emailDomain.classList.remove("unlocked-input");
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) {
      unlockPerk("email");
      iconemail.classList.add("iconcolored");
      emailInput.classList.add("unlocked-input");
    } else {
      lockPerk("email");
      iconemail.classList.remove("iconcolored");
      emailInput.classList.remove("unlocked-input");
    }
  });

  // --- Message toggle ---
  btnMsg.addEventListener("click", () => {
    messageInput.style.display = messageInput.style.display === "none" ? "block" : "none";
    if (messageInput.style.display === "block") messageInput.focus();
  });

  messageInput.addEventListener("input", () => {
    safePlay(typeSound);
    if (messageInput.value.trim().length > 0) {
      btnMsg.style.display = "none";
      btnClaim.classList.add("btn-merged");
    } else {
      btnMsg.style.display = "";
      btnClaim.classList.remove("btn-merged");
    }
  });

  // --- Perk unlock functions ---
  function unlockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    if (perk && !perk.classList.contains("unlocked")) {
      perk.classList.add("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.innerHTML = `<img src="https://cdn-form.netlify.app/unlock.png">`;
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
      if (icon) icon.innerHTML = `<img src="https://cdn-form.netlify.app/lock.png">`;
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "none";
    }
  }

  // --- Submit ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const all = ["name", "suburb", "mobile", "email"];
    const ok = all.every((k) => container.querySelector(`#perk-${k}`).classList.contains("unlocked"));
    if (!ok) {
      alert("⚠️ Please complete all fields to unlock all perks before submitting.");
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      suburb: suburbInput.value.trim(),
      mobile: mobileInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
      admin: adminEmail,
    };

    try {
      const resp = await fetch("https://cdn-form.netlify.app/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const leftsection = container.querySelector(".form-left");
        leftsection.innerHTML = `<div class="thankyou-message"><img src="https://cdn-form.netlify.app/_Layer_.png"><p>Thank you and congratulations, <span>we’ll send this shortly.</span></p></div>`;
      } else {
        alert("❌ Error sending email");
      }
    } catch (err) {
      alert("⚠️ Network error");
    }
  });
})();
