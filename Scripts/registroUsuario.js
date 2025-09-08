// Obtener usuarios existentes o crear un array vacío
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

document.getElementById('userform').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('ccorreo').value;
    const contraseña = document.getElementById('contraseña').value;
    const telefono = document.getElementById('telefono').value;
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    // Crear objeto usuario
    const usuario = { nombre, correo, contraseña, telefono, region, comuna };

    // Agregar a la lista y guardar en localStorage
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado correctamente');
    this.reset();
});