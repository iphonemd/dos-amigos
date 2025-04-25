// Product Data
const productData = {
  1: {
      id: 1,
      brand: 'Marca A',
      title: 'Producto Premium 1',
      price: '$129.99',
      oldPrice: '$159.99',
      description: 'Este producto premium está fabricado con materiales de alta calidad y diseñado para ofrecer máxima comodidad y estilo. Perfecto para cualquier ocasión y compatible con una amplia variedad de combinaciones de vestimenta.',
      colors: ['#e74c3c', '#3498db', '#2ecc71'],
      sizes: ['S', 'M', 'L'],
      images: [
          '/api/placeholder/800/500?text=Producto+1',
          '/api/placeholder/800/500?text=Producto+1+Vista+2',
          '/api/placeholder/800/500?text=Producto+1+Vista+3',
          '/api/placeholder/800/500?text=Producto+1+Vista+4'
      ],
      badge: {
          text: 'Nuevo',
          color: '#e74c3c'
      },
      category: 'new',
      featured: false,
      topSeller: false
  },
  2: {
      id: 2,
      brand: 'Marca B',
      title: 'Producto Especial 2',
      price: '$89.99',
      oldPrice: '$105.99',
      description: 'Producto especial con características únicas que lo distinguen de otros similares en el mercado. Su diseño innovador y materiales seleccionados garantizan una experiencia excepcional.',
      colors: ['#2c3e50', '#9b59b6'],
      sizes: ['M', 'L', 'XL'],
      images: [
          '/api/placeholder/800/500?text=Producto+2',
          '/api/placeholder/800/500?text=Producto+2+Vista+2',
          '/api/placeholder/800/500?text=Producto+2+Vista+3',
          '/api/placeholder/800/500?text=Producto+2+Vista+4'
      ],
      badge: {
          text: '-15%',
          color: '#f39c12'
      },
      category: 'sale',
      featured: false,
      topSeller: false
  },
  3: {
      id: 3,
      brand: 'Marca C',
      title: 'Producto Elite 3',
      price: '$199.99',
      oldPrice: '',
      description: 'Producto de la línea elite, diseñado para quienes buscan lo mejor en calidad y rendimiento. Sus características premium satisfacen las expectativas más exigentes del mercado actual.',
      colors: ['#f1c40f', '#e67e22', '#95a5a6'],
      sizes: ['S', 'M', 'L', 'XL'],
      images: [
          '/api/placeholder/800/500?text=Producto+3',
          '/api/placeholder/800/500?text=Producto+3+Vista+2',
          '/api/placeholder/800/500?text=Producto+3+Vista+3',
          '/api/placeholder/800/500?text=Producto+3+Vista+4'
      ],
      badge: null,
      category: 'popular',
      featured: false,
      topSeller: false
  },
  4: {
      id: 4,
      brand: 'Marca D',
      title: 'Producto Superior 4',
      price: '$149.99',
      oldPrice: '$179.99',
      description: 'Producto superior con acabados de alta gama y materiales seleccionados. Su diseño ergonómico y estética sofisticada lo convierten en una opción ideal para quienes valoran la calidad y el estilo.',
      colors: ['#34495e', '#16a085'],
      sizes: ['S', 'M', 'L'],
      images: [
          '/api/placeholder/800/500?text=Producto+4',
          '/api/placeholder/800/500?text=Producto+4+Vista+2',
          '/api/placeholder/800/500?text=Producto+4+Vista+3',
          '/api/placeholder/800/500?text=Producto+4+Vista+4'
      ],
      badge: {
          text: 'Top',
          color: '#27ae60'
      },
      category: 'popular',
      featured: false,
      topSeller: false
  },
  5: {
      id: 5,
      brand: 'Marca A',
      title: 'Producto Estrella 1',
      price: '$219.99',
      oldPrice: '',
      description: 'Producto estrella de nuestra marca, reconocido por su excelente relación calidad-precio y diseño innovador. Es uno de los más solicitados por nuestros clientes habituales.',
      colors: ['#e74c3c', '#3498db', '#2ecc71'],
      sizes: ['S', 'M', 'L'],
      images: [
          '/api/placeholder/800/500?text=Producto+5',
          '/api/placeholder/800/500?text=Producto+5+Vista+2',
          '/api/placeholder/800/500?text=Producto+5+Vista+3',
          '/api/placeholder/800/500?text=Producto+5+Vista+4'
      ],
      badge: {
          text: 'Best Seller',
          color: '#8e44ad'
      },
      category: 'popular',
      featured: true,
      topSeller: true
  },
  6: {
      id: 6,
      brand: 'Marca B',
      title: 'Producto Estrella 2',
      price: '$179.99',
      oldPrice: '$209.99',
      description: 'Este producto estrella combina tecnología avanzada y diseño elegante. Su popularidad se debe a su versatilidad y durabilidad excepcional que lo convierte en una inversión inteligente.',
      colors: ['#2c3e50', '#9b59b6'],
      sizes: ['M', 'L', 'XL'],
      images: [
          '/api/placeholder/800/500?text=Producto+6',
          '/api/placeholder/800/500?text=Producto+6+Vista+2',
          '/api/placeholder/800/500?text=Producto+6+Vista+3',
          '/api/placeholder/800/500?text=Producto+6+Vista+4'
      ],
      badge: {
          text: 'Best Seller',
          color: '#8e44ad'
      },
      category: 'sale',
      featured: false,
      topSeller: true
  },
  7: {
      id: 7,
      brand: 'Marca C',
      title: 'Producto Estrella 3',
      price: '$159.99',
      oldPrice: '',
      description: 'Uno de nuestros productos estrella más vendidos, apreciado por su equilibrio perfecto entre funcionalidad y estética. Ideal para uso diario y ocasiones especiales.',
      colors: ['#f1c40f', '#e67e22'],
      sizes: ['S', 'M', 'L'],
      images: [
          '/api/placeholder/800/500?text=Producto+7',
          '/api/placeholder/800/500?text=Producto+7+Vista+2',
          '/api/placeholder/800/500?text=Producto+7+Vista+3',
          '/api/placeholder/800/500?text=Producto+7+Vista+4'
      ],
      badge: {
          text: 'Best Seller',
          color: '#8e44ad'
      },
      category: 'popular',
      featured: false,
      topSeller: true
  },
  8: {
      id: 8,
      brand: 'Marca D',
      title: 'Producto Estrella 4',
      price: '$189.99',
      oldPrice: '$219.99',
      description: 'Producto estrella premium con características exclusivas. Su innovador diseño y calidad superior lo han convertido en un referente en su categoría y uno de los favoritos de nuestros clientes.',
      colors: ['#34495e', '#16a085'],
      sizes: ['S', 'M', 'L'],
      images: [
          '/api/placeholder/800/500?text=Producto+8',
          '/api/placeholder/800/500?text=Producto+8+Vista+2',
          '/api/placeholder/800/500?text=Producto+8+Vista+3',
          '/api/placeholder/800/500?text=Producto+8+Vista+4'
      ],
      badge: {
          text: 'Best Seller',
          color: '#8e44ad'
      },
      category: 'sale',
      featured: true,
      topSeller: true
  }
};

// Comparison data (simulated for demo)
const compareData = [
  {
      id: 1,
      title: 'Producto Premium 1',
      price: '$129.99',
      brand: 'Marca A',
      colors: 'Rojo, Azul, Verde',
      sizes: 'S, M, L',
      description: 'Descripción corta del producto premium 1. Características destacadas y beneficios.',
      image: '/api/placeholder/500/500'
  },
  {
      id: 2,
      title: 'Producto Especial 2',
      price: '$89.99',
      brand: 'Marca B',
      colors: 'Negro, Púrpura',
      sizes: 'M, L, XL',
      description: 'Descripción corta del producto especial 2. Características destacadas y beneficios.',
      image: '/api/placeholder/500/500'
  }
];