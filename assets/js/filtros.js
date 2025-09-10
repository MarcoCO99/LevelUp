function aplicarFiltros() {
    const categoria = document.getElementById('filtroCategoria').value;
    const marca = document.getElementById('filtroMarca').value;


    let productosFiltrados = productos;

    if (categoria) {
        productosFiltrados = productosFiltrados.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }
    if (marca) {
        productosFiltrados = productosFiltrados.filter(p => p.marca.toLowerCase() === marca.toLowerCase());
    }

    mostrarProductos(productosFiltrados);
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById("productosHome");
    contenedor.innerHTML = ""; // Limpiar antes de mostrar

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
                        <button class="btn btn-primary">Añadir al carrito</button>
                        <a href="detalleProducto.html?id=${p.id}" class="btn btn-outline-light">Detalles</a>
                    </div>
                </div>
            </div>
        `;
    });
}

function resetFiltros() {
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroMarca').value = '';
    mostrarProductos(productos); // Muestra todos los productos
}