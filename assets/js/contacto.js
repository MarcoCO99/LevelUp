(() => {
  const form = document.getElementById("userform");

  const email = document.getElementById("inputEmail4");
  const nombre = document.getElementById("nombre");
  const cont = document.getElementById("contenido");

  const EMAIL_RE = /^[a-z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

  function validateEmail() {
    const raw = email.value.trim().toLowerCase();
    const ok = EMAIL_RE.test(raw);
    email.setCustomValidity(
      ok ? "" : "Correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com"
    );
    return ok;
  }

  function validateNombre() {
    const ok =
      nombre.value.trim().length > 0 && nombre.value.trim().length <= 100;
    nombre.setCustomValidity(
      ok ? "" : "El nombre es obligatorio y máx. 100 caracteres"
    );
    return ok;
  }

  function validateContenido() {
    const txt = cont.value.trim();
    const ok = txt.length > 0 && txt.length <= 500;
    cont.setCustomValidity(
      ok ? "" : "El contenido es obligatorio y máx. 500 caracteres"
    );
    return ok;
  }

  form.addEventListener("submit", (e) => {
    email.value = email.value.trim();

    const ok = validateNombre() & validateEmail() & validateContenido();

    if (!ok || !form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
    }
    form.classList.add("was-validated");
  });
})();
