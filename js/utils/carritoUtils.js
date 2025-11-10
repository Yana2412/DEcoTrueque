// js/utils/carritoUtils.js

// ─── FUNCIÓN PARA INICIALIZAR DATOS DE DEMO ───────────────────────
export function inicializarDatosDemo() {
  if (!localStorage.getItem('productos')) {
    const productosDemo = [
      { id: 1, nombre: "Botellas de Vidrio", categoria: "Reciclaje", tipo: "trueque", vendedor: "Ana", imagen: "" },
      { id: 2, nombre: "Ropa Usada", categoria: "Textiles", tipo: "trueque", vendedor: "Carlos", imagen: "" },
      { id: 3, nombre: "Caja de Cartón", categoria: "Papel", tipo: "trueque", vendedor: "Luis", imagen: "" },
      { id: 4, nombre: "Caja de Madera", categoria: "Madera", tipo: "venta", precio: 8000, vendedor: "María", imagen: "" },
      { id: 5, nombre: "Lata de Aluminio", categoria: "Metales", tipo: "trueque", vendedor: "Jorge", imagen: "" }
    ];
    localStorage.setItem('productos', JSON.stringify(productosDemo));
  }

  if (!localStorage.getItem('carrito')) {
    localStorage.setItem('carrito', JSON.stringify([]));
  }
}

// ─── FUNCIÓN PARA AGREGAR AL CARRITO ──────────────────────────────
export function agregarAlCarrito(idProducto) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const productoExistente = carrito.find(item => item.id === idProducto);

  if (productoExistente) {
    productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
  } else {
    carrito.push({ id: idProducto, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito(); // ✅ Llama a la función aquí también
  // Opcional: disparar evento personalizado
  window.dispatchEvent(new Event('carritoActualizado'));
}

// ─── FUNCIÓN PARA ELIMINAR DEL CARRITO ────────────────────────────
export function eliminarDelCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(item => item.id !== idProducto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

// ─── FUNCIÓN PARA VACIAR EL CARRITO ───────────────────────────────
export function vaciarCarrito() {
  localStorage.setItem('carrito', JSON.stringify([]));
  actualizarContadorCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

// js/utils/carritoUtils.js
export function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  
  const contador = document.getElementById('carrito-contador');
  if (contador) {
    if (totalItems > 0) {
      contador.textContent = totalItems;
      contador.style.opacity = '1';
    } else {
      contador.style.opacity = '0';
    }
  }
}