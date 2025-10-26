// Clean Database Script - Remove all auto-generated products
const devDb = require('./dev-database');

const cleanDatabase = async () => {
  try {
    console.log('🧹 Cleaning database...');
    
    // Clear all products
    await devDb.Product.deleteMany({});
    console.log('✅ All products removed');
    
    // Keep categories for easier product creation
    const categories = await devDb.Category.find({});
    console.log(`📋 Keeping ${categories.length} categories`);
    
    console.log('🎉 Database cleaned successfully!');
    console.log('You can now add products manually through the admin panel');
    
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  }
};

module.exports = { cleanDatabase };

// Run if called directly
if (require.main === module) {
  cleanDatabase();
}
