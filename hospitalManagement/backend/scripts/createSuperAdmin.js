/**
 * Run once to create the Super Admin account:
 *   node scripts/createSuperAdmin.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../src/models/User');

const SUPER_ADMIN = {
  name: 'Super Admin',
  email: 'superadmin@medicare.com',
  password: 'Admin@1234',
  role: 'super_admin',
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: SUPER_ADMIN.email });
    if (existing) {
      console.log('⚠️  Super Admin already exists — no changes made.');
      process.exit(0);
    }

    await User.create(SUPER_ADMIN);
    console.log('🎉 Super Admin created successfully!');
    console.log('   Email   :', SUPER_ADMIN.email);
    console.log('   Password:', SUPER_ADMIN.password);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
