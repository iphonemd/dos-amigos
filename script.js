document.addEventListener('DOMContentLoaded', function() {
  // Loading screen animation
  setTimeout(function() {
      document.querySelector('.loading-overlay').style.opacity = '0';
      setTimeout(function() {
          document.querySelector('.loading-overlay').style.display = 'none';
      }, 1000);
  }, 1500);

  // Hero section animations
  gsap.to('#hero-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 1.8
  });

  gsap.to('#hero-text', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 2
  });

  gsap.to('#hero-btn', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 2.2
  });

  // Render products
  renderProducts();
  renderTopSellers();
  renderCompareTable();

  // Setup event listeners
  setupNavigation();
  setupProductInteraction();
  setupQuickViewModal();
  setupSwiper();
  setupFilterButtons();
  setupCompareTable();
  setupLanguageToggle();
  setupScrollAnimation();
});

// Main Navigation functionality
function setupNavigation() {
  const dropdownButtons = document.querySelectorAll('.dropdown-button');
  const megaMenus = document.querySelectorAll('.mega-menu-container');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  
  // Function to close all menus
  function closeAllMenus() {
      megaMenus.forEach(menu => {
          menu.classList.remove('active');
      });
      dropdownButtons.forEach(button => {
          button.classList.remove('active');
      });
  }
  
  // Setup click handler for each dropdown button
  dropdownButtons.forEach(button => {
      button.addEventListener('click', function(e) {
          e.stopPropagation();
          const buttonId = this.id;
          const menuId = buttonId.replace('button', 'mega-menu');
          const targetMenu = document.getElementById(menuId);
          
          // If the clicked menu is already active, close it
          if (targetMenu.classList.contains('active')) {
              targetMenu.classList.remove('active');
              this.classList.remove('active');
          } else {
              // Close any open menus first
              closeAllMenus();
              
              // Open the target menu
              targetMenu.classList.add('active');
              this.classList.add('active');
          }
      });
  });
  
  // Close menus when clicking outside
  document.addEventListener('click', function() {
      closeAllMenus();
  });
  
  // Prevent menu close when clicking inside the mega menu
  megaMenus.forEach(menu => {
      menu.addEventListener('click', function(e) {
          e.stopPropagation();
      });
  });

  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
  });
}

// Featured Product Gallery
function setupProductInteraction() {
  const thumbnails = document.querySelectorAll('.thumb');
  const mainImage = document.getElementById('featured-main-image');
  const decreaseBtn = document.getElementById('decrease-quantity');
  const increaseBtn = document.getElementById('increase-quantity');
  const quantityInput = document.querySelector('.quantity-input');
  const colorOptions = document.querySelectorAll('.color-option');
  const sizeOptions = document.querySelectorAll('.size-option');
  
  // Setup thumbnail gallery
  thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
          // Remove active class from all thumbnails
          thumbnails.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked thumbnail
          this.classList.add('active');
          
          // Update main image
          const imageUrl = this.getAttribute('data-image');
          mainImage.src = imageUrl;
      });
  });

  // Setup quantity buttons
  if (decreaseBtn && increaseBtn && quantityInput) {
      decreaseBtn.addEventListener('click', function() {
          let value = parseInt(quantityInput.value);
          if (value > 1) {
              quantityInput.value = value - 1;
          }
      });
      
      increaseBtn.addEventListener('click', function() {
          let value = parseInt(quantityInput.value);
          if (value < 10) {
              quantityInput.value = value + 1;
          }
      });
  }

  // Setup color and size options
  colorOptions.forEach(option => {
      option.addEventListener('click', function() {
          const parent = this.closest('.color-options') || this.closest('.product-colors');
          parent.querySelectorAll('.color-option').forEach(opt => {
              opt.classList.remove('active');
          });
          this.classList.add('active');
      });
  });
  
  sizeOptions.forEach(option => {
      option.addEventListener('click', function() {
          const parent = this.closest('.size-options') || this.closest('.product-sizes');
          parent.querySelectorAll('.size-option').forEach(opt => {
              opt.classList.remove('active');
          });
          this.classList.add('active');
      });
  });
}

