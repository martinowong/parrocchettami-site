const wavePaths = Array.from(document.querySelectorAll(".wave-line"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isEnglishPage = document.documentElement.lang === "en";
const assetPath = isEnglishPage ? "../assets/" : "assets/";
const stripeDonationButton = "<stripe-buy-button buy-button-id='buy_btn_1U2U9LBZ7E4J3C2PV20x16Y0' publishable-key='pk_live_51QSmmABZ7E4J3C2PZJ722tiUnINsko8iq7mGpmrBPlGW8NEKcEDpGhbU9Q8T30tfKAvzZQvdubkgQbM4pyCPtM6d00pWv3S7lW'></stripe-buy-button>";
const uiCopy = isEnglishPage ? {
  menu: "Menu",
  openMenu: "Open navigation menu",
  closeMenu: "Close navigation menu",
  close: "Close",
  macOnly: "Mac only",
  macTitle: "Parrocchettami is a Mac app.",
  macDescription: "It requires an Apple Silicon Mac with macOS 14 or later. Send this page to your Mac or keep exploring the site.",
  share: "Share the link",
  copy: "Copy the link",
  phone: "But I really want it on my phone!",
  iphoneKicker: "Parrocchettami on iPhone",
  iphoneTitle: "Would you like Parrocchettami on iPhone too?",
  iphoneDescription: "Publishing an app on the App Store requires the Apple Developer Program and dedicated iOS development resources.",
  iphoneGoal: "A possible next step",
  iphoneGoalText: "If donations cover the Apple Developer Program, I can evaluate an iOS version and, if sustainable, publish it on the App Store.",
  support: "Support the project",
  notNow: "Not now",
  stripe: "Payment handled by Stripe.",
  shareTitle: "Parrocchettami for macOS",
  shareText: "Download Parrocchettami on your Apple Silicon Mac.",
  shared: "Link shared.",
  shareFailed: "Could not open sharing.",
  copied: "Link copied. You can now send it to your Mac.",
  copiedLabel: "Link copied",
  copyLabel: "Copy the link",
  copyFallback: "Copy the address manually from your browser's address bar.",
  downloadNotice: "The download started in a new tab. Here you will find requirements and first-launch instructions.",
  enlargedScreenshot: "Enlarged screenshot",
  closeScreenshot: "Close screenshot",
  previousScreenshot: "Previous screenshot",
  nextScreenshot: "Next screenshot"
} : {
  menu: "Menu",
  openMenu: "Apri il menu di navigazione",
  closeMenu: "Chiudi il menu di navigazione",
  close: "Chiudi",
  macOnly: "Solo per Mac",
  macTitle: "Parrocchettami è un'app per Mac.",
  macDescription: "Richiede un Mac Apple Silicon con macOS 14 o successivo. Invia questa pagina al tuo Mac oppure continua a esplorare il sito.",
  share: "Condividi il link",
  copy: "Copia il link",
  phone: "Ma lo voglio davvero sul telefono!",
  iphoneKicker: "Parrocchettami su iPhone",
  iphoneTitle: "Vuoi Parrocchettami anche su iPhone?",
  iphoneDescription: "Pubblicare un'app sull'App Store richiede l'Apple Developer Program e risorse dedicate allo sviluppo iOS.",
  iphoneGoal: "Un possibile prossimo passo",
  iphoneGoalText: "Se le donazioni copriranno il costo dell'Apple Developer Program, potrò valutare una versione iOS e, se sostenibile, pubblicarla sull'App Store.",
  support: "Sostieni il progetto",
  notNow: "Non ora",
  stripe: "Pagamento gestito da Stripe.",
  shareTitle: "Parrocchettami per macOS",
  shareText: "Scarica Parrocchettami sul tuo Mac Apple Silicon.",
  shared: "Link condiviso.",
  shareFailed: "Non è stato possibile aprire la condivisione.",
  copied: "Link copiato. Ora puoi inviarlo al tuo Mac.",
  copiedLabel: "Link copiato",
  copyLabel: "Copia il link",
  copyFallback: "Copia manualmente l'indirizzo dalla barra del browser.",
  downloadNotice: "Il download è stato avviato in una nuova scheda. Qui trovi requisiti e istruzioni per il primo avvio.",
  enlargedScreenshot: "Screenshot ingrandito",
  closeScreenshot: "Chiudi screenshot",
  previousScreenshot: "Screenshot precedente",
  nextScreenshot: "Screenshot successivo"
};

const siteHeader = document.querySelector(".site-header");
const primaryNavigation = siteHeader?.querySelector(".nav-links");

const languageLink = document.querySelector(".language-link");
const languageHintKey = "parrocchettami-language-hint-dismissed";
const browserLanguages = Array.from(new Set([
  ...(navigator.languages || []),
  navigator.language
].filter(Boolean)));
const browserPrefersEnglish = !isEnglishPage && browserLanguages.some((language) => /^en(?:-|$)/i.test(language));

const isLanguageHintDismissed = () => {
  try {
    return window.localStorage.getItem(languageHintKey) === "1";
  } catch {
    return false;
  }
};

const rememberLanguageHintDismissal = () => {
  try {
    window.localStorage.setItem(languageHintKey, "1");
  } catch {
    // Private browsing can disable localStorage; the hint still dismisses for this page.
  }
};

if (languageLink && browserPrefersEnglish && !isLanguageHintDismissed()) {
  const languageSwitch = document.createElement("span");
  languageSwitch.className = "language-switch";
  languageLink.replaceWith(languageSwitch);
  languageSwitch.appendChild(languageLink);

  const languageHint = document.createElement("div");
  languageHint.className = "language-hint";
  languageHint.id = "language-hint";
  languageHint.setAttribute("role", "status");
  languageHint.innerHTML = `
    <span>English version available</span>
    <button type="button" aria-label="Dismiss language suggestion">×</button>
  `;
  languageSwitch.appendChild(languageHint);
  languageLink.setAttribute("aria-describedby", languageHint.id);

  const dismissLanguageHint = () => {
    rememberLanguageHintDismissal();
    languageLink.removeAttribute("aria-describedby");
    languageHint.remove();
  };

  languageHint.querySelector("button").addEventListener("click", dismissLanguageHint);
  languageLink.addEventListener("click", dismissLanguageHint);
}

if (siteHeader && primaryNavigation) {
  const menuButton = document.createElement("button");
  menuButton.className = "mobile-menu-toggle";
  menuButton.type = "button";
  menuButton.textContent = uiCopy.menu;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", uiCopy.openMenu);
  siteHeader.insertBefore(menuButton, primaryNavigation);

  const closeMenu = () => {
    primaryNavigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", uiCopy.openMenu);
  };

  menuButton.addEventListener("click", () => {
    const willOpen = !primaryNavigation.classList.contains("is-open");
    primaryNavigation.classList.toggle("is-open", willOpen);
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? uiCopy.closeMenu : uiCopy.openMenu);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNavigation.classList.contains("is-open")) {
      closeMenu();
      menuButton.focus();
    }
  });
}

