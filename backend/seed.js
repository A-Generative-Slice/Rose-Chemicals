const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/database-enhanced');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');

// Sample product data for Rose Chemicals
const categories = [
  {
    name: 'Bathroom Cleaners',
    description: 'Professional bathroom cleaning solutions',
    slug: 'bathroom-cleaners',
    image: '/images/categories/bathroom.jpg'
  },
  {
    name: 'Kitchen Cleaners',
    description: 'Heavy-duty kitchen cleaning products',
    slug: 'kitchen-cleaners',
    image: '/images/categories/kitchen.jpg'
  },
  {
    name: 'Floor Cleaners',
    description: 'Specialized floor cleaning solutions',
    slug: 'floor-cleaners',
    image: '/images/categories/floor.jpg'
  },
  {
    name: 'Glass Cleaners',
    description: 'Crystal clear glass cleaning products',
    slug: 'glass-cleaners',
    image: '/images/categories/glass.jpg'
  },
  {
    name: 'Disinfectants',
    description: 'Hospital-grade disinfection products',
    slug: 'disinfectants',
    image: '/images/categories/disinfectants.jpg'
  },
  {
    name: 'Industrial Cleaners',
    description: 'Heavy-duty industrial cleaning solutions',
    slug: 'industrial-cleaners',
    image: '/images/categories/industrial.jpg'
  },
  {
    name: 'Brooms',
    description: 'High-quality brooms for all cleaning needs',
    slug: 'brooms',
    image: '/images/categories/brooms.jpg'
  }
];

