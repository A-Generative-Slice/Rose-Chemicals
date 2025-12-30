require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if dusters exists
    const dustersExists = await Category.findOne({slug: 'dusters'});
    if (!dustersExists) {
      await Category.create({
        name: 'Dusters', 
        slug: 'dusters',
        description: 'Dusting and cleaning tools for home and office use'
      });
      console.log('Dusters category added');
    } else {
      console.log('Dusters category already exists');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})();