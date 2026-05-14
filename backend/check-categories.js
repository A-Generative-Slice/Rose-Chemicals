require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const categories = await Category.find({});
    console.log('Categories found:', categories.length);
    if (categories.length === 0) {
      console.log('Seeding categories...');
      const categoriesData = [
        { name: 'Cleaning Agents', slug: 'cleaning-agents' },
        { name: 'Dusters', slug: 'dusters' },
        { name: 'Sanitizers', slug: 'sanitizers' },
        { name: 'Industrial Cleaners', slug: 'industrial-cleaners' },
        { name: 'Laboratory Chemicals', slug: 'laboratory-chemicals' }
      ];
      await Category.insertMany(categoriesData);
      console.log('Categories seeded successfully');
    } else {
      console.log('Existing categories:', categories.map(c => ({name: c.name, slug: c.slug})));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})();
