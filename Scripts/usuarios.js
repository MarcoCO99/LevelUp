const usuarios = [];

document.getElementById('userform').addEventListener('submit', function(e) {
    e.preventDefault();

    //Formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('ccorreo').value;
    const contraseña = document.getElementById('contraseña').value;
    const telefono = document.getElementById('telefono').value;
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    const usuario = { nombre, correo, contraseña, telefono, region, comuna };
    usuarios.push(usuario);

    alert('Usuario registrado correctamente');
    this.reset();
});