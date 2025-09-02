// Create server/src/scripts/initDB.ts
import { connectDB } from '../db/connect';
import { User } from '../models/user.model';

const seedAdminUser = async () => {
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    await User.create({
      email: 'admin@example.com',
      password: 'tempPassword123', // Change after first login
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    console.log('Admin user created');
  }
};

connectDB().then(async () => {
  await seedAdminUser();
  process.exit(0);
});