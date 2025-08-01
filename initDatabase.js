require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    
    // Check existing collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Existing collections:', collections.map(c => c.name));
    
    // Create collections by inserting sample data if they don't exist
    const sampleUsers = [
      {
        name: "DD",
        age: "18",
        gender: "Male",
        address: "mutyalampaddu,Vijayawada AP",
        contact: "8977267233",
        code: "12345"
      },
      {
        name: "LL",
        age: "25",
        gender: "Female",
        address: "mutyalampaddu,Vijayawada AP",
        contact: "8977267238",
        code: "12345"
      },
      {
        name: "Sudeep",
        age: "16",
        gender: "Male",
        address: "25-1-25,kk poor , usa",
        contact: "9958158537",
        code: "12345"
      },
      {
        name: "lalith",
        age: "25",
        gender: "Male",
        address: "mutyalampaddu,Vijayawada AP",
        contact: "9618718208",
        code: "12345"
      }
    ];

    // Check if users collection is empty and add sample data
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('👥 Creating users collection with sample data...');
      await User.insertMany(sampleUsers);
      console.log('✅ Sample users added successfully');
    } else {
      console.log(`👥 Users collection already has ${userCount} documents`);
    }

    // Check if alerts collection exists (it will be created automatically when first alert is added)
    const alertCount = await Alert.countDocuments();
    console.log(`🚨 Alerts collection has ${alertCount} documents`);

    // Display database info
    console.log('\n📊 Database Summary:');
    console.log('Database Name:', mongoose.connection.db.databaseName);
    console.log('Connection URL:', process.env.MONGODB_URI.split('@')[1].split('/')[0]);
    
    const allCollections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', allCollections.map(c => c.name));
    
    console.log('\n✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the initialization
initializeDatabase(); 