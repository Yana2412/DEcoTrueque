// js/components/product-modal.js

let productoActual = null;

// ----------------------
// Helpers de sesión
// ----------------------
function estaLogueado() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  return !!usuario;
}

function exigirLogin() {
  if (!estaLogueado()) {
    alert('Para comprar, hacer trueque o agregar al carrito debes iniciar sesión o registrarte.');
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ----------------------
// Inicialización del modal
// ----------------------
export function initProductModal() {
  console.log('🔧 Inicializando modal de producto');

  const modal = document.getElementById('productModal');
  const closeModal = document.getElementById('modalClose');

  if (!modal) {
    console.error('❌ Modal de producto no encontrado en el DOM (#productModal)');
    return;
  }

  // Botón "X"
  if (closeModal) {
    closeModal.addEventListener('click', cerrarModal);
  }

  // Clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  // Tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      cerrarModal();
    }
  });

  // Delegación de eventos para los botones del modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-trueque')) {
      handleTrueque();
    } else if (e.target.classList.contains('btn-compra')) {
      handleCompra();
    } else if (e.target.classList.contains('btn-carrito')) {
      handleCarrito();
    }
  });

  console.log('✅ Modal de producto inicializado');
}

// ----------------------
// Abrir / cerrar modal
// ----------------------
export function abrirModalProducto(producto) {
  productoActual = producto;
  const modal = document.getElementById('productModal');

  if (!modal) {
    console.error('❌ Modal no encontrado (#productModal)');
    return;
  }

  const modalImage = document.getElementById('modalProductImage');
  const modalName = document.getElementById('modalProductName');
  const modalPrice = document.getElementById('modalProductPrice');
  const modalRating = document.getElementById('modalProductRating');
  const modalDescription = document.getElementById('modalProductDescription');

  if (modalImage) {
    modalImage.src = producto.imagen;
    modalImage.alt = producto.nombre;
    modalImage.onerror = function () {
      // Fallback estático
      this.src =
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIj5Qcm9kdWN0bzwvdGV4dD48L3N2Zz4=';
      this.alt = 'Imagen no disponible - ' + producto.nombre;
    };
  }

  if (modalName) {
    modalName.textContent = producto.nombre;
  }

  if (modalPrice) {
    if (producto.tipo === 'venta') {
      modalPrice.textContent = `₡${producto.precio.toLocaleString()}`;
      modalPrice.style.color = '#4CAF50';
    } else {
      modalPrice.textContent = '🔄 Trueque';
      modalPrice.style.color = '#FF9800';
    }
  }

  if (modalRating) {
    modalRating.textContent = `${producto.rating} ⭐ (${producto.itemsSold} vendidos)`;
  }

  if (modalDescription) {
    modalDescription.textContent = producto.descripcion;
  }

  // Actualizar data-id de los botones del modal
  document.querySelectorAll('.btn-modal').forEach((btn) => {
    btn.setAttribute('data-id', producto.id);
  });

  // Mostrar/ocultar botón de compra según tipo
  const btnCompra = document.querySelector('.btn-compra');
  if (btnCompra) {
    btnCompra.style.display = producto.tipo === 'venta' ? 'block' : 'none';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  console.log('📦 Modal abierto para el producto:', producto.nombre);
}

function cerrarModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    productoActual = null;
  }
}

// ----------------------
// Acciones: Trueque / Compra / Carrito
// ----------------------
function handleTrueque() {
  if (!productoActual) return;
  if (!exigirLogin()) return;

  console.log('🔄 Iniciando trueque para:', productoActual.nombre);

  const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');

  const trueque = {
    tipo: 'trueque',
    fecha: new Date().toISOString(),
    usuario: usuario?.nombre || 'Usuario Ecotrueque',
    vendedor: productoActual.vendedor,
    producto: productoActual.nombre
  };

  // Guardar datos del trueque para la vista de chat
  sessionStorage.setItem('truequeActual', JSON.stringify(trueque));

  cerrarModal();

  // Ir a la ruta de chat
  if (window.router) {
    window.router.navigate('chat-trueque');
  } else {
    window.location.hash = '#chat-trueque';
  }
}

function handleCompra() {
  if (!productoActual || productoActual.tipo !== 'venta') return;
  if (!exigirLogin()) return;

  console.log('💰 Iniciando compra para:', productoActual.nombre);

  const confirmar = confirm(
    `¿Deseas comprar "${productoActual.nombre}" por ₡${productoActual.precio.toLocaleString()}?`
  );
  if (!confirmar) return;

  const usuario = JSON.parse(localStorage.getItem('usuarioActual') || 'null');

  const transaccion = {
    tipo: 'compra',
    fecha: new Date().toISOString(),
    usuario: usuario?.nombre || 'Usuario Ecotrueque',
    vendedor: productoActual.vendedor,
    producto: productoActual.nombre,
    cantidad: 1,
    metodoPago: 'Tarjeta de Crédito',
    total: productoActual.precio
  };

  // Marcar producto como no disponible
  const productos = JSON.parse(localStorage.getItem('productos') || '[]');
  const actualizados = productos.map((p) =>
    p.id === productoActual.id ? { ...p, disponibles: 0 } : p
  );
  localStorage.setItem('productos', JSON.stringify(actualizados));

  // Guardar transacción para el recibo
  sessionStorage.setItem('transaccionActual', JSON.stringify(transaccion));

  cerrarModal();

  // Navegar a la vista de recibo
  if (window.router) {
    window.router.navigate('recibo');
  } else {
    window.location.hash = '#recibo';
  }
}

function handleCarrito() {
  if (!productoActual) return;
  
  console.log('Agregando al carrito:', productoActual.nombre);
  
  import('../utils/carritoUtils.js').then(module => {
    const ok = module.agregarAlCarrito(productoActual.id);

    if (ok) {
      // si se pudo agregar
      showNotification(`bien! "${productoActual.nombre}" agregado al carrito`);
      module.actualizarContadorCarrito();
    } else {
      
      showNotification(' No se pudo agregar al carrito', 'error');
    }
  }).catch(err => {
    console.error('Error importando carritoUtils:', err);
    showNotification('No se pudo agregar al carrito', 'error');
  });

  cerrarModal();
}


// ----------------------
// Notificaciones
// ----------------------
function showNotification(mensaje, tipo = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${tipo}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${mensaje}
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${tipo === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