// Render product cards in the grid
function renderProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  // Clear existing products
  productsGrid.innerHTML = '';
  
  // Get all product IDs
  const productIds = Object.keys(productData);
  
  // Loop through first 4 products and create cards
  for (let i = 0; i < 4; i++) {
      if (i >= productIds.length) break;
      
      const productId = productIds[i];
      const product = productData[productId];
      
      // Create product card HTML
      const productCard = createProductCard(product);
      
      // Add to grid
      productsGrid.appendChild(productCard);
  }
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
  
  product.colors.forEach((color, index) => {
      const colorOption = document.createElement('div');
      colorOption.className = index === 0 ? 'color-option active' : 'color-option';
      colorOption.style.backgroundColor = color;
      colors.appendChild(colorOption);
  });
  
  options.appendChild(colors);
  
  // Sizes
  const sizes = document.createElement('div');
  sizes.className = 'product-sizes';
  
  product.sizes.forEach((size, index) => {
      const sizeOption = document.createElement('div');
      sizeOption.className = index === 1 ? 'size-option active' : 'size-option';
      sizeOption.textContent = size;
      sizes.appendChild(sizeOption);
  });
  
  options.appendChild(sizes);
  info.appendChild(options);
  card.appendChild(info);
  
  return card;
}

// Render top sellers in the swiper
function renderTopSellers() {
  const swiperWrapper = document.getElementById('top-sellers-wrapper');
  if (!swiperWrapper) return;
  
  // Clear existing products
  swiperWrapper.innerHTML = '';
  
  // Filter top sellers
  const topSellers = Object.values(productData).filter(product => product.topSeller);
  
  // Loop through top sellers and create slides
  topSellers.forEach(product => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      
      // Create product card
      const productCard = createProductCard(product);
      
      // Add to slide
      slide.appendChild(productCard);
      
      // Add to wrapper
      swiperWrapper.appendChild(slide);
  });
}

// Render compare table
function renderCompareTable() {
  const compareTableBody = document.getElementById('compare-table-body');
  if (!compareTableBody) return;
  
  // Clear existing rows
  compareTableBody.innerHTML = '';
  
  // Loop through compare data and create rows
  compareData.forEach(product => {
      const row = document.createElement('tr');
      
      // Product column
      const productCell = document.createElement('td');
      const productContainer = document.createElement('div');
      productContainer.className = 'compare-product';
      
      const productImage = document.createElement('img');
      productImage.src = product.image;
      productImage.alt = product.title;
      productContainer.appendChild(productImage);
      
      const productTitle = document.createElement('div');
      productTitle.textContent = product.title;
      productContainer.appendChild(productTitle);
      
      const removeButton = document.createElement('div');
      removeButton.className = 'compare-remove';
      removeButton.textContent = 'Eliminar';
      productContainer.appendChild(removeButton);
      
      productCell.appendChild(productContainer);
      row.appendChild(productCell);
      
      // Price column
      const priceCell = document.createElement('td');
      priceCell.textContent = product.price;
      row.appendChild(priceCell);
      
      // Brand column
      const brandCell = document.createElement('td');
      brandCell.textContent = product.brand;
      row.appendChild(brandCell);
      
      // Colors column
      const colorsCell = document.createElement('td');
      colorsCell.textContent = product.colors;
      row.appendChild(colorsCell);
      
      // Sizes column
      const sizesCell = document.createElement('td');
      sizesCell.textContent = product.sizes;
      row.appendChild(sizesCell);
      
      // Description column
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = product.description;
      row.appendChild(descriptionCell);
      
      // Add row to table
      compareTableBody.appendChild(row);
  });
}

