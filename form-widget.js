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
  const sounds = {
    typing: new Audio("https://cdn-form.netlify.app/Typing-Sound.mp3"),
    backspace: new Audio("https://cdn-form.netlify.app/BackSpace.mp3"),
    selection: new Audio("https://cdn-form.netlify.app/Selection-Confirmation.mp3"),
    formFull: new Audio("https://cdn-form.netlify.app/Form-Fully-Filled.mp3"),
    msgbtn : new Audio("https://cdn-form.netlify.app/message-btn.mp3"),
  };

  for (let key in sounds) {
    sounds[key].volume = 0.6;
  }

  let soundEnabled = true;
  function safePlay(audio) {
    if (!soundEnabled) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch {}
  }

  // --- HTML (unchanged structure besides select options text) ---
  container.innerHTML = `
    <div class="form-widget">
    <div class="main-border"></div>
      <div class="form-left">
        <div class="title">Extra Warranty Perks <span>Curtains, Blinds & Shutters</span></div>
        <div class="subtitle">Fill in your details to reveal exclusive bonuses for your project</div>

        <form id="customForm" autocomplete="off">
          <div class="field">
            <svg class="iconname" xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
              <path d="M13 0.25C20.1602 0.25 26 6.08984 26 13.25C26 20.4609 20.1602 26.25 13 26.25C5.78906 26.25 0 20.4609 0 13.25C0 6.08984 5.78906 0.25 13 0.25ZM13 6.75C10.9688 6.75 9.34375 8.42578 9.34375 10.4062C9.34375 12.4375 10.9688 14.0625 13 14.0625C14.9805 14.0625 16.6562 12.4375 16.6562 10.4062C16.6562 8.42578 14.9805 6.75 13 6.75ZM13 23C15.6406 23 18.0781 21.9336 19.8555 20.1562C19.043 18.0234 17.0117 16.5 14.625 16.5H11.375C8.9375 16.5 6.90625 18.0234 6.09375 20.1562C7.87109 21.9336 10.3086 23 13 23Z" fill="#05967D"/>
            </svg>
            <input class="input" id="cdn_name" name="cdn_name" placeholder="Your Name" required/>
            <span class="border"></span>
          </div>

          <div class="field" style="position:relative;">
            <svg class="iconlocation" xmlns="http://www.w3.org/2000/svg" width="20" height="27" viewBox="0 0 20 27" fill="none">
              <path d="M8.53125 25.6406C5.89062 22.3398 0 14.4688 0 10C0 4.61719 4.31641 0.25 9.75 0.25C15.1328 0.25 19.5 4.61719 19.5 10C19.5 14.4688 13.5586 22.3398 10.918 25.6406C10.3086 26.4023 9.14062 26.4023 8.53125 25.6406ZM9.75 13.25C11.5273 13.25 13 11.8281 13 10C13 8.22266 11.5273 6.75 9.75 6.75C7.92188 6.75 6.5 8.22266 6.5 10C6.5 11.8281 7.92188 13.25 9.75 13.25Z" fill="#D4D4D4"/>
            </svg>
            <input class="input" id="suburb" name="suburb" placeholder="Suburb or Postcode" required/>
            <span class="border"></span>
            <div id="suburb-suggestions" class="suburb-suggestions" style="display:none;"></div>
          </div>

          <div class="field mobile-field" style="position:relative;">
            <svg class="iconphone" xmlns="http://www.w3.org/2000/svg" width="19" height="27" viewBox="0 0 19 27" fill="none">
              <path d="M16.25 0.25C17.5703 0.25 18.6875 1.36719 18.6875 2.6875V23.8125C18.6875 25.1836 17.5703 26.25 16.25 26.25H3.25C1.87891 26.25 0.8125 25.1836 0.8125 23.8125V2.6875C0.8125 1.36719 1.87891 0.25 3.25 0.25H16.25ZM12.1875 23C12.1875 22.5938 11.7812 22.1875 11.375 22.1875H8.125C7.66797 22.1875 7.3125 22.5938 7.3125 23C7.3125 23.457 7.66797 23.8125 8.07422 23.8125H11.375C11.7812 23.8125 12.1875 23.457 12.1875 23Z" fill="#D4D4D4"/>
            </svg>
            <div class="mobile-boxes-wrap">
              <input class="input mobile-input" id="cdn_mobile" name="cdn_mobile" placeholder="Mobile" inputmode="numeric" maxlength="10" required/>
              <span class="border"></span>
              <!-- digit boxes are injected by JS on focus -->
            </div>
          </div>

          <div class="field email-group">
            <svg class="iconemail" xmlns="http://www.w3.org/2000/svg" width="26" height="20" viewBox="0 0 26 20" fill="none">
              <path d="M23.5625 0.5C24.8828 0.5 26 1.61719 26 2.9375C26 3.75 25.5938 4.46094 24.9844 4.91797L13.9648 13.1953C13.3555 13.6523 12.5938 13.6523 11.9844 13.1953L0.964844 4.91797C0.355469 4.46094 0 3.75 0 2.9375C0 1.61719 1.06641 0.5 2.4375 0.5H23.5625ZM11.0195 14.5156C12.1875 15.3789 13.7617 15.3789 14.9297 14.5156L26 6.1875V16.75C26 18.5781 24.5273 20 22.75 20H3.25C1.42188 20 0 18.5781 0 16.75V6.1875L11.0195 14.5156Z" fill="#D4D4D4"/>
            </svg>
            <input class="input email-input" id="cdn_email" name="cdn_email" placeholder="Email" required />
            <span class="border border-right"></span>
            <select class="email-select" id="emailDomain">
               <option value="">@ (optional)</option>
              <option value="@gmail.com">@gmail.com</option>
              <option value="@hotmail.com">@hotmail.com</option>
              <option value="@yahoo.com">@yahoo.com</option>
              <option value="@outlook.com">@outlook.com</option>
              <option value="@bigpond.com">@bigpond.com</option>
              <option value="@live.com">@live.com</option>
              <option value="@icloud.com">@icloud.com</option>
              <option value="@yahoo.com.au">@yahoo.com.au</option>
            </select>
            <span class="border border-left"></span>
          </div>

          <div class="field">
            <textarea style="display:none" class="textarea" id="cdn_message" name="cdn_message" placeholder="Leave a message"></textarea>
            <div id="msg-limit-notice" style="
              opacity: 0;
              color: #b71c1c; 
              background: #ffebee; 
              padding: 6px 10px; 
              margin-top: 5px; 
              border-radius: 4px; 
              font-size: 13px;
              transition: opacity 0.5s ease;
              pointer-events: none;
              display: none;
            ">
              Max message size reached (600 characters)
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-msg" id="btnMsg">Leave A Message 💬</button>
            <button type="submit" class="btn btn-claim" id="btnClaim">Claim Bonus <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
<path d="M26 1.92969L22.75 23.0039C22.6992 23.5117 22.3945 23.9688 21.9375 24.2227C21.6836 24.3242 21.4297 24.4258 21.125 24.4258C20.9219 24.4258 20.7188 24.375 20.5156 24.2734L14.3203 21.6836L11.7305 25.543C11.5273 25.8984 11.1719 26.0508 10.8164 26.0508C10.2578 26.0508 9.80078 25.5938 9.80078 25.0352V20.1602C9.80078 19.7539 9.90234 19.3984 10.1055 19.1445L21.1758 4.92578L6.24609 18.3828L1.01562 16.1992C0.457031 15.9453 0.0507812 15.4375 0.0507812 14.7773C0 14.0664 0.304688 13.5586 0.863281 13.2539L23.6133 0.304688C24.1211 0 24.832 0 25.3398 0.355469C25.8477 0.710938 26.1016 1.32031 26 1.92969Z" fill="white"/>
</svg></button>
          </div>
        </form>
      </div>

      <div class="perks">
        <div class="heading">Your Perks</div>
        <p class="paragperk">Each perk unlocks when you complete its matching field on the left</p>
        <div id="perk-name" class="perk"><span class="uns">Unlock by completing Name</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">Free Installation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">We'll install your blinds with no charge</div></div></div>
        <div id="perk-suburb" class="perk"><span class="uns">Unlock by completing Suburb</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">10% Off Coupon <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Applies to your first order with us</div></div></div>
        <div id="perk-mobile" class="perk"><span class="uns">Unlock by completing Mobile</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">Extended Warranty (2x) <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Twice the warranty period for curtains, blinds and shutters</div></div></div>
        <div id="perk-email" class="perk"><span class="uns">Unlock by completing Email</span><div class="icon"><img src="https://cdn-form.netlify.app/lock.png"></div><div class="meta"><div class="title">Free Measure • Quote • Consultation <span class="badge" style="display:none">Now unlocked</span></div><div class="desc">Book a visit with zero obligation</div></div></div>
        <span class="limittext">Limited Time Only | Valid For 12 Months</span>
      </div>
    </div>
  `;

  // --- Helper functions ---
  function allPerksUnlocked() {
    return ["name", "suburb", "mobile", "email"].every(k =>
      container.querySelector(`#perk-${k}`).classList.contains("unlocked")
    );
  }

  const form = container.querySelector("#customForm");
  const nameInput = container.querySelector("#cdn_name");
  const suburbInput = container.querySelector("#suburb");
  const suburbSuggestions = container.querySelector("#suburb-suggestions");
  const mobileInput = container.querySelector("#cdn_mobile");
  const mobileWrap = container.querySelector(".mobile-boxes-wrap");
  const emailInput = container.querySelector("#cdn_email");
  const emailDomain = container.querySelector("#emailDomain");
  const messageInput = container.querySelector("#cdn_message");
  const btnMsg = container.querySelector("#btnMsg");
  const btnClaim = container.querySelector("#btnClaim");
  const iconname = container.querySelector(".iconname");
  const iconemail = container.querySelector(".iconemail");
  const iconphone = container.querySelector(".iconphone");
  const iconlocation = container.querySelector(".iconlocation");
  const msgNotice = container.querySelector("#msg-limit-notice");

  window.addEventListener('DOMContentLoaded', () => {
      document.querySelector('.form-widget').classList.add('loaded');
  });

  // add focus/filled class on parent .field for unified border animation
  function setFieldFocused(input, focused) {
    const fld = input.closest(".field");
    if (!fld) return;
    if (focused) fld.classList.add("focused");
    else fld.classList.remove("focused");
  }
  function setFieldFilled(input, filled) {
    const fld = input.closest(".field");
    if (!fld) return;
    if (filled) fld.classList.add("filled");
    else fld.classList.remove("filled");
  }

  // --- Typing and backspace sounds ---
  const inputs = container.querySelectorAll("input, textarea, select");
  inputs.forEach(input => {
    input.addEventListener("input", e => {
      if (e.inputType === "deleteContentBackward") safePlay(sounds.backspace);
      else safePlay(sounds.typing);

      // keep field filled class up to date
      setFieldFilled(input, !!input.value && input.value.trim() !== "");
    });
    input.addEventListener("focus", () => {
      setFieldFocused(input, true);
    });
    input.addEventListener("blur", () => {
      setFieldFocused(input, false);
      setFieldFilled(input, !!input.value && input.value.trim() !== "");
    });
  });

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
        // 5) after selecting suburb auto-focus mobile
        setTimeout(() => {
          mobileInput.focus();
        }, 40);
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

  // --- Mobile Input: Boxed Display + grouping + caret hiding + auto-advance ---
  function createDigitBoxesContainer() {
    let boxes = mobileWrap.querySelector(".digit-boxes");
    if (!boxes) {
      boxes = document.createElement("div");
      boxes.className = "digit-boxes";
      mobileWrap.appendChild(boxes);
    }
    return boxes;
  }

  function updateDigitBoxesFromValue(value) {
    const boxes = createDigitBoxesContainer();
    boxes.innerHTML = "";

    const digits = (value || "").split("");

    for (let i = 0; i < 10; i++) {
      const d = document.createElement("div");
      d.className = "digit-box";

      // Prefill "0" and "4"
      if (i === 0) {
        d.textContent = digits[0] || "0";
      } else if (i === 1) {
        d.textContent = digits[1] || "4";
      } else {
        d.textContent = digits[i] || "";
      }

      // Filled boxes
      if (digits[i]) d.classList.add("filled");

      // Active next box
      if (i === digits.length) d.classList.add("active-box");

      // Click to focus
      d.addEventListener("click", () => mobileInput.focus());

      boxes.appendChild(d);

      // GROUPING FOR 04 33-222-222
      // break after: 2nd digit, 4th digit, 7th digit
      if ( i === 3 || i === 6) {
        const dash = document.createElement("div");
        dash.className = "digit-dash";
        dash.textContent = "-";
        boxes.appendChild(dash);
      }
    }

    // Hide caret when only "04"
    if (value === "04" || value.length <= 2) {
      mobileInput.style.caretColor = "transparent";
    } else {
      mobileInput.style.caretColor = "";
    }
  }


  function removeDigitBoxes() {
    const boxes = mobileWrap.querySelector(".digit-boxes");
    if (boxes) boxes.remove();
    mobileInput.style.caretColor = ""; // reset
  }
  // When focusing mobile:
  mobileInput.addEventListener("focus", () => {
    // if not already starting with 04, prefill 04
    if (!mobileInput.value.startsWith("04")) {
      mobileInput.value = "04";
    }
    updateDigitBoxesFromValue(mobileInput.value);
    mobileWrap.classList.add("mobile-active");
    setFieldFocused(mobileInput, true);
    setFieldFilled(mobileInput, true);
  });

  // Mirror typed value to digit boxes + sounds + auto-advance
  mobileInput.addEventListener("input", (e) => {
    // keep only digits
    mobileInput.value = mobileInput.value.replace(/\D/g, "");
    // limit to 10
    if (mobileInput.value.length > 10) mobileInput.value = mobileInput.value.slice(0, 10);
    updateDigitBoxesFromValue(mobileInput.value);

    // If deletion/backspace
    if (e.inputType === "deleteContentBackward") safePlay(sounds.backspace);
    else safePlay(sounds.typing);

    // 4) once 10th digit typed auto-focus email
    if (mobileInput.value.length === 10) {
      // small delay so DOM updates show final digit
      setTimeout(() => {
        removeDigitBoxes();
        setFieldFilled(mobileInput, true);
        unlockPerk("mobile");
        mobileInput.classList.add("unlocked-input");
        iconphone.classList.add("iconcolored");
        // focus email
        emailInput.focus();
      }, 120);
    }
  });

  // On blur: if still just 04 or too short, clear; otherwise keep value and show normal input (remove boxes).
  mobileInput.addEventListener("blur", () => {
    mobileWrap.classList.remove("mobile-active");
    setFieldFocused(mobileInput, false);

    const val = mobileInput.value.trim();
    if (val === "04" || val.length < 10) {
      mobileInput.value = "";
      removeDigitBoxes();
      setFieldFilled(mobileInput, false);
      lockPerk("mobile");
      mobileInput.classList.remove("unlocked-input");
      iconphone.classList.remove("iconcolored");
    } else {
      // valid: keep value in input, remove boxes and show normal input display
      removeDigitBoxes();
      setFieldFilled(mobileInput, true);
      unlockPerk("mobile");
      mobileInput.classList.add("unlocked-input");
      iconphone.classList.add("iconcolored");
    }
  });

  // If the page is clicked anywhere inside mobileWrap we focus input (ease)
  mobileWrap.addEventListener("click", (e) => {
    if (e.target.classList.contains("digit-boxes") || e.target.classList.contains("digit-box")) {
      mobileInput.focus();
    }
  });

  // Keep boxes synced if script sets mobileInput.value programmatically
  function setMobileValueProgrammatically(v) {
    mobileInput.value = (v || "").replace(/\D/g, "").slice(0, 10);
    updateDigitBoxesFromValue(mobileInput.value);
    setFieldFilled(mobileInput, !!mobileInput.value);
  }

  // --- Email unlock & unified animation behavior (8 & 6) ---
  emailDomain.addEventListener("change", () => {
    const domain = emailDomain.value;
    const local = (emailInput.value.split("@")[0] || "").trim();
    if (domain) {
      emailInput.value = local ? `${local}${domain}` : `you${domain}`;
      unlockPerk("email");
      iconemail.classList.add("iconcolored");
      emailInput.classList.add("unlocked-input");
      emailDomain.classList.add("unlocked-input");
      setFieldFilled(emailInput, true);
    } else if (!emailInput.value.includes("@")) {
      lockPerk("email");
      iconemail.classList.remove("iconcolored");
      emailInput.classList.remove("unlocked-input");
      emailDomain.classList.remove("unlocked-input");
      setFieldFilled(emailInput, false);
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.includes("@")) {
      unlockPerk("email");
      iconemail.classList.add("iconcolored");
      emailInput.classList.add("unlocked-input");
      emailDomain.classList.add("unlocked-input");
      setFieldFilled(emailInput, true);
    } else {
      lockPerk("email");
      iconemail.classList.remove("iconcolored");
      emailInput.classList.remove("unlocked-input");
      emailDomain.classList.remove("unlocked-input");
      setFieldFilled(emailInput, false);
    }
  });

  // ensure focus on either input or select counts as focusing the parent .field:
  emailInput.addEventListener("focus", () => setFieldFocused(emailInput, true));
  emailDomain.addEventListener("focus", () => setFieldFocused(emailDomain, true));
  emailDomain.addEventListener("blur", () => setFieldFocused(emailDomain, false));

  // --- Message toggle ---
  btnMsg.addEventListener("click", () => {
    const isOpening = messageInput.style.display === "none";

    // Toggle visibility
    messageInput.style.display = isOpening ? "block" : "none";
    msgNotice.style.display = isOpening ? "block" : "none";

    // Play sound ONLY when opening
    if (isOpening) {
      safePlay(sounds.msgbtn);
      messageInput.focus();
    }
  });

  messageInput.addEventListener("input", () => {
    if (messageInput.value.length >= 600) {
      messageInput.value = messageInput.value.slice(0, 600);
      msgNotice.style.opacity = 1; // fade in
    } else {
      msgNotice.style.opacity = 0; // fade out
    }

    // hide/show claim/message buttons as before
    if (messageInput.value.trim().length > 0) {
      btnMsg.style.display = "none";
      messageInput.classList.add("unlocked-input-textarea");
      btnClaim.classList.add("btn-merged");
      btnClaim.innerHTML = `
        Send Message & Claim Bonus
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
          <path d="M26 1.92969L22.75 23.0039C22.6992 23.5117 22.3945 23.9688 21.9375 24.2227C21.6836 24.3242 21.4297 24.4258 21.125 24.4258C20.9219 24.4258 20.7188 24.375 20.5156 24.2734L14.3203 21.6836L11.7305 25.543C11.5273 25.8984 11.1719 26.0508 10.8164 26.0508C10.2578 26.0508 9.80078 25.5938 9.80078 25.0352V20.1602C9.80078 19.7539 9.90234 19.3984 10.1055 19.1445L21.1758 4.92578L6.24609 18.3828L1.01562 16.1992C0.457031 15.9453 0.0507812 15.4375 0.0507812 14.7773C0 14.0664 0.304688 13.5586 0.863281 13.2539L23.6133 0.304688C24.1211 0 24.832 0 25.3398 0.355469C25.8477 0.710938 26.1016 1.32031 26 1.92969Z" fill="white"/>
        </svg>
      `;
    } else {
      messageInput.classList.remove("unlocked-input-textarea");
      btnMsg.style.display = "";
      btnClaim.classList.remove("btn-merged");
      btnClaim.innerHTML = `
        Claim Bonus
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
          <path d="M26 1.92969L22.75 23.0039C22.6992 23.5117 22.3945 23.9688 21.9375 24.2227C21.6836 24.3242 21.4297 24.4258 21.125 24.4258C20.9219 24.4258 20.7188 24.375 20.5156 24.2734L14.3203 21.6836L11.7305 25.543C11.5273 25.8984 11.1719 26.0508 10.8164 26.0508C10.2578 26.0508 9.80078 25.5938 9.80078 25.0352V20.1602C9.80078 19.7539 9.90234 19.3984 10.1055 19.1445L21.1758 4.92578L6.24609 18.3828L1.01562 16.1992C0.457031 15.9453 0.0507812 15.4375 0.0507812 14.7773C0 14.0664 0.304688 13.5586 0.863281 13.2539L23.6133 0.304688C24.1211 0 24.832 0 25.3398 0.355469C25.8477 0.710938 26.1016 1.32031 26 1.92969Z" fill="white"/>
        </svg>
      `;
    }
  });


  // --- Perk unlock functions ---
  function unlockPerk(key) {
    const perk = container.querySelector(`#perk-${key}`);
    const wasLocked = !perk.classList.contains("unlocked");
    if (perk && wasLocked) {
      perk.classList.add("unlocked");
      const icon = perk.querySelector(".icon");
      if (icon) icon.innerHTML = `<img src="https://cdn-form.netlify.app/unlock.png">`;
      const badge = perk.querySelector(".badge");
      if (badge) badge.style.display = "inline-block";
      safePlay(sounds.selection);

      // play "form fully filled" sound once all perks unlocked
      if (allPerksUnlocked()) {
        safePlay(sounds.formFull);
        // animate claim button
        btnClaim.classList.add("all-unlocked");
        btnClaim.classList.add("btn-claim-pulse");
      }
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
      // remove claim unlocked style if not all unlocked
      if (!allPerksUnlocked()) btnClaim.classList.remove("all-unlocked");
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
