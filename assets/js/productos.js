let cantCarrito = 0;

const carritoSpan = document.querySelector(".cant-carrito");

function renderCarrito() {
  carritoSpan.textContent = cantCarrito;
}

const botones = document.querySelectorAll(".btn-add");

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    cantCarrito++;
    renderCarrito();
  });
});

renderCarrito();
