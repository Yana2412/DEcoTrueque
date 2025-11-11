// js/views/homeview.js

import { initProductModal } from '../components/product-modal.js';
import { actualizarContadorCarrito } from '../utils/carritoUtils.js';

export function showHomeView() {
  const viewContainer = document.getElementById('view-container');
  const background = document.getElementById('background');
  const toggleBtn = document.getElementById('toggleBtn');
  const infoPanel = document.getElementById('infoPanel');

  // Cambiar fondo
  background.style.backgroundImage = "url('../assets/images/Iniciooo.png')";

  // Ocultar botón de info y panel
  if (toggleBtn) toggleBtn.style.display = 'none';
  if (infoPanel) infoPanel.style.display = 'none';

  // Renderizar vista principal
  viewContainer.innerHTML = `
    <div class="container">
      <!-- HEADER -->
      <header>
        <div class="menu-toggle" id="menuToggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <a href="#" class="logo">ECOTRUEQUE</a>
        <div class="search-bar">
          <input type="text" placeholder="Search...">
          <button>🔍</button>
        </div>
        <div class="header-icons">
          <div class="icon">🔔</div>
          <div class="icon" id="profileIcon">👤</div>
        </div>
      </header>

      <!-- SIDEBAR -->
      <aside class="sidebar" id="sidebar">
        <ul class="sidebar-menu">
          <li class="active"><span>Compras</span></li>
          <li><span>Información</span></li>
          <li><span>Carrito</span></li>
          <li><span>Listas</span></li>
          <li><span>Ayuda</span></li>
        </ul>
      </aside>

      <!-- PERFIL DROPDOWN -->
      <div class="profile-dropdown" id="profileDropdown">
        <ul>
          <li>Mi Perfil</li>
          <li>Configuración</li>
          <li>Historial de Trueques</li>
          <li>Cerrar Sesión</li>
        </ul>
      </div>

      <!-- MAIN CONTENT -->
      <main id="mainContent">
        <!-- HERO SECTION -->
        <section class="hero-section">
          <div class="special-product">
            <h2>Special Product</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div>
              <a href="#" class="btn btn-primary">Get Now</a>
              <a href="#" class="btn btn-secondary">Learn More</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="https://via.placeholder.com/400x250?text=Hero+Image" alt="Hero Image">
          </div>
        </section>

        <!-- CATEGORY 1 -->
        <section class="category-section">
          <div class="section-header">
            <h2 class="section-title">Category 1</h2>
            <a href="#" class="see-more">Ver más →</a>
          </div>
          <div class="category-tabs">
            <div class="tab active">General</div>
            <div class="tab">Plásticos</div>
            <div class="tab">Metales</div>
            <div class="tab">Textiles</div>
            <div class="tab">Madera</div>
          </div>
          <div class="product-grid" id="category1-grid">
            <!-- Se llenará con JS -->
          </div>
        </section>

        <!-- CATEGORY 2 -->
        <section class="category-section">
          <div class="section-header">
            <h2 class="section-title">Category 2</h2>
            <a href="#" class="see-more">Ver más →</a>
          </div>
          <div class="product-grid" id="category2-grid">
            <!-- Se llenará con JS -->
          </div>
        </section>

        <!-- BANDA AMARILLA -->
        <section class="yellow-band">
          <p>✨ Aquí irá una imagen promocional o banner informativo. ✨</p>
          <img src="https://via.placeholder.com/1200x300?text=Banner+Promocional" alt="Banner Promocional">
        </section>
      </main>

      <!-- FLOATING CART ICON -->
      <div id="cartButton" style="position: fixed; bottom: 30px; right: 30px; background-color: var(--primary-green); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 10px var(--shadow); transition: all 0.3s ease; animation: pulse 2s infinite;">
        <span style="color: white; font-size: 24px;">🛒</span>
        <span id="carrito-contador" style="position: absolute; top: -5px; right: -5px; background-color: #f44336; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; opacity: 0; transition: opacity 0.3s;"></span>
      </div>
    </div>
  `;

  // Renderizar productos
  renderProducts();

  // Inicializar eventos
  initHomeEvents();
  initProductModal(); // Inicializar modal de producto
}

