// ================== ADMIN FIJO (NO localStorage) ==================
// Cambia estas credenciales a las que quieras
const ADMIN_EMAIL = "admin@levelup.com";
const ADMIN_PASSWORD = "Admin1234!";

// ================== Usuarios normales (sí usan localStorage) ==================
function obtenerUsuarios() {
  const raw = localStorage.getItem("usuarios");
  return raw ? JSON.parse(raw) : [];
}

// ================== Login ==================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("userform");
  const inputEmail = document.getElementById("correo");
  const inputPass = document.getElementById("contrasena");

  if (!form) {
    console.warn("Formulario de inicio de sesión no encontrado.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim();
    const pass = inputPass.value.trim();

    // 1) Admin fijo
    if (
      email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      pass === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem("isAdmin", "true");
      sessionStorage.removeItem("usuarioActual");
      window.location.href = "homeAdmin.html";
      return;
    }

    // 2) Usuario normal
    const usuarios = obtenerUsuarios();
    const user = usuarios.find(
      (u) =>
        u.email?.toLowerCase() === email.toLowerCase() && u.password === pass
    );

    if (!user) {
      alert("Credenciales incorrectas.");
      return;
    }

    sessionStorage.setItem("isAdmin", "false");
    sessionStorage.setItem("usuarioActual", JSON.stringify(user));
    window.location.href = "index.html"; // cámbialo a la página pública de tu tienda
  });
});
