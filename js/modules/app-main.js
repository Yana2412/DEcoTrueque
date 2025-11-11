// js/modules/app-main.js

import { initSidebar } from '../components/sidebar.js';
import { initProfileDropdown } from '../components/profile-dropdown.js';
import { Router } from '../router.js';
import { 
  inicializarDatosDemo, 
  actualizarContadorCarrito 
} from '../utils/carritoUtils.js';

export function initAppMain() {
  try {
    console.log('Inicializando aplicación principal...');
    
    // Inicializar datos de demostración
    inicializarDatosDemo();
    
    // Inicializar componentes
    initSidebar();
    initProfileDropdown();
    
    // Inicializar router
    const router = new Router();
    
    // Definir rutas
    router.addRoute('home', createHomeView);
    router.addRoute('carrito', createCartView);
    router.addRoute('perfil', createProfileView);
    router.addRoute('subir-producto', createUploadProductView);
    router.addRoute('buscar', createSearchView);
    
    // Inicializar router
    router.init();
    
    // Actualizar contador de carrito
    actualizarContadorCarrito();
    
    // Evento del botón flotante del carrito
    const cartButton = document.getElementById('cartButton');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        router.navigate('carrito');
      });
    }
    
    // Eventos para búsqueda
    const searchButton = document.querySelector('.search-bar button');
    if (searchButton) {
      searchButton.addEventListener('click', () => {
        const searchTerm = document.querySelector('.search-bar input').value;
        if (searchTerm) {
          router.navigate(`buscar?q=${encodeURIComponent(searchTerm)}`);
        }
      });
    }
    
    console.log('✅ Aplicación inicializada correctamente');
    
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    showAlert('Error al cargar la aplicación. Por favor, recarga la página.');
  }
}

