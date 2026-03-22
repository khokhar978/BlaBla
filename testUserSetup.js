import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import dns from 'dns';
dns.setServers(['8.8.8.8']);

async function setup() {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'testagent@example.com' });
  if (exists) {
    if (!exists.isVerified) {
        exists.isVerified = true;
        await exists.save();
    }
    console.log('Test user ready!');
    process.exit(0);
  }
  const hashedPassword = await bcrypt.hash('password123', 10);
  await User.create({
    name: 'Test Agent',
    email: 'testagent@example.com',
    password: hashedPassword,
    isVerified: true
  });
  console.log('Test user created and verified!');
  process.exit(0);
}
setup();
