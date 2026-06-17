const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongoDBConnected = false;
const DATA_DIR = path.join(__dirname, '../data');

// Ensure local data directory exists for fallback
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Connect to MongoDB
async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('⚠️  MONGODB_URI is not defined. Falling back to local JSON database mode.');
    isMongoDBConnected = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('✅ Connected to MongoDB successfully.');
    isMongoDBConnected = true;
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.warn('⚠️ Falling back to local JSON database mode.');
    isMongoDBConnected = false;
    return false;
  }
}

// Lightweight JSON database engine mimicking Mongoose operations
class JSONModel {
  constructor(modelName, defaultData = []) {
    this.modelName = modelName;
    this.filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
    
    // Create database file if not exists
    if (!fs.existsSync(this.filePath)) {
      this.saveToFile(defaultData);
    }
  }

  // Helper: Read and parse JSON database file
  readFromFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error(`Error reading database file for ${this.modelName}:`, error);
      return [];
    }
  }

  // Helper: Save items to file
  saveToFile(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error writing database file for ${this.modelName}:`, error);
    }
  }

  // Query: Find all matches
  async find(filter = {}) {
    const items = this.readFromFile();
    if (Object.keys(filter).length === 0) return items;

    return items.filter(item => {
      return Object.entries(filter).every(([key, value]) => {
        if (value && typeof value === 'object' && '$regex' in value) {
          const regex = new RegExp(value.$regex, value.$options || 'i');
          return regex.test(item[key]);
        }
        if (value && typeof value === 'object' && '$in' in value) {
          return value.$in.includes(item[key]);
        }
        return item[key] === value;
      });
    });
  }

  // Query: Find single match
  async findOne(filter = {}) {
    const items = await this.find(filter);
    return items[0] || null;
  }

  // Query: Find by ID
  async findById(id) {
    const items = this.readFromFile();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  // Command: Create document
  async create(data) {
    const items = this.readFromFile();
    const newDoc = {
      _id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newDoc);
    this.saveToFile(items);
    return newDoc;
  }

  // Command: Update by ID
  async findByIdAndUpdate(id, updateData, options = {}) {
    const items = this.readFromFile();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    // Handle Mongoose style update operators like $set or regular updates
    const currentItem = items[index];
    let finalUpdate = { ...updateData };
    if (updateData.$set) {
      finalUpdate = { ...updateData.$set };
    }

    const updatedDoc = {
      ...currentItem,
      ...finalUpdate,
      updatedAt: new Date().toISOString()
    };
    
    items[index] = updatedDoc;
    this.saveToFile(items);
    return updatedDoc;
  }

  // Command: Delete by ID
  async findByIdAndDelete(id) {
    const items = this.readFromFile();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const deletedItem = items[index];
    items.splice(index, 1);
    this.saveToFile(items);
    return deletedItem;
  }

  // Command: Count documents matching filter
  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }
}

// Unified model generator function
function getModel(modelName, mongooseSchema, defaultData = []) {
  const jsonModel = new JSONModel(modelName, defaultData);
  let MongooseModel;
  
  try {
    MongooseModel = mongoose.model(modelName, mongooseSchema);
  } catch (error) {
    MongooseModel = mongoose.model(modelName);
  }

  // Return a proxy that directs requests to Mongoose or the JSON fallback
  return new Proxy({}, {
    get(target, prop) {
      if (isMongoDBConnected) {
        return MongooseModel[prop];
      }
      return jsonModel[prop];
    }
  });
}

module.exports = {
  connectDB,
  getModel,
  isMongoDBConnected: () => isMongoDBConnected
};