// Set up swiper functionality
function setupSwiper() {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const swiperPrev = document.querySelector('.swiper-prev');
  const swiperNext = document.querySelector('.swiper-next');
  
  if (!swiperWrapper || !swiperPrev || !swiperNext) return;
  
  const slideWidth = document.querySelector('.swiper-slide').offsetWidth + 20;
  let currentPosition = 0;
  
  // Calculate the number of slides per view based on screen width
  function getSlidesPerView() {
      if (window.innerWidth < 768) {
          return 1;
      } else if (window.innerWidth < 992) {
          return 2;
      } else {
          return 3;
      }
  }
  
  let slidesPerView = getSlidesPerView();
  const totalSlides = document.querySelectorAll('.swiper-slide').length;
  let maxPosition = -slideWidth * (totalSlides - slidesPerView);

  function updateSwiper() {
      swiperWrapper.style.transform = `translateX(${currentPosition}px)`;
  }

  swiperPrev.addEventListener('click', function() {
      currentPosition = Math.min(currentPosition + slideWidth, 0);
      updateSwiper();
  });

  swiperNext.addEventListener('click', function() {
      currentPosition = Math.max(currentPosition - slideWidth, maxPosition);
      updateSwiper();
  });
  
  // Update swiper on window resize
  window.addEventListener('resize', function() {
      slidesPerView = getSlidesPerView();
      maxPosition = -slideWidth * (totalSlides - slidesPerView);
      
      // Reset position if needed
      if (currentPosition < maxPosition) {
          currentPosition = maxPosition;
      }
      updateSwiper();
  });
}

// Set up filter buttons
function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Here you would implement the actual filtering
          // For this demo, we'll just show an alert
          alert(`Filtro aplicado: ${this.textContent}`);
      });
  });
}

// Set up quick view modal
function setupQuickViewModal() {
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const modalClose = document.getElementById('modal-close');
  
  if (!quickViewModal || !modalClose) return;
  
  // Function to populate modal with product data
  function populateModal(productId) {
      const product = productData[productId];
      if (!product) return;
      
      // Set product details
      document.getElementById('modal-brand').textContent = product.brand;
      document.getElementById('modal-title').textContent = product.title;
      document.getElementById('modal-price').textContent = product.price;
      document.getElementById('modal-description').innerHTML = `<p>${product.description}</p>`;
      
      // Set old price or hide it
      const oldPriceElement = document.getElementById('modal-old-price');
      if (product.oldPrice) {
          oldPriceElement.textContent = product.oldPrice;
          oldPriceElement.style.display = 'inline';
      } else {
          oldPriceElement.style.display = 'none';
      }
      
      // Create color options
      const colorContainer = document.getElementById('modal-colors');
      colorContainer.innerHTML = '';
      product.colors.forEach((color, index) => {
          const colorOption = document.createElement('div');
          colorOption.className = index === 0 ? 'color-option active' : 'color-option';
          colorOption.style.backgroundColor = color;
          colorOption.addEventListener('click', function() {
              colorContainer.querySelectorAll('.color-option').forEach(opt => {
                  opt.classList.remove('active');
              });
              this.classList.add('active');
          });
          colorContainer.appendChild(colorOption);
      });
      
      // Create size options
      const sizeContainer = document.getElementById('modal-sizes');
      sizeContainer.innerHTML = '';
      product.sizes.forEach((size, index) => {
          const sizeOption = document.createElement('div');
          sizeOption.className = index === 1 ? 'size-option active' : 'size-option';
          sizeOption.textContent = size;
          sizeOption.addEventListener('click', function() {
              sizeContainer.querySelectorAll('.size-option').forEach(opt => {
                  opt.classList.remove('active');
              });
              this.classList.add('active');
          });
          sizeContainer.appendChild(sizeOption);
      });
      
      // Create image gallery
      const mainImage = document.getElementById('modal-main-image');
      mainImage.src = product.images[0];
      
      const galleryThumbs = document.getElementById('modal-gallery-thumbs');
      galleryThumbs.innerHTML = '';
      
      product.images.forEach((image, index) => {
          const thumb = document.createElement('div');
          thumb.className = index === 0 ? 'thumb active' : 'thumb';
          thumb.setAttribute('data-image', image);
          
          const thumbImg = document.createElement('img');
          thumbImg.src = image;
          thumbImg.alt = `${product.title} Vista ${index + 1}`;
          
          thumb.appendChild(thumbImg);
          
          thumb.addEventListener('click', function() {
              galleryThumbs.querySelectorAll('.thumb').forEach(t => {
                  t.classList.remove('active');
              });
              this.classList.add('active');
              mainImage.src = this.getAttribute('data-image');
          });
          
          galleryThumbs.appendChild(thumb);
      });
  }
  
  // Open modal with product data when quick view button is clicked
  document.addEventListener('click', function(e) {
      if (e.target.closest('.quick-view-btn')) {
          const btn = e.target.closest('.quick-view-btn');
          const productId = btn.getAttribute('data-product-id');
          populateModal(productId);
          quickViewModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
  });
  
  // Close modal
  modalClose.addEventListener('click', function() {
      quickViewModal.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
  });
  
  // Close modal when clicking outside of content
  quickViewModal.addEventListener('click', function(e) {
      if (e.target === this) {
          quickViewModal.classList.remove('active');
          document.body.style.overflow = '';
      }
  });
  
  // Modal quantity buttons
  const modalDecreaseBtns = document.querySelectorAll('.decrease-quantity');
  const modalIncreaseBtns = document.querySelectorAll('.increase-quantity');
  
  modalDecreaseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          const input = this.nextElementSibling;
          let value = parseInt(input.value);
          if (value > 1) {
              input.value = value - 1;
          }
      });
  });
  
  modalIncreaseBtns.forEach(btn => {
      btn.addEventListener('click', function() {
          const input = this.previousElementSibling;
          let value = parseInt(input.value);
          if (value < 10) {
              input.value = value + 1;
          }
      });
  });
}

