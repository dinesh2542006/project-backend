require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    
    // Add more sample users
    const additionalUsers = [
      {
        name: "John Doe",
        age: "30",
        gender: "Male",
        address: "123 Main St, New York, NY",
        contact: "555-0123",
        code: "12345"
      },
      {
        name: "Jane Smith",
        age: "28",
        gender: "Female",
        address: "456 Oak Ave, Los Angeles, CA",
        contact: "555-0456",
        code: "12345"
      },
      {
        name: "Mike Johnson",
        age: "35",
        gender: "Male",
        address: "789 Pine Rd, Chicago, IL",
        contact: "555-0789",
        code: "12345"
      }
    ];

    // Add sample alerts
    const sampleAlerts = [
      {
        name: "Emergency Alert 1",
        address: "123 Emergency St, City",
        contact: "911",
        timestamp: new Date()
      },
      {
        name: "Emergency Alert 2",
        address: "456 Safety Ave, Town",
        contact: "555-0001",
        timestamp: new Date()
      }
    ];

    // Add users
    console.log('👥 Adding sample users...');
    for (const userData of additionalUsers) {
      const existingUser = await User.findOne({ name: userData.name });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Added user: ${userData.name}`);
      } else {
        console.log(`⚠️ User ${userData.name} already exists`);
      }
    }

    // Add alerts
    console.log('🚨 Adding sample alerts...');
    for (const alertData of sampleAlerts) {
      const alert = new Alert(alertData);
      await alert.save();
      console.log(`✅ Added alert: ${alertData.name}`);
    }

    // Display final database status
    const userCount = await User.countDocuments();
    const alertCount = await Alert.countDocuments();
    
    console.log('\n📊 Final Database Status:');
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`🚨 Total Alerts: ${alertCount}`);
    
    // Show all users
    const allUsers = await User.find({}).select('name age gender contact');
    console.log('\n👥 All Users:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.age}, ${user.gender}) - ${user.contact}`);
    });

    // Show all alerts
    const allAlerts = await Alert.find({}).select('name address contact timestamp');
    console.log('\n🚨 All Alerts:');
    allAlerts.forEach(alert => {
      console.log(`- ${alert.name} at ${alert.address} (${alert.contact})`);
    });

    console.log('\n✅ Sample data added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addSampleData(); 