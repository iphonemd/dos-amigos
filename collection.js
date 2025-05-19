// This is an improved implementation of collection.js to properly show products

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the collection page
    initCollection();
    
    // For debugging
    console.log('Collection page initialized');
  });
  
  // Collection page initialization
  function initCollection() {
    // Get URL parameters to determine which collection to show
    const urlParams = new URLSearchParams(window.location.search);
    const collectionType = urlParams.get('type') || 'all';
    const collectionValue = urlParams.get('value') || '';
    const audienceFilter = urlParams.get('filter') || '';
    
    console.log('Collection parameters:', {
      type: collectionType,
      value: collectionValue,
      filter: audienceFilter
    });
    
    // Set page title and description based on collection type
    updateCollectionTitle(collectionType, collectionValue);
    
    // Load initial products based on URL parameters
    loadFilteredProducts(collectionType, collectionValue);
    
    // Setup event listeners
    setupFilterEvents();
    setupCollectionControls();
  }
  
  // Update page title and description based on collection type
  function updateCollectionTitle(type, value) {
    const heading = document.getElementById('collection-heading');
    const description = document.getElementById('collection-description');
    
    if (!heading || !description) return;
    
    // Set title and description based on collection type
    switch(type) {
      case 'category':
        heading.textContent = formatCollectionName(value);
        description.textContent = `Explora nuestra colección de ${formatCollectionName(value).toLowerCase()}.`;
        break;
      case 'brand':
        heading.textContent = formatCollectionName(value);
        description.textContent = `Descubre todos los productos de la marca ${formatCollectionName(value)}.`;
        break;
      case 'search':
        heading.textContent = `Resultados de búsqueda: "${value}"`;
        description.textContent = `Productos encontrados para tu búsqueda.`;
        break;
      default:
        heading.textContent = 'Todos los Productos';
        description.textContent = 'Explora nuestra colección completa de productos.';
    }
    
    // Also update the page title
    document.title = `Dos Amigos - ${heading.textContent}`;
  
    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb-collection');
    if (breadcrumb) {
      breadcrumb.textContent = heading.textContent;
    }
  }
  
  // Format collection name (convert slug to readable name)
  function formatCollectionName(slug) {
    if (!slug) return '';
    
    // Replace hyphens with spaces and capitalize each word
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Load products based on filters
  function loadFilteredProducts(type, value, page = 1) {
    // Get the product container
    const productContainer = document.getElementById('collection-products');
    if (!productContainer) return;
    
    // Clear existing products
    productContainer.innerHTML = '';
    
    // Get all products
    let filteredProducts = Object.values(productData);
    console.log('Total products before filtering:', filteredProducts.length);
    
    // Apply initial filter based on collection type
    if (type && type !== 'all') {
      switch(type) {
        case 'category':
          filteredProducts = filteredProducts.filter(product => 
            product.category === value);
          console.log(`Filtered by category "${value}":`, filteredProducts.length);
          break;
        case 'brand':
          filteredProducts = filteredProducts.filter(product => 
            product.brand.toLowerCase() === formatCollectionName(value).toLowerCase());
          console.log(`Filtered by brand "${value}":`, filteredProducts.length);
          break;
        case 'search':
          const searchTerm = value.toLowerCase();
          filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.brand.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm));
          console.log(`Filtered by search "${value}":`, filteredProducts.length);
          break;
      }
    }
    
    // Apply audience filter if specified in URL
    const urlParams = new URLSearchParams(window.location.search);
    const audienceFilter = urlParams.get('filter');
    if (audienceFilter) {
      filteredProducts = filteredProducts.filter(product => 
        product.tags && product.tags.includes(audienceFilter));
      console.log(`Filtered by audience "${audienceFilter}":`, filteredProducts.length);
    }
    
    // Apply additional filters from sidebar
    filteredProducts = applyCurrentFilters(filteredProducts);
    
    // Apply current sort option
    filteredProducts = applySorting(filteredProducts);
    
    // Update product count
    const productCount = document.getElementById('product-count');
    if (productCount) {
      productCount.textContent = filteredProducts.length;
    }
    
    // If no products found, show empty state
    if (filteredProducts.length === 0) {
      productContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros criterios de búsqueda o restablece los filtros.</p>
          <button id="clear-all-filters" class="btn">Restablecer Filtros</button>
        </div>
      `;
      
      // Add event listener to the clear filters button
      const clearAllFiltersBtn = document.getElementById('clear-all-filters');
      if (clearAllFiltersBtn) {
        clearAllFiltersBtn.addEventListener('click', resetAllFilters);
      }
      
      return;
    }
    
    // Calculate pagination
    const productsPerPage = 12;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Ensure current page is valid
    page = Math.max(1, Math.min(page, totalPages));
    
    // Slice products for current page
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
    
    console.log('Products displaying on current page:', currentPageProducts.length);
    
    // Render products
    currentPageProducts.forEach(product => {
      const productCard = createProductCard(product);
      productContainer.appendChild(productCard);
    });
    
    // Update pagination
    updatePagination(page, totalPages);
  }
  
  // Create a product card element
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.setAttribute('data-product-id', product.id);
    
    // Add badge if exists
    if (product.badge) {
      const badge = document.createElement('div');
      badge.className = 'product-badge';
      badge.textContent = product.badge.text;
      if (product.badge.color) {
        badge.style.backgroundColor = product.badge.color;
      }
      card.appendChild(badge);
    }
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image';
    
    const image = document.createElement('img');
    image.src = product.images[0];
    image.alt = product.title;
    imageContainer.appendChild(image);
    
    // Create overlay with actions
    const overlay = document.createElement('div');
    overlay.className = 'product-overlay';
    
    const actions = document.createElement('div');
    actions.className = 'product-actions-small';
    
    // Quick view button
    const quickViewBtn = document.createElement('div');
    quickViewBtn.className = 'product-action-btn quick-view-btn';
    quickViewBtn.setAttribute('data-product-id', product.id);
    quickViewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    actions.appendChild(quickViewBtn);
    
    // Wishlist button
    const wishlistBtn = document.createElement('div');
    wishlistBtn.className = 'product-action-btn';
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    actions.appendChild(wishlistBtn);
    
    // Compare button
    const compareBtn = document.createElement('div');
    compareBtn.className = 'product-action-btn add-compare';
    compareBtn.innerHTML = '<i class="fas fa-random"></i>';
    actions.appendChild(compareBtn);
    
    overlay.appendChild(actions);
    imageContainer.appendChild(overlay);
    card.appendChild(imageContainer);
    
    // Create product info section
    const info = document.createElement('div');
    info.className = 'product-info';
    
    // Brand
    const brand = document.createElement('div');
    brand.className = 'product-brand';
    brand.textContent = product.brand;
    info.appendChild(brand);
    
    // Title
    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = product.title;
    info.appendChild(title);
    
    // Price
    const price = document.createElement('div');
    price.className = 'product-price';
    
    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = product.price;
    price.appendChild(currentPrice);
    
    if (product.oldPrice) {
      const oldPrice = document.createElement('span');
      oldPrice.className = 'old-price';
      oldPrice.textContent = product.oldPrice;
      price.appendChild(oldPrice);
    }
    
    info.appendChild(price);
    
    // Product options
    const options = document.createElement('div');
    options.className = 'product-options';
    
    // Colors
    const colors = document.createElement('div');
    colors.className = 'product-colors';
    
    if (product.colors && product.colors.length) {
      product.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = index === 0 ? 'color-option active' : 'color-option';
        colorOption.style.backgroundColor = color;
        colors.appendChild(colorOption);
      });
    }
    
    options.appendChild(colors);
    
    // Sizes
    const sizes = document.createElement('div');
    sizes.className = 'product-sizes';
    
    if (product.sizes && product.sizes.length) {
      product.sizes.forEach((size, index) => {
        const sizeOption = document.createElement('div');
        sizeOption.className = index === 1 ? 'size-option active' : 'size-option';
        sizeOption.textContent = size;
        sizes.appendChild(sizeOption);
      });
    }
    
    options.appendChild(sizes);
    info.appendChild(options);
    card.appendChild(info);
    
    return card;
  }
  
  // Apply current filters from the sidebar
  function applyCurrentFilters(products) {
    let result = [...products];
    
    // Get audience filter from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const audienceFilter = urlParams.get('filter');
    if (audienceFilter) {
      result = result.filter(product => 
        product.tags && product.tags.includes(audienceFilter));
    }
    
    // Get all active checkboxes and filters
    // Categories
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(checkbox => checkbox.value !== 'all')
      .map(checkbox => checkbox.value);
    
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }
    
    // Brands
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
    const selectedBrands = Array.from(brandCheckboxes)
      .filter(checkbox => checkbox.value !== 'all')
      .map(checkbox => checkbox.value);
    
    if (selectedBrands.length > 0) {
      result = result.filter(product => 
        selectedBrands.includes(product.brand.toLowerCase().replace(/\s+/g, '-')));
    }
    
    // Price range
    const minPrice = parseFloat(document.getElementById('price-min').value);
    const maxPrice = parseFloat(document.getElementById('price-max').value);
    
    result = result.filter(product => {
      const price = parseFloat(product.price.replace('$', '').replace(',', ''));
      return price >= minPrice && price <= maxPrice;
    });
    
    // Sizes
    const selectedSizes = Array.from(document.querySelectorAll('.filter-sizes .size-option.active'))
      .map(option => option.getAttribute('data-size'));
    
    if (selectedSizes.length > 0) {
      result = result.filter(product => {
        if (!product.sizes) return false;
        const productSizes = product.sizes.map(size => size.toLowerCase());
        return selectedSizes.some(size => productSizes.includes(size));
      });
    }
    
    // Colors
    const selectedColors = Array.from(document.querySelectorAll('.filter-colors .color-option.active'))
      .map(option => option.getAttribute('data-color'));
    
    if (selectedColors.length > 0) {
      result = result.filter(product => {
        if (!product.colors) return false;
        return selectedColors.some(color => product.colors.includes(color));
      });
    }
    
    return result;
  }
  
  // Apply sorting to products
  function applySorting(products) {
    const sortSelect = document.getElementById('sort-select');
    if (!sortSelect) return products;
    
    const sortValue = sortSelect.value;
    let result = [...products];
    
    switch(sortValue) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace('$', '').replace(',', ''));
          const priceB = parseFloat(b.price.replace('$', '').replace(',', ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = parseFloat(a.price.replace('$', '').replace(',', ''));
          const priceB = parseFloat(b.price.replace('$', '').replace(',', ''));
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        // For demonstration, we'll assume product ID correlates with recency
        result.sort((a, b) => b.id - a.id);
        break;
      default: // featured
        // For demonstration, we'll prioritize featured products
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
    }
    
    return result;
  }
  
  // Update pagination controls
  function updatePagination(currentPage, totalPages) {
    const pageNumbers = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (!pageNumbers || !prevBtn || !nextBtn) return;
    
    // Clear existing page numbers
    pageNumbers.innerHTML = '';
    
    // Determine which page numbers to show
    let pagesToShow = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      pagesToShow = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
      // Always show first page
      pagesToShow.push(1);
      
      // Show current page and neighbors
      if (currentPage > 2) {
        if (currentPage > 3) {
          pagesToShow.push('...');
        }
        pagesToShow.push(currentPage - 1);
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pagesToShow.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pagesToShow.push(currentPage + 1);
        if (currentPage < totalPages - 2) {
          pagesToShow.push('...');
        }
      }
      
      // Always show last page
      pagesToShow.push(totalPages);
    }
    
    // Create page number elements
    pagesToShow.forEach(page => {
      if (page === '...') {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbers.appendChild(ellipsis);
      } else {
        const pageNumber = document.createElement('span');
        pageNumber.className = page === currentPage ? 'page-number active' : 'page-number';
        pageNumber.textContent = page;
        pageNumber.addEventListener('click', () => {
          if (page !== currentPage) {
            loadFilteredProducts(
              getQueryParam('type'), 
              getQueryParam('value'), 
              page
            );
          }
        });
        pageNumbers.appendChild(pageNumber);
      }
    });
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Add event listeners to prev/next buttons
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        loadFilteredProducts(
          getQueryParam('type'), 
          getQueryParam('value'), 
          currentPage - 1
        );
      }
    };
    
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        loadFilteredProducts(
          getQueryParam('type'), 
          getQueryParam('value'), 
          currentPage + 1
        );
      }
    };
  }
  
  // Helper function to get query parameters
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || '';
  }
  
  // Setup filter event listeners
  function setupFilterEvents() {
    // Mobile filter toggle
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const closeFilterBtn = document.getElementById('close-filter');
    const filterSidebar = document.getElementById('filter-sidebar');
    
    if (mobileFilterBtn && closeFilterBtn && filterSidebar) {
      mobileFilterBtn.addEventListener('click', () => {
        filterSidebar.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });
      
      closeFilterBtn.addEventListener('click', () => {
        filterSidebar.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
    }
    
    // Price range inputs
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    
    if (priceMin && priceMax && priceMinValue && priceMaxValue) {
      // Set initial values display
      priceMinValue.textContent = `$${priceMin.value}`;
      priceMaxValue.textContent = `$${priceMax.value}`;
      
      // Update range values display on input
      priceMin.addEventListener('input', () => {
        priceMinValue.textContent = `$${priceMin.value}`;
        // Ensure min doesn't exceed max
        if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
          priceMax.value = priceMin.value;
          priceMaxValue.textContent = `$${priceMax.value}`;
        }
      });
      
      priceMax.addEventListener('input', () => {
        priceMaxValue.textContent = `$${priceMax.value}`;
        // Ensure max doesn't go below min
        if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
          priceMin.value = priceMax.value;
          priceMinValue.textContent = `$${priceMin.value}`;
        }
      });
    }
    
    // Size options
    const sizeOptions = document.querySelectorAll('.filter-sizes .size-option');
    sizeOptions.forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('active');
      });
    });
    
    // Color options
    const colorOptions = document.querySelectorAll('.filter-colors .color-option');
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('active');
      });
    });
    
    // Category checkboxes all toggle
    const allCategoryCheckbox = document.querySelector('input[name="category"][value="all"]');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:not([value="all"])');
    
    if (allCategoryCheckbox) {
      allCategoryCheckbox.addEventListener('change', () => {
        if (allCategoryCheckbox.checked) {
          categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
          });
        }
      });
      
      categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            allCategoryCheckbox.checked = false;
          } else if (Array.from(categoryCheckboxes).every(cb => !cb.checked)) {
            allCategoryCheckbox.checked = true;
          }
        });
      });
    }
    
    // Brand checkboxes all toggle
    const allBrandCheckbox = document.querySelector('input[name="brand"][value="all"]');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:not([value="all"])');
    
    if (allBrandCheckbox) {
      allBrandCheckbox.addEventListener('change', () => {
        if (allBrandCheckbox.checked) {
          brandCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
          });
        }
      });
      
      brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            allBrandCheckbox.checked = false;
          } else if (Array.from(brandCheckboxes).every(cb => !cb.checked)) {
            allBrandCheckbox.checked = true;
          }
        });
      });
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => {
        // Close mobile filter if open
        if (filterSidebar) {
          filterSidebar.classList.remove('active');
          document.body.style.overflow = '';
        }
        
        // Reload products with current filters
        loadFilteredProducts(
          getQueryParam('type'), 
          getQueryParam('value'), 
          1 // Reset to first page when applying filters
        );
      });
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', () => {
        if (searchInput.value.trim()) {
          window.location.href = `collection.html?type=search&value=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          window.location.href = `collection.html?type=search&value=${encodeURIComponent(searchInput.value.trim())}`;
        }
      });
    }
    
    if (mobileSearchBtn && mobileSearchInput) {
      mobileSearchBtn.addEventListener('click', () => {
        if (mobileSearchInput.value.trim()) {
          window.location.href = `collection.html?type=search&value=${encodeURIComponent(mobileSearchInput.value.trim())}`;
        }
      });
      
      mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && mobileSearchInput.value.trim()) {
          window.location.href = `collection.html?type=search&value=${encodeURIComponent(mobileSearchInput.value.trim())}`;
        }
      });
    }
  }
  
  // Reset all filters to default values
  function resetAllFilters() {
    // Reset category checkboxes
    const allCategoryCheckbox = document.querySelector('input[name="category"][value="all"]');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]:not([value="all"])');
    
    if (allCategoryCheckbox) {
      allCategoryCheckbox.checked = true;
      categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }
    
    // Reset brand checkboxes
    const allBrandCheckbox = document.querySelector('input[name="brand"][value="all"]');
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]:not([value="all"])');
    
    if (allBrandCheckbox) {
      allBrandCheckbox.checked = true;
      brandCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }
    
    // Reset price range
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    
    if (priceMin && priceMax && priceMinValue && priceMaxValue) {
      priceMin.value = 0;
      priceMax.value = 500;
      priceMinValue.textContent = '$0';
      priceMaxValue.textContent = '$500';
    }
    
    // Reset size options
    const sizeOptions = document.querySelectorAll('.filter-sizes .size-option');
    sizeOptions.forEach(option => {
      option.classList.remove('active');
    });
    
    // Reset color options
    const colorOptions = document.querySelectorAll('.filter-colors .color-option');
    colorOptions.forEach(option => {
      option.classList.remove('active');
    });
    
    // Reload products with reset filters
    loadFilteredProducts(
      getQueryParam('type'), 
      getQueryParam('value'), 
      1 // Reset to first page
    );
  }
  
  // Setup collection controls (view mode, sorting)
  function setupCollectionControls() {
    // View mode toggle (grid/list)
    const viewButtons = document.querySelectorAll('.view-btn');
    const collectionGrid = document.getElementById('collection-products');
    
    if (viewButtons.length && collectionGrid) {
      viewButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Remove active class from all buttons
          viewButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          button.classList.add('active');
          
          // Set view mode
          const viewMode = button.getAttribute('data-view');
          if (viewMode === 'list') {
            collectionGrid.classList.add('list-view');
          } else {
            collectionGrid.classList.remove('list-view');
          }
        });
      });
    }
    
    // Sort options
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        // Reload products with current filters and sort option
        loadFilteredProducts(
          getQueryParam('type'), 
          getQueryParam('value'), 
          1 // Reset to first page when changing sort
        );
      });
    }
  }
  
  // Setup quick view modal
  function setupQuickViewModal() {
    const modal = document.getElementById('quick-view-modal');
    const closeBtn = document.getElementById('modal-close');
    
    if (modal && closeBtn) {
      // Add event listener for quick view buttons
      document.addEventListener('click', function(e) {
        const quickViewBtn = e.target.closest('.quick-view-btn');
        if (quickViewBtn) {
          const productId = quickViewBtn.getAttribute('data-product-id');
          if (productId && productData[productId]) {
            populateQuickViewModal(productData[productId]);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
          }
        }
      });
      
      // Close modal when close button is clicked
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
      });
      
      // Close modal when clicking outside of content
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }
  
  // Populate quick view modal with product data
  function populateQuickViewModal(product) {
    // Populate product details here
    // This function would set all the product information in the modal
  }

  document.addEventListener('DOMContentLoaded', function() {
    console.log("🔍 Collection Debug Script Loaded");
    
    // Wait a bit to ensure all other scripts have run
    setTimeout(function() {
      const productContainer = document.getElementById('collection-products');
      
      // If the container exists but has no children, we need to render products
      if (productContainer && productContainer.children.length === 0) {
        console.log("🚨 Product container exists but is empty - forcing product display");
        
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type') || 'all';
        const value = urlParams.get('value') || '';
        const filter = urlParams.get('filter') || '';
        
        console.log("📋 URL Parameters:", { type, value, filter });
        
        // Filter products based on URL parameters
        let filteredProducts = Object.values(productData);
        console.log("📊 Total products:", filteredProducts.length);
        
        // Apply type and value filters
        if (type !== 'all' && value) {
          if (type === 'category') {
            filteredProducts = filteredProducts.filter(p => p.category === value);
          } else if (type === 'brand') {
            filteredProducts = filteredProducts.filter(p => p.brand.toLowerCase() === value.toLowerCase());
          } else if (type === 'search') {
            const searchTerm = value.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
              p.title.toLowerCase().includes(searchTerm) || 
              p.brand.toLowerCase().includes(searchTerm) ||
              p.description.toLowerCase().includes(searchTerm)
            );
          }
        }
        
        // Apply audience filter if present
        if (filter) {
          filteredProducts = filteredProducts.filter(p => p.tags && p.tags.includes(filter));
        }
        
        console.log("🔍 Filtered products:", filteredProducts.length);
        
        // Clear container and append products
        productContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
          // Show empty state if no products found
          productContainer.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-search"></i>
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros criterios de búsqueda o restablece los filtros.</p>
              <button id="clear-all-filters" class="btn">Restablecer Filtros</button>
            </div>
          `;
          
          // Update product count display
          const productCount = document.getElementById('product-count');
          if (productCount) productCount.textContent = '0';
        } else {
          // Render products (up to 12 per page)
          const productsToShow = filteredProducts.slice(0, 12);
          
          // Create product cards and append them
          productsToShow.forEach(product => {
            const card = createProductCardImproved(product);
            productContainer.appendChild(card);
          });
          
          // Update product count display
          const productCount = document.getElementById('product-count');
          if (productCount) productCount.textContent = filteredProducts.length;
          
          console.log("✅ Successfully rendered", productsToShow.length, "products");
        }
      }
    }, 500); // Wait 500ms to ensure all scripts have initialized
  });

  // Improved product card creation function
function createProductCardImproved(product) {
    console.log("Creating card for product:", product.title);
    
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.setAttribute('data-product-id', product.id);
    
    // Add badge if exists
    if (product.badge) {
      const badge = document.createElement('div');
      badge.className = 'product-badge';
      badge.textContent = product.badge.text;
      if (product.badge.color) {
        badge.style.backgroundColor = product.badge.color;
      }
      card.appendChild(badge);
    }
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image';
    
    const image = document.createElement('img');
    image.src = product.images && product.images.length > 0 ? 
      product.images[0] : '/api/placeholder/300/200';
    image.alt = product.title;
    image.onerror = function() {
      this.src = '/api/placeholder/300/200?text=Imagen+No+Disponible';
    };
    imageContainer.appendChild(image);
    
    // Create overlay with actions
    const overlay = document.createElement('div');
    overlay.className = 'product-overlay';
    
    const actions = document.createElement('div');
    actions.className = 'product-actions-small';
    
    // Quick view button
    const quickViewBtn = document.createElement('div');
    quickViewBtn.className = 'product-action-btn quick-view-btn';
    quickViewBtn.setAttribute('data-product-id', product.id);
    quickViewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    actions.appendChild(quickViewBtn);
    
    // Wishlist button
    const wishlistBtn = document.createElement('div');
    wishlistBtn.className = 'product-action-btn';
    wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
    actions.appendChild(wishlistBtn);
    
    // Compare button
    const compareBtn = document.createElement('div');
    compareBtn.className = 'product-action-btn add-compare';
    compareBtn.innerHTML = '<i class="fas fa-random"></i>';
    actions.appendChild(compareBtn);
    
    overlay.appendChild(actions);
    imageContainer.appendChild(overlay);
    card.appendChild(imageContainer);
    
    // Create product info section
    const info = document.createElement('div');
    info.className = 'product-info';
    
    // Brand
    const brand = document.createElement('div');
    brand.className = 'product-brand';
    brand.textContent = product.brand;
    info.appendChild(brand);
    
    // Title
    const title = document.createElement('h3');
    title.className = 'product-title';
    title.textContent = product.title;
    info.appendChild(title);
    
    // Price
    const price = document.createElement('div');
    price.className = 'product-price';
    
    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = product.price;
    price.appendChild(currentPrice);
    
    if (product.oldPrice) {
      const oldPrice = document.createElement('span');
      oldPrice.className = 'old-price';
      oldPrice.textContent = product.oldPrice;
      price.appendChild(oldPrice);
    }
    
    info.appendChild(price);
    
    // Product options
    const options = document.createElement('div');
    options.className = 'product-options';
    
    // Colors
    const colors = document.createElement('div');
    colors.className = 'product-colors';
    
    if (product.colors && product.colors.length > 0) {
      product.colors.forEach((color, index) => {
        const colorOption = document.createElement('div');
        colorOption.className = index === 0 ? 'color-option active' : 'color-option';
        colorOption.style.backgroundColor = color;
        colors.appendChild(colorOption);
      });
    }
    
    options.appendChild(colors);
    
    // Sizes
    const sizes = document.createElement('div');
    sizes.className = 'product-sizes';
    
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size, index) => {
        const sizeOption = document.createElement('div');
        sizeOption.className = index === 0 ? 'size-option active' : 'size-option';
        sizeOption.textContent = size;
        sizes.appendChild(sizeOption);
      });
    }
    
    options.appendChild(sizes);
    info.appendChild(options);
    card.appendChild(info);
    
    // Add fade-in animation class
    setTimeout(() => {
      card.classList.add('active');
    }, 100);
    
    return card;
  }