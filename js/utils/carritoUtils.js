// js/utils/carritoUtils.js - VERSIÓN CORREGIDA

export function inicializarDatosDemo() {
  if (!localStorage.getItem('productos')) {
    const productosDemo = [
      {
        id: 1,
        nombre: "Botellas de Vidrio",
        descripcion: "Se vende botellas de vidrio limpias y clasificadas por color. Ideal para manualidades o reciclaje.",
        categoria: "vidrio",
        tipo: "venta",
        precio: 50,
        vendedor: "Ana López",
        imagen: "assets/images/botellavidrio.png",
        rating: 4.5,
        itemsSold: 30,
        disponibles: 50
      },
      {
        id: 2,
        nombre: "Botellas de Plástico",
        descripcion: "Se intercambian botellas de plástico para reciclaje. Todas limpias y sin residuos.",
        categoria: "plastico",
        tipo: "trueque",
        precio: 0,
        vendedor: "Carlos Ruiz",
        imagen: "assets/images/plasticbottles.jpg",
        rating: 4.8,
        itemsSold: 23,
        disponibles: 40
      },
      {
        id: 3,
        nombre: "Cartón Reciclado",
        descripcion: "Cartón limpio y seco, ideal para manualidades o empaques ecológicos.",
        categoria: "papel",
        tipo: "venta",
        precio: 230,
        vendedor: "María García",
        imagen: "assets/images/cardboard.jpg",
        rating: 4.2,
        itemsSold: 360,
        disponibles: 100
      },
      {
        id: 4,
        nombre: "Ropa Usada",
        descripcion: "Ropa en buen estado, lavada y revisada. Varios tallas disponibles.",
        categoria: "textiles",
        tipo: "trueque",
        precio: 0,
        vendedor: "Jorge Pérez",
        imagen: "assets/images/clothes.jpg",
        rating: 4.9,
        itemsSold: 46,
        disponibles: 30
      },
      {
        id: 5,
        nombre: "Tarimas de Madera",
        descripcion: "Se vende tarimas de madera usadas para proyectos artesanales o decoración.",
        categoria: "madera",
        tipo: "venta",
        precio: 150,
        vendedor: "Luis Martínez",
        imagen: "assets/images/woodpallets.jpg",
        rating: 4.7,
        itemsSold: 35,
        disponibles: 20
      },
      {
        id: 6,
        nombre: "Latas de Aluminio",
        descripcion: "Latas de aluminio limpias y sin residuos, listas para reciclar.",
        categoria: "metal",
        tipo: "trueque",
        precio: 0,
        vendedor: "Sofía Torres",
        imagen: "assets/images/aluminumcans.jpg",
        rating: 4.3,
        itemsSold: 50,
        disponibles: 75
      },
      {
        id: 7,
        nombre: "Juguetes Usados",
        descripcion: "Juguetes en buen estado, limpios y funcionales. Perfectos para reutilizar.",
        categoria: "plasticos",
        tipo: "venta",
        precio: 100,
        vendedor: "Pedro Sánchez",
        imagen: "assets/images/toys.jpg",
        rating: 4.6,
        itemsSold: 28,
        disponibles: 45
      },
      {
        id: 8,
        nombre: "Bolsas de Plástico",
        descripcion: "Bolsas de plástico limpias y reutilizables. Diferentes tamaños disponibles.",
        categoria: "plasticos",
        tipo: "trueque",
        precio: 0,
        vendedor: "Laura Fernández",
        imagen: "assets/images/plasticbags.jpg",
        rating: 4.1,
        itemsSold: 60,
        disponibles: 100
      },
      {
        id: 9,
        nombre: "Madera Reciclada",
        descripcion: "Madera usada en buen estado para proyectos de construcción o muebles.",
        categoria: "madera",
        tipo: "venta",
        precio: 300,
        vendedor: "Daniel Gómez",
        imagen: "assets/images/recycledwood.jpg",
        rating: 4.4,
        itemsSold: 15,
        disponibles: 25
      },
      {
        id: 10,
        nombre: "Bolsas de Tela",
        descripcion: "Bolsas de tela reutilizables para compras. Ecológicas y duraderas.",
        categoria: "textiles",
        tipo: "venta",
        precio: 120,
        vendedor: "Isabel Díaz",
        imagen: "assets/images/canvasbags.jpg",
        rating: 4.8,
        itemsSold: 40,
        disponibles: 35
      }
    ];
    
    // Verificar y corregir imágenes antes de guardar
    const productosCorregidos = productosDemo.map(producto => {
      if (!producto.imagen || producto.imagen === '') {
        producto.imagen = generarImagenFallback(producto.nombre);
      }
      return producto;
    });
    
    localStorage.setItem('productos', JSON.stringify(productosCorregidos));
    console.log('✅ Datos demo inicializados:', productosCorregidos.length, 'productos');
  }

  if (!localStorage.getItem('carrito')) {
    localStorage.setItem('carrito', JSON.stringify([]));
  }
}

