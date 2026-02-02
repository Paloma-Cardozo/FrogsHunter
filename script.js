document.querySelectorAll(".flip-card-inner").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});
