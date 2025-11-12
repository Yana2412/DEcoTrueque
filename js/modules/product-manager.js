// js/modules/product-manager.js
import { productImageHandler } from './image-handler.js';

export class ProductManager {
    constructor() {
        this.products = this.loadProducts();
    }

    initialize() {
        // Inicializar manejador de imágenes
        const imageHandlerInitialized = productImageHandler.initialize(
            'productImageInput', 
            'imagePreviewContainer'
        );

        if (!imageHandlerInitialized) {
            console.warn('Image handler no pudo inicializarse - elementos no encontrados');
        }

        this.bindFormEvents();
    }

    bindFormEvents() {
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (event) => {
                event.preventDefault();
                this.handleProductSubmit();
            });
        }
    }

    handleProductSubmit() {
        const productData = this.collectProductData();
        
        if (this.validateProductData(productData)) {
            this.saveProduct(productData);
            this.resetForm();
            this.showSuccessMessage();
            this.dispatchProductAddedEvent(productData);
        }
    }

    collectProductData() {
        return {
            id: this.generateId(),
            name: document.getElementById('productName').value.trim(),
            price: document.getElementById('productPrice').value,
            type: document.getElementById('productType').value,
            image: productImageHandler.getImageData(),
            timestamp: new Date().toISOString(),
            rating: Math.floor(Math.random() * 50) + 1 // Simular datos como en tu ejemplo
        };
    }

    validateProductData(productData) {
        if (!productData.name) {
            alert('Por favor, ingresa un nombre para el producto.');
            return false;
        }

        if (!productData.price && productData.type !== 'truegue') {
            alert('Por favor, ingresa un precio para el producto.');
            return false;
        }

        if (!productImageHandler.hasImage()) {
            alert('Por favor, selecciona una imagen para el producto.');
            return false;
        }

        return true;
    }

    saveProduct(productData) {
        this.products.push(productData);
        this.persistProducts();
    }

    persistProducts() {
        try {
            localStorage.setItem('userProducts', JSON.stringify(this.products));
        } catch (error) {
            console.error('Error guardando productos:', error);
        }
    }

    loadProducts() {
        try {
            const stored = localStorage.getItem('userProducts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error cargando productos:', error);
            return [];
        }
    }

    resetForm() {
        const form = document.getElementById('addProductForm');
        if (form) form.reset();
        productImageHandler.reset();
    }

    showSuccessMessage() {
        // Puedes usar tu modal system aquí
        alert('¡Producto agregado exitosamente!');
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    dispatchProductAddedEvent(productData) {
        const event = new CustomEvent('productAdded', {
            detail: productData
        });
        document.dispatchEvent(event);
    }

    getProducts() {
        return [...this.products];
    }

    clearProducts() {
        this.products = [];
        this.persistProducts();
    }
}

// Instancia global
export const productManager = new ProductManager();