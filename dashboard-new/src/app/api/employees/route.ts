import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This should call your backend server
    // Change this URL to match your actual backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    console.log('Fetching employees from backend:', `${backendUrl}/api/employees`);
    
    const response = await fetch(`${backendUrl}/api/employees`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Backend response not OK:', response.status);
      // Return mock data if backend fails
      return NextResponse.json({
        success: true,
        data: generateMockData(),
        stats: {
          total: 10,
          highRisk: 2,
          mediumRisk: 3,
          lowRisk: 5
        }
      });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error proxying to backend:', error);
    // Return mock data on error
    return NextResponse.json({
      success: true,
      data: generateMockData(),
      stats: {
        total: 10,
        highRisk: 2,
        mediumRisk: 3,
        lowRisk: 5
      },
      error: 'Using mock data due to backend connection issue'
    });
  }
}

function generateMockData() {
  const mockEmployees = [];
  for (let i = 1; i <= 10; i++) {
    mockEmployees.push({
      _id: `mock-${i}`,
      name: `Employee ${i}`,
      email: `employee${i}@company.com`,
      employeeId: `EMP${1000 + i}`,
      department: i % 2 === 0 ? 'Engineering' : 'Sales',
      role: i % 3 === 0 ? 'Senior' : i % 3 === 1 ? 'Mid' : 'Junior',
      location: i % 2 === 0 ? 'New York' : 'Remote',
      tenureMonths: i * 8,
      performanceRating: 3.0 + Math.random() * 2,
      engagementScore: 0.5 + Math.random() * 0.5,
      compRatio: 0.8 + Math.random() * 0.4,
      criticalSkills: ['Communication', 'Teamwork'],
      skillGaps: i > 7 ? ['Communication', 'Teamwork'] : i > 4 ? ['Communication'] : [],
      riskScore: i * 10,
      riskLevel: i > 7 ? 'high' : i > 4 ? 'medium' : 'low',
      status: 'Active',
      lastAssessmentDate: new Date().toISOString(),
      hireDate: new Date(Date.now() - i * 8 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  return mockEmployees;
}
