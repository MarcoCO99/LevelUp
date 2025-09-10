// ========= Utilidades =========
function tryLeerUsuarios() {
  try {
    const raw = localStorage.getItem("usuarios");
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (e) {
    console.error("[usuariosTabla] JSON inválido en localStorage.usuarios:", e);
    return [];
  }
}
function obtenerUsuarios() {
  const list = tryLeerUsuarios();
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
  return t ? String(t).replace(/\D/g, "") : "";
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

  tbody.innerHTML = usuarios
    .map((u) => {
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
    })
    .join("");

  notificarAltura();
}

// ========= Init =========
document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "[usuariosTabla] origin:",
    location.origin,
    "path:",
    location.pathname
  );

  const inputFiltro = document.getElementById("filtroUsuarios");
  let usuarios = obtenerUsuarios();
  console.log("[usuariosTabla] usuarios leídos:", usuarios.length);
  renderUsuarios(usuarios);

  inputFiltro?.addEventListener("input", (e) => {
    renderUsuarios(aplicarFiltro(usuarios, e.target.value));
  });

  // Refresco por storage (otro tab mismo origen)
  window.addEventListener("storage", (e) => {
    if (e.key === "usuarios") {
      usuarios = obtenerUsuarios();
      renderUsuarios(aplicarFiltro(usuarios, inputFiltro?.value || ""));
    }
  });

  // Refresco al volver a la pestaña
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      usuarios = obtenerUsuarios();
      renderUsuarios(aplicarFiltro(usuarios, inputFiltro?.value || ""));
    }
  });

  // Refresco forzado cada 2s (parche)
  setInterval(() => {
    const nuevos = obtenerUsuarios();
    if (nuevos.length !== usuarios.length) {
      usuarios = nuevos;
      renderUsuarios(aplicarFiltro(usuarios, inputFiltro?.value || ""));
    }
  }, 2000);

  // Auto-resize inicial y ante cambios de layout
  window.addEventListener("resize", notificarAltura);
  new ResizeObserver(() => notificarAltura()).observe(document.body);
});
