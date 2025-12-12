document.addEventListener("DOMContentLoaded", () => {
  console.log("skills.js is loaded!");
  const skillBars = document.querySelectorAll('.skill-level');
  skillBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    setTimeout(() => {
      bar.style.width = level;
    }, 100);
  });
});