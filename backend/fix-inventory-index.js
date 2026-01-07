const mongoose = require('mongoose');
require('dotenv').config();

async function fixInventoryIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autoserve');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('inventories');
    
    // Drop the unique index on sku
    try {
      await collection.dropIndex('sku_1');
      console.log('Dropped unique index on sku');
    } catch (error) {
      console.log('Index may not exist:', error.message);
    }
    
    // Create a compound index for sku + serviceCenter to allow same SKU for different service centers
    await collection.createIndex({ sku: 1, serviceCenter: 1 }, { unique: true });
    console.log('Created compound unique index on sku + serviceCenter');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixInventoryIndex();