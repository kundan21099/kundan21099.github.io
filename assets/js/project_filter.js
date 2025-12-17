document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("projectGrid");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const select = document.getElementById("sortSelect");

  // Initial numbering (default view)
  renderDefault();

  select.addEventListener("change", () => {
    const key = select.value;
    if (!key) {
      renderDefault();
    } else {
      renderSorted(key);
    }
  });

  // ---------------- DEFAULT VIEW ----------------
  function renderDefault() {
    grid.innerHTML = "";
    cards.forEach(card => grid.appendChild(card));
    renumberContinuous();
  }

  function renumberContinuous() {
    cards.forEach((card, index) => {
      const num = card.querySelector(".project-number");
      if (num) num.textContent = `${index + 1}. `;
    });
  }

  // ---------------- SORTED VIEW ----------------
  function renderSorted(key) {
    grid.innerHTML = "";
    const groups = {};

    cards.forEach(card => {
      let value = card.dataset[key];

      // Special handling for protocol
      if (key === "protocol") {
        if (!value || value === "NA") {
          value = "No Protocol Used";
        }
      } else {
        if (!value || value === "NA") return;
      }

      const values =
        key === "protocol"
          ? value.split(",").map(v => v.trim())
          : [value];

      values.forEach(v => {
        if (!groups[v]) groups[v] = [];
        groups[v].push(card);
      });
    });

    Object.keys(groups)
      .sort((a, b) => {
        if (a === "No Protocol Used") return 1;
        if (b === "No Protocol Used") return -1;
        return key === "year" ? b - a : a.localeCompare(b);
      })
      .forEach(group => {
        // Group header
        const header = document.createElement("h2");
        header.className = "project-group-header";
        header.textContent = group;
        grid.appendChild(header);

        // Group projects with RESET numbering
        groups[group].forEach((card, index) => {
          const num = card.querySelector(".project-number");
          if (num) num.textContent = `${index + 1}. `;
          grid.appendChild(card);
        });
      });
  }
});
