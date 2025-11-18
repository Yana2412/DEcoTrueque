// js/components/modal.js
// Controla los modales de Login y Registro en index.html
// Ahora delega la lógica de autenticación en js/modules/auth-service.js

import { loginUsuario, registrarUsuario } from '../modules/auth-service.js';

export function initModal() {
  // === Elementos comunes ===
  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');

  const openLoginBtn = document.getElementById('openLoginModal');
  const btnRegisterPanel = document.getElementById('btnRegister');

  const closeLoginBtn = document.getElementById('closeLoginModal');
  const closeRegisterBtn = document.getElementById('closeRegisterModal');

  const openRegisterFromLogin = document.getElementById('openRegisterFromLogin');
  const openLoginFromRegister = document.getElementById('openLoginFromRegister');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  function abrir(modal) {
    if (modal) modal.style.display = 'flex';
  }

  function cerrar(modal) {
    if (modal) modal.style.display = 'none';
  }

  // === Abrir / cerrar login ===
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => abrir(loginModal));
  }
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => cerrar(loginModal));
  }

  // === Abrir / cerrar registro ===
  if (btnRegisterPanel) {
    btnRegisterPanel.addEventListener('click', () => abrir(registerModal));
  }
  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', () => cerrar(registerModal));
  }

  // === Navegación entre modales ===
  if (openRegisterFromLogin) {
    openRegisterFromLogin.addEventListener('click', (e) => {
      e.preventDefault();
      cerrar(loginModal);
      abrir(registerModal);
    });
  }
  if (openLoginFromRegister) {
    openLoginFromRegister.addEventListener('click', (e) => {
      e.preventDefault();
      cerrar(registerModal);
      abrir(loginModal);
    });
  }

  // Cerrar al hacer clic fuera del contenido
  [loginModal, registerModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrar(modal);
      }
    });
  });

  // =====================
  //       LOGIN
  // =====================
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;

      if (!email || !password) {
        alert('Por favor completa todos los campos.');
        return;
      }

      try {
        const resp = await loginUsuario({ email, password });
        if (!resp.ok) {
          alert(resp.message || 'No fue posible iniciar sesión.');
          return;
        }

        alert('¡Inicio de sesión exitoso! 🎉');
        cerrar(loginModal);

        // Redirigir a la página principal
        window.location.href = 'main.html';
      } catch (err) {
        console.error('Error en login:', err);
        alert('Ocurrió un error al iniciar sesión.');
      }
    });
  }

  // =====================
  //       REGISTRO
  // =====================
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Limpiar mensajes previos
      const errorSpans = document.querySelectorAll('.error-message');
      errorSpans.forEach((span) => (span.textContent = ''));

      const nombre = document.getElementById('nombre')?.value.trim();
      const apellidoPaterno =
        document.getElementById('apellidoPaterno')?.value.trim();
      const apellidoMaterno =
        document.getElementById('apellidoMaterno')?.value.trim();
      const fechaNacimiento =
        document.getElementById('fechaNacimiento')?.value;
      const telefono = document.getElementById('telefono')?.value.trim();
      const direccion = document.getElementById('direccion')?.value.trim();

      // 🔹 Campos nuevos para registro
      const emailRegistro = document.getElementById('regEmail')?.value.trim();
      const passwordRegistro =
        document.getElementById('regPassword')?.value || '';

      let isValid = true;

      // --- Validaciones básicas ---
      if (!nombre) {
        const span = document.getElementById('nombre-error');
        if (span) span.textContent = 'El nombre es obligatorio.';
        isValid = false;
      }

      if (!apellidoPaterno) {
        const span = document.getElementById('apellidoP-error');
        if (span) span.textContent = 'El apellido paterno es obligatorio.';
        isValid = false;
      }

      if (!apellidoMaterno) {
        const span = document.getElementById('apellidoM-error');
        if (span) span.textContent = 'El apellido materno es obligatorio.';
        isValid = false;
      }

      const telefonoLimpio = (telefono || '').replace(/\D/g, '');

      if (!telefonoLimpio || !/^\d{10}$/.test(telefonoLimpio)) {
        const span = document.getElementById('telefono-error');
        if (span) span.textContent = 'Ingresa un teléfono válido de 10 dígitos.';
        isValid = false;
      } else {
        const span = document.getElementById('telefono-error');
        if (span) span.textContent = '';
      }

      if (!direccion) {
        // si quieres, puedes añadir un span-error para dirección
        isValid = false;
      }

      if (!emailRegistro || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRegistro)) {
        alert('Ingresa un correo electrónico válido para el registro.');
        isValid = false;
      }

      if (!passwordRegistro || passwordRegistro.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        isValid = false;
      }

      if (!isValid) {
        alert('Corrige los errores en el formulario.');
        return;
      }

      try {
        const datos = {
          nombre,
          apellidos: `${apellidoPaterno} ${apellidoMaterno}`,
          telefono: telefonoLimpio,
          direccion,
          email: emailRegistro,
          password: passwordRegistro,
          fechaNacimiento,
        };

        const resp = await registrarUsuario(datos);
        if (!resp.ok) {
          alert(resp.message || 'No fue posible registrar al usuario.');
          return;
        }

        alert('¡Registro exitoso! 🌿');
        cerrar(registerModal);

        // Como ya se queda logueado, mandamos directo a la página principal
        window.location.href = 'main.html';
      } catch (err) {
        console.error('Error en registro:', err);
        alert('Ocurrió un error al registrar al usuario.');
      }
    });
  }
}
