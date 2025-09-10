/* ================== Config ================== */
const REGIONES_COMUNAS = {
  "Región de Valparaíso": [
    "Valparaíso",
    "Viña del Mar",
    "Quilpué",
    "Villa Alemana",
    "Concón",
    "Quillota",
    "La Calera",
    "San Antonio",
    "Los Andes",
    "San Felipe",
  ],
  "Región Metropolitana": [
    "Santiago",
    "Providencia",
    "Las Condes",
    "Vitacura",
    "Lo Barnechea",
    "Ñuñoa",
    "La Florida",
    "Puente Alto",
    "Maipú",
    "San Bernardo",
  ],
};

/* ================== Helpers LocalStorage ================== */
function lsGetUsers() {
  try {
    const raw = localStorage.getItem("usuarios");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function lsSetUsers(list) {
  localStorage.setItem("usuarios", JSON.stringify(list));
}
function calcularEdad(yyyy_mm_dd) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - y;
  const mes = hoy.getMonth() + 1;
  const dia = hoy.getDate();
  if (mes < m || (mes === m && dia < d)) edad--;
  return edad;
}
function formatearFecha(s) {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("es-CL");
  } catch {
    return s;
  }
}
function uid() {
  return (crypto.randomUUID && crypto.randomUUID()) || String(Date.now());
}

/* ================== Render Tabla ================== */
function renderTabla() {
  const tbody = document.getElementById("tbodyUsuarios");
  const vacio = document.getElementById("estadoVacio");
  const total = document.getElementById("totalUsuarios");
  const filtro =
    document.getElementById("filtroUsuarios")?.value.toLowerCase() || "";

  let usuarios = lsGetUsers().sort(
    (a, b) => new Date(b.creadoEn || 0) - new Date(a.creadoEn || 0)
  );
  if (filtro) {
    usuarios = usuarios.filter(
      (u) =>
        (u.nombre || "").toLowerCase().includes(filtro) ||
        (u.email || "").toLowerCase().includes(filtro)
    );
  }

  tbody.innerHTML = "";
  if (!usuarios.length) {
    vacio.classList.remove("d-none");
    total.textContent = "0";
    return;
  }
  vacio.classList.add("d-none");
  total.textContent = usuarios.length;

  tbody.innerHTML = usuarios
    .map(
      (u) => `
    <tr data-id="${u.id}">
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${u.edad}</td>
      <td>${formatearFecha(u.fechaNacimiento)}</td>
      <td>${u.telefono ? "+56 " + u.telefono : ""}</td>
      <td>${u.region}</td>
      <td>${u.comuna}</td>
      <td>${formatearFecha(u.creadoEn)}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary me-1 btn-edit"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger btn-del"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `
    )
    .join("");
}

/* ================== Modal Helpers ================== */
let usuarioModal;
function resetComunasSelect(
  sel,
  placeholder = "Seleccione una región primero"
) {
  sel.innerHTML = `<option selected disabled>${placeholder}</option>`;
}
function cargarComunas(regionSelect, comunaSelect) {
  const comunas = REGIONES_COMUNAS[regionSelect.value] || [];
  resetComunasSelect(comunaSelect, "Seleccione una comuna");
  comunas.forEach((c) => {
    const o = document.createElement("option");
    o.textContent = c;
    comunaSelect.appendChild(o);
  });
  comunaSelect.disabled = !comunas.length;
}
function openModalCrear() {
  document.getElementById("formUsuario").reset();
  document.getElementById("usuarioId").value = "";
  document.getElementById("usuarioModalLabel").textContent = "Nuevo usuario";
  resetComunasSelect(document.getElementById("uComuna"));
  document.getElementById("uComuna").disabled = true;
  hideModalAlert();
  usuarioModal.show();
}
function openModalEditar(user) {
  document.getElementById("formUsuario").reset();
  document.getElementById("usuarioId").value = user.id;
  document.getElementById("usuarioModalLabel").textContent = "Editar usuario";
  document.getElementById("uNombre").value = user.nombre;
  document.getElementById("uEmail").value = user.email;
  document.getElementById("uFecha").value = user.fechaNacimiento;
  document.getElementById("uTelefono").value = user.telefono || "";
  document.getElementById("uRegion").value = user.region;
  cargarComunas(
    document.getElementById("uRegion"),
    document.getElementById("uComuna")
  );
  document.getElementById("uComuna").disabled = false;
  document.getElementById("uComuna").value = user.comuna;
  hideModalAlert();
  usuarioModal.show();
}
function showModalAlert(msg) {
  const box = document.getElementById("modalAlert");
  box.textContent = msg;
  box.classList.remove("d-none");
}
function hideModalAlert() {
  const box = document.getElementById("modalAlert");
  box.classList.add("d-none");
  box.textContent = "";
}

