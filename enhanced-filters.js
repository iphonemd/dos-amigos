// Enhanced Filters Functionality
// This script improves the filtering system for the Dos Amigos website

// Active filters tracking object
let activeFilters = {
  category: ['all'],
  brand: ['all'],
  priceMin: 0,
  priceMax: 500,
  sizes: [],
  colors: [],
  search: '',
  
  // Reset all filters to default values
  reset: function() {
    this.category = ['all'];
    this.brand = ['all'];
    this.priceMin = 0;
    this.priceMax = 500;
    this.sizes = [];
    this.colors = [];
    this.search = '';
    
    // Update UI to reflect reset filters
    updateFilterUI();
  },
  
  // Apply current filters to products
  applyFilters: function() {
    debug.log('Applying filters', this);
    
    // Get all products
    let filteredProducts = Object.values(productData);
    debug.log('Total products before filtering:', filteredProducts.length);
    
    // Apply URL-based filters first (these are higher priority)
    const urlParams = new URLSearchParams(window.location.search);
    const collectionType = urlParams.get('type') || 'all';
    const collectionValue = urlParams.get('value') || '';
    const audienceFilter = urlParams.get('filter') || '';
    
    // Apply collection type filter from URL
    if (collectionType && collectionType !== 'all') {
      switch (collectionType) {
        case 'category':
          filteredProducts = filteredProducts.filter(
            (product) => product.category === collectionValue
          );
          debug.log(
            `Filtered by URL category "${collectionValue}":`,
            filteredProducts.length
          );
          break;
        case 'brand':
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.brand.toLowerCase() ===
              formatCollectionName(collectionValue).toLowerCase()
          );
          debug.log(
            `Filtered by URL brand "${collectionValue}":`,
            filteredProducts.length
          );
          break;
        case 'search':
          const searchTerm = collectionValue.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.title.toLowerCase().includes(searchTerm) ||
              product.brand.toLowerCase().includes(searchTerm) ||
              product.description.toLowerCase().includes(searchTerm)
          );
          debug.log(
            `Filtered by URL search "${collectionValue}":`,
            filteredProducts.length
          );
          break;
      }
    }
    
    // Apply audience filter from URL if specified
    if (audienceFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.tags && product.tags.includes(audienceFilter)
      );
      debug.log(
        `Filtered by URL audience "${audienceFilter}":`,
        filteredProducts.length
      );
    }
    
    // If a category filter is active and it's not 'all', apply it
    if (!this.category.includes('all')) {
      filteredProducts = filteredProducts.filter(product => 
        this.category.includes(product.category)
      );
      debug.log('After category filter:', filteredProducts.length);
    }
    
    // If a brand filter is active and it's not 'all', apply it
    if (!this.brand.includes('all')) {
      filteredProducts = filteredProducts.filter(product => 
        this.brand.includes(product.brand.toLowerCase().replace(' ', '-'))
      );
      debug.log('After brand filter:', filteredProducts.length);
    }
    
    // Apply price range filter
    filteredProducts = filteredProducts.filter(product => {
      const price = parseFloat(product.price.replace('$', '').replace(',', ''));
      return price >= this.priceMin && price <= this.priceMax;
    });
    debug.log('After price filter:', filteredProducts.length);
    
    // Apply size filter if any sizes are selected
    if (this.sizes.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (!product.sizes) return false;
        // Check if any of the product's sizes match the selected sizes
        return product.sizes.some(size => this.sizes.includes(size.toLowerCase()));
      });
      debug.log('After size filter:', filteredProducts.length);
    }
    
    // Apply color filter if any colors are selected
    if (this.colors.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        if (!product.colors) return false;
        // Check if any of the product's colors match the selected colors
        return product.colors.some(color => this.colors.includes(color));
      });
      debug.log('After color filter:', filteredProducts.length);
    }
    
    // Apply search filter if there's a search term
    if (this.search) {
      const searchTerm = this.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
      debug.log('After search filter:', filteredProducts.length);
    }
    
    // Apply sorting
    filteredProducts = applySorting(filteredProducts);
    
    // Update the UI with filtered products
    displayFilteredProducts(filteredProducts);
    
    // Hide the filter sidebar on mobile after applying filters
    const filterSidebar = document.getElementById('filter-sidebar');
    if (filterSidebar && window.innerWidth < 768) {
      filterSidebar.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Show notification of how many products were found
    showFilterNotification(filteredProducts.length);
    
    return filteredProducts;
  }
};

