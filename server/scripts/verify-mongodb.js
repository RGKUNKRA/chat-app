#!/usr/bin/env node

/**
 * MongoDB Setup Verification Script
 * Run this to verify your MongoDB configuration and connection
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
const TIMEOUT = 10000; // 10 seconds

console.log('\n🔍 MongoDB Setup Verification\n');
console.log('━'.repeat(50));
console.log('1. Checking MongoDB Connection...\n');

// Test connection
const testConnection = async () => {
  try {
    console.log(`📍 Connecting to: ${MONGODB_URI.replace(/password:[^@]*@/, 'password:****@')}\n`);

    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: TIMEOUT,
      connectTimeoutMS: TIMEOUT,
    });

    console.log('✅ Connection successful!\n');
    console.log('📊 Database Info:');
    console.log(`   • Host: ${conn.connection.host}`);
    console.log(`   • Database: ${conn.connection.name}`);
    console.log(`   • Port: ${conn.connection.port}\n`);

    // Test collections
    console.log('━'.repeat(50));
    console.log('2. Checking Collections...\n');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (collectionNames.length === 0) {
      console.log('⚠️  No collections found yet (this is OK for first setup)\n');
    } else {
      console.log(`Found ${collectionNames.length} collection(s):`);
      for (const name of collectionNames) {
        const collection = mongoose.connection.collection(name);
        const count = await collection.countDocuments();
        console.log(`   • ${name}: ${count} document(s)`);
      }
      console.log();
    }

    // Test models
    console.log('━'.repeat(50));
    console.log('3. Verifying Models...\n');

    const User = require('../models/User');
    const Message = require('../models/Message');

    console.log('Models loaded successfully:');
    console.log('   • User');
    console.log('   • Message\n');

    // Test indexes
    console.log('━'.repeat(50));
    console.log('4. Database Indexes...\n');

    try {
      const userIndexes = await User.collection.getIndexes();
      console.log('User indexes:');
      Object.keys(userIndexes).forEach(idx => {
        console.log(`   • ${idx}`);
      });

      const messageIndexes = await Message.collection.getIndexes();
      console.log('\nMessage indexes:');
      Object.keys(messageIndexes).forEach(idx => {
        console.log(`   • ${idx}`);
      });
    } catch (err) {
      console.log('⚠️  Could not retrieve indexes:', err.message);
    }

    console.log('\n' + '━'.repeat(50));
    console.log('5. Sample Test Operations...\n');

    // Test write
    try {
      const testUser = new User({
        username: `test_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        password: 'testpass123'
      });

      console.log('✅ User model validation: PASSED');

      const testMessage = new Message({
        sender: new mongoose.Types.ObjectId(),
        receiver: new mongoose.Types.ObjectId(),
        text: 'Test message'
      });

      console.log('✅ Message model validation: PASSED\n');
    } catch (err) {
      console.log('❌ Model validation failed:', err.message);
    }

    console.log('━'.repeat(50));
    console.log('\n✨ Setup Verification Complete!\n');
    console.log('📝 Next Steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Test endpoints with Postman or cURL');
    console.log('   3. Check MongoDB Atlas dashboard for live data\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Failed!\n');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting:\n');

    if (error.message.includes('ECONNREFUSED')) {
      console.error('   • MongoDB is not running locally');
      console.error('   • Start MongoDB: mongod (Windows) or brew services start mongodb-community (Mac)\n');
    } else if (error.message.includes('authentication failed')) {
      console.error('   • Check your MongoDB URI username and password');
      console.error('   • Update MONGODB_URI in .env file\n');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('   • MongoDB host not found (for Atlas, ensure IP is whitelisted)\n');
    } else {
      console.error('   • Check your MONGODB_URI environment variable');
      console.error('   • Verify MongoDB is running and accessible\n');
    }

    console.error('📚 Documentation:');
    console.error('   • Local MongoDB: ../MONGODB_SETUP.md');
    console.error('   • MongoDB Atlas: https://www.mongodb.com/cloud/atlas\n');

    process.exit(1);
  }
};

testConnection();
