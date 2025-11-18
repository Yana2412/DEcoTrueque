// js/modules/auth-service.js
// Servicio de autenticación aislado.
// Por ahora usa localStorage como "BD" de prueba.
// Más adelante puedes cambiar SOLO este archivo para llamar a tu backend real
// (PHP, Node, etc.) con fetch() sin tocar el resto del front.

const STORAGE_KEY = 'usuariosEcotrueque';

function cargarUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    console.error('Error leyendo usuarios de localStorage', e);
    return [];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
}

/**
 * Registra un usuario nuevo
 * @param {{nombre:string, apellidos:string, telefono:string, direccion:string,
 *          email:string, password:string, fechaNacimiento:string}} datos
 * @returns {Promise<{ok:boolean, message:string, usuario?:object}>}
 */
export async function registrarUsuario(datos) {
  const usuarios = cargarUsuarios();

  // Verificar correo único
  const yaExiste = usuarios.some(
    (u) => u.email.toLowerCase() === datos.email.toLowerCase()
  );
  if (yaExiste) {
    return { ok: false, message: 'El correo ya está registrado.' };
  }

  const nuevoUsuario = {
    id: Date.now(),
    ...datos,
  };

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  // Dejar al usuario logueado
  const nombreCompleto = datos.apellidos
    ? `${datos.nombre} ${datos.apellidos}`
    : datos.nombre;

  localStorage.setItem(
    'usuarioActual',
    JSON.stringify({
      id: nuevoUsuario.id,
      nombre: nombreCompleto,
      email: nuevoUsuario.email,
    })
  );
  localStorage.setItem('usuarioNombre', datos.nombre);

  return { ok: true, message: 'Registro exitoso.', usuario: nuevoUsuario };
}

/**
 * Inicia sesión con email y password
 * @param {{email:string, password:string}} credenciales
 * @returns {Promise<{ok:boolean, message:string, usuario?:object}>}
 */
export async function loginUsuario({ email, password }) {
  const usuarios = cargarUsuarios();

  const usuario = usuarios.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!usuario) {
    return { ok: false, message: 'Correo o contraseña incorrectos.' };
  }

  const nombreCompleto = usuario.apellidos
    ? `${usuario.nombre} ${usuario.apellidos}`
    : usuario.nombre;

  localStorage.setItem(
    'usuarioActual',
    JSON.stringify({
      id: usuario.id,
      nombre: nombreCompleto,
      email: usuario.email,
    })
  );
  localStorage.setItem('usuarioNombre', usuario.nombre);

  return { ok: true, message: 'Inicio de sesión exitoso.', usuario };
}

// Helper opcional para cerrar sesión
export function logoutUsuario() {
  localStorage.removeItem('usuarioActual');
}