// Set up compare functionality
function setupCompareTable() {
  // Add to compare functionality
  document.addEventListener('click', function(e) {
      if (e.target.closest('.add-compare')) {
          const compareBtn = e.target.closest('.add-compare');
          compareBtn.classList.toggle('active');
          
          if (compareBtn.classList.contains('active')) {
              // In a real application, we would add this product to the compare table
              // For demo purposes, just show an alert
              const productCard = compareBtn.closest('.product-card');
              const productId = productCard ? productCard.getAttribute('data-product-id') : 'unknown';
              
              alert(`Producto ${productId} añadido a comparar`);
          }
      }
  });
  
  // Clear compare table
  const clearCompareButton = document.getElementById('clear-compare');
  if (clearCompareButton) {
      clearCompareButton.addEventListener('click', function() {
          const compareTableBody = document.getElementById('compare-table-body');
          if (compareTableBody) {
              // Clear the table
              compareTableBody.innerHTML = '';
              
              // Reset add-compare buttons
              document.querySelectorAll('.add-compare').forEach(button => {
                  button.classList.remove('active');
              });
              
              alert('Comparación limpiada');
          }
      });
  }
  
  // Remove from compare
  document.addEventListener('click', function(e) {
      if (e.target.classList.contains('compare-remove')) {
          const row = e.target.closest('tr');
          if (row) {
              row.remove();
              alert('Producto eliminado de la comparación');
          }
      }
  });
  
  // Print compare table
  const printCompareButton = document.getElementById('print-compare');
  if (printCompareButton) {
      printCompareButton.addEventListener('click', function() {
          alert('Función de impresión simulada. En una aplicación real, esto imprimiría la tabla de comparación.');
      });
  }
}

// Set up language toggle
function setupLanguageToggle() {
  const languageToggle = document.getElementById('language-toggle');
  if (!languageToggle) return;
  
  let isSpanish = true;
  
  languageToggle.addEventListener('click', function() {
      if (isSpanish) {
          alert('Switching to English version...');
          languageToggle.textContent = 'ES';
      } else {
          alert('Cambiando a versión en Español...');
          languageToggle.textContent = 'EN';
      }
      isSpanish = !isSpanish;
      
      // In a real application, we would change the language of all text
      // For demo purposes, we just toggle the button text
  });
}

// Set up scroll animations
function setupScrollAnimation() {
  // Header scroll animation
  window.addEventListener('scroll', function() {
      const header = document.querySelector('header');
      if (header) {
          if (window.scrollY > 100) {
              header.style.backgroundColor = 'rgba(58, 58, 58, 0.95)';
          } else {
              header.style.backgroundColor = 'var(--primary)';
          }
      }
  });
  
  // Fade in animations
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeInOptions = {
      threshold: 0.2
  };

  const fadeInObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
          }
      });
  }, fadeInOptions);

  fadeElements.forEach(element => {
      fadeInObserver.observe(element);
  });
}