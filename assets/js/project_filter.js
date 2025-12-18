document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("projectGrid");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  // Initial numbering (default view)
  renderDefault();

  // Event listener for sorting
  const dropdown = document.querySelector(".dropdown");
  const dropbtn = dropdown.querySelector(".dropbtn");
  const dropdownContent = dropdown.querySelector(".dropdown-content");
  const dropdownLinks = dropdownContent.querySelectorAll("a");

  // Toggle dropdown on button click
  dropbtn.addEventListener("click", e => {
    e.stopPropagation(); // prevent click bubbling
    dropdownContent.classList.toggle("show");
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", () => {
    dropdownContent.classList.remove("show");
  });

  // Handle sorting when link clicked
  dropdownLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault(); // prevent jump
      const key = link.dataset.sort;

      // Call your sorting functions
      if (!key) {
        renderDefault(); // your existing function
      } else {
        renderSorted(key); // your existing function
      }

      // Update button text
      dropbtn.textContent = "Sort projects by: " + link.textContent;

      // Close dropdown
      dropdownContent.classList.remove("show");
    });
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

      // Common Special handling for protocol and microcontoller
      const fallbackLabels = {
        protocol: "No Protocol Used",
        microcontroller: "No Microcontroller Used"
      };

      if (fallbackLabels[key]) {
        if (!value || value === "NA") {
          value = fallbackLabels[key];
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
        if (a === "No Microcontroller Used") return 1;
        if (b === "No Microcontroller Used") return -1;
        if (a === "Other") return 1;
        if (b === "Other") return -1;        
        if (a === "Completed") return 1;
        if (b === "Completed") return -1;
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
