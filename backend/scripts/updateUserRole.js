require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const updateUserRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get username from command line argument
    const username = process.argv[2];
    
    if (!username) {
      console.error('Please provide a username as argument');
      console.log('Usage: node updateUserRole.js <username>');
      process.exit(1);
    }

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      console.error(`User with username '${username}' not found`);
      process.exit(1);
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully updated user '${username}' role to 'admin'`);
    console.log('User details:');
    console.log('- Name:', user.name);
    console.log('- Email:', user.email);
    console.log('- Username:', user.username);
    console.log('- Role:', user.role);

    process.exit(0);
  } catch (error) {
    console.error('Error updating user role:', error.message);
    process.exit(1);
  }
};

updateUserRole();
