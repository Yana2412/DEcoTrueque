// js/views/registerview.js
import { showLoginView } from './loginview.js';

export function showRegisterView() {
  const viewContainer = document.getElementById('view-container');
  const background = document.getElementById('background');
  const toggleBtn = document.getElementById('toggleBtn');
  const infoPanel = document.getElementById('infoPanel');

  // Cambiar fondo
  background.style.backgroundImage = "url('../assets/images/Login.png')";

  // Ocultar botón de info y panel
  if (toggleBtn) toggleBtn.style.display = 'none';
  if (infoPanel) infoPanel.style.display = 'none';

  // Renderizar vista
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