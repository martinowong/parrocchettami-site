const wavePaths = Array.from(document.querySelectorAll(".wave-line"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const editorToggle = document.querySelector("[data-editor-toggle]");
const editorExport = document.querySelector("[data-editor-export]");
const editorReset = document.querySelector("[data-editor-reset]");
const editorStatus = document.querySelector("[data-editor-status]");
const editableSelector = [
  "h1",
  "h2",
  "h3",
  "main p",
  ".brand span",
  ".nav-links a",
  ".nav-cta",
  ".button",
  ".system-note",
  ".proof-row strong",
  ".proof-row span",
  ".format-pills li",
  ".record-controls span",
  ".privacy-band li",
  ".credit-card span",
  ".credit-card a",
  ".install-steps-card li",
  ".faq-item summary",
  ".faq-item p",
  ".site-footer a",
  ".site-footer p"
].join(",");

const editableTextNodes = Array.from(document.querySelectorAll(editableSelector)).filter((element) => {
  return !element.closest(".text-editor-panel") && element.textContent.trim().length > 0;
});

const editorStorageKey = "parrocchettami-redesign-v2-copy";
let editorOn = false;

const stableKeyFor = (element, index) => {
  const explicitId = element.id ? `#${element.id}` : "";
  const textHint = element.textContent.trim().slice(0, 42).toLowerCase().replace(/\s+/g, "-");
  return `${element.tagName.toLowerCase()}${explicitId}:${index}:${textHint}`;
};

const readStoredCopy = () => {
  try {
    return JSON.parse(localStorage.getItem(editorStorageKey) || "{}");
  } catch {
    return {};
  }
};

const writeStoredCopy = (copy) => {
  localStorage.setItem(editorStorageKey, JSON.stringify(copy, null, 2));
};

const storedCopy = readStoredCopy();

editableTextNodes.forEach((element, index) => {
  const key = stableKeyFor(element, index);
  element.dataset.editableText = key;

  if (storedCopy[key]) {
    element.textContent = storedCopy[key];
  }

  element.addEventListener("input", () => {
    const nextCopy = readStoredCopy();
    nextCopy[key] = element.textContent.trim();
    writeStoredCopy(nextCopy);
    if (editorStatus) editorStatus.textContent = "Salvato";
  });
});

const setEditorMode = (enabled) => {
  editorOn = enabled;
  document.body.classList.toggle("text-editing", editorOn);

  editableTextNodes.forEach((element) => {
    element.contentEditable = editorOn ? "true" : "false";
    element.spellcheck = editorOn;
  });

  if (editorToggle) editorToggle.textContent = editorOn ? "Fine modifica" : "Modifica testi";
  if (editorStatus) editorStatus.textContent = editorOn ? "Editor acceso" : "Editor spento";
};

if (editorToggle) {
  editorToggle.addEventListener("click", () => setEditorMode(!editorOn));
}

if (editorExport) {
  editorExport.addEventListener("click", () => {
    const copy = readStoredCopy();
    const blob = new Blob([JSON.stringify(copy, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "parrocchettami-copy.json";
    link.click();
    URL.revokeObjectURL(url);
    if (editorStatus) editorStatus.textContent = "JSON esportato";
  });
}

if (editorReset) {
  editorReset.addEventListener("click", () => {
    localStorage.removeItem(editorStorageKey);
    window.location.reload();
  });
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
      if (editorOn) return;
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

if (galleryImages.length > 0) {
  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Screenshot ingrandito");
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="Chiudi screenshot">×</button>
    <button class="gallery-lightbox-nav prev" type="button" aria-label="Screenshot precedente">‹</button>
    <img alt="">
    <button class="gallery-lightbox-nav next" type="button" aria-label="Screenshot successivo">›</button>
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
