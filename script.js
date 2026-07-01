const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll("[data-reveal]");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll("[data-counter]");

const formatNumber = (value) => new Intl.NumberFormat("fr-CH").format(value);

const animateCounter = (node) => {
  const target = Number(node.dataset.target || "0");
  const prefix = node.dataset.prefix || "";
  const duration = reducedMotion ? 1 : 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
    node.textContent = `${prefix}${formatNumber(current)}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const hero = document.querySelector(".hero");

if (hero && !reducedMotion) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    hero.style.setProperty("--mx", x.toFixed(3));
    hero.style.setProperty("--my", y.toFixed(3));
  });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--mx", "0");
    hero.style.setProperty("--my", "0");
  });
}

const projectStory = document.querySelector(".project-story");
const projectCards = Array.from(document.querySelectorAll("[data-project-card]"));
const heroStageAnchor = document.querySelector(".hero-stage-anchor");
const projectSlots = Array.from(document.querySelectorAll(".featured-project-slot"));

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (start, end, progress) => start + (end - start) * progress;
const easeInOut = (progress) => {
  if (progress < 0.5) {
    return 4 * progress * progress * progress;
  }

  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

if (projectStory && projectCards.length && heroStageAnchor && projectSlots.length) {
  const heroStackOffsets = [
    { x: -0.29, y: 0.05, rotate: -9 },
    { x: -0.15, y: -0.025, rotate: -3 },
    { x: 0, y: -0.055, rotate: 2 },
    { x: 0.15, y: -0.005, rotate: 7 },
    { x: 0.3, y: 0.065, rotate: 12 },
  ];

  let cardGeometry = [];
  let storyTop = 0;
  let scrollDistance = window.innerHeight;
  let ticking = false;

  const setCardState = (card, state) => {
    card.style.setProperty("--card-width", `${state.width}px`);
    card.style.setProperty("--card-height", `${state.height}px`);
    card.style.setProperty("--card-x", `${state.x}px`);
    card.style.setProperty("--card-y", `${state.y}px`);
    card.style.setProperty("--card-rotate", `${state.rotate}deg`);
  };

  const measureProjectStory = () => {
    const storyRect = projectStory.getBoundingClientRect();
    const anchorRect = heroStageAnchor.getBoundingClientRect();
    const storyLeft = storyRect.left + window.scrollX;
    storyTop = storyRect.top + window.scrollY;
    scrollDistance = Math.max(window.innerHeight * (window.innerWidth > 820 ? 1.16 : 1.32), 1);

    const anchorLeft = anchorRect.left + window.scrollX - storyLeft;
    const anchorTop = anchorRect.top + window.scrollY - storyTop;
    const heroCardWidth = Math.min(anchorRect.width * (window.innerWidth > 820 ? 0.7 : 0.74), window.innerWidth > 820 ? 430 : 315);
    const heroCardHeight = heroCardWidth * 1.16;
    const heroCenterX = anchorLeft + anchorRect.width * (window.innerWidth > 820 ? 0.55 : 0.56);
    const heroCenterY = anchorTop + anchorRect.height * 0.52;

    cardGeometry = projectCards.map((card, index) => {
      const slot = projectSlots[index];
      const slotRect = slot.getBoundingClientRect();
      const offset = heroStackOffsets[index] || heroStackOffsets[heroStackOffsets.length - 1];
      const finalWidth = slotRect.width;
      const finalHeight = slotRect.height;

      return {
        card,
        start: {
          x: heroCenterX - heroCardWidth / 2 + heroCardWidth * offset.x,
          y: heroCenterY - heroCardHeight / 2 + heroCardHeight * offset.y,
          width: heroCardWidth,
          height: heroCardHeight,
          rotate: offset.rotate,
        },
        end: {
          x: slotRect.left + window.scrollX - storyLeft,
          y: slotRect.top + window.scrollY - storyTop,
          width: finalWidth,
          height: finalHeight,
          rotate: 0,
        },
      };
    });

    updateProjectCards();
    projectStory.classList.add("is-ready");
  };

  const updateProjectCards = () => {
    const rawProgress = reducedMotion ? (window.scrollY > storyTop + 24 ? 1 : 0) : clamp((window.scrollY - storyTop) / scrollDistance);

    cardGeometry.forEach(({ card, start, end }, index) => {
      const staggeredProgress = reducedMotion
        ? rawProgress
        : clamp((rawProgress - index * 0.012) / 0.98);
      const spread = easeInOut(staggeredProgress);
      const vertical = reducedMotion ? rawProgress : easeInOut(clamp(rawProgress / 0.92));
      const state = {
        x: lerp(start.x, end.x, spread),
        y: lerp(start.y, end.y, vertical),
        width: lerp(start.width, end.width, spread),
        height: lerp(start.height, end.height, spread),
        rotate: lerp(start.rotate, end.rotate, spread),
      };

      card.style.zIndex = rawProgress > 0.72 ? `${20 + index}` : `${25 - index}`;
      setCardState(card, state);
    });
  };

  const requestProjectCardUpdate = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateProjectCards();
    });
  };

  window.addEventListener("scroll", requestProjectCardUpdate, { passive: true });
  window.addEventListener("resize", measureProjectStory);
  window.addEventListener("load", measureProjectStory);

  if (document.fonts) {
    document.fonts.ready.then(measureProjectStory);
  }

  measureProjectStory();
}

const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting && activeLink) {
          navLinks.forEach((link) => link.classList.remove("is-active"));
          activeLink.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

const magneticButtons = document.querySelectorAll(".magnetic");

if (!reducedMotion) {
  magneticButtons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}
