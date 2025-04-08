const circle = document.querySelector(".invert-circle");

document.addEventListener("mousemove", (e) => {
  circle.style.left = `${e.clientX}px`;
  circle.style.top = `${e.clientY}px`;
});