// Show notification with filter results
function showFilterNotification(count) {
  let message, type;
  
  if (count === 0) {
    message = 'No se encontraron productos con los filtros seleccionados';
    type = 'warning';
  } else if (count === 1) {
    message = 'Se encontró 1 producto';
    type = 'success';
  } else {
    message = `Se encontraron ${count} productos`;
    type = 'success';
  }
  
  // Check if notification function exists (from previous scripts)
  if (typeof showNotification === 'function') {
    showNotification(message, type);
  } else {
    // Simple alert fallback
    alert(message);
  }
}

// Update the UI to reflect current filter state
function updateFilterUI() {
  // Update category checkboxes
  document.querySelectorAll('input[name="category"]').forEach(checkbox => {
    const value = checkbox.value;
    if (value === 'all') {
      checkbox.checked = activeFilters.category.includes('all');
    } else {
      checkbox.checked = activeFilters.category.includes(value);
    }
  });
  
  // Update brand checkboxes
  document.querySelectorAll('input[name="brand"]').forEach(checkbox => {
    const value = checkbox.value;
    if (value === 'all') {
      checkbox.checked = activeFilters.brand.includes('all');
    } else {
      checkbox.checked = activeFilters.brand.includes(value);
    }
  });
  
  // Update price range sliders
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const priceMinValue = document.getElementById('price-min-value');
  const priceMaxValue = document.getElementById('price-max-value');
  
  if (priceMin && priceMinValue) {
    priceMin.value = activeFilters.priceMin;
    priceMinValue.textContent = `$${activeFilters.priceMin}`;
  }
  
  if (priceMax && priceMaxValue) {
    priceMax.value = activeFilters.priceMax;
    priceMaxValue.textContent = `$${activeFilters.priceMax}`;
  }
  
  // Update price range input fields if they exist
  const priceMinInput = document.getElementById('price-min-input');
  const priceMaxInput = document.getElementById('price-max-input');
  
  if (priceMinInput) priceMinInput.value = activeFilters.priceMin;
  if (priceMaxInput) priceMaxInput.value = activeFilters.priceMax;
  
  // Update the price range progress bar if it exists
  const progressBar = document.querySelector('.price-range-progress');
  if (progressBar) {
    const minPercent = (activeFilters.priceMin / 500) * 100;
    const maxPercent = (activeFilters.priceMax / 500) * 100;
    progressBar.style.left = `${minPercent}%`;
    progressBar.style.right = `${100 - maxPercent}%`;
  }
  
  // Update selected sizes
  document.querySelectorAll('.filter-sizes .size-option').forEach(option => {
    const size = option.getAttribute('data-size');
    if (activeFilters.sizes.includes(size)) {
      option.classList.add('active');
      option.setAttribute('aria-checked', 'true');
    } else {
      option.classList.remove('active');
      option.setAttribute('aria-checked', 'false');
    }
  });
  
  // Update selected colors
  document.querySelectorAll('.filter-colors .color-option').forEach(option => {
    const color = option.getAttribute('data-color');
    if (activeFilters.colors.includes(color)) {
      option.classList.add('active');
      option.setAttribute('aria-checked', 'true');
    } else {
      option.classList.remove('active');
      option.setAttribute('aria-checked', 'false');
    }
  });
  
  // Update search boxes
  const searchInput = document.getElementById('search-input');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  
  if (searchInput) searchInput.value = activeFilters.search;
  if (mobileSearchInput) mobileSearchInput.value = activeFilters.search;
}

