/* * File: js/main.js
 * Context: Core interactivity scripts for 01Talent website.
 * Includes IntersectionObserver for scroll animations, Mobile navigation toggle,
 * Image Lightbox functionality, News Carousel controls, FAQ accordion, and Cookie Banner management.
 */

// ==========================================================================
// GLOBALLY ACCESSIBLE FUNCTIONS (Called via inline onclick attributes)
// ==========================================================================

// --- FAQ Accordion ---
function toggleFaq(el) {
  const item = el.closest(".faq-item");
  const isOpen = item.classList.contains("faq-open");

  // Close all open FAQs
  document.querySelectorAll(".faq-item.faq-open").forEach(function (i) {
    i.classList.remove("faq-open");
    i.querySelector(".faq-a").style.maxHeight = "0";
    i.querySelector(".faq-a").style.paddingBottom = "0";
    i.querySelector(".faq-icon").style.background = "";
    i.querySelector(".faq-icon").style.borderColor = "";
    i.querySelector(".faq-icon").style.color = "var(--muted)";
    i.querySelector(".faq-icon").textContent = "+";
  });

  // Open clicked FAQ
  if (!isOpen) {
    item.classList.add("faq-open");
    item.querySelector(".faq-a").style.maxHeight = "300px";
    item.querySelector(".faq-icon").style.background = "var(--blue)";
    item.querySelector(".faq-icon").style.borderColor = "var(--blue)";
    item.querySelector(".faq-icon").style.color = "#fff";
    item.querySelector(".faq-icon").textContent = "×";
  }
}

// --- News Carousel ---
let newsPos = 0;
function newsSlide(dir) {
  const track = document.getElementById("newsTrack");
  if (!track) return;

  const cards = track.querySelectorAll(".news-card");
  if (!cards.length) return;

  const total = cards.length;
  const cardW = cards[0].offsetWidth + 28; // Card width + gap
  const visible = Math.max(
    1,
    Math.floor(track.parentElement.offsetWidth / cardW),
  );

  newsPos = (((newsPos + dir) % total) + total) % total;
  track.style.transform = "translateX(-" + newsPos * cardW + "px)";
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
      if (img.src && img.src.includes("twemoji")) return;

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
  }

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
      ?.addEventListener("click", function () {
        dismiss("all");
      });
    document
      .getElementById("cookie-reject")
      ?.addEventListener("click", function () {
        dismiss("essential");
      });
    document
      .getElementById("cookie-close")
      ?.addEventListener("click", function () {
        dismiss("dismissed");
      });

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
});
