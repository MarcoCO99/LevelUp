const CART_KEY = "carrito";
const $items = document.getElementById("cart-items");
const $total = document.getElementById("cart-total");

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function countItems(cart) {
  return cart.reduce((acc, it) => acc + (it.qty || 0), 0);
}
function cartSum(cart) {
  return cart.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 0), 0);
}

function renderNavbarCount(cart) {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = countItems(cart);
  });
}

function itemTemplate(item, index) {
  const img = item.image || "https://via.placeholder.com/300";
  return `
    <div class="card border-0" style="background:#1f1d1e; color:#fff;">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-3 col-md-2">
            <div class="ratio ratio-1x1 border rounded">
              <img src="${img}" class="rounded object-fit-cover" alt="${
    item.name
  }">
            </div>
          </div>

          <div class="col-9 col-md-6">
            <div class="fw-semibold">${item.name}</div>
            <small class="text-secondary d-none d-md-block">Cantidad: ${
              item.qty
            }</small>
          </div>

          <div class="col-6 col-md-2 text-md-end">
            <div class="fw-semibold">${CLP.format(item.price)}</div>
          </div>

          <div class="col-6 col-md-2">
            <div class="input-group input-group-sm">
              <button class="btn btn-outline-light" data-action="dec" data-index="${index}">
                <i class="bi bi-dash"></i>
              </button>
              <input type="number"
                     class="form-control text-center bg-transparent text-white qty-input"
                     value="${item.qty}" min="1" data-index="${index}">
              <button class="btn btn-outline-light" data-action="inc" data-index="${index}">
                <i class="bi bi-plus"></i>
              </button>
              <button class="btn btn-outline-danger ms-2" data-action="remove" data-index="${index}" title="Eliminar">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function renderCart() {
  const cart = loadCart();

  if (!cart.length) {
    $items.innerHTML = `<div class="text-secondary">Tu carrito está vacío.</div>`;
  } else {
    $items.innerHTML = cart.map(itemTemplate).join("");
  }
  $total.textContent = CLP.format(cartSum(cart));
  renderNavbarCount(cart);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const index = Number(btn.dataset.index);
  const cart = loadCart();
  const item = cart[index];
  if (!item) return;

  if (action === "inc") item.qty += 1;
  if (action === "dec") item.qty = Math.max(1, item.qty - 1);
  if (action === "remove") cart.splice(index, 1);

  saveCart(cart);
  renderCart();
});

document.addEventListener("change", (e) => {
  const input = e.target.closest(".qty-input");
  if (!input) return;

  const index = Number(input.dataset.index);
  const cart = loadCart();
  const item = cart[index];
  if (!item) return;

  const val = Math.max(1, parseInt(input.value || "1", 10));
  item.qty = val;

  saveCart(cart);
  renderCart();
});

document.addEventListener("DOMContentLoaded", renderCart);
