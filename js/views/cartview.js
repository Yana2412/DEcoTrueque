// js/views/cartview.js

export function render() {
  const mainContent = document.getElementById('mainContent');
  if (!mainContent) {
    console.error("Contenedor #mainContent no encontrado");
    return;
  }

  const carritoData = JSON.parse(localStorage.getItem('carrito')) || [];
  const productos = JSON.parse(localStorage.getItem('productos')) || [];

  const productosEnCarrito = carritoData.map(item => {
    const producto = productos.find(p => p.id === item.id);
    return producto ? { ...producto, cantidad: item.cantidad || 1 } : null;
  }).filter(p => p !== null);

  if (productosEnCarrito.length === 0) {
    mainContent.innerHTML = `
      <div class="carrito-vacio" style="text-align: center; padding: 60px 20px;">
        <h2>🛒 Tu carrito está vacío</h2>
        <p>Aún no has agregado productos para trueque o compra.</p>
        <button id="btnIrHome" style="margin-top: 20px; padding: 10px 20px; background: var(--primary-green); color: white; border: none; border-radius: 5px; cursor: pointer;">
          Explorar productos
        </button>
      </div>
    `;

    // ✅ Espera un tick para asegurar que el DOM esté listo
    setTimeout(() => {
      const btn = document.getElementById('btnIrHome');
      if (btn) {
        btn.onclick = () => {
          import('../modules/app-main.js').then(m => m.renderHome());
        };
      }
    }, 0);
    return;
  }

  const total = productosEnCarrito
    .filter(p => p.tipo === 'venta')
    .reduce((sum, p) => sum + (p.precio * (p.cantidad || 1)), 0);

  mainContent.innerHTML = `
    <section class="carrito-section" style="padding: 20px;">
      <h2 style="margin-bottom: 20px;">🛒 Tu carrito (${productosEnCarrito.length} items)</h2>
      <div class="product-grid">
        ${productosEnCarrito.map(p => `
          <div class="product-card" style="position: relative;">
            <div class="product-image">
              <img src="${p.imagen || ' https://via.placeholder.com/200x180?text=' + encodeURIComponent(p.nombre)}" alt="${p.nombre}">
            </div>
            <div class="product-info">
              <div class="product-title">${p.nombre}</div>
              <div class="product-price">
                ${p.tipo === 'venta' 
                  ? `₡${(p.precio * (p.cantidad || 1)).toLocaleString()}` 
                  : `🔄 Trueque × ${p.cantidad || 1}`}
              </div>
              <div class="product-stats">
                <span>Vendedor: ${p.vendedor || 'Anónimo'}</span>
              </div>
              <div style="margin-top: 10px; display: flex; gap: 8px; align-items: center;">
                <span>Cantidad: ${p.cantidad || 1}</span>
                <button class="btn-eliminar" data-id="${p.id}" 
                  style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="resumen-carrito" style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        ${total > 0 ? `<h3>Total: ₡${total.toLocaleString()}</h3>` : ''}
        <div style="margin-top: 15px;">
          <button id="btnProcesar" style="padding: 10px 20px; background: var(--primary-green); color: white; border: none; border-radius: 5px; margin-right: 10px;">
            ${total > 0 ? 'Comprar' : 'Proponer trueque'}
          </button>
          <button id="btnSeguir" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px;">
            Seguir explorando
          </button>
        </div>
      </div>
    </section>
  `;

  // ✅ Usar setTimeout para asegurar que el DOM esté listo
  setTimeout(() => {
    // Eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = parseInt(e.target.dataset.id);
        const { eliminarDelCarrito, actualizarContadorCarrito } = await import('../utils/carritoUtils.js');
        eliminarDelCarrito(id);
        actualizarContadorCarrito();
        render(); // Recargar carrito
      });
    });

    // Procesar
    const btnProcesar = document.getElementById('btnProcesar');
    if (btnProcesar) {
      btnProcesar.onclick = async () => {
        alert('¡Operación completada! (Simulación)');
        localStorage.setItem('carrito', JSON.stringify([]));
        const { actualizarContadorCarrito } = await import('../utils/carritoUtils.js');
        actualizarContadorCarrito();
        render();
      };
    }

    // Seguir explorando
    const btnSeguir = document.getElementById('btnSeguir');
    if (btnSeguir) {
      btnSeguir.onclick = () => {
        import('../modules/app-main.js').then(m => m.renderHome());
      };
    }
  }, 0);
}