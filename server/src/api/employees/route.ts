import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Employee } from '@/models/employee.model';

export async function GET() {
  try {
    console.log('Ì≥ã API: Fetching employees...');
    
    // Connect to MongoDB
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }
    
    // Fetch employees with risk data
    const employees = await Employee.find({})
      .sort({ riskScore: -1 }) // Highest risk first
      .limit(100)
      .lean();
    
    console.log(`‚úÖ Found ${employees.length} employees`);
    
    // Calculate statistics
    const stats = {
      total: employees.length,
      highRisk: employees.filter(e => e.riskLevel === 'high').length,
      mediumRisk: employees.filter(e => e.riskLevel === 'medium').length,
      lowRisk: employees.filter(e => e.riskLevel === 'low').length,
      averageRiskScore: employees.reduce((sum, e) => sum + (e.riskScore || 0), 0) / employees.length
    };
    
    return NextResponse.json({
      success: true,
      data: employees,
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('‚ùå API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
