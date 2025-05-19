// Favorites Functionality
// This script adds the ability to save favorite products on the Dos Amigos website

// Store for favorite products
let favorites = {
  items: [],
  
  // Add a product to favorites
  addProduct: function(productId) {
    // Check if product is already in favorites
    if (this.items.includes(productId)) {
      return this.removeProduct(productId); // Toggle behavior
    }
    
    // Add product to favorites
    this.items.push(productId);
    
    // Update UI
    this.updateFavoritesUI();
    
    // Show notification
    showNotification('Producto añadido a favoritos', 'success');
    
    return true;
  },
  
  // Remove a product from favorites
  removeProduct: function(productId) {
    const index = this.items.indexOf(productId);
    if (index > -1) {
      this.items.splice(index, 1);
      this.updateFavoritesUI();
      
      // Update favorites modal if open
      if (document.getElementById('favorites-modal').classList.contains('active')) {
        this.showFavorites();
      }
      
      showNotification('Producto eliminado de favoritos', 'info');
      return true;
    }
    return false;
  },
  
  // Clear all products from favorites
  clearFavorites: function() {
    this.items = [];
    this.updateFavoritesUI();
    showNotification('Se han eliminado todos los favoritos', 'info');
    
    // Update favorites modal if open
    if (document.getElementById('favorites-modal').classList.contains('active')) {
      this.showFavorites();
    }
  },
  
  // Update the favorites UI elements
  updateFavoritesUI: function() {
    // Save to local storage
    localStorage.setItem('favoriteProducts', JSON.stringify(this.items));
    
    // Update the favorites count
    const favoritesCount = document.getElementById('favorites-count');
    if (favoritesCount) {
      favoritesCount.textContent = this.items.length;
      
      // Show or hide the count badge
      if (this.items.length > 0) {
        favoritesCount.style.display = 'flex';
      } else {
        favoritesCount.style.display = 'none';
      }
    }
    
    // Update all heart buttons to show active state for products in favorites
    document.querySelectorAll('.add-favorite').forEach(btn => {
      const productId = btn.getAttribute('data-product-id');
      if (productId && this.items.includes(parseInt(productId))) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },
  
  // Load favorites data from local storage
  loadFromStorage: function() {
    const storedItems = localStorage.getItem('favoriteProducts');
    if (storedItems) {
      try {
        this.items = JSON.parse(storedItems);
        this.updateFavoritesUI();
      } catch (e) {
        debug.error('Error loading favorites data from storage', e);
        localStorage.removeItem('favoriteProducts');
      }
    }
  },
  
  // Show the favorites modal with selected products
  showFavorites: function() {
    const favoritesModal = document.getElementById('favorites-modal');
    const favoritesContent = document.getElementById('favorites-content');
    
    if (!favoritesModal || !favoritesContent) {
      debug.error('Favorites modal elements not found');
      return false;
    }
    
    // Clear previous content
    favoritesContent.innerHTML = '';
    
    // If no favorites, show empty state
    if (this.items.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'favorites-empty';
      emptyState.innerHTML = `
        <i class="fas fa-heart-broken"></i>
        <h3>No tienes favoritos guardados</h3>
        <p>Haz clic en el corazón de cualquier producto para añadirlo a tus favoritos.</p>
        <a href="collection.html" class="btn">Ver Productos</a>
      `;
      favoritesContent.appendChild(emptyState);
    } else {
      // Create favorites grid
      const favoritesGrid = document.createElement('div');
      favoritesGrid.className = 'favorites-grid';
      
      // Header with clear button
      const headerRow = document.createElement('div');
      headerRow.className = 'favorites-header';
      headerRow.innerHTML = `
        <h3>Mis Favoritos <span>(${this.items.length})</span></h3>
        <button id="clear-favorites" class="btn-text">
          <i class="fas fa-trash-alt"></i> Eliminar Todo
        </button>
      `;
      favoritesContent.appendChild(headerRow);
      
      // Add clear favorites event
      headerRow.querySelector('#clear-favorites').addEventListener('click', () => {
        if (confirm('¿Estás seguro que deseas eliminar todos tus favoritos?')) {
          this.clearFavorites();
        }
      });
      
      // Get the products to display
      const productsToDisplay = this.items
        .map(id => productData[id])
        .filter(Boolean);
      
      // Create product cards for each favorite
      productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'favorite-card';
        
        // Product image
        const productImage = document.createElement('div');
        productImage.className = 'favorite-image';
        
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
        removeBtn.className = 'favorite-remove-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.setAttribute('data-product-id', product.id);
        removeBtn.addEventListener('click', function() {
          favorites.removeProduct(parseInt(this.getAttribute('data-product-id')));
        });
        
        productImage.appendChild(removeBtn);
        productCard.appendChild(productImage);
        
        // Product info
        const productInfo = document.createElement('div');
        productInfo.className = 'favorite-info';
        
        // Brand
        const productBrand = document.createElement('div');
        productBrand.className = 'favorite-brand';
        productBrand.textContent = product.brand;
        productInfo.appendChild(productBrand);
        
        // Title
        const productTitle = document.createElement('h3');
        productTitle.className = 'favorite-title';
        productTitle.textContent = product.title;
        productInfo.appendChild(productTitle);
        
        // Price
        const productPrice = document.createElement('div');
        productPrice.className = 'favorite-price';
        
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
        
        productInfo.appendChild(productPrice);
        
        // Quick view button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn-text quick-view-btn';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i> Vista Rápida';
        viewBtn.setAttribute('data-product-id', product.id);
        
        productInfo.appendChild(viewBtn);
        
        // Add to cart button
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'btn add-to-cart-btn';
        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Añadir al Carrito';
        
        productInfo.appendChild(addToCartBtn);
        productCard.appendChild(productInfo);
        
        favoritesGrid.appendChild(productCard);
      });
      
      favoritesContent.appendChild(favoritesGrid);
    }
    
    // Show the modal
    favoritesModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    return true;
  }
};

