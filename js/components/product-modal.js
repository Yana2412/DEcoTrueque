// js/components/product-modal.js

let productoActual = null;

export function initProductModal() {
  console.log("🔧 Inicializando modal de producto");
  
  const modal = document.getElementById('productModal');
  const closeModal = document.getElementById('modalClose');
  
  if (!modal) {
    console.error('❌ Modal no encontrado en el DOM');
    return;
  }

  // Cerrar modal al hacer clic en la X
  if (closeModal) {
    closeModal.addEventListener('click', cerrarModal);
  }
  
  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModal();
    }
  });

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      cerrarModal();
    }
  });

  // Eventos de los botones del modal
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

// SOLO UNA DECLARACIÓN de abrirModalProducto
export function abrirModalProducto(producto) {
  productoActual = producto;
  const modal = document.getElementById('productModal');
  
  if (!modal) {
    console.error('❌ Modal no encontrado');
    return;
  }

  // Actualizar contenido del modal con mejor manejo de imágenes
  const modalImage = document.getElementById('modalProductImage');
  modalImage.src = producto.imagen;
  modalImage.alt = producto.nombre;
  
  // Fallback para imágenes que no cargan (usando SVG local)
  modalImage.onerror = function() {
    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIj4kewogICAgZW5jb2RlVVJJQ29tcG9uZW50KHByb2R1Y3RvLm5vbWJyZSl9PC90ZXh0Pjwvc3ZnPg==';
    this.alt = 'Imagen no disponible - ' + producto.nombre;
  };

  document.getElementById('modalProductName').textContent = producto.nombre;
  
  const priceElement = document.getElementById('modalProductPrice');
  if (producto.tipo === 'venta') {
    priceElement.textContent = `₡${producto.precio.toLocaleString()}`;
    priceElement.style.color = '#4CAF50';
  } else {
    priceElement.textContent = '🔄 Trueque';
    priceElement.style.color = '#FF9800';
  }

  document.getElementById('modalProductRating').textContent = 
    `${producto.rating} ⭐ (${producto.itemsSold} vendidos)`;
  
  document.getElementById('modalProductDescription').textContent = producto.descripcion;

  // Actualizar data-id de los botones
  document.querySelectorAll('.btn-modal').forEach(btn => {
    btn.setAttribute('data-id', producto.id);
  });

  // Mostrar/ocultar botón de compra según el tipo
  const btnCompra = document.querySelector('.btn-compra');
  if (btnCompra) {
    btnCompra.style.display = producto.tipo === 'venta' ? 'block' : 'none';
  }

  // Mostrar modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  console.log('📦 Modal abierto para:', producto.nombre);
}

function cerrarModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    productoActual = null;
  }
}

function handleTrueque() {
  if (!productoActual) return;
  
  console.log('🔄 Iniciando trueque para:', productoActual.nombre);
  
  // Simular proceso de trueque
  showNotification(`📨 Propuesta de trueque enviada para: ${productoActual.nombre}`);
  cerrarModal();
}

function handleCompra() {
  if (!productoActual || productoActual.tipo !== 'venta') return;
  
  console.log('💰 Iniciando compra para:', productoActual.nombre);
  
  if (confirm(`¿Deseas comprar "${productoActual.nombre}" por ₡${productoActual.precio.toLocaleString()}?`)) {
    showNotification(`✅ Compra realizada: ${productoActual.nombre}`);
    // Aquí iría la lógica de pago real
  }
  cerrarModal();
}

function handleCarrito() {
  if (!productoActual) return;
  
  console.log('🛒 Agregando al carrito:', productoActual.nombre);
  
  import('../utils/carritoUtils.js').then(module => {
    const resultado = module.agregarAlCarrito(productoActual.id);
    if (resultado) {
      showNotification(`✅ "${productoActual.nombre}" agregado al carrito`);
      module.actualizarContadorCarrito();
    } else {
      showNotification('❌ Error al agregar al carrito', 'error');
    }
  });
  
  cerrarModal();
}

function showNotification(mensaje, tipo = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${tipo}`;
  notification.innerHTML = `
    <div class="notification-content">
      ${mensaje}
    </div>
  `;
  
  // Estilos para la notificación
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

// NO exportar abrirModalProducto otra vez - ya está exportada arriba