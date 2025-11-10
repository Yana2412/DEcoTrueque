// js/components/modal.js

export function initModal() {
  // === MODAL DE LOGIN ===
  const loginModal = document.getElementById('loginModal');
  const openLoginBtn = document.getElementById('openLoginModal');
  const closeLoginBtn = document.getElementById('closeLoginModal');
  const openRegisterFromLogin = document.getElementById('openRegisterFromLogin');

  // Abrir login
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'flex';
    });
  }

  // Cerrar login
  if (closeLoginBtn) {
    closeLoginBtn.addEventListener('click', () => {
      if (loginModal) loginModal.style.display = 'none';
    });
  }

  // Abrir registro desde login
  if (openRegisterFromLogin) {
    openRegisterFromLogin.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.style.display = 'none';
      const registerModal = document.getElementById('registerModal');
      if (registerModal) registerModal.style.display = 'flex';
    });
  }

  // Cerrar login al hacer clic fuera
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) loginModal.style.display = 'none';
    });
  }

  // === MODAL DE REGISTRO ===
  const registerModal = document.getElementById('registerModal');
  const openRegisterBtn = document.getElementById('btnRegister');
  const closeRegisterBtn = document.getElementById('closeRegisterModal');
  const openLoginFromRegister = document.getElementById('openLoginFromRegister');

  // Abrir registro desde botón principal
  if (openRegisterBtn) {
    openRegisterBtn.addEventListener('click', () => {
      if (registerModal) registerModal.style.display = 'flex';
    });
  }

  // Cerrar registro
  if (closeRegisterBtn) {
    closeRegisterBtn.addEventListener('click', () => {
      if (registerModal) registerModal.style.display = 'none';
    });
  }

  // Abrir login desde registro
  if (openLoginFromRegister) {
    openLoginFromRegister.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerModal) registerModal.style.display = 'none';
      if (loginModal) loginModal.style.display = 'flex';
    });
  }

  // Cerrar registro al hacer clic fuera
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) registerModal.style.display = 'none';
    });
  }

  // === VALIDACIÓN EN TIEMPO REAL ===
  const textInputs = ['nombre', 'apellidoPaterno', 'apellidoMaterno'];
  textInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        let value = input.value;
        // Solo letras y espacios
        value = value.replace(/[^a-zA-Z\s]/g, '');
        input.value = value;

        const errorSpan = document.getElementById(`${id}-error`);
        if (errorSpan) {
          if (value.trim() === '') {
            errorSpan.textContent = 'Este campo es obligatorio';
          } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            errorSpan.textContent = 'Solo letras y espacios';
          } else {
            errorSpan.textContent = '';
          }
        }
      });
    }
  });

  // Validar teléfono
  const phoneInput = document.getElementById('telefono');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let value = phoneInput.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      phoneInput.value = value;

      const errorSpan = document.getElementById('telefono-error');
      if (errorSpan) {
        if (value.length === 0) {
          errorSpan.textContent = 'Este campo es obligatorio';
        } else if (value.length !== 10) {
          errorSpan.textContent = 'Debe tener 10 dígitos';
        } else {
          errorSpan.textContent = '';
        }
      }
    });
  }

  // === FORMULARIOS ===
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      if (!email || !password) {
        alert('Por favor completa todos los campos.');
        return;
      }
      alert('¡Inicio de sesión exitoso! 🎉');
      if (loginModal) loginModal.style.display = 'none';
      // Redirigir a la página principal
      window.location.href = 'main.html';
    });
  }

  // Registro
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validar campos
      let isValid = true;
      const errorSpans = [];

      // Validar nombre y apellidos
      textInputs.forEach(id => {
        const input = document.getElementById(id);
        const value = input.value.trim();
        const errorSpan = document.getElementById(`${id}-error`);
        if (value === '' || !/^[a-zA-Z\s]+$/.test(value)) {
          if (errorSpan) {
            errorSpan.textContent = 'Solo letras y espacios';
            errorSpans.push(errorSpan);
          }
          isValid = false;
        }
      });

      // Validar teléfono
      const phone = phoneInput.value;
      const phoneError = document.getElementById('telefono-error');
      if (phone.length !== 10) {
        if (phoneError) {
          phoneError.textContent = 'Debe tener 10 dígitos';
          errorSpans.push(phoneError);
        }
        isValid = false;
      }

      if (!isValid) {
        alert('Corrige los errores en el formulario.');
        return;
      }

      alert('¡Registro exitoso! 🌿');
      if (registerModal) registerModal.style.display = 'none';
    });
  }
}