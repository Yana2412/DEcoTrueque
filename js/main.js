// js/main.js

// Ejecutar solo cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const isMainPage = window.location.pathname.includes('main.html');

  if (isMainPage) {
    // Inicializa la app principal
    import('./modules/app-main.js').then(module => {
      if (module.initAppMain) {
        module.initAppMain();
      }
    }).catch(err => {
      console.error("Error al cargar app-main:", err);
    });
  } else {
    // Para index.html (login)
    import('./modules/app-login.js').then(module => {
      if (module.initAppLogin) {
        module.initAppLogin();
      }
    }).catch(err => {
      console.error("Error al cargar app-login:", err);
    });
  }
});