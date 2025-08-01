require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');

async function getDatabaseInfo() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB Atlas');
    
    // Get database information
    const dbName = mongoose.connection.db.databaseName;
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('\n📊 DATABASE INFORMATION');
    console.log('='.repeat(50));
    console.log(`🏢 Database Name: ${dbName}`);
    console.log(`🌐 Cluster: ${process.env.MONGODB_URI.split('@')[1].split('/')[0]}`);
    console.log(`📋 Collections: ${collections.length}`);
    
    // Collection details
    console.log('\n📋 COLLECTION DETAILS');
    console.log('='.repeat(50));
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`📁 ${collection.name}: ${count} documents`);
    }
    
    // User statistics
    const userCount = await User.countDocuments();
    const maleUsers = await User.countDocuments({ gender: 'Male' });
    const femaleUsers = await User.countDocuments({ gender: 'Female' });
    
    console.log('\n👥 USER STATISTICS');
    console.log('='.repeat(50));
    console.log(`📊 Total Users: ${userCount}`);
    console.log(`👨 Male Users: ${maleUsers}`);
    console.log(`👩 Female Users: ${femaleUsers}`);
    
    // Recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name age gender contact createdAt');
    
    console.log('\n🆕 RECENT USERS');
    console.log('='.repeat(50));
    recentUsers.forEach((user, index) => {
      const date = user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A';
      console.log(`${index + 1}. ${user.name} (${user.age}, ${user.gender}) - ${user.contact} - ${date}`);
    });
    
    // Alert statistics
    const alertCount = await Alert.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAlerts = await Alert.countDocuments({ timestamp: { $gte: today } });
    
    console.log('\n🚨 ALERT STATISTICS');
    console.log('='.repeat(50));
    console.log(`📊 Total Alerts: ${alertCount}`);
    console.log(`📅 Today's Alerts: ${todayAlerts}`);
    
    // Recent alerts
    const recentAlerts = await Alert.find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .select('name address contact timestamp');
    
    console.log('\n🚨 RECENT ALERTS');
    console.log('='.repeat(50));
    recentAlerts.forEach((alert, index) => {
      const date = alert.timestamp ? alert.timestamp.toLocaleString() : 'N/A';
      console.log(`${index + 1}. ${alert.name} at ${alert.address} (${alert.contact}) - ${date}`);
    });
    
    // Connection info
    console.log('\n🔗 CONNECTION INFORMATION');
    console.log('='.repeat(50));
    console.log(`🌐 Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`🔌 Host: ${mongoose.connection.host}`);
    console.log(`📊 Port: ${mongoose.connection.port}`);
    console.log(`🏢 Database: ${mongoose.connection.name}`);
    
    console.log('\n✅ Database information retrieved successfully!');
    
  } catch (error) {
    console.error('❌ Error getting database info:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
getDatabaseInfo(); 