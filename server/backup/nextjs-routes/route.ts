import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Employee } from '@/models/employee.model';

export async function GET() {
  try {
    console.log('API: Fetching employees...');

    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Fetch employees with risk data
    const employees = await Employee.find({})
      .sort({ riskScore: -1 }) // Highest risk first
      .limit(100)
      .lean();

    console.log(`Found ${employees.length} employees`);

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
