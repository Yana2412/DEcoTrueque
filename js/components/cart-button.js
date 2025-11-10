// js/components/cart-button.js

function crearBotonCarrito() {
  const div = document.createElement('div');
  div.className = 'cart-button';
  div.innerHTML = `
    <a href="#/carrito" class="nav-link">
      🛒
      <span id="carrito-contador" style="display:none;"></span>
    </a>
  `;
  return div;
}

export default crearBotonCarrito;