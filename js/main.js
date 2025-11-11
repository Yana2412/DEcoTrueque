// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado');
  const isMainPage = window.location.pathname.includes('main.html');
  console.log('Es página principal:', isMainPage);
  
  if (isMainPage) {
    console.log('Cargando app-main');
    import('./modules/app-main.js').then(module => {
      console.log('app-main cargado');
      if (module.initAppMain) {
        console.log('Llamando a initAppMain');
        module.initAppMain();
      } else {
        console.error('initAppMain no encontrado en app-main.js');
        alert('Error: initAppMain no encontrado en app-main.js');
      }
    }).catch(err => {
      console.error("Error al cargar app-main:", err);
      alert('Error al cargar app-main: ' + err.message);
    });
  } else {
    console.log('Cargando app-login');
    import('./modules/app-login.js').then(module => {
      console.log('app-login cargado');
      if (module.initAppLogin) {
        console.log('Llamando a initAppLogin');
        module.initAppLogin();
      } else {
        console.error('initAppLogin no encontrado en app-login.js');
        alert('Error: initAppLogin no encontrado en app-login.js');
      }
    }).catch(err => {
      console.error("Error al cargar app-login:", err);
      alert('Error al cargar app-login: ' + err.message);
    });
  }
});