let carrito = [];

const productos = [
];

function mostrarProductos(lista) {
    const contenedor = document.getElementById("productosHome");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center"><p>No se encontraron productos.</p></div>`;
        return;
    }

    lista.forEach(p => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title text-neon">${p.nombre}</h5>
                        <p class="card-text">$${p.precio.toLocaleString("es-CL")}</p>
                        <button class="btn btn-primary btn-add-carrito" data-id="${p.id}">Añadir al carrito</button>
                        <a href="detalleProducto.html?id=${p.id}" class="btn btn-outline-light mt-2">Detalles</a>
                    </div>
                </div>
            </div>
        `;
    });

    // Agregar eventos a los botones de "Añadir al carrito"
    document.querySelectorAll('.btn-add-carrito').forEach(btn => {
        btn.addEventListener('click', function() {
            const idProducto = parseInt(this.getAttribute('data-id'));
            const producto = productos.find(prod => prod.id === idProducto);
            if (producto) {
                carrito.push(producto);
                alert(`"${producto.nombre}" añadido al carrito.`);
                // (Opcional) Guarda el carrito en localStorage:
                // localStorage.setItem('carrito', JSON.stringify(carrito));
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarCarrito();
});

function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById("carritoProductos");
    contenedor.innerHTML = "";

    if (carrito.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center"><p><strong>No hay productos en el carrito.</strong></p></div>`;
        return;
    }
    // Botón para vaciar carrito
    const containerPadre = contenedor.parentElement;
    let btnVaciar = document.getElementById("btnVaciarCarrito");
    if (!btnVaciar) {
        btnVaciar = document.createElement("button");
        btnVaciar.id = "btnVaciarCarrito";
        btnVaciar.className = "btn btn-danger mb-4";
        btnVaciar.textContent = "Vaciar carrito";
        btnVaciar.onclick = function() {
            localStorage.removeItem('carrito');
            mostrarCarrito();
        };
        containerPadre.insertBefore(btnVaciar, contenedor);
    }

    if (carrito.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center"><p>No hay productos en el carrito.</p></div>`;
        btnVaciar.style.display = "none";
        return;
    } else {
        btnVaciar.style.display = "inline-block";
    }

   carrito.forEach((p, idx) => {
        contenedor.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title text-neon">${p.nombre}</h5>
                        <p class="card-text">$${p.precio.toLocaleString("es-CL")}</p>
                        <button class="btn btn-danger btn-eliminar-producto" data-idx="${idx}">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    });

    // Botones eliminar producto
    document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            carrito.splice(idx, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        });
    });
}