/* ================== Validaciones ================== */
function validarUsuario({
  id,
  nombre,
  email,
  fecha,
  telefono,
  region,
  comuna,
}) {
  if (!nombre || !email || !fecha) {
    showModalAlert("Completa nombre, email y fecha de nacimiento.");
    return false;
  }
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!reEmail.test(email)) {
    showModalAlert("Email inválido.");
    return false;
  }
  const edad = calcularEdad(fecha);
  if (isNaN(edad) || edad < 18) {
    showModalAlert("Debe ser mayor de 18 años.");
    return false;
  }
  if (!region) {
    showModalAlert("Selecciona una región.");
    return false;
  }
  if (!comuna) {
    showModalAlert("Selecciona una comuna.");
    return false;
  }
  const lista = lsGetUsers();
  const existe = lista.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase() && u.id !== id
  );
  if (existe) {
    showModalAlert("Ya existe un usuario con ese email.");
    return false;
  }
  return true;
}

/* ================== Eventos ================== */
document.addEventListener("DOMContentLoaded", () => {
  usuarioModal = new bootstrap.Modal(document.getElementById("usuarioModal"));
  document
    .getElementById("filtroUsuarios")
    .addEventListener("input", renderTabla);
  document
    .getElementById("btnNuevoUsuario")
    .addEventListener("click", openModalCrear);
  document.getElementById("uRegion").addEventListener("change", () => {
    cargarComunas(
      document.getElementById("uRegion"),
      document.getElementById("uComuna")
    );
    document.getElementById("uComuna").disabled = false;
  });

  document.getElementById("formUsuario").addEventListener("submit", (e) => {
    e.preventDefault();
    hideModalAlert();
    const id = document.getElementById("usuarioId").value || null;
    const nombre = document.getElementById("uNombre").value.trim();
    const email = document.getElementById("uEmail").value.trim();
    const fecha = document.getElementById("uFecha").value;
    const telefono = document.getElementById("uTelefono").value.trim();
    const region = document.getElementById("uRegion").value;
    const comuna = document.getElementById("uComuna").value;

    if (!validarUsuario({ id, nombre, email, fecha, telefono, region, comuna }))
      return;
    const edad = calcularEdad(fecha);
    let lista = lsGetUsers();

    if (id) {
      const idx = lista.findIndex((u) => u.id === id);
      if (idx === -1) return;
      lista[idx] = {
        ...lista[idx],
        nombre,
        email,
        fechaNacimiento: fecha,
        edad,
        telefono,
        region,
        comuna,
      };
    } else {
      lista.push({
        id: uid(),
        nombre,
        email,
        fechaNacimiento: fecha,
        edad,
        telefono,
        region,
        comuna,
        creadoEn: new Date().toISOString(),
      });
    }
    lsSetUsers(lista);
    usuarioModal.hide();
    renderTabla();
  });

  document.getElementById("tbodyUsuarios").addEventListener("click", (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    const id = tr.getAttribute("data-id");
    const lista = lsGetUsers();
    const user = lista.find((u) => u.id === id);
    if (!user) return;
    if (e.target.closest(".btn-edit")) {
      openModalEditar(user);
    }
    if (e.target.closest(".btn-del")) {
      if (confirm(`¿Eliminar a "${user.nombre}"?`)) {
        lsSetUsers(lista.filter((u) => u.id !== id));
        renderTabla();
      }
    }
  });

  renderTabla();
  window.addEventListener("storage", (e) => {
    if (e.key === "usuarios") renderTabla();
  });
});