// Funciones para crear vistas
function createHomeView() {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="special-product">
        <h2>🌟 Productos Destacados</h2>
        <p>Encuentra los mejores artículos para trueque y compra en tu comunidad.</p>
        <div>
          <a href="#" class="btn btn-primary" data-route="subir-producto">Subir Producto</a>
          <a href="#" class="btn btn-secondary" data-route="buscar">Buscar Productos</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Productos Ecológicos">
      </div>
    </section>

    <!-- CATEGORÍAS DINÁMICAS -->
    <section class="category-section">
      <div class="section-header">
        <h2 class="section-title">🌿 Productos para Trueque</h2>
        <a href="#" class="see-more" data-route="buscar">Ver más →</a>
      </div>
      <div class="category-tabs">
        <div class="tab active" data-category="todos">Todos</div>
        <div class="tab" data-category="plasticos">Plásticos</div>
        <div class="tab" data-category="metales">Metales</div>
        <div class="tab" data-category="textiles">Textiles</div>
        <div class="tab" data-category="madera">Madera</div>
      </div>
      <div class="product-grid" id="products-grid">
        <!-- Los productos se cargarán dinámicamente aquí -->
      </div>
    </section>

    <!-- BANDA AMARILLA (Call to Action) -->
    <section class="yellow-band">
      <p>💚 <strong>¡Únete a la comunidad de trueque sostenible!</strong> Intercambia tus residuos por productos útiles y ayuda al medio ambiente.</p>
      <img src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Comunidad Ecológica">
    </section>
  `;
  
  // Cargar productos después de renderizar
  setTimeout(() => loadProducts('todos'), 100);
  
  return container;
}

function createCartView() {
  const container = document.createElement('div');
  container.className = 'cart-container';
  
  // Obtener productos del carrito
  const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
  const allProducts = JSON.parse(localStorage.getItem('productos')) || [];
  
  const cartProducts = cartItems.map(item => {
    const product = allProducts.find(p => p.id === item.id);
    return product ? {...product, cantidad: item.cantidad || 1} : null;
  }).filter(p => p);
  
  const total = cartProducts
    .filter(p => p.tipo === 'venta')
    .reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  
  container.innerHTML = `
    <h1 class="page-title">🛒 Mi Carrito</h1>
    
    ${cartProducts.length === 0 ? `
      <div class="empty-cart">
        <p>Tu carrito está vacío</p>
        <button class="btn btn-primary" data-route="home">Explorar productos</button>
      </div>
    ` : `
      <div class="cart-items">
        ${cartProducts.map(product => `
          <div class="cart-item">
            <img src="${product.imagen || 'https://via.placeholder.com/100x100?text=Producto'}" alt="${product.nombre}">
            <div class="cart-item-info">
              <h3>${product.nombre}</h3>
              <p>${product.tipo === 'venta' ? `₡${product.precio.toLocaleString()}` : '🔄 Trueque'}</p>
              <p>Cantidad: ${product.cantidad || 1}</p>
              <p>Vendedor: ${product.vendedor}</p>
            </div>
            <button class="btn-remove" data-id="${product.id}">🗑️</button>
          </div>
        `).join('')}
      </div>
      
      <div class="cart-summary">
        ${total > 0 ? `<p class="total">Total: ₡${total.toLocaleString()}</p>` : ''}
        <div class="cart-actions">
          <button class="btn btn-secondary" data-route="home">Seguir comprando</button>
          <button class="btn btn-primary cart-action-btn">
            ${total > 0 ? 'Finalizar Compra' : 'Proponer Trueque'}
          </button>
        </div>
      </div>
    `}
  `;
  
  return container;
}

// Función para cargar productos dinámicamente
function loadProducts(category = 'todos') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  // Obtener productos del localStorage
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  
  // Filtrar por categoría
  let productosFiltrados = productos;
  if (category !== 'todos') {
    productosFiltrados = productos.filter(p => 
      p.categoria?.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Renderizar productos
  grid.innerHTML = productosFiltrados.map(producto => `
    <div class="product-card">
      <div class="product-image">
        <img src="${producto.imagen || 'https://via.placeholder.com/200x180?text=' + encodeURIComponent(producto.nombre)}" 
             alt="${producto.nombre}"
             onerror="this.src='https://via.placeholder.com/200x180?text=Sin+imagen'">
      </div>
      <div class="product-info">
        <div class="product-title">${producto.nombre}</div>
        <div class="product-price">
          ${producto.tipo === 'venta' ? `₡${producto.precio.toLocaleString()}` : '🔄 Trueque'}
        </div>
        <div class="product-stats">
          <span>Vendedor: ${producto.vendedor}</span>
        </div>
        <div class="product-actions">
          <button class="heart-icon" title="Favorito">♡</button>
          <button class="btn-agregar-carrito" data-id="${producto.id}" title="Agregar al carrito">
            🛒
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Añadir eventos a los botones
  document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    });
  });
}

