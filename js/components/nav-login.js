// js/components/nav-login.js
export function initInfoPanel() {
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