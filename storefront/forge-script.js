// ========== THEME TOGGLE ==========
function setTheme(isLight) {
  const body = document.body;
  if (isLight) {
    body.classList.add("light-mode");
    localStorage.setItem("forge-theme", "light");
    document.getElementById("themeToggle").textContent = "◑";
    document
      .getElementById("themeToggle")
      .setAttribute("aria-label", "Switch to dark mode");
  } else {
    body.classList.remove("light-mode");
    localStorage.setItem("forge-theme", "dark");
    document.getElementById("themeToggle").textContent = "◐";
    document
      .getElementById("themeToggle")
      .setAttribute("aria-label", "Switch to light mode");
  }
}

// ========== MENU TOGGLE ==========
function setupMenuToggle() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", false);
      });
    });
  }
}

// ========== COPY TO CLIPBOARD ==========
function setupCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const targetId = button.getAttribute("data-copy-target");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const text = targetElement.textContent;
        try {
          await navigator.clipboard.writeText(text);
          const originalHTML = button.innerHTML;
          button.innerHTML = "Copied <span>✓</span>";
          setTimeout(() => {
            button.innerHTML = originalHTML;
          }, 1400);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
      }
    });
  });
}

// ========== YEAR UPDATE ==========
function updateYear() {
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
  // Theme restoration
  const savedTheme = localStorage.getItem("forge-theme");
  setTheme(savedTheme === "light");

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isLight = document.body.classList.contains("light-mode");
      setTheme(!isLight);
    });
  }

  // Setup features
  setupMenuToggle();
  setupCopyButtons();
  updateYear();
});
