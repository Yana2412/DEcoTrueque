// js/modules/app-main.js
import { initSidebar } from '../components/sidebar.js';
import { initProfileDropdown } from '../components/profile-dropdown.js';
import { initProductModal, abrirModalProducto } from '../components/product-modal.js'; // ✅ Solo una importación
import { verificarImagenes } from '../utils/carritoUtils.js';
import { Router } from '../router.js';
import { 
  inicializarDatosDemo, 
  actualizarContadorCarrito,
  agregarAlCarrito 
} from '../utils/carritoUtils.js';

// El resto del archivo se mantiene igual...

export function initAppMain() {
  try {
    console.log('🚀 Inicializando aplicación principal');
    
    // Verificar elementos del DOM
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
      throw new Error('Elemento #mainContent no encontrado en el DOM');
    }

    // Inicializar datos de demostración
    console.log('📦 Inicializando datos de demostración...');
    inicializarDatosDemo();
    
    // Agregar esta línea para verificar imágenes
    verificarImagenes();

    // Inicializar componentes
    console.log('🔧 Inicializando componentes...');
    initSidebar();
    initProfileDropdown();
    initProductModal();
    
    // Inicializar router
    console.log('🛣️ Inicializando router...');
    const router = new Router();
    
    // Definir rutas
    console.log('📍 Definiendo rutas...');
    
    function createHomeView() {
      const container = document.createElement('div');
      
      container.innerHTML = `
        <!-- HERO SECTION -->
        <section class="hero-section">
          <div class="special-product">
            <h2>🌟 Productos Destacados</h2>
            <p>Encuentra los mejores artículos para trueque y compra en tu comunidad ecológica.</p>
            <div>
              <a href="#" class="btn btn-primary" data-route="subir-producto">Subir Producto</a>
              <a href="#" class="btn btn-secondary" data-route="buscar">Buscar Productos</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="assets/images/Iniciooo.png" alt="Comunidad Ecotrueque" onerror="this.src='https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'">
          </div>
        </section>

        <!-- CATEGORÍA 1 -->
        <section class="category-section">
          <div class="section-header">
            <h2 class="section-title">🔄 Productos para Trueque</h2>
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
            <!-- Los productos se cargarán aquí -->
          </div>
        </section>

        <!-- BANDA INFORMATIVA -->
        <section class="yellow-band">
          <p>💚 <strong>¡Únete a la comunidad de trueque sostenible!</strong> Intercambia tus residuos por productos útiles y ayuda al medio ambiente.</p>
          <img src="https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Comunidad Ecológica">
        </section>
      `;
      
      // Cargar productos después de renderizar
      setTimeout(() => {
        loadProducts('todos');
        setupCategoryTabs();
      }, 100);
      
      return container;
    }

    function createCartView() {
      const container = document.createElement('div');
      container.className = 'cart-view';
      
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const productos = JSON.parse(localStorage.getItem('productos')) || [];
      
      const productosEnCarrito = carrito.map(item => {
        const producto = productos.find(p => p.id === item.id);
        return producto ? { ...producto, cantidad: item.cantidad || 1 } : null;
      }).filter(p => p !== null);
      
      const total = productosEnCarrito
        .filter(p => p.tipo === 'venta')
        .reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

      container.innerHTML = `
        <h1 class="page-title">🛒 Mi Carrito</h1>
        
        ${productosEnCarrito.length === 0 ? `
          <div class="empty-cart" style="text-align: center; padding: 40px 20px;">
            <h3 style="color: #666; margin-bottom: 20px;">Tu carrito está vacío</h3>
            <button class="btn btn-primary" data-route="home">Explorar Productos</button>
          </div>
        ` : `
          <div class="cart-items">
            ${productosEnCarrito.map(producto => `
              <div class="cart-item" style="display: flex; gap: 15px; padding: 15px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 10px; background: white;">
                <img src="${producto.imagen}" alt="${producto.nombre}" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0;">${producto.nombre}</h4>
                  <p style="margin: 0 0 5px 0; color: #4CAF50; font-weight: bold;">
                    ${producto.tipo === 'venta' ? `₡${(producto.precio * producto.cantidad).toLocaleString()}` : '🔄 Trueque'}
                  </p>
                  <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">
                    Cantidad: ${producto.cantidad} | Vendedor: ${producto.vendedor}
                  </p>
                </div>
                <button class="btn-remove" data-id="${producto.id}" 
                        style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                  🗑️
                </button>
              </div>
            `).join('')}
          </div>
          
          <div class="cart-summary" style="margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
            ${total > 0 ? `
              <div style="text-align: right; margin-bottom: 15px;">
                <h3 style="color: #333;">Total: ₡${total.toLocaleString()}</h3>
              </div>
            ` : ''}
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button class="btn btn-secondary" data-route="home">Seguir Comprando</button>
              <button class="btn btn-primary" id="finalizarCompra">
                ${total > 0 ? 'Finalizar Compra' : 'Proponer Trueques'}
              </button>
            </div>
          </div>
        `}
      `;
      
      return container;
    }

    function createProfileView() {
      const container = document.createElement('div');
      container.innerHTML = `
        <h1 class="page-title">👤 Mi Perfil</h1>
        <div class="profile-container" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
          <div class="profile-header" style="display: flex; gap: 20px; align-items: center; margin-bottom: 30px;">
            <img src="https://via.placeholder.com/150?text=Foto+Perfil" alt="Foto de perfil" 
                 style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">
            <div class="profile-info">
              <h2 style="margin: 0 0 10px 0;">${localStorage.getItem('usuarioNombre') || 'Usuario Ecotrueque'}</h2>
              <p style="margin: 5px 0; color: #666;">Miembro desde: ${new Date().getFullYear()}</p>
              <p style="margin: 5px 0; color: #666;">Trueques completados: 12</p>
            </div>
          </div>
          
          <div class="profile-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Productos Subidos</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #4CAF50;">8</p>
            </div>
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Trueques Activos</h3>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2196F3;">3</p>
            </div>
            <div class="stat-card" style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Calificación</h3>
              <p style="margin: 0; font-size: 24px; color: #FFD700;">⭐⭐⭐⭐☆</p>
            </div>
          </div>
          
          <div class="profile-actions" style="display: flex; gap: 10px;">
            <button class="btn btn-primary" data-route="subir-producto">Subir Nuevo Producto</button>
            <button class="btn btn-secondary" data-route="historial">Ver Historial</button>
          </div>
        </div>
      `;
      return container;
    }

    function loadProducts(category = 'todos') {
      const grid = document.getElementById('products-grid');
      if (!grid) {
        console.error('❌ Grid de productos no encontrado');
        return;
      }
      
      const productos = JSON.parse(localStorage.getItem('productos')) || [];
      
      let productosFiltrados = productos;
      if (category !== 'todos') {
        productosFiltrados = productos.filter(p => 
          p.categoria?.toLowerCase().includes(category.toLowerCase())
        );
      }
      
      if (productosFiltrados.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        `;
        return;
      }
      
      // ✅ MOSTRAR TODOS LOS PRODUCTOS FILTRADOS (no solo 5)
      grid.innerHTML = productosFiltrados.map(producto => `
        <div class="product-card" data-id="${producto.id}">
          <div class="product-image">
            <img src="${producto.imagen}" 
                 alt="${producto.nombre}"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj5Qcm9kdWN0bzwvdGV4dD48L3N2Zz4='">
          </div>
          <div class="product-info">
            <div class="product-title">${producto.nombre}</div>
            <div class="product-price">
              ${producto.tipo === 'venta' ? `₡${producto.precio.toLocaleString()}` : '🔄 Trueque'}
            </div>
            <div class="product-stats">
              <span>${producto.rating} ⭐ (${producto.itemsSold})</span>
              <span class="heart-icon">♡</span>
            </div>
            <div class="product-actions" style="margin-top: 10px;">
              <button class="btn-agregar-carrito" data-id="${producto.id}" 
                      style="width: 100%; padding: 8px; background: var(--primary-green); color: white; border: none; border-radius: 4px; cursor: pointer;">
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      `).join('');
      
      // Agregar eventos a las tarjetas de producto
      document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
          // No abrir modal si se hace clic en el botón de carrito
          if (e.target.closest('.btn-agregar-carrito')) {
            return;
          }
          const productId = parseInt(card.dataset.id);
          const producto = productos.find(p => p.id === productId);
          if (producto) {
            abrirModalProducto(producto);
          }
        });
      });
      
      // Agregar eventos a los botones de carrito
      document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = parseInt(e.target.dataset.id);
          agregarAlCarrito(id);
          actualizarContadorCarrito();
        });
      });
      
      console.log(`✅ ${productosFiltrados.length} productos cargados`);
    }

    function setupCategoryTabs() {
      document.querySelectorAll('.category-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
          // Remover clase active de todas las tabs
          document.querySelectorAll('.category-tabs .tab').forEach(t => {
            t.classList.remove('active');
          });
          
          // Agregar clase active a la tab clickeada
          tab.classList.add('active');
          
          // Cargar productos de la categoría
          const category = tab.dataset.category;
          loadProducts(category);
        });
      });
    }

    // Configurar rutas
    router.addRoute('home', createHomeView);
    router.addRoute('carrito', createCartView);
    router.addRoute('perfil', createProfileView);
    
    // Inicializar router
    router.init();
    
    // Actualizar contador de carrito
    actualizarContadorCarrito();
    
    console.log('✅ Aplicación principal inicializada correctamente');
    
  } catch (error) {
    console.error("❌ Error al inicializar la aplicación:", error);
    
    // Mostrar error al usuario
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #f44336;">
          <h2>Error al cargar la aplicación</h2>
          <p>${error.message}</p>
          <button onclick="window.location.reload()" 
                  style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Recargar Página
          </button>
        </div>
      `;
    }
  }
}