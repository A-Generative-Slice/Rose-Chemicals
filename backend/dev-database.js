// Development database using JSON files (temporary solution)
const fs = require('fs');
const path = require('path');

class DevDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, 'dev-data');
    this.initDatabase();
  }

  initDatabase() {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir);
    }

    // Initialize collections
    this.initCollection('users');
    this.initCollection('products');
    this.initCollection('orders');
    this.initCollection('cart');

    // Create admin user and sample data
    this.setupInitialData();
  }

  initCollection(name) {
    const filePath = path.join(this.dataDir, `${name}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
  }

  setupInitialData() {
    // Create admin user
    const users = this.readCollection('users');
    const bcrypt = require('bcryptjs');
    
    if (users.length === 0) {
      const adminUser = {
        _id: 'admin-001',
        name: 'Rose Chemicals Admin',
        email: 'admin@rosechemicals.com',
        password: bcrypt.hashSync('Admin@123', 12),
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      users.push(adminUser);
      this.writeCollection('users', users);
      console.log('✅ Admin user created');
    }

    // Create sample products
    const products = this.readCollection('products');
    if (products.length === 0) {
      const sampleProducts = [
        {
          _id: 'prod-001',
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
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'prod-002',
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
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'prod-003',
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
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'prod-004',
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
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: 'prod-005',
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
          },
          createdAt: new Date().toISOString()
        }
      ];
      
      this.writeCollection('products', sampleProducts);
      console.log('✅ Sample chemical products created');
    }
  }

  readCollection(name) {
    const filePath = path.join(this.dataDir, `${name}.json`);
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeCollection(name, data) {
    const filePath = path.join(this.dataDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // CRUD operations
  create(collection, data) {
    const items = this.readCollection(collection);
    data._id = data._id || Date.now().toString();
    data.createdAt = new Date().toISOString();
    items.push(data);
    this.writeCollection(collection, items);
    return data;
  }

  find(collection, query = {}) {
    const items = this.readCollection(collection);
    if (Object.keys(query).length === 0) return items;
    
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  findOne(collection, query) {
    const items = this.find(collection, query);
    return items[0] || null;
  }

  update(collection, query, updateData) {
    const items = this.readCollection(collection);
    const index = items.findIndex(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
    
    if (index !== -1) {
      items[index] = { ...items[index], ...updateData, updatedAt: new Date().toISOString() };
      this.writeCollection(collection, items);
      return items[index];
    }
    return null;
  }

  delete(collection, query) {
    const items = this.readCollection(collection);
    const newItems = items.filter(item => {
      return !Object.keys(query).every(key => item[key] === query[key]);
    });
    
    if (newItems.length !== items.length) {
      this.writeCollection(collection, newItems);
      return true;
    }
    return false;
  }
}

// Initialize and export
const devDb = new DevDatabase();
console.log('🚀 Development database initialized!');
console.log('📊 Admin Login: admin@rosechemicals.com / Admin@123');

module.exports = devDb;
