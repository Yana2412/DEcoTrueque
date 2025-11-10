// js/modules/app-main.js

import { 
  inicializarDatosDemo, 
  actualizarContadorCarrito, 
  agregarAlCarrito 
} from '../utils/carritoUtils.js';
import { initSidebar } from '../components/sidebar.js';

let productos = [];

export function initAppMain() {
  try {
    // Inicializar datos de demostración
    inicializarDatosDemo();
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    // Renderizar la vista principal
    renderHome();

    // Actualizar el contador del carrito
    actualizarContadorCarrito();

    // Evento del botón flotante del carrito
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        mostrarVistaCarrito();
      });
    }

    // Escuchar cambios en el carrito
    window.addEventListener('carritoActualizado', () => {
      actualizarContadorCarrito();
    });

    // ✅ Inicializar sidebar y otros eventos de UI
    initSidebar();
    setupUIEvents();

  } catch (error) {
    console.error("Error al inicializar la app:", error);
    alert("Hubo un error al cargar la aplicación. Revisa la consola.");
  }
}

function mostrarVistaCarrito() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) return;

  mainContent.innerHTML = '<p>Cargando carrito...</p>';

  import('../views/cartview.js').then(m => {
    if (typeof m.render === 'function') {
      m.render(mainContent);
    } else if (typeof m.initCartView === 'function') {
      m.initCartView(mainContent);
    } else {
      mainContent.innerHTML = '<p>Vista del carrito no disponible.</p>';
    }
  }).catch(err => {
    console.error("Error al cargar la vista del carrito:", err);
    mainContent.innerHTML = '<p>Error al cargar el carrito.</p>';
  });
}

// Renderiza la vista principal
export function renderHome() {
  const mainContent = document.getElementById('mainContent');
  
  // Guardar referencias a secciones que no deben recargarse
  const heroSection = document.querySelector('.hero-section');
  const yellowBand = document.querySelector('.yellow-band');

  // Generar categorías únicas
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria || 'General'))];
  
  let categoriasHTML = '';
  categoriasUnicas.forEach(cat => {
    const productosCat = productos.filter(p => (p.categoria || 'General') === cat);
    if (productosCat.length === 0) return;

    let productosHTML = productosCat.map(p => `
      <div class="product-card">
        <div class="product-image">
          <img src="${p.imagen || 'https://via.placeholder.com/200x180?text=' + encodeURIComponent(p.nombre)}" alt="${p.nombre}">
        </div>
        <div class="product-info">
          <div class="product-title">${p.nombre}</div>
          <div class="product-price">${p.tipo === 'venta' ? `₡${p.precio}` : '🔄 Trueque'}</div>
          <div class="product-stats">
            <span>Vendedor: ${p.vendedor}</span>
          </div>
          <div class="heart-icon">♡</div>
          <button class="btn-agregar-carrito" data-id="${p.id}" 
            style="margin-top: 8px; width: 100%; padding: 6px; background: var(--primary-green); color: white; border: none; border-radius: 4px; cursor: pointer;">
            Agregar al carrito
          </button>
        </div>
      </div>
    `).join('');

    categoriasHTML += `
      <section class="category-section">
        <div class="section-header">
          <h2 class="section-title">${cat}</h2>
          <a href="#" class="see-more">Ver más →</a>
        </div>
        <div class="product-grid">
          ${productosHTML}
        </div>
      </section>
    `;
  });

  // Reconstruir el contenido principal
  mainContent.innerHTML = `
    ${heroSection ? heroSection.outerHTML : ''}
    ${categoriasHTML}
    ${yellowBand ? yellowBand.outerHTML : ''}
  `;

  // ✅ Reaplicar eventos a los nuevos botones "Agregar al carrito"
  document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.dataset.id);
      agregarAlCarrito(id);
    });
  });

  // ✅ Configurar otros eventos de UI (menú, perfil, etc.)
  setupUIEvents(); // <-- ¡Importante! Volver a configurar después de re-renderizar
}

function setupUIEvents() {
  console.log("✅ setupUIEvents() llamada");

  // Dropdown de perfil
  const profileIcon = document.getElementById('profileIcon');
  const profileDropdown = document.getElementById('profileDropdown');
  
  if (profileIcon && profileDropdown) {
    // Cerrar dropdown si ya está abierto
    if (profileDropdown.style.display === 'block') {
      profileDropdown.style.display = 'none';
      return;
    }

    profileIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.style.display = 'none';
      }
    });
  } else {
    console.warn("Elementos de perfil no encontrados. Esto podría ser normal en algunas vistas.");
  }
}