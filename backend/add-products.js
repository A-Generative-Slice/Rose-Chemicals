// Add all products (chemicals + brooms/brushes) to development database
const devDb = require('./dev-database');

const allProducts = [
  // Existing chemical products are already in the database
  
  // Brooms
  {
    _id: 'broom-001',
    name: 'Delux Nice Broom',
    price: 115,
    category: 'Brooms',
    description: 'Premium quality broom for household and commercial cleaning.',
    images: ['/images/BROOMS/164. DELUX NICE BROOM 115.png'],
    sku: 'BR-DELUX-001',
    inStock: true,
    quantity: 100,
    specifications: {
      material: 'Natural fibers',
      handle: 'Wooden',
      size: 'Standard'
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'broom-002',
    name: 'Sitara Broom',
    price: 84,
    category: 'Brooms',
    description: 'Durable broom suitable for daily cleaning tasks.',
    images: ['/images/BROOMS/166. SITARA BROOM- 84.png'],
    sku: 'BR-SITARA-001',
    inStock: true,
    quantity: 150,
    specifications: {
      material: 'Synthetic fibers',
      handle: 'Plastic',
      size: 'Standard'
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'broom-003',
    name: 'Supriya Nice Broom',
    price: 115,
    category: 'Brooms',
    description: 'High-quality broom with excellent sweeping performance.',
    images: ['/images/BROOMS/167. SUPRIYA NICE BROOM 115.png'],
    sku: 'BR-SUPRIYA-001',
    inStock: true,
    quantity: 80,
    specifications: {
      material: 'Natural fibers',
      handle: 'Wooden',
      size: 'Standard'
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'broom-004',
    name: 'Camel Red Broom',
    price: 65,
    category: 'Brooms',
    description: 'Economical broom for everyday cleaning needs.',
    images: ['/images/BROOMS/168. CAMEL RED - 65.png'],
    sku: 'BR-CAMEL-001',
    inStock: true,
    quantity: 200,
    specifications: {
      material: 'Mixed fibers',
      handle: 'Wooden',
      size: 'Standard'
    },
    createdAt: new Date().toISOString()
  },

  // Toilet Brushes
  {
    _id: 'toilet-001',
    name: 'Keetal Brush',
    price: 30,
    category: 'Toilet Brushes',
    description: 'Essential toilet cleaning brush for bathroom hygiene.',
    images: ['/images/TOILET_BRUSHES/107. 5500 KEETAL BRUSH-Rs 30.png'],
    sku: 'TB-KEETAL-001',
    inStock: true,
    quantity: 120,
    specifications: {
      material: 'Plastic bristles',
      handle: 'Plastic',
      type: 'Standard'
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'toilet-002',
    name: 'New Container Brush',
    price: 141,
    category: 'Toilet Brushes',
    description: 'Premium toilet brush with storage container.',
    images: ['/images/TOILET_BRUSHES/119. NEW CONTAINER BRUSH 1642-Rs 141.png'],
    sku: 'TB-CONTAINER-001',
    inStock: true,
    quantity: 60,
    specifications: {
      material: 'Durable bristles',
      handle: 'Stainless steel',
      type: 'Container included'
    },
    createdAt: new Date().toISOString()
  },

  // Sink Brushes
  {
    _id: 'sink-001',
    name: 'Supreme Sink Square',
    price: 57,
    category: 'Sink Brushes',
    description: 'Square-shaped brush ideal for sink corners and edges.',
    images: ['/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG'],
    sku: 'SB-SUPREME-001',
    inStock: true,
    quantity: 90,
    specifications: {
      shape: 'Square',
      material: 'Nylon bristles',
      handle: 'Plastic'
    },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'sink-002',
    name: '2381 Sink Brush',
    price: 38,
    category: 'Sink Brushes',
    description: 'Compact sink brush for kitchen and bathroom cleaning.',
    images: ['/images/SINK_BRUSHES/108. 2381 SINK BRUSH- Rs 38.png'],
    sku: 'SB-2381-001',
    inStock: true,
    quantity: 150,
    specifications: {
      shape: 'Round',
      material: 'Soft bristles',
      handle: 'Plastic'
    },
    createdAt: new Date().toISOString()
  },

  // Carpet Brushes
  {
    _id: 'carpet-001',
    name: 'Avon Carpet Brush',
    price: 127,
    category: 'Carpet Brushes',
    description: 'Professional carpet cleaning brush for deep cleaning.',
    images: ['/images/CARPET_BRUSHES/83. AVON CARPER BRUSH (307)-Rs 127.png'],
    sku: 'CB-AVON-001',
    inStock: true,
    quantity: 40,
    specifications: {
      material: 'Stiff bristles',
      handle: 'Ergonomic grip',
      type: 'Deep cleaning'
    },
    createdAt: new Date().toISOString()
  },

  // Long Brushes
  {
    _id: 'long-001',
    name: 'THK 140',
    price: 111,
    category: 'Long Brushes',
    description: 'Extended reach brush for high areas and corners.',
    images: ['/images/LONG_BRUSHES/123. THK 140-Rs 111.png'],
    sku: 'LB-THK-001',
    inStock: true,
    quantity: 70,
    specifications: {
      length: '140cm',
      material: 'Synthetic bristles',
      handle: 'Telescopic'
    },
    createdAt: new Date().toISOString()
  }
];

// Add products to database
function addProductsToDatabase() {
  console.log('🔄 Adding brooms and brushes to database...');
  
  const existingProducts = devDb.readCollection('products');
  let addedCount = 0;
  
  allProducts.forEach(product => {
    // Check if product already exists
    const exists = existingProducts.find(p => p._id === product._id);
    if (!exists) {
      devDb.create('products', product);
      addedCount++;
    }
  });
  
  console.log(`✅ Added ${addedCount} new products to database`);
  console.log(`📊 Total products in database: ${devDb.readCollection('products').length}`);
}

// Run if called directly
if (require.main === module) {
  addProductsToDatabase();
}

module.exports = { addProductsToDatabase };
