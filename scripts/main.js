// Prevent scroll restoration
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Force scroll to top only on initial page load
window.addEventListener("load", () => {
  if (window.scrollY === 0) {
    window.scrollTo(0, 0);
  }
});

// Custom gliding scroll effect
let isGlidingScroll = false;
let glideScrollTimeout;

function smoothScrollTo(targetY, duration = 800) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

// Simple smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      // Simple subtle delay
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  });
});

// Optimize scroll performance with Intersection Observer
const observerOptions = {
  threshold: Array.from({ length: 20 }, (_, i) => i / 20), // More granular thresholds
  rootMargin: "-10% 0px",
};

// Track scroll position for smooth border updates
let borderScrollTimeout;
let lastScrollY = window.scrollY;

// Simple scroll handler for border animations
function handleScroll() {
  const sections = document.querySelectorAll("section:not(#home)");
  const viewportHeight = window.innerHeight;
  const shrinkStartDistance = 100; // Increased for smoother transition
  const triggerPoint = viewportHeight * 0.6; // Start animation when section is 60% up the viewport

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Calculate distance from trigger point to bottom of section
    const distanceFromTrigger = triggerPoint - rect.bottom;

    // Simple progress calculation
    let progress = 0;
    if (distanceFromTrigger >= 0) {
      // Section is at or below trigger point
      progress = 1;
    } else if (distanceFromTrigger >= -shrinkStartDistance) {
      // Section is within shrink zone
      progress = 1 - Math.abs(distanceFromTrigger) / shrinkStartDistance;
    }

    // Direct style update
    section.style.setProperty("--border-width", progress);

    // Handle fade-in
    if (rect.top < viewportHeight * 0.8) {
      section.classList.add("fade-in");
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";

      // Handle experience cards fade-in
      if (section.id === "experience") {
        const experienceCards = section.querySelectorAll(".experience-card");
        experienceCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("fade-in");
          }, index * 200); // Stagger the animations
        });
      }
    } else if (rect.top > viewportHeight) {
      section.classList.remove("fade-in");
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";

      // Remove fade-in from experience cards when section is out of view
      if (section.id === "experience") {
        const experienceCards = section.querySelectorAll(".experience-card");
        experienceCards.forEach((card) => {
          card.classList.remove("fade-in");
        });
      }
    }
  });
}

// Add scroll listener with throttling
let isBorderScrolling;
window.addEventListener(
  "scroll",
  () => {
    if (!isBorderScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isBorderScrolling = false;
      });
      isBorderScrolling = true;
    }
  },
  { passive: true }
);

// Initial call
handleScroll();

// Update on resize
window.addEventListener("resize", handleScroll, { passive: true });

// Update on load
window.addEventListener("load", handleScroll);

// Cache DOM queries
const sections = document.querySelectorAll("section:not(#home)");

// Mobile menu functionality
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (mobileMenuButton && mobileMenu) {
  // Toggle menu on button click
  mobileMenuButton.addEventListener("click", (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("active");
    mobileMenuButton.classList.toggle("active");
  });

  // Close menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.remove("active");
      mobileMenuButton.classList.remove("active");
    });
  });

  // Close menu when clicking on the menu overlay (but not on links)
  mobileMenu.addEventListener("click", (e) => {
    // Only close if clicking on the overlay itself, not on links
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active");
      mobileMenuButton.classList.remove("active");
    }
  });

  // Close menu when clicking outside the entire menu
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
      mobileMenuButton.classList.remove("active");
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      mobileMenuButton.classList.remove("active");
    }
  });
}

// Handle hero animations
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");

  // Ensure hero animations play smoothly
  requestAnimationFrame(() => {
    hero.style.opacity = "0";
    hero.style.animation = "none";
    hero.offsetHeight; // Trigger reflow
    hero.style.animation = null;
  });
});

// Advanced email obfuscation with clipboard copy
function decodeAndCopyEmail() {
  // Base64 encoded email parts (kaylamartinez1201)
  const part1 = atob("a2F5bGFtYXJ0aW5lejEyMDE=");

  // Additional obfuscation layer for "gmail.com"
  const domain = String.fromCharCode(
    103, // g
    109, // m
    97, // a
    105, // i
    108, // l
    46, // .
    99, // c
    111, // o
    109 // m
  );

  const email = part1 + "@" + domain;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showCopyFeedback();
      })
      .catch(() => {
        fallbackCopy(email);
      });
  } else {
    fallbackCopy(email);
  }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    showCopyFeedback();
  } catch (err) {
    console.error("Fallback copy failed:", err);
  }

  document.body.removeChild(textArea);
}

// Show visual feedback that email was copied
function showCopyFeedback() {
  // Create toast notification
  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = "Email copied to clipboard!";

  // Add to page
  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Remove after animation
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Prevent right-click context menu on email icon
document.addEventListener("DOMContentLoaded", function () {
  const emailIcon = document.querySelector(
    '.contact-icon[onclick="decodeAndCopyEmail()"]'
  );
  if (emailIcon) {
    emailIcon.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  }
});
