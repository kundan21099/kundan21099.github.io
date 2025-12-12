document.addEventListener("DOMContentLoaded", () => {
  const skillBars = document.querySelectorAll('.skill-level');
  skillBars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    setTimeout(() => {
      bar.style.width = level;
    }, 100);
  });
});