// Notification system (reusing from compare functionality if it exists)
if (typeof showNotification !== 'function') {
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
}

// Initialize favorites functionality
function initFavoritesSystem() {
  debug.log('Initializing product favorites system');
  
  // Create favorites modal if it doesn't exist
  if (!document.getElementById('favorites-modal')) {
    const favoritesModal = document.createElement('div');
    favoritesModal.id = 'favorites-modal';
    favoritesModal.className = 'favorites-modal';
    
    favoritesModal.innerHTML = `
      <div class="modal-content">
        <div class="modal-close" id="favorites-modal-close">
          <i class="fas fa-times"></i>
        </div>
        <div class="modal-header">
          <h2>Mis Favoritos</h2>
        </div>
        <div class="modal-body" id="favorites-content">
          <!-- Favorites content will be dynamically inserted here -->
        </div>
      </div>
    `;
    
    document.body.appendChild(favoritesModal);
    
    // Set up close button
    const closeBtn = document.getElementById('favorites-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        favoritesModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
    }
    
    // Close modal when clicking outside of content
    favoritesModal.addEventListener('click', function(e) {
      if (e.target === favoritesModal) {
        favoritesModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Create favorites button in header if it doesn't exist
  const topNavContainer = document.querySelector('.top-nav');
  if (topNavContainer) {
    const existingFavoritesBtn = topNavContainer.querySelector('.top-nav-item i.fas.fa-heart').parentNode;
    
    if (existingFavoritesBtn) {
      // Add the favorites button ID and count badge to existing button
      existingFavoritesBtn.id = 'favorites-button';
      
      // Add count badge if not exists
      if (!existingFavoritesBtn.querySelector('.count-badge')) {
        const countBadge = document.createElement('span');
        countBadge.className = 'count-badge';
        countBadge.id = 'favorites-count';
        countBadge.style.display = 'none';
        countBadge.textContent = '0';
        existingFavoritesBtn.appendChild(countBadge);
      }
      
      // Add click event to show favorites
      existingFavoritesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        favorites.showFavorites();
      });
    }
  }
  
  // Load favorites data from local storage
  favorites.loadFromStorage();
  
  // Add click event to all favorite buttons in product cards
  document.addEventListener('click', function(e) {
    const favoriteBtn = e.target.closest('.product-action-btn:not(.quick-view-btn):not(.add-compare)');
    if (favoriteBtn && favoriteBtn.querySelector('i.fas.fa-heart')) {
      // Find product ID from parent card
      const productCard = favoriteBtn.closest('.product-card');
      if (productCard) {
        const productId = parseInt(productCard.getAttribute('data-product-id'));
        if (productId) {
          // Add product-id attribute to favorite button for future reference
          favoriteBtn.setAttribute('data-product-id', productId);
          favoriteBtn.classList.add('add-favorite');
          
          // Toggle favorite
          favorites.addProduct(productId);
        }
      }
    }
  });
  
  // Process existing favorite buttons to add classes and check if active
  document.querySelectorAll('.product-action-btn i.fas.fa-heart').forEach(icon => {
    const btn = icon.parentNode;
    btn.classList.add('add-favorite');
    
    // Find product ID from parent card
    const productCard = btn.closest('.product-card');
    if (productCard) {
      const productId = productCard.getAttribute('data-product-id');
      if (productId) {
        btn.setAttribute('data-product-id', productId);
        
        // Check if product is in favorites
        if (favorites.items.includes(parseInt(productId))) {
          btn.classList.add('active');
        }
      }
    }
  });
  
  // Also handle the "Add to wishlist" button in quick view modal
  const quickViewWishlistBtn = document.querySelector('.add-to-wishlist');
  if (quickViewWishlistBtn) {
    quickViewWishlistBtn.addEventListener('click', function() {
      const modal = document.getElementById('quick-view-modal');
      if (modal) {
        const productId = getCurrentProductIdFromModal();
        if (productId) {
          favorites.addProduct(productId);
          
          // Update wishlist button state in modal
          updateQuickViewWishlistButton(productId);
        }
      }
    });
  }
}

// Helper function to get product ID from quick view modal
function getCurrentProductIdFromModal() {
  const modal = document.getElementById('quick-view-modal');
  if (!modal) return null;
  
  // Get product ID from any element with data-product-id in the modal
  const elementWithId = modal.querySelector('[data-product-id]');
  if (elementWithId) {
    return parseInt(elementWithId.getAttribute('data-product-id'));
  }
  
  // Alternative: Try to get product title and find matching product
  const titleElement = modal.querySelector('.product-title');
  if (titleElement) {
    const title = titleElement.textContent.trim();
    for (const [id, product] of Object.entries(productData)) {
      if (product.title === title) {
        return parseInt(id);
      }
    }
  }
  
  return null;
}

// Update wishlist button in quick view modal based on favorites status
function updateQuickViewWishlistButton(productId) {
  const wishlistBtn = document.querySelector('.add-to-wishlist');
  if (wishlistBtn && productId) {
    if (favorites.items.includes(parseInt(productId))) {
      wishlistBtn.classList.add('active');
    } else {
      wishlistBtn.classList.remove('active');
    }
  }
}

// Add observer to update quick view modal wishlist button when modal opens
function setupQuickViewObserver() {
  // Create a MutationObserver to watch for modal opening
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        const modal = mutation.target;
        if (modal.classList.contains('active')) {
          // Modal was just opened, update wishlist button
          const productId = getCurrentProductIdFromModal();
          if (productId) {
            updateQuickViewWishlistButton(productId);
          }
        }
      }
    });
  });
  
  // Start observing the modal
  const modal = document.getElementById('quick-view-modal');
  if (modal) {
    observer.observe(modal, { attributes: true });
  }
}

