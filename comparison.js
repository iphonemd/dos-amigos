// Product Comparison Functionality
// This script adds the ability to compare products in the Dos Amigos website

// Store for products to be compared
let compareProducts = {
  items: [],
  maxItems: 4, // Maximum number of products that can be compared at once
  
  // Add a product to the comparison
  addProduct: function(productId) {
    // Check if product is already in comparison
    if (this.items.includes(productId)) {
      showNotification('Este producto ya está en la comparación', 'warning');
      return false;
    }
    
    // Check if comparison is full
    if (this.items.length >= this.maxItems) {
      showNotification(`Solo puedes comparar hasta ${this.maxItems} productos a la vez`, 'warning');
      return false;
    }
    
    // Add product to comparison
    this.items.push(productId);
    
    // Update UI
    this.updateCompareButton();
    
    // Show notification
    showNotification('Producto añadido a la comparación', 'success');
    
    return true;
  },
  
  // Remove a product from the comparison
  removeProduct: function(productId) {
    const index = this.items.indexOf(productId);
    if (index > -1) {
      this.items.splice(index, 1);
      this.updateCompareButton();
      
      // Update comparison modal if open
      if (document.getElementById('compare-modal').classList.contains('active')) {
        this.showComparison();
      }
      
      return true;
    }
    return false;
  },
  
  // Clear all products from comparison
  clearProducts: function() {
    this.items = [];
    this.updateCompareButton();
    
    // Remove the active class from all compare buttons
    document.querySelectorAll('.add-compare').forEach(btn => {
      btn.classList.remove('active');
    });
  },
  
  // Update the compare button in the header
  updateCompareButton: function() {
    // Save to local storage
    localStorage.setItem('compareProducts', JSON.stringify(this.items));
    
    // Update the compare button count
    const compareCount = document.getElementById('compare-count');
    if (compareCount) {
      compareCount.textContent = this.items.length;
      
      // Show or hide the count badge
      if (this.items.length > 0) {
        compareCount.style.display = 'flex';
      } else {
        compareCount.style.display = 'none';
      }
    }
    
    // Update all compare buttons to show active state for products in comparison
    document.querySelectorAll('.add-compare').forEach(btn => {
      const productId = btn.getAttribute('data-product-id');
      if (productId && this.items.includes(parseInt(productId))) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Enable or disable the compare button based on item count
    const compareBtn = document.getElementById('compare-button');
    if (compareBtn) {
      if (this.items.length >= 2) {
        compareBtn.classList.add('active');
      } else {
        compareBtn.classList.remove('active');
      }
    }
  },
  
  // Load comparison data from local storage
  loadFromStorage: function() {
    const storedItems = localStorage.getItem('compareProducts');
    if (storedItems) {
      try {
        this.items = JSON.parse(storedItems);
        this.updateCompareButton();
      } catch (e) {
        debug.error('Error loading comparison data from storage', e);
        localStorage.removeItem('compareProducts');
      }
    }
  },
  
  // Show the comparison modal with selected products
  showComparison: function() {
    if (this.items.length < 2) {
      showNotification('Selecciona al menos 2 productos para comparar', 'warning');
      return false;
    }
    
    const compareModal = document.getElementById('compare-modal');
    const compareContent = document.getElementById('compare-content');
    
    if (!compareModal || !compareContent) {
      debug.error('Compare modal elements not found');
      return false;
    }
    
    // Clear previous content
    compareContent.innerHTML = '';
    
    // Create comparison table
    const compareTable = document.createElement('div');
    compareTable.className = 'compare-table';
    
    // Get the products to compare
    const productsToCompare = this.items.map(id => productData[id]).filter(Boolean);
    
    // Build header row with product images and titles
    const headerRow = document.createElement('div');
    headerRow.className = 'compare-row compare-header';
    
    // Add empty cell for property names
    const emptyHeaderCell = document.createElement('div');
    emptyHeaderCell.className = 'compare-cell compare-property';
    headerRow.appendChild(emptyHeaderCell);
    
    // Add product headers
    productsToCompare.forEach(product => {
      const productCell = document.createElement('div');
      productCell.className = 'compare-cell compare-product';
      
      // Product image
      const productImage = document.createElement('div');
      productImage.className = 'compare-product-image';
      
      const image = document.createElement('img');
      if (product.images && product.images.length > 0) {
        image.src = product.images[0];
      } else {
        image.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23cccccc"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23666666"%3ESin Imagen%3C/text%3E%3C/svg%3E';
      }
      image.alt = product.title;
      
      // Add error handler
      image.onerror = function() {
        if (!this.hasAttribute('data-error-handled')) {
          this.setAttribute('data-error-handled', 'true');
          this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f8d7da"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23721c24"%3EImagen No Disponible%3C/text%3E%3C/svg%3E';
        }
      };
      
      productImage.appendChild(image);
      
      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'compare-remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-times"></i>';
      removeBtn.setAttribute('data-product-id', product.id);
      removeBtn.addEventListener('click', function() {
        compareProducts.removeProduct(parseInt(this.getAttribute('data-product-id')));
      });
      
      productImage.appendChild(removeBtn);
      productCell.appendChild(productImage);
      
      // Product title
      const productTitle = document.createElement('h3');
      productTitle.className = 'compare-product-title';
      productTitle.textContent = product.title;
      productCell.appendChild(productTitle);
      
      // Product brand
      const productBrand = document.createElement('div');
      productBrand.className = 'compare-product-brand';
      productBrand.textContent = product.brand;
      productCell.appendChild(productBrand);
      
      // Product price
      const productPrice = document.createElement('div');
      productPrice.className = 'compare-product-price';
      
      const currentPrice = document.createElement('span');
      currentPrice.className = 'current-price';
      currentPrice.textContent = product.price;
      productPrice.appendChild(currentPrice);
      
      if (product.oldPrice) {
        const oldPrice = document.createElement('span');
        oldPrice.className = 'old-price';
        oldPrice.textContent = product.oldPrice;
        productPrice.appendChild(oldPrice);
      }
      
      productCell.appendChild(productPrice);
      
      // Add to cart button
      const addToCartBtn = document.createElement('button');
      addToCartBtn.className = 'btn add-to-cart-btn';
      addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Añadir al Carrito';
      productCell.appendChild(addToCartBtn);
      
      headerRow.appendChild(productCell);
    });
    
    compareTable.appendChild(headerRow);
    
    // Property rows to compare
    const propertiesToCompare = [
      { name: 'Categoría', key: 'category', formatter: formatCollectionName },
      { name: 'Descripción', key: 'description' },
      { name: 'Colores', key: 'colors', formatter: formatColors },
      { name: 'Tallas', key: 'sizes', formatter: formatSizes }
    ];
    
    // Build property rows
    propertiesToCompare.forEach(property => {
      const propertyRow = document.createElement('div');
      propertyRow.className = 'compare-row';
      
      // Property name cell
      const propertyCell = document.createElement('div');
      propertyCell.className = 'compare-cell compare-property';
      propertyCell.textContent = property.name;
      propertyRow.appendChild(propertyCell);
      
      // Property values for each product
      productsToCompare.forEach(product => {
        const valueCell = document.createElement('div');
        valueCell.className = 'compare-cell';
        
        let value = product[property.key];
        
        // Apply formatter if exists
        if (property.formatter && typeof property.formatter === 'function') {
          value = property.formatter(value);
        }
        
        if (property.key === 'description') {
          // For description, create a paragraph element
          const desc = document.createElement('p');
          desc.textContent = value || 'No disponible';
          valueCell.appendChild(desc);
        } else if (property.key === 'colors') {
          // For colors, the formatter returns HTML
          valueCell.innerHTML = value;
        } else if (property.key === 'sizes') {
          // For sizes, the formatter returns HTML
          valueCell.innerHTML = value;
        } else {
          // For other properties, use text content
          valueCell.textContent = value || 'No disponible';
        }
        
        propertyRow.appendChild(valueCell);
      });
      
      compareTable.appendChild(propertyRow);
    });
    
    compareContent.appendChild(compareTable);
    
    // Show the modal
    compareModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    return true;
  }
};

// Format specific product properties for display
function formatCollectionName(category) {
  if (!category) return 'No disponible';
  
  // Convert category to readable format
  const categoryMap = {
    'boots': 'Botas',
    'hats': 'Sombreros',
    'jackets': 'Chamarras',
    'accessories': 'Accesorios'
  };
  
  return categoryMap[category] || category;
}

function formatColors(colors) {
  if (!colors || !Array.isArray(colors) || colors.length === 0) {
    return 'No disponible';
  }
  
  let html = '<div class="compare-colors">';
  colors.forEach(color => {
    html += `<div class="color-option" style="background-color: ${color}"></div>`;
  });
  html += '</div>';
  
  return html;
}

function formatSizes(sizes) {
  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return 'No disponible';
  }
  
  let html = '<div class="compare-sizes">';
  sizes.forEach(size => {
    html += `<div class="size-option">${size}</div>`;
  });
  html += '</div>';
  
  return html;
}

// Notification system
function showNotification(message, type = 'info') {
  // Check if notification container exists, create if not
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Icon based on type
  let icon = '';
  switch (type) {
    case 'success':
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    case 'error':
      icon = '<i class="fas fa-times-circle"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle"></i>';
  }
  
  // Set notification content
  notification.innerHTML = `
    ${icon}
    <div class="notification-message">${message}</div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  // Add notification to container
  notificationContainer.appendChild(notification);
  
  // Add active class after a small delay for animation
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Setup close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    closeNotification(notification);
  });
  
  // Auto-close notification after 3 seconds
  setTimeout(() => {
    closeNotification(notification);
  }, 3000);
}

function closeNotification(notification) {
  notification.classList.remove('active');
  
  // Remove from DOM after animation completes
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Initialize comparison functionality
function initComparisonSystem() {
  debug.log('Initializing product comparison system');
  
  // Create comparison modal if it doesn't exist
  if (!document.getElementById('compare-modal')) {
    const compareModal = document.createElement('div');
    compareModal.id = 'compare-modal';
    compareModal.className = 'compare-modal';
    
    compareModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-close" id="compare-modal-close">
          <i class="fas fa-times"></i>
        </div>
        <div class="modal-header">
          <h2>Comparación de Productos</h2>
        </div>
        <div class="modal-body" id="compare-content">
          <!-- Comparison content will be dynamically inserted here -->
        </div>
      </div>
    `;
    
    document.body.appendChild(compareModal);
    
    // Set up close button
    const closeBtn = document.getElementById('compare-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        compareModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
    }
    
    // Close modal when clicking outside of content
    compareModal.addEventListener('click', function(e) {
      if (e.target === compareModal) {
        compareModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Create compare button in header if it doesn't exist
  const topNavContainer = document.querySelector('.top-nav');
  if (topNavContainer && !document.getElementById('compare-button')) {
    const compareButton = document.createElement('div');
    compareButton.className = 'top-nav-item';
    compareButton.id = 'compare-button';
    compareButton.innerHTML = `
      <i class="fas fa-random"></i>
      <span class="count-badge" id="compare-count" style="display: none;">0</span>
    `;
    
    // Insert before language toggle
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
      topNavContainer.insertBefore(compareButton, languageToggle);
    } else {
      topNavContainer.appendChild(compareButton);
    }
    
    // Add click event to show comparison
    compareButton.addEventListener('click', () => {
      compareProducts.showComparison();
    });
  }
  
  // Load comparison data from local storage
  compareProducts.loadFromStorage();
  
  // Add click event to all compare buttons
  document.addEventListener('click', function(e) {
    const compareBtn = e.target.closest('.add-compare');
    if (compareBtn) {
      const productId = parseInt(compareBtn.getAttribute('data-product-id'));
      if (productId) {
        // If button is already active, remove from comparison
        if (compareBtn.classList.contains('active')) {
          compareProducts.removeProduct(productId);
          compareBtn.classList.remove('active');
          showNotification('Producto eliminado de la comparación', 'info');
        } else {
          // Otherwise add to comparison
          if (compareProducts.addProduct(productId)) {
            compareBtn.classList.add('active');
          }
        }
      }
    }
  });
  
  // Add data-product-id attribute to all compare buttons
  document.querySelectorAll('.add-compare').forEach(btn => {
    // Find parent product card to get product ID
    const productCard = btn.closest('.product-card');
    if (productCard) {
      const productId = productCard.getAttribute('data-product-id');
      if (productId) {
        btn.setAttribute('data-product-id', productId);
        
        // Check if this product is already in comparison
        if (compareProducts.items.includes(parseInt(productId))) {
          btn.classList.add('active');
        }
      }
    }
  });
}

// Add CSS styles for the comparison system
function addComparisonStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Compare Button Styles */
    #compare-button {
      position: relative;
      cursor: pointer;
    }
    
    #compare-button.active i {
      color: var(--accent);
    }
    
    #compare-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: var(--accent);
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    
    /* Product Card Compare Button */
    .product-action-btn.add-compare.active {
      background-color: var(--accent);
      color: white;
    }
    
    /* Compare Modal Styles */
    .compare-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      z-index: 9999;
      overflow-y: auto;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .compare-modal.active {
      display: flex;
      opacity: 1;
    }
    
    .compare-modal .modal-content {
      background-color: white;
      margin: auto;
      width: 90%;
      max-width: 1200px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      position: relative;
    }
    
    .compare-modal .modal-close {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      cursor: pointer;
      z-index: 10;
      transition: background-color 0.2s ease;
    }
    
    .compare-modal .modal-close:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
    
    .compare-modal .modal-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .compare-modal .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    
    .compare-modal .modal-body {
      padding: 0;
      overflow-x: auto;
    }
    
    /* Compare Table Styles */
    .compare-table {
      width: 100%;
      display: table;
      border-collapse: collapse;
    }
    
    .compare-row {
      display: table-row;
    }
    
    .compare-row:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    .compare-cell {
      display: table-cell;
      padding: 15px;
      border-bottom: 1px solid #eee;
      vertical-align: middle;
    }
    
    .compare-property {
      width: 150px;
      font-weight: bold;
      background-color: #f5f5f5;
    }
    
    .compare-header {
      background-color: white;
    }
    
    .compare-product {
      width: 220px;
      text-align: center;
      position: relative;
    }
    
    .compare-product-image {
      position: relative;
      width: 100%;
      height: 150px;
      margin-bottom: 15px;
    }
    
    .compare-product-image img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .compare-remove-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      color: #666;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .compare-remove-btn:hover {
      background-color: #e74c3c;
      color: white;
    }
    
    .compare-product-title {
      margin: 0 0 5px;
      font-size: 1rem;
    }
    
    .compare-product-brand {
      color: #777;
      margin-bottom: 10px;
    }
    
    .compare-product-price {
      margin-bottom: 15px;
    }
    
    .compare-product-price .current-price {
      font-weight: bold;
      color: var(--accent);
      font-size: 1.1rem;
    }
    
    .compare-product-price .old-price {
      color: #999;
      text-decoration: line-through;
      margin-left: 5px;
      font-size: 0.9rem;
    }
    
    .compare-colors {
      display: flex;
      justify-content: center;
      gap: 5px;
    }
    
    .compare-colors .color-option {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid #ddd;
    }
    
    .compare-sizes {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .compare-sizes .size-option {
      min-width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
    
    .add-to-cart-btn {
      width: 100%;
      padding: 8px;
      font-size: 0.9rem;
    }
    
    /* Notification Styles */
    #notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
    }
    
    .notification {
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
      padding: 15px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      transform: translateX(120%);
      transition: transform 0.3s ease;
    }
    
    .notification.active {
      transform: translateX(0);
    }
    
    .notification i {
      margin-right: 10px;
      font-size: 1.2rem;
    }
    
    .notification-success i {
      color: #2ecc71;
    }
    
    .notification-warning i {
      color: #f39c12;
    }
    
    .notification-error i {
      color: #e74c3c;
    }
    
    .notification-info i {
      color: #3498db;
    }
    
    .notification-message {
      flex: 1;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 5px;
    }
    
    /* Responsive styles for comparison table */
    @media (max-width: 768px) {
      .compare-modal .modal-content {
        width: 95%;
        margin: 20px auto;
      }
      
      .compare-property {
        width: 100px;
      }
      
      .compare-product {
        width: 180px;
      }
      
      .compare-product-image {
        height: 120px;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Add the necessary styles
  addComparisonStyles();
  
  // Initialize the comparison system
  initComparisonSystem();
  
  debug.log('Product comparison system initialized');
});