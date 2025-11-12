// js/modules/image-handler.js
export class ImageHandler {
    constructor() {
        this.imageInput = null;
        this.previewContainer = null;
        this.currentImage = null;
    }

    initialize(imageInputId, previewContainerId) {
        this.imageInput = document.getElementById(imageInputId);
        this.previewContainer = document.getElementById(previewContainerId);
        
        if (this.imageInput && this.previewContainer) {
            this.bindEvents();
            return true;
        }
        return false;
    }

    bindEvents() {
        this.imageInput.addEventListener('change', (event) => {
            this.handleImageUpload(event);
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (!file) {
            this.removeImage();
            return;
        }

        if (!this.validateImage(file)) {
            this.removeImage();
            return;
        }

        this.displayImage(file);
    }

    validateImage(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return false;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande. Máximo 5MB permitidos.');
            return false;
        }

        return true;
    }

    displayImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.removeImage();
            
            this.currentImage = new Image();
            this.currentImage.src = e.target.result;
            this.currentImage.className = 'product-image-preview';
            this.currentImage.alt = 'Vista previa del producto';
            
            this.previewContainer.appendChild(this.currentImage);
        };
        
        reader.onerror = () => {
            alert('Error al cargar la imagen. Intenta nuevamente.');
            this.removeImage();
        };
        
        reader.readAsDataURL(file);
    }

    removeImage() {
        if (this.currentImage && this.currentImage.parentNode) {
            this.currentImage.parentNode.removeChild(this.currentImage);
            this.currentImage = null;
        }
        
        if (this.imageInput) {
            this.imageInput.value = '';
        }
        
        this.previewContainer.innerHTML = '';
    }

    getImageData() {
        return this.currentImage ? this.currentImage.src : null;
    }

    hasImage() {
        return this.currentImage !== null;
    }

    reset() {
        this.removeImage();
    }
}

export const productImageHandler = new ImageHandler();