function addToCart(productId) {
  try {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExistente = carrito.find(item => item.id === productId);
    
    if (productoExistente) {
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
      carrito.push({ id: productId, cantidad: 1 });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    showNotification('✅ Producto agregado al carrito');
    
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    showAlert('Error al agregar el producto al carrito');
  }
}

// Funciones de utilidad
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      ${message}
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function showAlert(message) {
  alert(message);
}

// Vistas adicionales (simplificadas)
function createProfileView() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1 class="page-title">👤 Mi Perfil</h1>
    <div class="profile-container">
      <div class="profile-header">
        <img src="https://via.placeholder.com/150?text=Foto+Perfil" alt="Foto de perfil" class="profile-photo">
        <div class="profile-info">
          <h2>${localStorage.getItem('usuarioNombre') || 'Usuario'}</h2>
          <p>Member since: ${new Date().getFullYear()}</p>
          <p>Trueques completados: 0</p>
        </div>
      </div>
      
      <div class="profile-stats">
        <div class="stat-card">
          <h3>Productos Subidos</h3>
          <p>0</p>
        </div>
        <div class="stat-card">
          <h3>Trueques Activos</h3>
          <p>0</p>
        </div>
        <div class="stat-card">
          <h3>Calificación</h3>
          <p>⭐⭐⭐⭐☆</p>
        </div>
      </div>
      
      <div class="profile-actions">
        <button class="btn btn-primary" data-route="subir-producto">Subir Nuevo Producto</button>
        <button class="btn btn-secondary" data-route="historial">Ver Historial</button>
      </div>
    </div>
  `;
  return container;
}

function createUploadProductView() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1 class="page-title">📤 Subir Nuevo Producto</h1>
    <form id="upload-product-form" class="upload-form">
      <div class="form-group">
        <label for="product-name">Nombre del Producto</label>
        <input type="text" id="product-name" required placeholder="Ej: Botellas de vidrio">
      </div>
      
      <div class="form-group">
        <label for="product-category">Categoría</label>
        <select id="product-category" required>
          <option value="">Selecciona una categoría</option>
          <option value="plasticos">Plásticos</option>
          <option value="metales">Metales</option>
          <option value="papel">Papel</option>
          <option value="textiles">Textiles</option>
          <option value="madera">Madera</option>
          <option value="electronicos">Electrónicos</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="product-type">Tipo de intercambio</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="product-type" value="trueque" checked> Trueque
          </label>
          <label>
            <input type="radio" name="product-type" value="venta"> Venta
          </label>
        </div>
      </div>
      
      <div class="form-group" id="price-group" style="display:none;">
        <label for="product-price">Precio (₡)</label>
        <input type="number" id="product-price" placeholder="Ej: 5000">
      </div>
      
      <div class="form-group">
        <label for="product-description">Descripción</label>
        <textarea id="product-description" rows="4" placeholder="Describe tu producto..."></textarea>
      </div>
      
      <div class="form-group">
        <label for="product-image">Imagen (URL)</label>
        <input type="url" id="product-image" placeholder="https://ejemplo.com/imagen.jpg">
      </div>
      
      <button type="submit" class="btn btn-primary">Subir Producto</button>
    </form>
  `;
  return container;
}

function createSearchView() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1 class="page-title">🔍 Resultados de Búsqueda</h1>
    <div class="search-results">
      <p>No se encontraron resultados para tu búsqueda. Intenta con otros términos.</p>
      <button class="btn btn-secondary" data-route="home">Volver al inicio</button>
    </div>
  `;
  return container;
}

// Eventos para el formulario de subir producto
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('submit', async (e) => {
    if (e.target && e.target.id === 'upload-product-form') {
      e.preventDefault();
      
      try {
        const formData = {
          nombre: document.getElementById('product-name').value,
          categoria: document.getElementById('product-category').value,
          tipo: document.querySelector('input[name="product-type"]:checked').value,
          precio: document.getElementById('product-price').value || 0,
          descripcion: document.getElementById('product-description').value,
          imagen: document.getElementById('product-image').value || '',
          vendedor: localStorage.getItem('usuarioNombre') || 'Anónimo',
          fecha: new Date().toISOString()
        };
        
        // Validaciones
        if (!formData.nombre || !formData.categoria) {
          throw new Error('Nombre y categoría son obligatorios');
        }
        
        if (formData.tipo === 'venta' && (!formData.precio || formData.precio <= 0)) {
          throw new Error('El precio es obligatorio para productos en venta');
        }
        
        // Generar ID único
        formData.id = Date.now();
        
        // Guardar en localStorage
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(formData);
        localStorage.setItem('productos', JSON.stringify(productos));
        
        showNotification('✅ Producto subido exitosamente');
        
        // Redirigir a la vista principal
        if (window.router) {
          window.router.navigate('home');
        }
        
      } catch (error) {
        console.error('Error al subir producto:', error);
        showAlert(`Error: ${error.message}`);
      }
    }
  });
  
  // Mostrar/ocultar campo de precio según el tipo
  document.addEventListener('change', (e) => {
    if (e.target && e.target.name === 'product-type') {
      const priceGroup = document.getElementById('price-group');
      if (priceGroup) {
        priceGroup.style.display = e.target.value === 'venta' ? 'block' : 'none';
      }
    }
  });
});

// Hacer router accesible globalmente para las vistas
window.router = new Router();