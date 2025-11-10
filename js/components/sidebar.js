// js/components/sidebar.js

export function initSidebar() {
  console.log("Intialized sidebar component");
  
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  // Si no existe el overlay, créalo
  if (!overlay) {
    const newOverlay = document.createElement('div');
    newOverlay.id = 'sidebarOverlay';
    newOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 999;
      display: none;
    `;
    document.body.appendChild(newOverlay);
    
    // Cerrar sidebar al hacer clic en el overlay
    newOverlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      newOverlay.style.display = 'none';
    });
  }

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('active');
      document.getElementById('sidebarOverlay').style.display = 
        sidebar.classList.contains('active') ? 'block' : 'none';
    });
  }
}

// Cerrar sidebar al hacer clic fuera de él
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  
  if (sidebar && menuToggle && sidebar.classList.contains('active')) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove('active');
      document.getElementById('sidebarOverlay').style.display = 'none';
    }
  }
});