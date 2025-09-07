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
  }
];

const products = [
  // Bathroom Cleaners
  {
    name: 'Rose Toilet Bowl Cleaner',
    description: 'Professional strength toilet bowl cleaner with fresh rose fragrance. Removes tough stains and kills 99.9% of germs.',
    price: 299,
    mrp: 399,
    category: 'Bathroom Cleaners',
    images: ['/images/products/toilet-cleaner-1.jpg'],
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
    images: ['/images/products/tile-cleaner-1.jpg'],
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
    images: ['/images/products/degreaser-1.jpg'],
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
    images: ['/images/products/dishwash-1.jpg'],
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
    images: ['/images/products/floor-cleaner-1.jpg'],
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
    images: ['/images/products/glass-cleaner-1.jpg'],
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
    images: ['/images/products/disinfectant-1.jpg'],
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
    images: ['/images/products/heavy-duty-1.jpg'],
    stock: 80,
    sku: 'RC-HDC-008',
    features: ['Industrial strength', 'Concentrated formula', 'Multi-purpose', 'Cost effective'],
    ingredients: ['Sodium Hydroxide', 'Surfactants', 'Chelating agents', 'Stabilizers'],
    usage: 'Dilute as per requirement. Apply, scrub if needed, and rinse thoroughly.',
    weight: '1L',
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

    const hashedPassword = await bcrypt.hash(adminUser.password, 12);
    const admin = new User({
      ...adminUser,
      password: hashedPassword
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
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
