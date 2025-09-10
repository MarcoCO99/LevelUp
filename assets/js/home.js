const contenedorHome = document.getElementById("productosHome");

// Seleccionar los 3 primeros productos como ejemplo
const destacados = productos.slice(0, 9);

// Función para dibujar productos en el home
function mostrarProductosHome(lista) {
  lista.forEach(p => {
    contenedorHome.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
          <div class="card-body text-center">
            <h5 class="card-title text-neon">${p.nombre}</h5>
            <p class="card-text">$${p.precio.toLocaleString("es-CL")}</p>
            <button class="btn btn-primary btn-add-carrito" data-id="${p.id}">Añadir al carrito</button>
            <a href="detalleProducto.html?id=${p.id}" class="btn btn-outline-light">Detalles</a>
          </div>
        </div>
      </div>
    `;
  });

   document.querySelectorAll('.btn-add-carrito').forEach(btn => {
    btn.addEventListener('click', function() {
      const idProducto = parseInt(this.getAttribute('data-id'));
      const producto = productos.find(prod => prod.id === idProducto);
      if (producto) {
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(producto);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`"${producto.nombre}" añadido al carrito.`);
      }
    });
  });
}

// Mostrar los destacados en la página principal
mostrarProductosHome(destacados);