const products = [
  // Toilet Cleaners
  {
    name: 'Rose Toilet Bowl Cleaner',
    description: 'Professional strength toilet bowl cleaner with fresh rose fragrance. Removes tough stains and kills 99.9% of germs.',
    price: 299,
    mrp: 399,
    category: 'Bathroom Cleaners',
    images: ['/images/TOILET_BRUSHES/99. TOILET BRUSH 6306.png'],
    stock: 150,
    sku: 'RC-TC-001',
    features: ['Kills 99.9% germs', 'Fresh rose fragrance', 'Removes tough stains', 'Safe for septic tanks'],
    ingredients: ['Hydrochloric Acid (9%)', 'Surfactants', 'Fragrance', 'Colorant'],
    usage: 'Apply under rim and bowl surfaces. Let sit for 5 minutes. Scrub and flush.',
    weight: '500ml',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rose Bathroom Tile Cleaner',
    description: 'Powerful tile and grout cleaner that removes soap scum, mildew, and hard water stains.',
    price: 249,
    mrp: 329,
    category: 'Bathroom Cleaners',
    images: ['/images/CARPET_BRUSHES/83. AVON CARPER BRUSH (307).png'],
    stock: 200,
    sku: 'RC-BTC-002',
    features: ['Removes soap scum', 'Anti-mildew formula', 'Safe on all tiles', 'No harsh fumes'],
    ingredients: ['Citric Acid', 'Surfactants', 'Anti-fungal agents', 'Fragrance'],
    usage: 'Spray on surface, wait 2-3 minutes, scrub and rinse thoroughly.',
    weight: '750ml',
    isActive: true
  },

  // Kitchen Cleaners
  {
    name: 'Rose Degreaser Pro',
    description: 'Heavy-duty kitchen degreaser for stovetops, ovens, and exhaust fans. Cuts through grease instantly.',
    price: 349,
    mrp: 449,
    category: 'Kitchen Cleaners',
    images: ['/images/SINK_BRUSHES/100. SUPREME SINK SQUIRE Rs 57.JPG'],
    stock: 100,
    sku: 'RC-KD-003',
    features: ['Instant grease cutting', 'Safe on surfaces', 'Pleasant fragrance', 'Biodegradable'],
    ingredients: ['Sodium Hydroxide', 'Surfactants', 'Emulsifiers', 'Fragrance'],
    usage: 'Spray on greasy surface, let sit for 30 seconds, wipe clean with cloth.',
    weight: '500ml',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Rose Dish Wash Liquid',
    description: 'Concentrated dishwashing liquid with advanced grease-cutting formula and gentle on hands.',
    price: 129,
    mrp: 179,
    category: 'Kitchen Cleaners',
    images: ['/images/SINK_BRUSHES/108. 2381 SINK BRUSH- Rs 38.png'],
    stock: 300,
    sku: 'RC-DW-004',
    features: ['Concentrated formula', 'Gentle on hands', 'Fresh fragrance', 'Long lasting'],
    ingredients: ['Linear Alkyl Benzene Sulphonate', 'Coconut Oil', 'Glycerin', 'Fragrance'],
    usage: 'Add 2-3 drops to water. Wash dishes and rinse thoroughly.',
    weight: '1L',
    isActive: true
  },

  // Floor Cleaners
  {
    name: 'Rose Multi-Surface Floor Cleaner',
    description: 'All-in-one floor cleaner suitable for tiles, marble, granite, and wooden floors.',
    price: 199,
    mrp: 249,
    category: 'Floor Cleaners',
    images: ['/images/LONG_BRUSHES/123. THK 140-Rs 111.png'],
    stock: 180,
    sku: 'RC-FC-005',
    features: ['Multi-surface safe', 'No streaks', 'Quick drying', 'Pleasant fragrance'],
    ingredients: ['Isopropyl Alcohol', 'Surfactants', 'Fragrance', 'Colorant'],
    usage: 'Mix 50ml in 1 bucket of water. Mop floor and let air dry.',
    weight: '1L',
    isActive: true,
    isFeatured: true
  },

  // Glass Cleaners
  {
    name: 'Rose Crystal Glass Cleaner',
    description: 'Streak-free glass cleaner for windows, mirrors, and glass surfaces.',
    price: 149,
    mrp: 199,
    category: 'Glass Cleaners',
    images: ['/images/COBWEB_CLEANERS/219. cobweb sunflower-outer-lock.png'],
    stock: 250,
    sku: 'RC-GC-006',
    features: ['Streak-free shine', 'Quick drying', 'Ammonia-free', 'Safe for tinted glass'],
    ingredients: ['Isopropyl Alcohol', 'Surfactants', 'Vinegar', 'Fragrance'],
    usage: 'Spray on glass surface, wipe with clean cloth for streak-free shine.',
    weight: '500ml',
    isActive: true
  },

  // Disinfectants
  {
    name: 'Rose Multi-Purpose Disinfectant',
    description: 'Hospital-grade disinfectant that kills 99.99% of bacteria and viruses.',
    price: 279,
    mrp: 349,
    category: 'Disinfectants',
    images: ['/images/BROOMS/164. DELUX NICE BROOM 115.png'],
    stock: 120,
    sku: 'RC-MPD-007',
    features: ['Kills 99.99% germs', 'Hospital grade', 'Multi-surface safe', 'Long-lasting protection'],
    ingredients: ['Benzalkonium Chloride', 'Isopropyl Alcohol', 'Surfactants', 'Fragrance'],
    usage: 'Spray on surface, let sit for 30 seconds, wipe clean or let air dry.',
    weight: '750ml',
    isActive: true,
    isFeatured: true
  },

  // Industrial Cleaners
  {
    name: 'Rose Heavy Duty Cleaner',
    description: 'Industrial strength cleaner for heavy-duty cleaning applications.',
    price: 599,
    mrp: 749,
    category: 'Industrial Cleaners',
    images: ['/images/BROOMS/166. SITARA BROOM- 84.png'],
    stock: 80,
    sku: 'RC-HDC-008',
    features: ['Industrial strength', 'Concentrated formula', 'Multi-purpose', 'Cost effective'],
    ingredients: ['Sodium Hydroxide', 'Surfactants', 'Chelating agents', 'Stabilizers'],
    usage: 'Dilute as per requirement. Apply, scrub if needed, and rinse thoroughly.',
    weight: '1L',
    isActive: true
  },

  // Brooms Category
  {
    name: 'Delux Nice Broom',
    description: 'Premium quality broom with excellent durability and cleaning performance.',
    price: 115,
    mrp: 145,
    category: 'Brooms',
    images: ['/images/BROOMS/164. DELUX NICE BROOM 115.png'],
    stock: 100,
    sku: 'RC-BR-009',
    features: ['Durable bristles', 'Comfortable grip', 'Long lasting', 'Effective cleaning'],
    ingredients: ['Natural bristles', 'Wooden handle'],
    usage: 'Use for sweeping floors and surfaces.',
    weight: '500g',
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Sitara Broom',
    description: 'Traditional style broom for effective cleaning of all floor types.',
    price: 84,
    mrp: 110,
    category: 'Brooms',
    images: ['/images/BROOMS/166. SITARA BROOM- 84.png'],
    stock: 150,
    sku: 'RC-BR-010',
    features: ['Traditional design', 'Multi-surface', 'Lightweight', 'Easy to use'],
    ingredients: ['Natural bristles', 'Bamboo handle'],
    usage: 'Ideal for daily sweeping of home and office.',
    weight: '450g',
    isActive: true
  },
  {
    name: 'Supriya Nice Broom',
    description: 'High-quality broom with soft bristles for gentle yet effective cleaning.',
    price: 115,
    mrp: 145,
    category: 'Brooms',
    images: ['/images/BROOMS/167. SUPRIYA NICE BROOM 115.png'],
    stock: 120,
    sku: 'RC-BR-011',
    features: ['Soft bristles', 'Premium quality', 'Comfortable handle', 'Long lasting'],
    ingredients: ['Premium bristles', 'Ergonomic handle'],
    usage: 'Perfect for delicate floor surfaces.',
    weight: '480g',
    isActive: true
  },
  {
    name: 'Camel Red Broom',
    description: 'Attractive red colored broom with excellent cleaning capabilities.',
    price: 65,
    mrp: 85,
    category: 'Brooms',
    images: ['/images/BROOMS/168. CAMEL RED - 65.png'],
    stock: 200,
    sku: 'RC-BR-012',
    features: ['Attractive design', 'Good quality', 'Affordable', 'Reliable'],
    ingredients: ['Synthetic bristles', 'Plastic handle'],
    usage: 'Suitable for regular household cleaning.',
    weight: '400g',
    isActive: true
  },
  {
    name: 'Shine Red Broom',
    description: 'Bright red broom with effective cleaning bristles for daily use.',
    price: 74,
    mrp: 95,
    category: 'Brooms',
    images: ['/images/BROOMS/169. SHINE RED- 74.png'],
    stock: 180,
    sku: 'RC-BR-013',
    features: ['Bright color', 'Effective bristles', 'Daily use', 'Value for money'],
    ingredients: ['Mixed bristles', 'Durable handle'],
    usage: 'Great for everyday cleaning tasks.',
    weight: '420g',
    isActive: true
  },
  {
    name: 'Pinky Red Broom',
    description: 'Stylish pink and red broom with superior cleaning performance.',
    price: 78,
    mrp: 100,
    category: 'Brooms',
    images: ['/images/BROOMS/171. PINKY RED BROOM - 78.png'],
    stock: 160,
    sku: 'RC-BR-014',
    features: ['Stylish design', 'Superior performance', 'Easy handling', 'Durable'],
    ingredients: ['Quality bristles', 'Strong handle'],
    usage: 'Ideal for thorough cleaning of all areas.',
    weight: '460g',
    isActive: true
  }
];

