// ===== Mapeo Región -> Comunas =====
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

// ===== Helpers de almacenamiento =====
function obtenerUsuarios() {
  const raw = localStorage.getItem("usuarios");
  return raw ? JSON.parse(raw) : [];
}
function guardarUsuarios(lista) {
  localStorage.setItem("usuarios", JSON.stringify(lista));
}
function existeEmail(email) {
  return obtenerUsuarios().some(
    (u) => (u.email || "").toLowerCase() === email.toLowerCase()
  );
}
function agregarUsuario(usuario) {
  try {
    const raw = localStorage.getItem("usuarios");
    const lista = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(lista))
      throw new Error("La clave 'usuarios' no es lista");
    lista.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(lista));
    console.log("[registro] Usuario agregado. Total ahora:", lista.length);
  } catch (e) {
    console.error("[registro] Error guardando en localStorage.usuarios:", e);
    const lista = [usuario];
    localStorage.setItem("usuarios", JSON.stringify(lista));
    console.warn(
      "[registro] La clave 'usuarios' fue reescrita como nueva lista."
    );
  }
}

// ===== UI: alertas =====
function mostrarAlerta(msg, tipo = "danger", ms = 4000) {
  const cont = document.querySelector(".alert-container");
  if (!cont) return alert(msg);
  cont.innerHTML = `<div class="alert alert-${tipo}" role="alert">${msg}</div>`;
  if (ms > 0) setTimeout(() => (cont.innerHTML = ""), ms);
}

// ===== Calcular edad =====
function calcularEdad(yyyy_mm_dd) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - y;
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();
  if (mesActual < m || (mesActual === m && diaActual < d)) edad--;
  return edad;
}

// ===== Poblar comunas según región =====
function resetearComunasSelect(
  sel,
  placeholder = "Seleccione una región primero"
) {
  sel.innerHTML = "";
  const opt = document.createElement("option");
  opt.textContent = placeholder;
  opt.selected = true;
  opt.disabled = true;
  sel.appendChild(opt);
}
function cargarComunas(regionSelect, comunaSelect) {
  const comunas = REGIONES_COMUNAS[regionSelect.value] || [];
  resetearComunasSelect(comunaSelect, "Seleccione una comuna");
  comunas.forEach((c) => {
    const o = document.createElement("option");
    o.textContent = c;
    comunaSelect.appendChild(o);
  });
  comunaSelect.disabled = comunas.length === 0;
}

// ===== Validaciones =====
function validarCampos({
  nombre,
  fechaNacimiento,
  correo,
  ccorreo,
  contraseña,
  ccontraseña,
  telefono,
  region,
  comuna,
}) {
  if (
    !nombre.value.trim() ||
    !fechaNacimiento.value.trim() ||
    !correo.value.trim() ||
    !ccorreo.value.trim() ||
    !contraseña.value.trim() ||
    !ccontraseña.value.trim()
  ) {
    mostrarAlerta("Por favor, completa todos los campos requeridos.");
    return false;
  }

  // Email
  const email = correo.value.trim();
  const emailConf = ccorreo.value.trim();
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!reEmail.test(email)) {
    mostrarAlerta("El email no tiene un formato válido.");
    return false;
  }
  if (email !== emailConf) {
    mostrarAlerta("El email y su confirmación no coinciden.");
    return false;
  }

  // Contraseña
  if (contraseña.value !== ccontraseña.value) {
    mostrarAlerta("La contraseña y su confirmación no coinciden.");
    return false;
  }
  if (contraseña.value.length < 6) {
    mostrarAlerta("La contraseña debe tener al menos 6 caracteres.");
    return false;
  }

  // Teléfono opcional
  const tel = telefono.value.replace(/\D/g, "");
  if (telefono.value.trim() && tel.length < 8) {
    mostrarAlerta("El teléfono debe tener al menos 8 dígitos.");
    return false;
  }

  // Región / Comuna
  if (region.selectedIndex === 0) {
    mostrarAlerta("Selecciona una región.");
    return false;
  }
  if (comuna.disabled || comuna.selectedIndex === 0) {
    mostrarAlerta("Selecciona una comuna.");
    return false;
  }

  return true;
}

// ===== Construcción de usuario =====
function construirUsuario({
  nombre,
  fechaNacimiento,
  correo,
  contraseña,
  telefono,
  region,
  comuna,
}) {
  const edad = calcularEdad(fechaNacimiento.value);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    nombre: nombre.value.trim(),
    fechaNacimiento: fechaNacimiento.value,
    edad,
    email: correo.value.trim(),
    password: contraseña.value, // ⚠️ En producción nunca guardar en plano
    telefono: telefono.value.replace(/\D/g, ""),
    region: region.value,
    comuna: comuna.value,
    creadoEn: new Date().toISOString(),
  };
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userform");

  const refs = {
    nombre: document.getElementById("nombre"),
    fechaNacimiento: document.getElementById("fechaNacimiento"),
    correo: document.getElementById("correo"),
    ccorreo: document.getElementById("ccorreo"),
    contraseña: document.getElementById("contraseña"),
    ccontraseña: document.getElementById("ccontraseña"),
    telefono: document.getElementById("telefono"),
    region: document.getElementById("region"),
    comuna: document.getElementById("comuna"),
  };

  resetearComunasSelect(refs.comuna, "Seleccione una región primero");
  refs.comuna.disabled = true;

  refs.region.addEventListener("change", () => {
    if (refs.region.selectedIndex === 0) {
      resetearComunasSelect(refs.comuna, "Seleccione una región primero");
      refs.comuna.disabled = true;
      return;
    }
    cargarComunas(refs.region, refs.comuna);
    refs.comuna.disabled = false;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarCampos(refs)) return;

    // Edad: bloquear menores de 18 con modal
    const edad = calcularEdad(refs.fechaNacimiento.value);
    if (isNaN(edad) || edad < 18) {
      const modalEl = document.getElementById("minorModal");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      return;
    }

    const usuario = construirUsuario(refs);
    agregarUsuario(usuario);

    mostrarAlerta("Usuario registrado correctamente ✅", "success");
    form.reset();
    resetearComunasSelect(refs.comuna, "Seleccione una región primero");
    refs.comuna.disabled = true;
    refs.region.selectedIndex = 0;
  });
});
