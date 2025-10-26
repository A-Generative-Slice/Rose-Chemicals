const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');

const setupDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      console.log('🔄 Creating admin user...');
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      
      const adminUser = new User({
        name: 'Rose Chemicals Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
    } else {
      console.log('✅ Admin user already exists!');
    }

    // Create sample products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🔄 Creating sample chemical products...');
      
      const sampleProducts = [
        {
          name: 'Sodium Chloride (NaCl)',
          description: 'High purity sodium chloride for industrial and laboratory use. Meets ACS specifications.',
          price: 25.99,
          category: 'Industrial Salts',
          inStock: true,
          quantity: 500,
          sku: 'RC-NACL-001',
          images: ['/images/products/sodium-chloride.jpg'],
          specifications: {
            purity: '99.5%',
            grade: 'ACS',
            form: 'Crystalline powder',
            packaging: '25kg bags'
          }
        },
        {
          name: 'Sulfuric Acid (H2SO4)',
          description: 'Concentrated sulfuric acid for industrial applications. Handle with extreme care.',
          price: 89.99,
          category: 'Acids',
          inStock: true,
          quantity: 200,
          sku: 'RC-H2SO4-001',
          images: ['/images/products/sulfuric-acid.jpg'],
          specifications: {
            concentration: '98%',
            grade: 'Technical',
            form: 'Liquid',
            packaging: '25L containers'
          }
        },
        {
          name: 'Calcium Carbonate (CaCO3)',
          description: 'Precipitated calcium carbonate for pharmaceutical and food applications.',
          price: 45.50,
          category: 'Carbonates',
          inStock: true,
          quantity: 300,
          sku: 'RC-CACO3-001',
          images: ['/images/products/calcium-carbonate.jpg'],
          specifications: {
            purity: '99.0%',
            grade: 'USP',
            form: 'Fine powder',
            packaging: '20kg bags'
          }
        },
        {
          name: 'Ethanol (C2H5OH)',
          description: 'Denatured ethanol for industrial cleaning and solvent applications.',
          price: 65.75,
          category: 'Solvents',
          inStock: true,
          quantity: 150,
          sku: 'RC-ETOH-001',
          images: ['/images/products/ethanol.jpg'],
          specifications: {
            purity: '95%',
            grade: 'Industrial',
            form: 'Liquid',
            packaging: '20L containers'
          }
        },
        {
          name: 'Potassium Hydroxide (KOH)',
          description: 'Caustic potash for soap making and industrial applications.',
          price: 78.25,
          category: 'Bases',
          inStock: true,
          quantity: 100,
          sku: 'RC-KOH-001',
          images: ['/images/products/potassium-hydroxide.jpg'],
          specifications: {
            purity: '90%',
            grade: 'Technical',
            form: 'Flakes',
            packaging: '25kg drums'
          }
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('✅ Sample chemical products created!');
    } else {
      console.log('✅ Products already exist in database!');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('🔗 Backend running on: http://localhost:5000');
    console.log('🔗 Frontend running on: http://localhost:3002');
    console.log('\n📋 Admin Login Details:');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