// Display filtered products in the UI
function displayFilteredProducts(products) {
  const productContainer = document.getElementById('collection-products');
  if (!productContainer) {
    debug.error('Product container not found');
    return;
  }
  
  // Clear existing products
  productContainer.innerHTML = '';
  
  // Update product count
  const productCount = document.getElementById('product-count');
  if (productCount) {
    productCount.textContent = products.length;
  }
  
  // If no products found, show empty state
  if (products.length === 0) {
    productContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-filter"></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta con otros criterios de búsqueda o restablece los filtros.</p>
        <button id="clear-all-filters" class="btn">Restablecer Filtros</button>
      </div>
    `;
    
    // Add event listener to the clear filters button
    const clearAllFiltersBtn = document.getElementById('clear-all-filters');
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', () => {
        activeFilters.reset();
        activeFilters.applyFilters();
      });
    }
    
    return;
  }
  
  // Calculate pagination
  const productsPerPage = 12;
  const currentPage = 1; // Start at first page for filter results
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  // Slice products for current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentPageProducts = products.slice(startIndex, endIndex);
  
  // Render products
  currentPageProducts.forEach((product, index) => {
    const productCard = createProductCard(product);
    productContainer.appendChild(productCard);
    
    // Add fade-in animation with staggered delay
    setTimeout(() => {
      productCard.classList.add('active');
    }, 50 * index);
  });
  
  // Update pagination
  updatePagination(currentPage, totalPages, null, null, null);
}

// Create improved price range selector with min/max inputs
function createImprovedPriceRangeSelector() {
  const priceGroup = document.querySelector('.filter-group:nth-of-type(3)');
  if (!priceGroup) return;
  
  // Replace the existing price range HTML with improved version
  priceGroup.innerHTML = `
    <h4>Precio</h4>
    <div class="price-range-container">
      <div class="price-input-group">
        <div class="price-input">
          <input type="number" id="price-min-input" min="0" max="500" value="0" step="10">
          <span class="price-currency">$</span>
        </div>
        <span class="price-separator">-</span>
        <div class="price-input">
          <input type="number" id="price-max-input" min="0" max="500" value="500" step="10">
          <span class="price-currency">$</span>
        </div>
      </div>
      <div class="dual-range-slider">
        <div class="price-range-track">
          <div class="price-range-progress"></div>
        </div>
        <input type="range" id="price-min" min="0" max="500" value="0" step="10" class="range-min">
        <input type="range" id="price-max" min="0" max="500" value="500" step="10" class="range-max">
      </div>
      <div class="range-values">
        <span id="price-min-value">$0</span>
        <span id="price-max-value">$500</span>
      </div>
    </div>
  `;
  
  // Add CSS for improved price range selector
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .price-range-container {
      padding: 10px 0;
    }
    
    .price-input-group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .price-input {
      position: relative;
      width: 45%;
    }
    
    .price-input input {
      width: 100%;
      padding: 8px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      text-align: right;
    }
    
    .price-currency {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #777;
    }
    
    .price-separator {
      font-weight: bold;
      color: #777;
    }
    
    .dual-range-slider {
      position: relative;
      height: 30px;
      margin-bottom: 10px;
    }
    
    .price-range-track {
      position: absolute;
      width: 100%;
      height: 5px;
      background-color: #ddd;
      border-radius: 5px;
      top: 12px;
    }
    
    .price-range-progress {
      position: absolute;
      height: 5px;
      background-color: var(--accent);
      border-radius: 5px;
      top: 0;
      left: 0;
      right: 0;
    }
    
    .dual-range-slider input[type="range"] {
      -webkit-appearance: none;
      position: absolute;
      width: 100%;
      height: 5px;
      background: transparent;
      top: 12px;
      z-index: 10;
      cursor: pointer;
    }
    
    .dual-range-slider input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: white;
      border: 2px solid var(--accent);
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      z-index: 10;
    }
    
    .dual-range-slider input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      background: white;
      border: 2px solid var(--accent);
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      z-index: 10;
    }
    
    .range-values {
      display: flex;
      justify-content: space-between;
      color: #777;
      font-size: 14px;
    }
    
    /* Fix for overlapping controls in filter sidebar */
    .filter-group {
      margin-bottom: 20px;
    }
    
    /* Make checkboxes more prominent */
    .filter-checkbox {
      padding: 8px 0;
    }
    
    .filter-checkbox input[type="checkbox"] {
      transform: scale(1.2);
      margin-right: 8px;
    }
    
    /* Improve size/color option visibility */
    .size-option.active,
    .color-option.active {
      border: 2px solid var(--accent);
      transform: scale(1.1);
    }
    
    /* Filter sidebar scroll */
    .filter-sidebar {
      max-height: 100vh;
      overflow-y: auto;
    }
    
    /* Empty state icon */
    .empty-state i {
      font-size: 3rem;
      color: #ddd;
      margin-bottom: 1rem;
    }
    
    /* Apply filters button highlight */
    #apply-filters {
      background-color: var(--accent);
      color: white;
      font-weight: bold;
    }
    
    #apply-filters:hover {
      background-color: #d35400;
    }
    
    /* Add focus styles for accessibility */
    .size-option:focus,
    .color-option:focus {
      outline: 2px dashed var(--accent);
      outline-offset: 2px;
    }
    
    /* Add tooltips to color options */
    .color-option {
      position: relative;
    }
    
    .color-option::after {
      content: attr(aria-label);
      position: absolute;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, visibility 0.2s;
      pointer-events: none;
    }
    
    .color-option:hover::after,
    .color-option:focus::after {
      opacity: 1;
      visibility: visible;
    }
    
    /* Reset filters button */
    #reset-filters {
      color: #777;
      text-decoration: underline;
      transition: color 0.2s;
    }
    
    #reset-filters:hover {
      color: #e74c3c;
    }
    
    /* Mobile filter improvements */
    @media (max-width: 768px) {
      .mobile-filter-toggle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding: 0 10px;
      }
      
      #mobile-filter-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 8px 12px;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .mobile-search {
        display: flex;
        width: 60%;
      }
      
      #mobile-search-input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-right: none;
        border-radius: 4px 0 0 4px;
      }
      
      #mobile-search-btn {
        padding: 8px 12px;
        background-color: var(--accent);
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
      }
      
      /* Better mobile sidebar */
      .filter-sidebar {
        width: 100%;
        max-width: 350px;
      }
      
      .filter-sidebar.active {
        padding-top: 60px;
      }
      
      .filter-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        max-width: 350px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background-color: white;
        border-bottom: 1px solid #eee;
        z-index: 100;
      }
    }
  `;
  document.head.appendChild(styleElement);
  
  // Setup the price range functionality
  setupPriceRangeSelector();
}

// Setup the improved price range selector behavior
function setupPriceRangeSelector() {
  const minSlider = document.getElementById('price-min');
  const maxSlider = document.getElementById('price-max');
  const minInput = document.getElementById('price-min-input');
  const maxInput = document.getElementById('price-max-input');
  const progressBar = document.querySelector('.price-range-progress');
  const minValueDisplay = document.getElementById('price-min-value');
  const maxValueDisplay = document.getElementById('price-max-value');
  
  if (!minSlider || !maxSlider || !minInput || !maxInput || !progressBar) {
    debug.error('Price range elements not found');
    return;
  }
  
  // Function to update the range progress bar
  function updateProgressBar() {
    const min = parseInt(minSlider.value);
    const max = parseInt(maxSlider.value);
    const minPercent = (min / parseInt(minSlider.max)) * 100;
    const maxPercent = (max / parseInt(maxSlider.max)) * 100;
    
    progressBar.style.left = `${minPercent}%`;
    progressBar.style.right = `${100 - maxPercent}%`;
  }
  
  // Function to update display values
  function updateDisplayValues() {
    minValueDisplay.textContent = `$${minSlider.value}`;
    maxValueDisplay.textContent = `$${maxSlider.value}`;
    minInput.value = minSlider.value;
    maxInput.value = maxSlider.value;
    
    // Update active filters
    activeFilters.priceMin = parseInt(minSlider.value);
    activeFilters.priceMax = parseInt(maxSlider.value);
  }
  
  // Initialize values
  updateProgressBar();
  updateDisplayValues();
  
  // Event listeners for sliders
  minSlider.addEventListener('input', function() {
    const minValue = parseInt(minSlider.value);
    const maxValue = parseInt(maxSlider.value);
    
    if (minValue > maxValue) {
      minSlider.value = maxValue;
    }
    
    updateProgressBar();
    updateDisplayValues();
  });
  
  maxSlider.addEventListener('input', function() {
    const minValue = parseInt(minSlider.value);
    const maxValue = parseInt(maxSlider.value);
    
    if (maxValue < minValue) {
      maxSlider.value = minValue;
    }
    
    updateProgressBar();
    updateDisplayValues();
  });
  
  // Event listeners for number inputs
  minInput.addEventListener('change', function() {
    const minValue = parseInt(minInput.value);
    const maxValue = parseInt(maxInput.value);
    
    // Ensure value is within valid range
    if (minValue < 0) minInput.value = 0;
    if (minValue > 500) minInput.value = 500;
    
    // Ensure min <= max
    if (minValue > maxValue) {
      minInput.value = maxValue;
    }
    
    // Update slider
    minSlider.value = minInput.value;
    
    updateProgressBar();
    updateDisplayValues();
  });
  
  maxInput.addEventListener('change', function() {
    const minValue = parseInt(minInput.value);
    const maxValue = parseInt(maxInput.value);
    
    // Ensure value is within valid range
    if (maxValue < 0) maxInput.value = 0;
    if (maxValue > 500) maxInput.value = 500;
    
    // Ensure max >= min
    if (maxValue < minValue) {
      maxInput.value = minValue;
    }
    
    // Update slider
    maxSlider.value = maxInput.value;
    
    updateProgressBar();
    updateDisplayValues();
  });
}

// Initialize the enhanced filter functionality
function initEnhancedFilters() {
  debug.log('Initializing enhanced filters');
  
  // Replace the price range slider with improved version
  createImprovedPriceRangeSelector();
  
  // Set up filter event listeners
  setupFilterEventListeners();
  
  // Add keyboard accessibility
  addFilterAccessibility();
  
  // Show filter reset button if URL has filters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('type') || urlParams.has('value') || urlParams.has('filter')) {
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.style.display = 'inline-block';
    }
  }
}

