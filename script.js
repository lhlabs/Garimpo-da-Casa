document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const revealElements = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  const searchInput = document.getElementById("product-search");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll(".product-card");
  const productGroups = document.querySelectorAll(".product-group");
  const productCount = document.getElementById("product-count");
  const noResults = document.getElementById("no-results");
  let activeFilter = "all";

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const updateCatalog = () => {
    const query = normalize(searchInput?.value || "");
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesSearch = !query || normalize(card.dataset.search || card.textContent).includes(query);
      const isVisible = matchesCategory && matchesSearch;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    productGroups.forEach((group) => {
      group.hidden = !group.querySelector(".product-card:not([hidden])");
    });

    if (productCount) productCount.textContent = visibleCount;
    if (noResults) noResults.hidden = visibleCount !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        const isActive = item.dataset.filter === activeFilter;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      updateCatalog();

      if (button.classList.contains("category-tile")) {
        document.querySelector(".catalog-controls")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  searchInput?.addEventListener("input", updateCatalog);
});
