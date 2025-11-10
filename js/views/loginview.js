// views/loginview.js
import { showRegisterView } from './registerview.js';

export function showLoginView() {
  const viewContainer = document.getElementById('view-container');
  const background = document.getElementById('background');
  const toggleBtn = document.getElementById('toggleBtn');
  const infoPanel = document.getElementById('infoPanel');

  // Cambiar fondo
  background.style.backgroundImage = "url('../assets/images/Iniciooo.png')";

  // Mostrar botón de info y panel
  if (toggleBtn) toggleBtn.style.display = 'block';
  if (infoPanel) infoPanel.style.display = 'block';

  // Renderizar vista
  viewContainer.innerHTML = `
    <div class="login-panel">
      <h1>ECOTRUEQUE</h1>
      <p>Bienvenido,</p>
      <button class="btn btn--register" id="btnRegister">Registrarse</button>
      <button class="btn btn--login" id="openLoginModal">Iniciar sesión</button>
    </div>
  `;

  // Vincular eventos
  document.getElementById('btnRegister').addEventListener('click', showRegisterView);
  document.getElementById('openLoginModal').addEventListener('click', () => {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
  });
}

<button class="btn btn--primary" id="openHomeFromLogin">Ir a la página principal</button>