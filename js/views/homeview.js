// js/views/homeview.js

import { carrito } from '/utils/carritoUtils.js';

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
        <span id="cartBadge" style="position: absolute; top: -5px; right: -5px; background-color: #f44336; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; opacity: 0; transition: opacity 0.3s;"></span>
      </div>
    </div>
  `;

  // Renderizar productos
  renderProducts();

  // Inicializar eventos
  initHomeEvents();
}

// Datos de ejemplo (reemplaza con tu API o lista real más adelante)
const productos = [
  { id: 1, nombre: "Maceta Reciclada", precio: 15, categoria: 1, imagen: "https://via.placeholder.com/200x180?text=Maceta" },
  { id: 2, nombre: "Bolso de Plástico Reutilizado", precio: 20, categoria: 1, imagen: "https://via.placeholder.com/200x180?text=Bolso" },
  { id: 3, nombre: "Lámpara de Madera", precio: 35, categoria: 1, imagen: "https://via.placeholder.com/200x180?text=Lamp" },
  { id: 4, nombre: "Estuche de Cartón", precio: 10, categoria: 1, imagen: "https://via.placeholder.com/200x180?text=Estuche" },
  { id: 5, nombre: "Figura de Resina", precio: 25, categoria: 1, imagen: "https://via.placeholder.com/200x180?text=Figura" },
  { id: 6, nombre: "Set de Platos Reciclados", precio: 40, categoria: 2, imagen: "https://via.placeholder.com/200x180?text=Platos" },
  { id: 7, nombre: "Portavelas de Vidrio", precio: 18, categoria: 2, imagen: "https://via.placeholder.com/200x180?text=Vela" },
  { id: 8, nombre: "Caja Organizadora", precio: 22, categoria: 2, imagen: "https://via.placeholder.com/200x180?text=Caja" },
  { id: 9, nombre: "Juguete Ecológico", precio: 12, categoria: 2, imagen: "https://via.placeholder.com/200x180?text=Juguete" },
  { id: 10, nombre: "Espejo de Madera", precio: 30, categoria: 2, imagen: "https://via.placeholder.com/200x180?text=Espejo" }
];

function renderProducts() {
  const grid1 = document.getElementById('category1-grid');
  const grid2 = document.getElementById('category2-grid');

  grid1.innerHTML = '';
  grid2.innerHTML = '';

  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <img src="${p.imagen}" alt="${p.nombre}">
      </div>
      <div class="product-info">
        <div class="product-title">${p.nombre}</div>
        <div class="product-price">$${p.precio}</div>
        <div class="product-stats">
          <span>⭐⭐⭐⭐☆</span>
          <span>360 items sold</span>
        </div>
        <div class="heart-icon">♡</div>
        <button class="btn-add-to-cart" data-id="${p.id}" data-nombre="${p.nombre}" data-precio="${p.precio}">
          Agregar al carrito
        </button>
      </div>
    `;

    if (p.categoria === 1) {
      grid1.appendChild(card);
    } else {
      grid2.appendChild(card);
    }
  });

  // Añadir evento a los botones
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      const nombre = e.target.dataset.nombre;
      const precio = parseFloat(e.target.dataset.precio);
      carrito.agregar({ id, nombre, precio });
    });
  });
}

function initHomeEvents() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const profileIcon = document.getElementById('profileIcon');
  const profileDropdown = document.getElementById('profileDropdown');
  const cartButton = document.getElementById('cartButton');
  const cartBadge = document.getElementById('cartBadge');

  // Sidebar toggle
  if (menuToggle && sidebar && mainContent) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      sidebar.classList.toggle('open');
      mainContent.classList.toggle('sidebar-open');
    });
  }

  // Perfil dropdown
  if (profileIcon && profileDropdown) {
    profileIcon.addEventListener('click', function () {
      profileDropdown.classList.toggle('open');
    });

    document.addEventListener('click', function (event) {
      if (!profileIcon.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // Carrito
  if (cartButton && cartBadge) {
    // Actualizar badge al cargar
    const total = carrito.getTotalItems();
    cartBadge.textContent = total;
    cartBadge.style.opacity = total > 0 ? '1' : '0';

    cartButton.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1) translateY(-5px)';
      this.style.backgroundColor = '#45a049';
      cartBadge.style.opacity = total > 0 ? '1' : '0';
    });

    cartButton.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
      this.style.backgroundColor = 'var(--primary-green)';
      cartBadge.style.opacity = '0';
    });

    cartButton.addEventListener('click', function () {
      // Mostrar contenido real del carrito
      if (carrito.items.length === 0) {
        alert("Tu carrito está vacío. 😢");
      } else {
        let mensaje = "🛒 Tu carrito:\n\n";
        carrito.items.forEach(item => {
          mensaje += `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
        });
        mensaje += `\nTotal: $${carrito.getTotalPrecio().toFixed(2)}`;
        alert(mensaje);
      }
    });
  }

  // Animación de pulso
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}