const btn = document.querySelector("#mobile-menu-btn");
const menu = document.querySelector("#mobile-menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("md:hidden");
  menu.classList.toggle("hidden");
});
