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
  
  // ✅ LIMPIAR COMPLETAMENTE antes de renderizar
  this.mainContent.innerHTML = '';
  
  // Renderizar componente
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
      
      // Ejecutar callbacks después de renderizar
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
      }
    } catch (error) {
      console.error(`❌ Error en callbacks de ruta ${path}:`, error);
    }
  }

  initHomeEvents() {
    // Eventos específicos de la página de inicio
    console.log('🎯 Inicializando eventos de home');
  }

  initCartEvents() {
    // Eventos específicos del carrito
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
      this.navigate('carrito'); // Recargar vista del carrito
    });
  }

  finalizarCompra() {
    alert('¡Gracias por tu compra! Esta funcionalidad está en desarrollo.');
    // Aquí iría la lógica de finalización de compra
  }

  init() {
    // Navegación inicial
    const initialPath = window.location.hash.slice(1) || 'home';
    this.renderRoute(initialPath);

    // Escuchar cambios de hash
    window.addEventListener('hashchange', () => {
      const path = window.location.hash.slice(1) || 'home';
      this.renderRoute(path);
    });

    // Navegación con botones
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-route]')) {
        e.preventDefault();
        const route = e.target.dataset.route;
        this.navigate(route);
      }
    });

    // Manejar botón de retroceso/avance del navegador
    window.addEventListener('popstate', (e) => {
      const path = window.location.hash.slice(1) || 'home';
      this.renderRoute(path);
    });

    console.log('✅ Router completamente inicializado');
  }
}