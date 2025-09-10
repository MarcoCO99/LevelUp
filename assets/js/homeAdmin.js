document.addEventListener("DOMContentLoaded", () => {
  const iframe = document.getElementById("usuariosFrame");

  // Ajusta altura con mensajes del hijo
  window.addEventListener("message", (ev) => {
    // Si tienes dominio fijo, valida el origin: if (ev.origin !== window.location.origin) return;
    const data = ev.data || {};
    if (
      data.type === "usuariosTabla:height" &&
      typeof data.height === "number"
    ) {
      iframe.style.height = Math.max(400, data.height + 20) + "px";
    }
  });
});
