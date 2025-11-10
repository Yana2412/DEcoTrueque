// js/components/nav-main.js
export function initNavbar() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');

  if (menuToggle && sidebar && mainContent) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      sidebar.classList.toggle('open');
      mainContent.classList.toggle('sidebar-open');
    });
  }
}