// Add CSS styles for the favorites system
function addFavoritesStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Favorites Button Styles */
    #favorites-button {
      position: relative;
      cursor: pointer;
    }
    
    .product-action-btn.add-favorite.active i,
    .add-to-wishlist.active i {
      color: #e74c3c;
    }
    
    #favorites-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #e74c3c;
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
    
    /* Favorites Modal Styles */
    .favorites-modal {
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
    
    .favorites-modal.active {
      display: flex;
      opacity: 1;
    }
    
    .favorites-modal .modal-content {
      background-color: white;
      margin: auto;
      width: 90%;
      max-width: 1200px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      position: relative;
    }
    
    .favorites-modal .modal-close {
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
    
    .favorites-modal .modal-close:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
    
    .favorites-modal .modal-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    
    .favorites-modal .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    
    .favorites-modal .modal-body {
      padding: 20px;
    }
    
    /* Favorites Header */
    .favorites-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .favorites-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }
    
    .favorites-header h3 span {
      color: #777;
      font-weight: normal;
    }
    
    .btn-text {
      background: none;
      border: none;
      padding: 5px 10px;
      color: #777;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .btn-text:hover {
      color: #e74c3c;
    }
    
    /* Favorites Grid */
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    
    /* Favorites Empty State */
    .favorites-empty {
      text-align: center;
      padding: 40px 20px;
    }
    
    .favorites-empty i {
      font-size: 3rem;
      color: #ddd;
      margin-bottom: 15px;
    }
    
    .favorites-empty h3 {
      margin: 0 0 10px;
      color: #333;
    }
    
    .favorites-empty p {
      color: #777;
      margin-bottom: 20px;
    }
    
    /* Favorite Card */
    .favorite-card {
      border: 1px solid #eee;
      border-radius: 5px;
      overflow: hidden;
      transition: box-shadow 0.3s ease;
    }
    
    .favorite-card:hover {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .favorite-image {
      position: relative;
      height: 200px;
      background-color: #f9f9f9;
    }
    
    .favorite-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .favorite-remove-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.8);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      opacity: 0;
    }
    
    .favorite-card:hover .favorite-remove-btn {
      opacity: 1;
    }
    
    .favorite-remove-btn:hover {
      background-color: #e74c3c;
      color: white;
    }
    
    .favorite-info {
      padding: 15px;
    }
    
    .favorite-brand {
      color: #777;
      font-size: 0.9rem;
      margin-bottom: 5px;
    }
    
    .favorite-title {
      margin: 0 0 10px;
      font-size: 1rem;
      color: #333;
    }
    
    .favorite-price {
      margin-bottom: 15px;
    }
    
    .favorite-price .current-price {
      font-weight: bold;
      color: var(--accent);
    }
    
    .favorite-price .old-price {
      color: #999;
      text-decoration: line-through;
      margin-left: 5px;
      font-size: 0.9rem;
    }
    
    .favorite-info .btn-text {
      margin-bottom: 10px;
      display: block;
      width: 100%;
      text-align: left;
    }
    
    .favorite-info .add-to-cart-btn {
      width: 100%;
    }
    
    /* Responsive styles for favorites */
    @media (max-width: 768px) {
      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
      
      .favorites-modal .modal-content {
        width: 95%;
        margin: 20px auto;
      }
      
      .favorite-image {
        height: 160px;
      }
    }
    
    /* Make sure the heart is red when active in quick view modal */
    .add-to-wishlist.active {
      background-color: #f9f9f9;
    }
    
    .add-to-wishlist.active i {
      color: #e74c3c;
    }
  `;
  
  document.head.appendChild(styleElement);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Add the necessary styles
  addFavoritesStyles();
  
  // Initialize the favorites system
  initFavoritesSystem();
  
  // Setup observer for quick view modal
  setupQuickViewObserver();
  
  debug.log('Product favorites system initialized');
});

// Add event listener to DOM changes to handle dynamically added elements
const productGridObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Check if any new product cards were added
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          // Look for heart buttons in newly added product cards
          const heartButtons = node.querySelectorAll('.product-action-btn i.fas.fa-heart');
          heartButtons.forEach(icon => {
            const btn = icon.parentNode;
            btn.classList.add('add-favorite');
            
            // Find product ID from parent card
            const productCard = btn.closest('.product-card');
            if (productCard) {
              const productId = productCard.getAttribute('data-product-id');
              if (productId) {
                btn.setAttribute('data-product-id', productId);
                
                // Check if product is in favorites
                if (favorites.items.includes(parseInt(productId))) {
                  btn.classList.add('active');
                }
              }
            }
          });
        }
      });
    }
  });
});

// Start observing the product grid for changes
document.addEventListener('DOMContentLoaded', function() {
  const productGrid = document.getElementById('collection-products');
  if (productGrid) {
    productGridObserver.observe(productGrid, { childList: true, subtree: true });
  }
});

// Handle localStorage cleanup - provide utility method that can be triggered from settings or profile page
function addLocalStorageManager() {
  window.dosAmigosStorage = {
    // Get all saved data
    getAll: function() {
      return {
        favorites: JSON.parse(localStorage.getItem('favoriteProducts') || '[]'),
        compare: JSON.parse(localStorage.getItem('compareProducts') || '[]')
        // Add other storage keys here as needed
      };
    },
    
    // Clear specific storage
    clear: function(key) {
      switch(key) {
        case 'favorites':
          localStorage.removeItem('favoriteProducts');
          if (window.favorites) {
            window.favorites.items = [];
            window.favorites.updateFavoritesUI();
          }
          break;
        case 'compare':
          localStorage.removeItem('compareProducts');
          if (window.compareProducts) {
            window.compareProducts.items = [];
            window.compareProducts.updateCompareButton();
          }
          break;
        default:
          console.warn('Unknown storage key:', key);
      }
      
      return true;
    },
    
    // Clear all saved data
    clearAll: function() {
      this.clear('favorites');
      this.clear('compare');
      // Clear other storage keys here
      
      return true;
    }
  };
}

// Initialize the storage manager
addLocalStorageManager();