const downloadLinks = Array.from(document.querySelectorAll('a[href*="/releases/"][href$=".dmg"]'));

if (downloadLinks.length > 0) {
  const downloadUrl = downloadLinks[0].href;
  const guideUrl = new URL("download.html", window.location.href);
  const isDownloadPage = window.location.pathname.endsWith("/download.html");
  const isMobileDownloadContext = () => {
    const userAgent = navigator.userAgent || "";
    const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) || iPadOS || window.matchMedia("(max-width: 680px)").matches;
  };

  const mobileDialog = document.createElement("dialog");
  mobileDialog.className = "mobile-download-dialog";
  mobileDialog.setAttribute("aria-labelledby", "mobile-download-dialog-title");
  mobileDialog.innerHTML = `
    <div class="mobile-download-dialog-inner">
      <button class="mobile-download-dialog-close" type="button" aria-label="${uiCopy.close}">×</button>
      <p class="mobile-download-dialog-kicker">${uiCopy.macOnly}</p>
      <h2 id="mobile-download-dialog-title">${uiCopy.macTitle}</h2>
      <p>${uiCopy.macDescription}</p>
      <div class="mobile-download-dialog-actions">
        <button class="button primary" type="button" data-mobile-share>${uiCopy.share}</button>
        <button class="mobile-download-dialog-copy" type="button" data-mobile-copy aria-label="${uiCopy.copy}" title="${uiCopy.copy}"><span aria-hidden="true">⧉</span></button>
      </div>
      <p class="mobile-download-dialog-status" aria-live="polite"></p>
      <a class="mobile-ios-interest" href="#ios-support-dialog" data-ios-support-trigger>${uiCopy.phone}</a>
    </div>
  `;
  document.body.appendChild(mobileDialog);

  const iosSupportDialog = document.createElement("dialog");
  iosSupportDialog.className = "support-dialog ios-support-dialog";
  iosSupportDialog.id = "ios-support-dialog";
  iosSupportDialog.setAttribute("aria-labelledby", "ios-support-dialog-title");
  iosSupportDialog.innerHTML = [
    "<div class='support-dialog-inner'>",
    `  <button class='support-dialog-close' type='button' data-ios-support-close aria-label='${uiCopy.close}'>×</button>`,
    "  <div class='support-dialog-hero'>",
    "    <div class='support-dialog-hero-copy'>",
    `      <p class='support-dialog-kicker'>${uiCopy.iphoneKicker}</p>`,
    `      <h2 id='ios-support-dialog-title'>${uiCopy.iphoneTitle}</h2>`,
    "    </div>",
    `    <div class='support-dialog-mascot' aria-hidden='true'><img src='${assetPath}parrocchettami-donation-mascot.png' alt=''></div>`,
    "  </div>",
    `  <p>${uiCopy.iphoneDescription}</p>`,
    "  <div class='support-dialog-funding'>",
    `    <p class='support-dialog-goal'><strong>${uiCopy.iphoneGoal}</strong>${uiCopy.iphoneGoalText}</p>`,
    "    <div class='support-dialog-payment'>",
    "      <div class='support-dialog-actions'>",
    `        <div class='support-dialog-stripe-button'>${stripeDonationButton}</div>`,
    `        <button class='support-dialog-cancel' type='button' data-ios-support-close>${uiCopy.notNow}</button>`,
    "      </div>",
    `      <small>${uiCopy.stripe}</small>`,
    "    </div>",
    "  </div>",
    "</div>"
  ].join("");
  document.body.appendChild(iosSupportDialog);

  const closeMobileDialog = () => mobileDialog.close();
  mobileDialog.querySelector(".mobile-download-dialog-close").addEventListener("click", closeMobileDialog);
  mobileDialog.addEventListener("click", (event) => {
    if (event.target === mobileDialog) closeMobileDialog();
  });

  const iosInterestLink = mobileDialog.querySelector("[data-ios-support-trigger]");
  const closeIosSupportDialog = () => {
    if (iosSupportDialog.open) iosSupportDialog.close();
    document.body.classList.remove("support-dialog-open");
  };

  iosInterestLink.addEventListener("click", (event) => {
    if (typeof iosSupportDialog.showModal !== "function") return;
    event.preventDefault();
    closeMobileDialog();
    iosSupportDialog.showModal();
    document.body.classList.add("support-dialog-open");
    iosSupportDialog.querySelector(".support-dialog-close").focus();
  });

  iosSupportDialog.querySelectorAll("[data-ios-support-close]").forEach((button) => {
    button.addEventListener("click", closeIosSupportDialog);
  });
  iosSupportDialog.addEventListener("click", (event) => {
    if (event.target === iosSupportDialog) closeIosSupportDialog();
  });
  iosSupportDialog.addEventListener("close", () => {
    document.body.classList.remove("support-dialog-open");
  });

  const shareButton = mobileDialog.querySelector("[data-mobile-share]");
  const copyButton = mobileDialog.querySelector("[data-mobile-copy]");
  const mobileStatus = mobileDialog.querySelector(".mobile-download-dialog-status");

  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: uiCopy.shareTitle,
      text: uiCopy.shareText,
      url: guideUrl.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        mobileStatus.textContent = uiCopy.shared;
      } catch (error) {
        if (error.name !== "AbortError") mobileStatus.textContent = uiCopy.shareFailed;
      }
      return;
    }

    window.location.href = `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text}\n\n${shareData.url}`)}`;
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(guideUrl.href);
      copyButton.classList.remove("is-copied");
      void copyButton.offsetWidth;
      copyButton.classList.add("is-copied");
      copyButton.querySelector("span").textContent = "✓";
      copyButton.setAttribute("aria-label", uiCopy.copiedLabel);
      mobileStatus.textContent = uiCopy.copied;
      window.setTimeout(() => {
        copyButton.classList.remove("is-copied");
        copyButton.querySelector("span").textContent = "⧉";
        copyButton.setAttribute("aria-label", uiCopy.copyLabel);
      }, 1400);
    } catch {
      mobileStatus.textContent = uiCopy.copyFallback;
    }
  });

  downloadLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (isMobileDownloadContext()) {
        mobileStatus.textContent = "";
        mobileDialog.showModal();
        mobileDialog.querySelector(".mobile-download-dialog-close").focus();
        return;
      }

      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = downloadUrl;
      downloadAnchor.target = "_blank";
      downloadAnchor.rel = "noopener noreferrer";
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      if (!isDownloadPage) {
        guideUrl.searchParams.set("download", "started");
        window.setTimeout(() => {
          window.location.href = guideUrl.href;
        }, 160);
      }
    });
  });

  if (isDownloadPage && new URLSearchParams(window.location.search).get("download") === "started") {
    const downloadMain = document.querySelector(".seo-main");
    const downloadHero = downloadMain?.querySelector(".seo-hero");
    if (downloadMain && downloadHero) {
      const notice = document.createElement("p");
      notice.className = "download-started-notice";
      notice.textContent = uiCopy.downloadNotice;
      downloadMain.insertBefore(notice, downloadHero);
    }
  }
}

const realProductSection = document.querySelector("#features");
const illustrativeDemo = document.querySelector(".transcription-demo");

if (realProductSection && illustrativeDemo && (illustrativeDemo.compareDocumentPosition(realProductSection) & Node.DOCUMENT_POSITION_FOLLOWING)) {
  illustrativeDemo.parentNode.insertBefore(realProductSection, illustrativeDemo);
}

if (wavePaths.length > 0) {
  const width = 760;
  const height = 180;
  const center = height / 2;
  const samples = 96;
  let seed = 112;
  let last = performance.now();
  let energy = 0.78;
  let targetEnergy = 0.92;
  let nextChange = performance.now() + 420;
  let phase = 1.2;
  let scroll = 0.35;

  const random = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const between = (min, max) => min + random() * (max - min);
  const lerp = (current, target, dt, response) => {
    return current + (target - current) * (1 - Math.exp(-dt / response));
  };

  const layers = wavePaths.map((element, index) => ({
    element,
    scale: [0.54, 0.44, 1][index] ?? 0.6,
    y: [-18, 17, 0][index] ?? 0,
    offset: [0.2, 1.85, 0][index] ?? 0,
    noise: [0.18, 0.13, 0.28][index] ?? 0.2
  }));

  const makePath = (points) => {
    let path = `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const midX = (previous.x + current.x) / 2;
      path += ` C${midX.toFixed(2)} ${previous.y.toFixed(2)}, ${midX.toFixed(2)} ${current.y.toFixed(2)}, ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
    }

    return path;
  };

  const draw = (time) => {
    const dt = Math.min((time - last) / 1000, 0.05);
    last = time;

    if (time > nextChange) {
      targetEnergy = between(0.48, 1.08);
      nextChange = time + between(340, 860);
    }

    energy = lerp(energy, targetEnergy, dt, 0.24);
    phase += dt * (4.6 + energy * 1.2);
    scroll += dt * (0.28 + energy * 0.36);

    layers.forEach((layer) => {
      const points = Array.from({ length: samples }, (_, index) => {
        const progress = index / (samples - 1);
        const flow = progress + scroll;
        const edge = Math.sin(progress * Math.PI) ** 0.75;
        const breath = 0.86 + Math.sin(time * 0.001 + layer.offset) * 0.12;
        const syllable = 0.72 + Math.max(0, Math.sin(flow * Math.PI * 2 * 3.2 - phase + layer.offset)) ** 2.1 * 0.42;
        const voice =
          Math.sin(flow * Math.PI * 2 * 1.7 + phase * 0.16 + layer.offset) * 0.42 +
          Math.sin(flow * Math.PI * 2 * 3.4 - phase * 0.24 + layer.offset) * 0.28 +
          Math.sin(flow * Math.PI * 2 * 6.6 + phase * 0.36 + layer.offset) * 0.16;
        const softNoise = Math.sin(flow * Math.PI * 2 * 10.4 + time * 0.002 + layer.offset) * layer.noise;
        const amplitude = (10 + energy * 58) * edge * breath * syllable * layer.scale;
        const y = center + layer.y + (voice + softNoise) * amplitude;

        return {
          x: progress * width,
          y: Math.max(18, Math.min(height - 18, y))
        };
      });

      layer.element.setAttribute("d", makePath(points));
    });

    if (!reducedMotion) {
      requestAnimationFrame(draw);
    }
  };

  draw(performance.now());
}

const typewriterLines = Array.from(document.querySelectorAll(".typewriter-line"));

if (!reducedMotion && typewriterLines.length > 0) {
  const originalText = typewriterLines.map((line) => line.textContent.trim());
  let lineIndex = 0;
  let charIndex = 0;

  typewriterLines.forEach((line) => {
    line.textContent = "";
  });

  const typeNext = () => {
    const line = typewriterLines[lineIndex];

    typewriterLines.forEach((item) => item.classList.remove("is-typing"));
    line.classList.add("is-typing");
    line.textContent = originalText[lineIndex].slice(0, charIndex);

    if (charIndex <= originalText[lineIndex].length) {
      charIndex += 1;
      const character = originalText[lineIndex][charIndex - 2] || "";
      const delay = /[,.]/.test(character) ? 140 : 28 + Math.random() * 24;
      window.setTimeout(typeNext, delay);
      return;
    }

    line.classList.remove("is-typing");
    line.classList.add("is-complete");
    lineIndex += 1;
    charIndex = 0;

    if (lineIndex < typewriterLines.length) {
      window.setTimeout(typeNext, 320);
      return;
    }

    window.setTimeout(() => {
      typewriterLines.forEach((item) => {
        item.classList.remove("is-complete");
        item.textContent = "";
      });
      lineIndex = 0;
      charIndex = 0;
      typeNext();
    }, 3600);
  };

  window.setTimeout(typeNext, 480);
}

const languageStage = document.querySelector(".language-stage");
const flagRing = document.querySelector(".flag-ring");
const flagItems = flagRing ? Array.from(flagRing.children) : [];

if (languageStage && flagRing && flagItems.length > 0) {
  let orbitAngle = -Math.PI / 2;
  let orbitSpeed = 0.12;
  let targetSpeed = 0.12;
  let pointerAngle = null;
  let lastPointerAngle = null;
  let isDragging = false;
  let lastOrbitFrame = performance.now();
  const baseRadius = () => Math.min(languageStage.clientWidth, languageStage.clientHeight) * 0.38;

  const angleDistance = (a, b) => {
    let distance = Math.abs(a - b) % (Math.PI * 2);
    if (distance > Math.PI) distance = Math.PI * 2 - distance;
    return distance;
  };

  const pointerToAngle = (event) => {
    const rect = languageStage.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    return Math.atan2(y, x);
  };

  const renderFlags = (time) => {
    const dt = Math.min((time - lastOrbitFrame) / 1000, 0.05);
    lastOrbitFrame = time;

    if (!isDragging) {
      targetSpeed += (0.12 - targetSpeed) * (1 - Math.exp(-dt / 1.4));
      orbitSpeed += (targetSpeed - orbitSpeed) * (1 - Math.exp(-dt / 0.34));
      orbitAngle += orbitSpeed * dt;
    }

    const radius = baseRadius();

    flagItems.forEach((flag, index) => {
      const baseAngle = orbitAngle + (Math.PI * 2 * index) / flagItems.length;
      const hoverDistance = pointerAngle === null ? Math.PI : angleDistance(baseAngle, pointerAngle);
      const influence = Math.max(0, 1 - hoverDistance / 0.42);
      const eased = influence * influence * (3 - 2 * influence);
      const push = eased * 18;
      const scale = 1 + eased * 1.05;
      const x = Math.cos(baseAngle) * (radius + push);
      const y = Math.sin(baseAngle) * (radius + push);

      flag.style.setProperty("--flag-x", `${x.toFixed(2)}px`);
      flag.style.setProperty("--flag-y", `${y.toFixed(2)}px`);
      flag.style.setProperty("--flag-scale", scale.toFixed(3));
      flag.dataset.labelSide = y < -radius * 0.46 ? "below" : "above";
    });

    if (!reducedMotion) {
      requestAnimationFrame(renderFlags);
    }
  };

  flagRing.addEventListener("pointermove", (event) => {
    pointerAngle = pointerToAngle(event);

    if (!isDragging || lastPointerAngle === null) return;

    let delta = pointerAngle - lastPointerAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    orbitAngle += delta;
    targetSpeed = Math.max(-1.4, Math.min(1.4, delta * 18));
    orbitSpeed = targetSpeed;
    lastPointerAngle = pointerAngle;
  });

  flagRing.addEventListener("pointerenter", (event) => {
    pointerAngle = pointerToAngle(event);
  });

  flagRing.addEventListener("pointerleave", () => {
    pointerAngle = null;
    lastPointerAngle = null;
    isDragging = false;
    flagRing.classList.remove("is-dragging");
  });

  flagRing.addEventListener("pointerdown", (event) => {
    pointerAngle = pointerToAngle(event);
    lastPointerAngle = pointerAngle;
    isDragging = true;
    flagRing.classList.add("is-dragging");
    flagRing.setPointerCapture(event.pointerId);
  });

  flagRing.addEventListener("pointerup", (event) => {
    isDragging = false;
    lastPointerAngle = null;
    flagRing.classList.remove("is-dragging");

    if (flagRing.hasPointerCapture(event.pointerId)) {
      flagRing.releasePointerCapture(event.pointerId);
    }
  });

  renderFlags(performance.now());
}

const modesFigure = document.querySelector(".modes-screenshot");
const modeArrowSvg = document.querySelector(".mode-arrows");
const elasticModes = [
  {
    label: document.querySelector(".file-annotation"),
    path: document.querySelector(".file-arrow"),
    rest: [
      { x: 77, y: 38 },
      { x: 19, y: 198 },
      { x: 92, y: 271 },
      { x: 199, y: 280 }
    ]
  },
  {
    label: document.querySelector(".mic-annotation"),
    path: document.querySelector(".mic-arrow"),
    rest: [
      { x: 885, y: 23 },
      { x: 932, y: 203 },
      { x: 854, y: 233 },
      { x: 774, y: 267 }
    ]
  }
];

if (!reducedMotion && modesFigure && modeArrowSvg) {
  const pathFromPoints = (points) => {
    return `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y} ${points[2].x} ${points[2].y} ${points[3].x} ${points[3].y}`;
  };

  const rubber = (value, limit) => {
    return limit * Math.tanh(value / limit);
  };

  elasticModes.forEach((mode) => {
    if (!mode.label || !mode.path) return;

    let dragging = false;
    let pointerStart = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    let target = { x: 0, y: 0 };
    let lastFrame = performance.now();
    let frame = null;
    let activePointerId = null;

    const render = (time) => {
      const dt = Math.min((time - lastFrame) / 1000, 0.032);
      lastFrame = time;

      const stiffness = dragging ? 42 : 96;
      const damping = dragging ? 7.5 : 8.2;
      velocity.x += (target.x - current.x) * stiffness * dt;
      velocity.y += (target.y - current.y) * stiffness * dt;
      velocity.x *= Math.exp(-damping * dt);
      velocity.y *= Math.exp(-damping * dt);
      current.x += velocity.x * dt;
      current.y += velocity.y * dt;

      mode.label.style.setProperty("--pull-x", `${current.x.toFixed(2)}px`);
      mode.label.style.setProperty("--pull-y", `${current.y.toFixed(2)}px`);

      const svgWidth = modeArrowSvg.clientWidth;
      const svgHeight = modeArrowSvg.clientHeight;
      const svgDx = svgWidth > 0 ? (current.x / svgWidth) * 1000 : 0;
      const svgDy = svgHeight > 0 ? (current.y / svgHeight) * 520 : 0;
      const points = mode.rest.map((point, index) => {
        const influence = index === 0 ? 1 : index === 1 ? 0.68 : index === 2 ? 0.22 : 0;
        return {
          x: Number((point.x + svgDx * influence).toFixed(2)),
          y: Number((point.y + svgDy * influence).toFixed(2))
        };
      });
      mode.path.setAttribute("d", pathFromPoints(points));

      if (
        dragging ||
        Math.abs(current.x - target.x) > 0.08 ||
        Math.abs(current.y - target.y) > 0.08 ||
        Math.abs(velocity.x) > 0.08 ||
        Math.abs(velocity.y) > 0.08
      ) {
        frame = requestAnimationFrame(render);
        return;
      }

      current = { x: 0, y: 0 };
      velocity = { x: 0, y: 0 };
      mode.label.style.setProperty("--pull-x", "0px");
      mode.label.style.setProperty("--pull-y", "0px");
      mode.path.setAttribute("d", pathFromPoints(mode.rest));
      frame = null;
    };

    const startFrame = () => {
      if (frame) return;
      lastFrame = performance.now();
      frame = requestAnimationFrame(render);
    };

    mode.label.addEventListener("pointerdown", (event) => {
      dragging = true;
      activePointerId = event.pointerId;
      pointerStart = { x: event.clientX, y: event.clientY };
      mode.label.classList.add("is-pulled");
      if (mode.label.setPointerCapture) {
        mode.label.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      startFrame();
    });

    const updatePull = (event) => {
      if (!dragging || event.pointerId !== activePointerId) return;
      target = {
        x: rubber(event.clientX - pointerStart.x, 74),
        y: rubber(event.clientY - pointerStart.y, 58)
      };
      startFrame();
    };

    const release = (event) => {
      if (!dragging || (event && event.pointerId !== activePointerId)) return;
      const pointerId = activePointerId;
      dragging = false;
      activePointerId = null;
      target = { x: 0, y: 0 };
      mode.label.classList.remove("is-pulled");
      if (pointerId !== null && mode.label.hasPointerCapture && mode.label.hasPointerCapture(pointerId)) {
        mode.label.releasePointerCapture(pointerId);
      }
      startFrame();
    };

    mode.label.addEventListener("pointermove", updatePull);
    mode.label.addEventListener("pointerup", release);
    mode.label.addEventListener("pointercancel", release);
    mode.label.addEventListener("lostpointercapture", release);
    window.addEventListener("pointermove", updatePull);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", () => {
      if (!dragging) return;
      dragging = false;
      activePointerId = null;
      target = { x: 0, y: 0 };
      mode.label.classList.remove("is-pulled");
      startFrame();
    });
  });
}

const galleryImages = Array.from(document.querySelectorAll(".gallery-shot img"));

document.querySelectorAll(".beta-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.remove("is-springing");
    void button.offsetWidth;
    button.classList.add("is-springing");
    button.addEventListener("animationend", () => {
      button.classList.remove("is-springing");
    }, { once: true });
  });
});

const supportDialog = document.querySelector("#support-dialog");
const supportTriggers = Array.from(document.querySelectorAll("[data-support-trigger]"));
const supportCloseButtons = supportDialog
  ? Array.from(supportDialog.querySelectorAll("[data-support-close]"))
  : [];

if (supportDialog && supportTriggers.length > 0) {
  let lastSupportTrigger = null;

  const closeSupportDialog = () => {
    if (supportDialog.open) supportDialog.close();
    document.body.classList.remove("support-dialog-open");
    lastSupportTrigger?.focus();
  };

  supportTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      if (typeof supportDialog.showModal !== "function") return;
      event.preventDefault();
      lastSupportTrigger = trigger;
      supportDialog.showModal();
      document.body.classList.add("support-dialog-open");
      supportDialog.querySelector(".support-dialog-close")?.focus();
    });
  });

  supportCloseButtons.forEach((button) => {
    button.addEventListener("click", closeSupportDialog);
  });

  supportDialog.addEventListener("click", (event) => {
    if (event.target === supportDialog) closeSupportDialog();
  });

  supportDialog.addEventListener("close", () => {
    document.body.classList.remove("support-dialog-open");
    lastSupportTrigger?.focus();
  });
}

if (galleryImages.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", uiCopy.enlargedScreenshot);
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="${uiCopy.closeScreenshot}">×</button>
    <button class="gallery-lightbox-nav prev" type="button" aria-label="${uiCopy.previousScreenshot}">‹</button>
    <img alt="">
    <button class="gallery-lightbox-nav next" type="button" aria-label="${uiCopy.nextScreenshot}">›</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".gallery-lightbox-close");
  const previousButton = lightbox.querySelector(".gallery-lightbox-nav.prev");
  const nextButton = lightbox.querySelector(".gallery-lightbox-nav.next");
  let lastFocusedElement = null;
  let currentGalleryIndex = 0;

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  const showGalleryImage = (index) => {
    currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[currentGalleryIndex];
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
  };

  const openLightbox = (image) => {
    lastFocusedElement = document.activeElement;
    showGalleryImage(galleryImages.indexOf(image));
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  galleryImages.forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `${image.alt} Apri immagine ingrandita.`);

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(image);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showGalleryImage(currentGalleryIndex - 1));
  nextButton.addEventListener("click", () => showGalleryImage(currentGalleryIndex + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showGalleryImage(currentGalleryIndex - 1);
    if (event.key === "ArrowRight") showGalleryImage(currentGalleryIndex + 1);
  });
}

const copyEditorIsLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

if (copyEditorIsLocal) {
  const copyEditorStorageKey = "parrocchettami-copy-drafts-v4";
  const copyEditorActiveKey = "parrocchettami-copy-editor-active";
  const copyEditorPage = window.location.pathname.split("/").pop() || "index.html";
  let copyEditorDrafts = { version: 4, changes: {} };
  let copyEditorPrepared = false;

  try {
    const savedDrafts = window.localStorage.getItem(copyEditorStorageKey);
    if (savedDrafts) copyEditorDrafts = JSON.parse(savedDrafts);
  } catch {
    copyEditorDrafts = { version: 4, changes: {} };
  }

  const copyEditor = document.createElement("aside");
  copyEditor.className = "copy-editor";
  copyEditor.setAttribute("aria-label", "Editor dei testi");
  copyEditor.innerHTML = [
    "<button class='copy-editor-launcher' type='button' data-copy-editor-open>Modifica testi</button>",
    "<div class='copy-editor-bar'>",
    "  <div class='copy-editor-heading'>",
    "    <strong>Editor testi</strong>",
    "    <span data-copy-editor-status>Nessuna modifica</span>",
    "  </div>",
    "  <nav class='copy-editor-pages' aria-label='Pagine da modificare'>",
    "    <a href='index.html'>Home</a>",
    "    <a href='features.html'>Funzioni</a>",
    "    <a href='privacy.html'>Privacy</a>",
    "    <a href='compare.html'>Confronto</a>",
    "    <a href='download.html'>Installazione</a>",
    "    <button type='button' data-copy-editor-support>Popup donazioni</button>",
    "  </nav>",
    "  <div class='copy-editor-actions'>",
    "    <button type='button' data-copy-editor-copy>Copia modifiche</button>",
    "    <button type='button' data-copy-editor-download>Scarica JSON</button>",
    "    <button type='button' data-copy-editor-close>Fine</button>",
    "  </div>",
  "</div>"
  ].join("");
  document.body.appendChild(copyEditor);

  const copyEditorStatus = copyEditor.querySelector("[data-copy-editor-status]");
  const copyEditorOpenButton = copyEditor.querySelector("[data-copy-editor-open]");
  const copyEditorCloseButton = copyEditor.querySelector("[data-copy-editor-close]");
  const copyEditorCopyButton = copyEditor.querySelector("[data-copy-editor-copy]");
  const copyEditorDownloadButton = copyEditor.querySelector("[data-copy-editor-download]");
  const copyEditorSupportButton = copyEditor.querySelector("[data-copy-editor-support]");

  if (!supportDialog) copyEditorSupportButton.remove();

  copyEditor.querySelectorAll(".copy-editor-pages a").forEach((link) => {
    if (link.getAttribute("href") === copyEditorPage) link.setAttribute("aria-current", "page");
  });

  const copyEditorSave = () => {
    try {
      window.localStorage.setItem(copyEditorStorageKey, JSON.stringify(copyEditorDrafts));
    } catch {
      copyEditorStatus.textContent = "Salvataggio non disponibile";
    }
  };

  const copyEditorChangeCount = () => Object.keys(copyEditorDrafts.changes || {}).length;

  const copyEditorRefreshStatus = (message) => {
    const count = copyEditorChangeCount();
    copyEditorStatus.textContent = message || (count === 0 ? "Nessuna modifica" : count + (count === 1 ? " modifica salvata" : " modifiche salvate"));
  };

  const copyEditorContext = (element) => ({
    tag: element.tagName.toLowerCase(),
    id: element.id || "",
    className: typeof element.className === "string" ? element.className : "",
    section: element.closest("section")?.id || ""
  });

  const copyEditorPrepare = () => {
    if (copyEditorPrepared) return;
    copyEditorPrepared = true;

    const excluded = [
      "script",
      "style",
      "noscript",
      "svg",
      "[aria-hidden='true']",
      ".copy-editor",
      ".typewriter-line",
      ".gallery-lightbox",
      ".flag-ring",
      "[data-support-close]",
      "input",
      "textarea",
      "select",
      "option"
    ].join(",");

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue.trim() || parent.closest(excluded)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node, index) => {
      const match = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!match || !match[2]) return;

      const editable = document.createElement("span");
      const changeId = copyEditorPage + ":" + index;
      const savedChange = copyEditorDrafts.changes?.[changeId];
      editable.dataset.copyEditId = changeId;
      editable.dataset.copyOriginal = match[2];
      editable.textContent = savedChange?.value ?? match[2];
      editable.contentEditable = "false";
      editable.spellcheck = true;
      editable.setAttribute("role", "textbox");
      editable.setAttribute("aria-label", "Testo modificabile");

      editable.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        editable.blur();
      });

      editable.addEventListener("input", () => {
        const value = editable.textContent || "";
        const original = editable.dataset.copyOriginal || "";
        if (value === original) {
          delete copyEditorDrafts.changes[changeId];
        } else {
          copyEditorDrafts.changes[changeId] = {
            page: copyEditorPage,
            id: changeId,
            original,
            value,
            context: copyEditorContext(editable.parentElement)
          };
        }
        copyEditorSave();
        copyEditorRefreshStatus("Salvato");
        window.setTimeout(() => copyEditorRefreshStatus(), 700);
      });

      node.replaceWith(
        document.createTextNode(match[1]),
        editable,
        document.createTextNode(match[3])
      );
    });

    copyEditorRefreshStatus();
  };

  const copyEditorSetActive = (active) => {
    copyEditorPrepare();
    document.body.classList.toggle("copy-editor-active", active);
    copyEditor.classList.toggle("is-active", active);
    document.querySelectorAll("[data-copy-edit-id]").forEach((element) => {
      element.contentEditable = active ? "plaintext-only" : "false";
    });
    try {
      window.localStorage.setItem(copyEditorActiveKey, active ? "1" : "0");
    } catch {
      copyEditorRefreshStatus();
    }
    if (active) copyEditorStatus.focus?.();
  };

  const copyEditorManifest = () => ({
    project: "parrocchettami-site",
    version: 4,
    exportedAt: new Date().toISOString(),
    changes: Object.values(copyEditorDrafts.changes || {}).sort((a, b) => a.id.localeCompare(b.id))
  });

  copyEditorOpenButton.addEventListener("click", () => copyEditorSetActive(true));
  copyEditorCloseButton.addEventListener("click", () => copyEditorSetActive(false));
  copyEditorSupportButton?.addEventListener("click", () => {
    if (!supportDialog || typeof supportDialog.showModal !== "function") return;
    supportDialog.showModal();
    document.body.classList.add("support-dialog-open");
    supportDialog.querySelector("[data-copy-edit-id]")?.focus();
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("copy-editor-active")) return;
    const editable = event.target.closest?.("[data-copy-edit-id]");
    if (!editable || !editable.closest("a, button, summary, label")) return;
    event.preventDefault();
    event.stopPropagation();
    editable.focus();
  }, true);

  copyEditorCopyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(copyEditorManifest(), null, 2));
      copyEditorRefreshStatus("Modifiche copiate");
    } catch {
      copyEditorRefreshStatus("Copia non disponibile. Usa Scarica JSON");
    }
  });

  copyEditorDownloadButton.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(copyEditorManifest(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const download = document.createElement("a");
    download.href = url;
    download.download = "parrocchettami-copy-final.json";
    document.body.appendChild(download);
    download.click();
    download.remove();
    URL.revokeObjectURL(url);
    copyEditorRefreshStatus("JSON scaricato");
  });

  copyEditorPrepare();
  if (window.localStorage.getItem(copyEditorActiveKey) === "1") copyEditorSetActive(true);
}
