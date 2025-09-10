let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderCarrito() {
  const carritoSpan = document.querySelector(".cant-carrito");
  const totalItems = carrito.reduce((acc, item) => acc + item.qty, 0);
  carritoSpan.textContent = totalItems;
}

function addToCarrito(producto) {
  const existe = carrito.find((item) => item.name === producto.name);

  if (existe) {
    existe.qty += 1;
  } else {
    carrito.push({...producto, qty: 1});
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

document.querySelectorAll(".btn-add").forEach((btn) => {
  btn.addEventListener("click", () => {
    const producto = {
      name: btn.dataset.name,
      price: Number(btn.dataset.price),
      image: btn.dataset.img,
    };
    addToCarrito(producto);
  });
});

renderCarrito();
