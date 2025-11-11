// js/router.js

export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.mainContent = document.getElementById('mainContent');
  }

  addRoute(path, component) {
    this.routes[path] = component;
    return this;
  }

  navigate(path) {
    if (!this.mainContent) {
      console.error('Contenedor #mainContent no encontrado');
      return;
    }

    // Actualizar URL sin recargar
    window.history.pushState({ path }, '', `#${path}`);
    this.renderRoute(path);
  }

  renderRoute(path) {
    const component = this.routes[path] || this.routes['home'];
    
    if (!component) {
      console.error(`Ruta no encontrada: ${path}`);
      return;
    }

    this.currentRoute = path;
    
    // Limpiar contenido anterior
    this.mainContent.innerHTML = '<div class="loading">Cargando...</div>';
    
    // Renderizar nuevo componente
    setTimeout(() => {
      if (typeof component === 'function') {
        this.mainContent.innerHTML = '';
        this.mainContent.appendChild(component());
      } else if (typeof component === 'string') {
        this.mainContent.innerHTML = component;
      }
      
      // Ejecutar callbacks después de renderizar
      this.executeRouteCallbacks(path);
    }, 300);
  }

  executeRouteCallbacks(path) {
    // Aquí puedes ejecutar funciones específicas para cada ruta
    switch(path) {
      case 'home':
        this.initHomeEvents();
        break;
      case 'perfil':
        this.initProfileEvents();
        break;
    }
  }

  initHomeEvents() {
    // Eventos para la vista principal
    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        this.addToCart(id);
      });
    });
  }

  addToCart(productId) {
    console.log(`Producto ${productId} agregado al carrito`);
    // Aquí iría la lógica real de agregar al carrito
    this.updateCartBadge();
  }

  updateCartBadge() {
    const cartBadge = document.getElementById('carrito-contador');
    if (cartBadge) {
      const cartItems = JSON.parse(localStorage.getItem('carrito')) || [];
      const total = cartItems.reduce((sum, item) => sum + (item.cantidad || 1), 0);
      
      cartBadge.textContent = total;
      cartBadge.style.opacity = total > 0 ? '1' : '0';
    }
  }

  init() {
    // Navegación inicial
    const initialPath = window.location.hash.slice(1) || 'home';
    this.renderRoute(initialPath);

    // Escuchar cambios de hash
    window.addEventListener('hashchange', (e) => {
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
  }
}