// Función para generar imágenes SVG como fallback (sin dependencias externas)
function generarImagenFallback(nombreProducto) {
  const colores = ['4CAF50', '2196F3', 'FF9800', '9C27B0', 'F44336', '607D8B'];
  const color = colores[Math.floor(Math.random() * colores.length)];
  
  // Crear SVG como data URL (funciona sin internet)
  const svg = `
    <svg width="200" height="180" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${color}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
        ${nombreProducto.split(' ').slice(0, 3).join(' ')}
      </text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Función mejorada para verificar imágenes
export function verificarImagenes() {
  const productos = JSON.parse(localStorage.getItem('productos')) || [];
  console.log('🔍 Verificando imágenes disponibles:');
  
  productos.forEach((producto, index) => {
    // Si no hay imagen o está vacía, generar fallback
    if (!producto.imagen || producto.imagen.trim() === '') {
      console.warn(`❌ Imagen vacía para: ${producto.nombre}`);
      producto.imagen = generarImagenFallback(producto.nombre);
    } else {
      // Verificar si es una imagen local
      if (producto.imagen.startsWith('assets/') || producto.imagen.startsWith('./assets/')) {
        console.log(`📁 Imagen local: ${producto.imagen}`);
        // Para imágenes locales, asumimos que existen o usamos fallback
      } else {
        console.log(`🌐 Imagen externa: ${producto.imagen}`);
      }
    }
  });
  
  // Actualizar localStorage con correcciones
  localStorage.setItem('productos', JSON.stringify(productos));
  console.log('✅ Verificación de imágenes completada');
}

export function agregarAlCarrito(idProducto) {
  try {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoExistente = carrito.find(item => item.id === idProducto);

    if (productoExistente) {
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
    } else {
      carrito.push({ 
        id: idProducto, 
        cantidad: 1,
        agregado: new Date().toISOString()
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    window.dispatchEvent(new CustomEvent('carritoActualizado'));
    return true;
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    return false;
  }
}

export function eliminarDelCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carrito.filter(item => item.id !== idProducto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

export function vaciarCarrito() {
  localStorage.setItem('carrito', JSON.stringify([]));
  actualizarContadorCarrito();
  window.dispatchEvent(new Event('carritoActualizado'));
}

export function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  
  const contador = document.getElementById('carrito-contador');
  if (contador) {
    if (totalItems > 0) {
      contador.textContent = totalItems > 99 ? '99+' : totalItems.toString();
      contador.style.display = 'flex';
      contador.style.opacity = '1';
    } else {
      contador.style.opacity = '0';
      setTimeout(() => {
        contador.style.display = 'none';
      }, 300);
    }
  }
}

export function obtenerCarrito() {
  return JSON.parse(localStorage.getItem('carrito')) || [];
}

export function obtenerProductos() {
  return JSON.parse(localStorage.getItem('productos')) || [];
}