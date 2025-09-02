import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.ts';
import { Team } from '../models/team.model.ts';

// Load environment variables
dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || 'talent-risk-ai'
    });
    console.log('✅ MongoDB connected');

    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log('🧹 Database cleared');

    // Create team
    const devTeam = await Team.create({
      name: 'Development Team',
      department: 'Engineering'
    });

    // Create users
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        password: '$2a$12$T7v5Q9yZqPYzE.4X1Xz0O.9I3Z5X8Vz9XkX8XkX8XkX8XkX8XkX8X', // Test@1234
        teamId: devTeam._id,
        sentimentHistory: [{
          score: 0.8,
          magnitude: 1.2,
          source: 'initial'
        }]
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        password: '$2a$12$T7v5Q9yZqPYzE.4X1Xz0O.9I3Z5X8Vz9XkX8XkX8XkX8XkX8XkX8X', // Test@1234
        teamId: devTeam._id
      }
    ]);

    // Update team with members
    await Team.findByIdAndUpdate(devTeam._id, {
      managerId: users[1]._id,
      memberIds: users.map(u => u._id)
    });

    console.log('🌱 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

await seedDatabase();