// Datos de ejemplo (ahora usando localStorage)
const productos = [];

function renderProducts() {
  const grid1 = document.getElementById('category1-grid');
  const grid2 = document.getElementById('category2-grid');
  const productos = JSON.parse(localStorage.getItem('productos')) || [];

  grid1.innerHTML = '';
  grid2.innerHTML = '';

  // Mostrar los primeros 5 productos en Category 1
  const categoria1 = productos.slice(0, 5);
  // Mostrar los siguientes 5 productos en Category 2
  const categoria2 = productos.slice(5, 10);

  categoria1.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
      <div class="product-info">
        <div class="product-title">${p.nombre}</div>
        <div class="product-price">
          ${p.tipo === 'venta' ? `₡${p.precio}` : '🔄 Trueque'}
        </div>
        <div class="product-stats">
          <span>Vendedor: ${p.vendedor}</span>
        </div>
        <div class="heart-icon">♡</div>
        <button class="btn-agregar-carrito" data-id="${p.id}" 
          style="margin-top: 8px; width: 100%; padding: 6px; background: var(--primary-green); color: white; border: none; border-radius: 4px; cursor: pointer;">
          Agregar al carrito
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      mostrarModalProducto(p);
    });

    grid1.appendChild(card);
  });

  categoria2.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
      <div class="product-info">
        <div class="product-title">${p.nombre}</div>
        <div class="product-price">
          ${p.tipo === 'venta' ? `₡${p.precio}` : '🔄 Trueque'}
        </div>
        <div class="product-stats">
          <span>Vendedor: ${p.vendedor}</span>
        </div>
        <div class="heart-icon">♡</div>
        <button class="btn-agregar-carrito" data-id="${p.id}" 
          style="margin-top: 8px; width: 100%; padding: 6px; background: var(--primary-green); color: white; border: none; border-radius: 4px; cursor: pointer;">
          Agregar al carrito
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      mostrarModalProducto(p);
    });

    grid2.appendChild(card);
  });

  // Añadir evento a los botones
  document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar que se abra el modal
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

function initHomeEvents() {
  // Eventos para el carrito
  const cartButton = document.getElementById('cartButton');
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      // Aquí podrías implementar la navegación al carrito
      alert("Redirigiendo al carrito...");
    });
  }

  // Actualizar contador del carrito
  actualizarContadorCarrito();
}

// Función para mostrar el modal de producto
function mostrarModalProducto(producto) {
  const modal = document.createElement('div');
  modal.id = 'productModal';
  modal.className = 'product-modal';
  
  modal.innerHTML = `
    <div class="product-modal-content">
      <div class="modal-header">
        <h3>${producto.nombre}</h3>
        <button id="modalClose" class="modal-close">×</button>
      </div>
      <div class="product-image-modal">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="modal-body">
        <h2 class="product-title-modal">${producto.nombre}</h2>
        <div class="product-price-modal">${producto.tipo === 'venta' ? `₡${producto.precio}` : '🔄 Trueque'}</div>
        
        <div class="product-rating">
          <div class="stars">★★★★★</div>
          <span>${producto.rating} ⭐ (${producto.itemsSold} items sold)</span>
        </div>
        
        <p class="product-description">${producto.descripcion}</p>
        
        <div class="modal-actions">
          <button class="btn-modal btn-trueque" data-id="${producto.id}">Trueque</button>
          ${producto.tipo === 'venta' ? 
            `<button class="btn-modal btn-compra" data-id="${producto.id}">Compra</button>` : ''}
          <button class="btn-modal btn-carrito" data-id="${producto.id}">Carrito</button>
        </div>
      </div>
    </div>
  `;
  
  // Agregar modal al DOM
  document.body.appendChild(modal);
  
  // Mostrar el modal
  setTimeout(() => {
    modal.style.display = 'flex';
  }, 100);
  
  // Inicializar eventos del modal
  initProductModal();
}