// Setup event listeners for filters
function setupFilterEventListeners() {
  // Category filter checkboxes
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.value === 'all' && this.checked) {
        // If "all" is checked, uncheck others
        categoryCheckboxes.forEach(cb => {
          if (cb.value !== 'all') cb.checked = false;
        });
        activeFilters.category = ['all'];
      } else if (this.checked) {
        // If a specific category is checked, uncheck "all"
        const allCheckbox = document.querySelector('input[name="category"][value="all"]');
        if (allCheckbox) allCheckbox.checked = false;
        
        // Add to active categories
        if (!activeFilters.category.includes(this.value)) {
          activeFilters.category = activeFilters.category.filter(cat => cat !== 'all');
          activeFilters.category.push(this.value);
        }
      } else {
        // If unchecked, remove from active categories
        activeFilters.category = activeFilters.category.filter(cat => cat !== this.value);
        
        // If no categories selected, check "all"
        if (activeFilters.category.length === 0) {
          const allCheckbox = document.querySelector('input[name="category"][value="all"]');
          if (allCheckbox) allCheckbox.checked = true;
          activeFilters.category = ['all'];
        }
      }
    });
  });
  
  // Brand filter checkboxes
  const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
  brandCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.value === 'all' && this.checked) {
        // If "all" is checked, uncheck others
        brandCheckboxes.forEach(cb => {
          if (cb.value !== 'all') cb.checked = false;
        });
        activeFilters.brand = ['all'];
      } else if (this.checked) {
        // If a specific brand is checked, uncheck "all"
        const allCheckbox = document.querySelector('input[name="brand"][value="all"]');
        if (allCheckbox) allCheckbox.checked = false;
        
        // Add to active brands
        if (!activeFilters.brand.includes(this.value)) {
          activeFilters.brand = activeFilters.brand.filter(b => b !== 'all');
          activeFilters.brand.push(this.value);
        }
      } else {
        // If unchecked, remove from active brands
        activeFilters.brand = activeFilters.brand.filter(b => b !== this.value);
        
        // If no brands selected, check "all"
        if (activeFilters.brand.length === 0) {
          const allCheckbox = document.querySelector('input[name="brand"][value="all"]');
          if (allCheckbox) allCheckbox.checked = true;
          activeFilters.brand = ['all'];
        }
      }
    });
  });
  
  // Size options
  const sizeOptions = document.querySelectorAll('.filter-sizes .size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      const size = this.getAttribute('data-size');
      
      // Toggle active class
      this.classList.toggle('active');
      
      // Update ARIA state
      const isActive = this.classList.contains('active');
      this.setAttribute('aria-checked', isActive.toString());
      
      // Update active filters
      if (isActive) {
        if (!activeFilters.sizes.includes(size)) {
          activeFilters.sizes.push(size);
        }
      } else {
        activeFilters.sizes = activeFilters.sizes.filter(s => s !== size);
      }
    });
  });
  
  // Color options
  const colorOptions = document.querySelectorAll('.filter-colors .color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      const color = this.getAttribute('data-color');
      
      // Toggle active class
      this.classList.toggle('active');
      
      // Update ARIA state
      const isActive = this.classList.contains('active');
      this.setAttribute('aria-checked', isActive.toString());
      
      // Update active filters
      if (isActive) {
        if (!activeFilters.colors.includes(color)) {
          activeFilters.colors.push(color);
        }
      } else {
        activeFilters.colors = activeFilters.colors.filter(c => c !== color);
      }
    });
  });
  
  // Search inputs
  const searchInput = document.getElementById('search-input');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const searchBtn = document.getElementById('search-btn');
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  
  if (searchInput && searchBtn) {
    // Search button click
    searchBtn.addEventListener('click', function() {
      activeFilters.search = searchInput.value.trim();
      activeFilters.applyFilters();
    });
    
    // Enter key in search input
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        activeFilters.search = this.value.trim();
        activeFilters.applyFilters();
      }
    });
  }
  
  if (mobileSearchInput && mobileSearchBtn) {
    // Mobile search button click
    mobileSearchBtn.addEventListener('click', function() {
      activeFilters.search = mobileSearchInput.value.trim();
      activeFilters.applyFilters();
    });
    
    // Enter key in mobile search input
    mobileSearchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        activeFilters.search = this.value.trim();
        activeFilters.applyFilters();
      }
    });
  }
}