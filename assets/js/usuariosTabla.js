// ========= Utilidades =========
function obtenerUsuarios() {
  const raw = localStorage.getItem("usuarios");
  const list = raw ? JSON.parse(raw) : [];
  return list.sort(
    (a, b) => new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0)
  );
}

function formatearFecha(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return isoStr;
  }
}

function limpiarTelefono(t) {
  if (!t) return "";
  return String(t).replace(/\D/g, "");
}

function aplicarFiltro(usuarios, termino) {
  if (!termino) return usuarios;
  const q = termino.trim().toLowerCase();
  return usuarios.filter(
    (u) =>
      (u.nombre || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
  );
}

// ========= Resize al padre (iframe) =========
function notificarAltura() {
  const h = document.documentElement.scrollHeight;
  window.parent?.postMessage({ type: "usuariosTabla:height", height: h }, "*");
}

// ========= Render =========
function renderUsuarios(usuarios) {
  const tbody = document.getElementById("tbodyUsuarios");
  const vacio = document.getElementById("estadoVacio");
  const total = document.getElementById("totalUsuarios");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!usuarios.length) {
    vacio?.classList.remove("d-none");
    if (total) total.textContent = "0";
    notificarAltura();
    return;
  }

  vacio?.classList.add("d-none");
  if (total) total.textContent = String(usuarios.length);

  const rows = usuarios.map((u) => {
    const tel = limpiarTelefono(u.telefono);
    return `
      <tr>
        <td>${u.nombre ?? ""}</td>
        <td>${u.email ?? ""}</td>
        <td>${u.edad ?? ""}</td>
        <td>${u.fechaNacimiento ? formatearFecha(u.fechaNacimiento) : ""}</td>
        <td>${tel ? `+56 ${tel}` : ""}</td>
        <td>${u.region ?? ""}</td>
        <td>${u.comuna ?? ""}</td>
        <td>${u.creadoEn ? formatearFecha(u.creadoEn) : ""}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rows.join("");
  notificarAltura();
}

// ========= Init =========
document.addEventListener("DOMContentLoaded", () => {
  const inputFiltro = document.getElementById("filtroUsuarios");

  let usuarios = obtenerUsuarios();
  renderUsuarios(usuarios);

  inputFiltro?.addEventListener("input", (e) => {
    const filtrados = aplicarFiltro(usuarios, e.target.value);
    renderUsuarios(filtrados);
  });

  // Auto-resize inicial y ante cambios de layout
  window.addEventListener("resize", notificarAltura);
  const ro = new ResizeObserver(() => notificarAltura());
  ro.observe(document.body);

  // Refrescar al cambiar localStorage en otra pestaña/ventana
  window.addEventListener("storage", (e) => {
    if (e.key === "usuarios") {
      usuarios = obtenerUsuarios();
      const filtrados = aplicarFiltro(usuarios, inputFiltro?.value || "");
      renderUsuarios(filtrados);
    }
  });
});