const adminUser = {
  name: 'Rose Chemicals Admin',
  email: 'admin@rosechemicals.com',
  password: 'Admin@123',
  role: 'admin',
  isEmailVerified: true
};

// Connect to MongoDB
const connectDatabase = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories seeded`);
    return createdCategories;
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Seed products
const seedProducts = async (categoriesMap) => {
  try {
    await Product.deleteMany({});
    
    // Map category names to IDs
    const productsWithCategoryIds = products.map(product => ({
      ...product,
      category: categoriesMap[product.category]
    }));
    
    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`✅ ${createdProducts.length} products seeded`);
    return createdProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Seed admin user
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return existingAdmin;
    }

    // Don't manually hash - let the User model's pre-save hook handle it
    const admin = new User({
      ...adminUser
    });

    await admin.save();
    console.log('✅ Admin user created');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    return admin;
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    await connectDatabase();
    
    // Seed categories first
    const createdCategories = await seedCategories();
    
    // Create category name to ID mapping
    const categoriesMap = {};
    createdCategories.forEach(category => {
      categoriesMap[category.name] = category._id;
    });
    
    // Seed products with category references
    await seedProducts(categoriesMap);
    
    // Seed admin user
    await seedAdmin();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Login as admin with: admin@rosechemicals.com / Admin@123');
    console.log('3. Visit the frontend to see all products');
    
    // Don't exit process when called from server.js
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
