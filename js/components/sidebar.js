// js/components/sidebar.js

export function initSidebar() {
  console.log("Sidebar inicializado correctamente");
  
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const mainContent = document.getElementById('mainContent');

  if (!menuToggle || !sidebar || !overlay || !mainContent) {
    console.warn('Elementos del sidebar no encontrados. Verifica los IDs.');
    return;
  }

  // Función para abrir/cerrar sidebar
  const toggleSidebar = () => {
    sidebar.classList.toggle('open');
    overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    mainContent.classList.toggle('sidebar-open');
    menuToggle.classList.toggle('active');
  };

  // Eventos
  menuToggle.addEventListener('click', toggleSidebar);
  
  // Cerrar sidebar al hacer clic en el overlay
  overlay.addEventListener('click', toggleSidebar);

  // Cerrar sidebar al hacer clic en un elemento del menú
  document.querySelectorAll('.sidebar-menu li').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth < 768) { // Solo en móvil
        toggleSidebar();
      }
    });
  });

  // Cerrar sidebar al redimensionar a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && sidebar.classList.contains('open')) {
      toggleSidebar();
    }
  });

  // Configurar enlaces del sidebar para el router SPA
  document.querySelectorAll('.sidebar-menu li[data-route]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const route = item.dataset.route;
      
      if (window.router) {
        window.router.navigate(route);
      }
      
      // Cerrar sidebar en móviles después de navegar
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    });
  });
}