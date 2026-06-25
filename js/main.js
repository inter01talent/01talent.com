/* * File: js/main.js
 * Context: Core interactivity scripts for 01Talent website.
 * Includes IntersectionObserver for scroll animations, Mobile navigation toggle,
 * Image Lightbox functionality, News Carousel controls (Infinite), FAQ accordion, and Cookie Banner management.
 */

// --- FAQ Accordion ---
function toggleFaq(el) {
  const item = el.closest(".faq-item");
  if (!item) return;
  const isOpen = item.classList.contains("faq-open");

  // Close all open FAQs
  document.querySelectorAll(".faq-item.faq-open").forEach(function (i) {
    i.classList.remove("faq-open");
    i.querySelector(".faq-a").style.maxHeight = "0";
    i.querySelector(".faq-a").style.paddingBottom = "0";
    const icon = i.querySelector(".faq-icon");
    if (icon) {
      icon.style.background = "";
      icon.style.borderColor = "";
      icon.style.color = "var(--muted)";
      icon.textContent = "+";
    }
  });

  // Open clicked FAQ
  if (!isOpen) {
    item.classList.add("faq-open");
    const faqA = item.querySelector(".faq-a");
    if (faqA) faqA.style.maxHeight = "300px";
    const icon = item.querySelector(".faq-icon");
    if (icon) {
      icon.style.background = "var(--blue)";
      icon.style.borderColor = "var(--blue)";
      icon.style.color = "#fff";
      icon.textContent = "×";
    }
  }
}

// --- True Infinite News Carousel JS Functionality ---
let isAnimating = false;

function newsSlide(dir) {
  const track = document.getElementById("newsTrack");
  if (!track || isAnimating) return;

  const cards = track.querySelectorAll(".news-card");
  if (!cards.length) return;

  isAnimating = true;

  // Dynamically calculate width + gap to support responsive resizing
  const gap = parseInt(window.getComputedStyle(track).gap || 28);
  const cardW = cards[0].offsetWidth + gap;

  if (dir === 1) {
    // Slide Next
    track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = `translateX(-${cardW}px)`;

    setTimeout(() => {
      // Move first element to the end instantly
      track.style.transition = "none";
      track.appendChild(track.firstElementChild);
      track.style.transform = "translateX(0)";
      isAnimating = false;
    }, 400);
  } else {
    // Slide Prev
    track.style.transition = "none";
    // Move last element to the start instantly, shifting the track left
    track.prepend(track.lastElementChild);
    track.style.transform = `translateX(-${cardW}px)`;

    // Force a browser reflow so the transition applies smoothly
    void track.offsetWidth;

    // Animate smoothly back to 0
    track.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    track.style.transform = "translateX(0)";

    setTimeout(() => {
      isAnimating = false;
    }, 400);
  }
}

// --- Lightbox Global Close ---
function closeLightbox(e) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (e && e.target === lightboxImg) return;
  if (lightbox) {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// ==========================================================================
// DOM CONTENT LOADED EVENT LISTENERS
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  // --- Scroll Animations (Reveal) ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // --- Lightbox Initialization ---
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  if (lightbox && lightboxImg) {
    document.querySelectorAll("img:not([data-no-lightbox])").forEach((img) => {
      if (img.closest(".partner-logo-item")) return;
      if (img.classList.contains("modern-flag")) return; // Don't trigger on flag icons

      img.style.cursor = "pointer";
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "";
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });

    lightbox.addEventListener("click", closeLightbox);
    const closeBtn = lightbox.querySelector(".lightbox-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }
  }

  // --- FAQ Listeners ---
  document.querySelectorAll(".faq-q").forEach((q) => {
    q.addEventListener("click", () => toggleFaq(q));
  });

  // --- News Carousel Listeners ---
  const prevBtn = document.querySelector(".news-nav-btn.prev");
  const nextBtn = document.querySelector(".news-nav-btn.next");
  if (prevBtn) prevBtn.addEventListener("click", () => newsSlide(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => newsSlide(1));

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", false);
      });
    });
  }

  // --- Cookie Banner ---
  const banner = document.getElementById("cookie-banner");
  if (banner) {
    const consent = localStorage.getItem("01t_cookie_consent");
    if (!consent) {
      setTimeout(function () {
        banner.style.display = "flex";
      }, 1200);
    }

    function dismiss(value) {
      localStorage.setItem("01t_cookie_consent", value);
      banner.style.opacity = "0";
      banner.style.transition = "opacity .3s";
      setTimeout(function () {
        banner.style.display = "none";
      }, 300);
    }

    document
      .getElementById("cookie-accept")
      ?.addEventListener("click", () => dismiss("all"));
    document
      .getElementById("cookie-reject")
      ?.addEventListener("click", () => dismiss("essential"));
    document
      .getElementById("cookie-close")
      ?.addEventListener("click", () => dismiss("dismissed"));

    const mgr = document.getElementById("manage-cookies-btn");
    if (mgr) {
      mgr.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("01t_cookie_consent");
        banner.style.opacity = "1";
        banner.style.transition = "";
        banner.style.display = "flex";
      });
    }
  }

  // --- Theme Toggle ---
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      let targetTheme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", targetTheme);
      localStorage.setItem("theme", targetTheme);
    });
  }
});

// ==========================================================================
// WINDOW LOAD EVENT LISTENERS
// ==========================================================================

window.addEventListener("load", function () {
  // --- HubSpot Form Initialization ---
  if (window.hbspt) {
    hbspt.forms.create({
      portalId: "25483699",
      formId: "e004571d-7fa0-4724-8bfb-c0130794c9fa",
      region: "eu1",
      target: "#hs-cta-form",
      css: "",
    });
  }
});
