// js/components/profile-dropdown.js

export function initProfileDropdown() {
  console.log("Dropdown de perfil inicializado");
  
  const profileIcon = document.getElementById('profileIcon');
  const profileDropdown = document.getElementById('profileDropdown');

  if (!profileIcon || !profileDropdown) {
    console.warn('Elementos del dropdown de perfil no encontrados');
    return;
  }

  // Toggle del dropdown
  profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('open');
  });

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('open');
    }
  });

  // Cerrar dropdown al presionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      profileDropdown.classList.remove('open');
    }
  });

  // Funcionalidad de las opciones del dropdown
  profileDropdown.querySelectorAll('li').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = option.textContent.trim();
      
      switch(action) {
        case 'Cerrar Sesión':
          if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem('usuarioLogueado');
            window.location.href = 'index.html';
          }
          break;
        case 'Mi Perfil':
          showProfileView();
          break;
        case 'Historial de Trueques':
          showHistoryView();
          break;
        case 'Configuración':
          showSettingsView();
          break;
      }
      
      profileDropdown.classList.remove('open');
    });
  });
}

// Funciones para mostrar vistas (implementar en router.js)
function showProfileView() {
  console.log('Mostrando perfil');
  // Aquí iría la lógica para cargar la vista de perfil
}

function showHistoryView() {
  console.log('Mostrando historial de trueques');
}

function showSettingsView() {
  console.log('Mostrando configuración');
}