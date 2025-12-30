// Development database adapter for Mongoose models
const devDb = require('./dev-database');

// Mock Mongoose model behavior for development
class DevModel {
  constructor(collectionName) {
    this.collection = collectionName;
  }

  async find(query = {}) {
    const items = devDb.find(this.collection, query);
    return items;
  }

  async findById(id) {
    return devDb.findOne(this.collection, { _id: id });
  }

  async findOne(query) {
    return devDb.findOne(this.collection, query);
  }

  async create(data) {
    return devDb.create(this.collection, data);
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const updated = devDb.update(this.collection, { _id: id }, updateData);
    return updated;
  }

  async findByIdAndDelete(id) {
    return devDb.delete(this.collection, { _id: id });
  }

  async countDocuments(query = {}) {
    const items = devDb.find(this.collection, query);
    return items.length;
  }

  // For backward compatibility
  async remove() {
    // This would be called on an instance, but we'll handle it differently
    return true;
  }
}

// Export mock models
module.exports = {
  Product: new DevModel('products'),
  User: new DevModel('users'),
  Order: new DevModel('orders'),
  Cart: new DevModel('cart')
};
