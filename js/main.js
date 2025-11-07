/**
 * Ecotrueque - Main Application Logic
 * SPA with dynamic views and correct event handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar panel informativo
  initInfoPanel();

  // Mostrar vista inicial (login)
  showLoginView();
});

// === PANEL INFORMATIVO ===
function initInfoPanel() {
  const toggleBtn = document.getElementById('toggleBtn');
  const infoPanel = document.getElementById('infoPanel');
  const closeBtn = document.getElementById('closeBtn');

  if (!toggleBtn || !infoPanel || !closeBtn) return;

  const openPanel = () => infoPanel.classList.add('open');
  const closePanel = () => infoPanel.classList.remove('open');

  toggleBtn.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('click', (e) => {
    if (!infoPanel.contains(e.target) && e.target !== toggleBtn) {
      closePanel();
    }
  });

  infoPanel.addEventListener('click', (e) => e.stopPropagation());
}

// === MOSTRAR VISTA DE LOGIN ===
function showLoginView() {
  const viewContainer = document.getElementById('view-container');
  const background = document.getElementById('background');
  const toggleBtn = document.getElementById('toggleBtn');
  const infoPanel = document.getElementById('infoPanel');

  // Cambiar fondo a Iniciooo.png
  background.style.backgroundImage = "url('../assets/images/Iniciooo.png')";

  // Mostrar botón de info y panel
  if (toggleBtn) toggleBtn.style.display = 'block';
  if (infoPanel) infoPanel.style.display = 'block';

  // Renderizar vista de login
  viewContainer.innerHTML = `
    <div class="login-panel">
      <h1>ECOTRUEQUE</h1>
      <p>Bienvenido,</p>
      <button class="btn btn--register" id="btnRegister">Registrarse</button>
      <button class="btn btn--login" id="openLoginModal">Iniciar sesión</button>
    </div>
  `;

  // Reasignar eventos
  document.getElementById('btnRegister').addEventListener('click', showRegisterView);
  document.getElementById('openLoginModal').addEventListener('click', openLoginModal);
}

// === FUNCIONES DEL MODAL DE LOGIN ===
function openLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) modal.style.display = 'none';
}

// === MOSTRAR VISTA DE REGISTRO ===
function showRegisterView() {
  const viewContainer = document.getElementById('view-container');
  const background = document.getElementById('background');
  const toggleBtn = document.getElementById('toggleBtn');
  const infoPanel = document.getElementById('infoPanel');

  // Cambiar fondo a Login.png
  background.style.backgroundImage = "url('../assets/images/Login.png')";

  // Ocultar botón de info y panel
  if (toggleBtn) toggleBtn.style.display = 'none';
  if (infoPanel) infoPanel.style.display = 'none';

  // Renderizar vista de registro
  viewContainer.innerHTML = `
    <div class="register-form">
      <h2>REGISTRO</h2>
      <div class="form-group">
        <label for="nombre">Nombre(s)</label>
        <input type="text" id="nombre" class="form-control" placeholder="Escribe tu nombre" required>
      </div>
      <div class="form-group">
        <label for="apellidoPaterno">Apellido Paterno</label>
        <input type="text" id="apellidoPaterno" class="form-control" placeholder="Escribe tu apellido paterno" required>
      </div>
      <div class="form-group">
        <label for="apellidoMaterno">Apellido Materno</label>
        <input type="text" id="apellidoMaterno" class="form-control" placeholder="Escribe tu apellido materno" required>
      </div>
      <div class="form-group">
        <label for="fechaNacimiento">Fecha de nacimiento</label>
        <input type="date" id="fechaNacimiento" class="form-control" value="2001-01-01" required>
      </div>
      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input type="tel" id="telefono" class="form-control" placeholder="962-406-3042" required>
      </div>
      <div class="form-group">
        <label for="direccion">Dirección</label>
        <input type="text" id="direccion" class="form-control" placeholder="Escribe tu dirección" required>
      </div>
      <button type="submit" class="btn">Registrar</button>
      <div class="login-link">
        Ya tienes una cuenta? <a href="#" id="backToLogin">Inicio</a>
      </div>
    </div>
  `;

  // Vincular evento de volver a login
  document.getElementById('backToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showLoginView();
  });

  // Vincular evento de registrar
  document.querySelector('.register-form button').addEventListener('click', (e) => {
    e.preventDefault();
    alert('¡Registro exitoso! 🌿');
    showLoginView(); // Volver a login después de registrar
  });
}

// === INICIALIZAR EVENTOS DEL MODAL ===
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeLoginModal');
  const switchRegister = document.getElementById('switchToRegister');
  const form = document.getElementById('loginForm');
  const modal = document.getElementById('loginModal');

  // Cerrar con la "X"
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLoginModal);
  }

  // Cerrar al hacer clic fuera
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLoginModal();
    });
  }

  // Enlace "¿No tienes cuenta? Regístrate"
  if (switchRegister) {
    switchRegister.addEventListener('click', (e) => {
      e.preventDefault();
      closeLoginModal();
      showRegisterView();
    });
  }

  // Manejo del formulario
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      if (!email || !password) {
        alert('Por favor completa todos los campos.');
        return;
      }
      alert('¡Autenticación exitosa! 🎉');
      closeLoginModal();
      // showMainView(); // <-- Descomenta cuando tengas la vista principal
    });
  }
});