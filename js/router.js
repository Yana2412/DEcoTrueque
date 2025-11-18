// js/router.js
export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.mainContent = document.getElementById('mainContent');
    
    if (!this.mainContent) {
      console.error('❌ Elemento #mainContent no encontrado en el DOM');
      throw new Error('Elemento #mainContent no encontrado en el DOM');
    }
    
    console.log('✅ Router inicializado');
  }

  addRoute(path, component) {
    this.routes[path] = component;
    console.log(`📍 Ruta agregada: ${path}`);
    return this;
  }

  navigate(path) {
    console.log(`🛣️ Navegando a: ${path}`);
    
    if (!this.mainContent) {
      console.error('❌ Contenedor #mainContent no encontrado');
      return;
    }

    // Actualizar URL
    window.history.pushState({ path }, '', `#${path}`);
    this.renderRoute(path);
  }

  renderRoute(path) {
    console.log(`🎨 Renderizando ruta: ${path}`);
  
    const component = this.routes[path] || this.routes['home'];
  
    if (!component) {
      console.error(`❌ Ruta no encontrada: ${path}`);
      this.mainContent.innerHTML = `
        <div class="error" style="text-align: center; padding: 40px;">
          <h2>Error 404</h2>
          <p>La página "${path}" no existe.</p>
          <button data-route="home" class="btn btn-primary">Volver al Inicio</button>
        </div>
      `;
      return;
    }

    this.currentRoute = path;
    this.mainContent.innerHTML = '';

    setTimeout(() => {
      try {
        if (typeof component === 'function') {
          const componentElement = component();
          if (componentElement) {
            this.mainContent.appendChild(componentElement);
          }
        } else {
          this.mainContent.innerHTML = component;
        }
        
        console.log(`✅ Ruta "${path}" renderizada correctamente`);
        
        this.executeRouteCallbacks(path);
        
      } catch (error) {
        console.error(`❌ Error al renderizar vista ${path}:`, error);
        this.mainContent.innerHTML = `
          <div class="error" style="text-align: center; padding: 40px;">
            <h2>Error al cargar la página</h2>
            <p>${error.message}</p>
            <button data-route="home" class="btn btn-primary">Volver al Inicio</button>
          </div>
        `;
      }
    }, 100);
  }

  executeRouteCallbacks(path) {
    try {
      switch(path) {
        case 'home':
          this.initHomeEvents();
          break;
        case 'carrito':
          this.initCartEvents();
          break;
        case 'recibo':
          // No requiere eventos especiales de momento
          break;
        case 'chat-trueque':
          // Chat maneja sus propios eventos en la vista
          break;
      }
    } catch (error) {
      console.error(`❌ Error en callbacks de ruta ${path}:`, error);
    }
  }

  initHomeEvents() {
    console.log('🎯 Inicializando eventos de home');
  }

  initCartEvents() {
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        this.removeFromCart(productId);
      });
    });

    const finalizarBtn = document.getElementById('finalizarCompra');
    if (finalizarBtn) {
      finalizarBtn.addEventListener('click', () => {
        this.finalizarCompra();
      });
    }
  }

  removeFromCart(productId) {
    import('./utils/carritoUtils.js').then(module => {
      module.eliminarDelCarrito(productId);
      this.navigate('carrito');
    });
  }

  finalizarCompra() {
    import('./utils/carritoUtils.js').then(module => {
      const carrito = module.obtenerCarrito();
      const productos = module.obtenerProductos();

      const itemsCompra = carrito
        .map(item => {
          const p = productos.find(prod => prod.id === item.id);
          return p && p.tipo === 'venta'
            ? { ...p, cantidad: item.cantidad || 1 }
            : null;
        })
        .filter(Boolean);

      if (itemsCompra.length === 0) {
        alert('No hay productos de venta en el carrito.');
        return;
      }

      const total = itemsCompra.reduce((s, p) => s + p.precio * p.cantidad, 0);

      // Marcar productos como no disponibles
      const productosActualizados = productos.map(p => {
        const itemCarrito = carrito.find(c => c.id === p.id);
        if (itemCarrito && p.tipo === 'venta') {
          return { ...p, disponibles: 0 };
        }
        return p;
      });

      localStorage.setItem('productos', JSON.stringify(productosActualizados));
      module.vaciarCarrito();

      const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
      const nombreUsuario = usuario?.nombre || 'Usuario Ecotrueque';

      const transaccion = {
        tipo: 'compra',
        fecha: new Date().toISOString(),
        usuario: nombreUsuario,
        vendedor: itemsCompra.length === 1 ? itemsCompra[0].vendedor : 'Varios vendedores',
        producto: itemsCompra.length === 1 ? itemsCompra[0].nombre : `${itemsCompra.length} productos`,
        cantidad: itemsCompra.reduce((s, p) => s + p.cantidad, 0),
        metodoPago: 'Tarjeta de Crédito',
        total
      };

      sessionStorage.setItem('transaccionActual', JSON.stringify(transaccion));

      if (window.router) {
        window.router.navigate('recibo');
      } else {
        window.location.hash = '#recibo';
      }
    });
  }

  init() {
    const initialPath = window.location.hash.slice(1) || 'home';
    this.renderRoute(initialPath);

    window.addEventListener('hashchange', () => {
      const path = window.location.hash.slice(1) || 'home';
      this.renderRoute(path);
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-route]')) {
        e.preventDefault();
        const route = e.target.dataset.route;
        this.navigate(route);
      }
    });

    window.addEventListener('popstate', () => {
      const path = window.location.hash.slice(1) || 'home';
      this.renderRoute(path);
    });

    console.log('✅ Router completamente inicializado');
  }
}
