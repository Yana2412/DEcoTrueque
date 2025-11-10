// js/components/profile-dropdown.js
export function initProfileDropdown() {
  const profileIcon = document.getElementById('profileIcon');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener('click', function() {
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(event) {
      if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }
}