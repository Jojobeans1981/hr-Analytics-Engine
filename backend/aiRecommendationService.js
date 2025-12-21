// AI Recommendation Service - Original with Groq Integration Only

/**
 * Generate AI recommendations for an employee
 * Uses Groq API with fallback to original recommendations
 */
async function generateAIRecommendations(employeeData) {
  // Try Groq API first if key is available
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (groqApiKey && groqApiKey.startsWith('gsk_')) {
    try {
      console.log('Attempting to generate recommendations via Groq API...');
      const groqRecommendations = await generateGroqRecommendations(employeeData, groqApiKey);
      return groqRecommendations;
    } catch (error) {
      console.error('Groq API failed, falling back to original recommendations:', error.message);
      // Fall through to original functionality
    }
  }
  
  // Original functionality - no external APIs
  console.log('Using original recommendation system');
  return generateOriginalRecommendations(employeeData);
}

/**
 * Generate recommendations using Groq API
 */
async function generateGroqRecommendations(employeeData, apiKey) {
  const axios = await import('axios');
  
  const prompt = `As an HR analytics expert, analyze this employee data and provide 2-3 actionable recommendations:

Employee Profile:
- Name: ${employeeData.name || 'Not specified'}
- Department: ${employeeData.department || 'Not specified'}
- Role: ${employeeData.role || 'Not specified'}
- Risk Level: ${employeeData.riskLevel || 'Medium'}
- Performance Score: ${employeeData.performanceScore || 'Not specified'}
- Tenure: ${employeeData.tenure || 'Not specified'} months
- Engagement Score: ${employeeData.engagementScore || 'Not specified'}
- Last Promotion: ${employeeData.lastPromotion || 'Not specified'}

Provide recommendations in this EXACT JSON array format:
[
  {
    "title": "Recommendation title",
    "type": "retention|development|training|mentorship|wellness",
    "action": "Specific actionable step",
    "timeline": "When to implement (e.g., Within 2 weeks)",
    "expectedImpact": "Expected outcome"
  }
]`;

  const response = await axios.default.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are an HR analytics expert. Return only valid JSON, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }
  );

  const content = response.data.choices[0].message.content;
  const parsed = JSON.parse(content);
  
  // Handle different possible response structures
  if (Array.isArray(parsed)) {
    return parsed;
  } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
    return parsed.recommendations;
  } else {
    // Try to extract array from response
    const arrayMatch = content.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return JSON.parse(arrayMatch[0]);
    }
    throw new Error('Could not parse recommendations from Groq response');
  }
}

/**
 * ORIGINAL FUNCTIONALITY - Your original recommendation logic
 * This is what your code did before any API integrations
 */
function generateOriginalRecommendations(employeeData) {
  console.log('Generating original recommendations for:', employeeData.name || 'Unknown employee');
  
  // Your original recommendation logic here
  // Based on employee risk level, department, etc.
  
  const recommendations = [
    {
      title: "Manager Check-in Meeting",
      type: "retention",
      action: "Schedule bi-weekly 1:1 meetings with direct manager",
      timeline: "Within 1 week",
      expectedImpact: "Improve communication and address concerns early"
    },
    {
      title: "Skills Development Plan",
      type: "development",
      action: "Create personalized learning path for career growth",
      timeline: "Within 2 weeks",
      expectedImpact: "Increase engagement and reduce flight risk"
    }
  ];
  
  // Add department-specific recommendations if needed
  if (employeeData.department === 'Engineering') {
    recommendations.push({
      title: "Technical Mentorship",
      type: "mentorship",
      action: "Pair with senior engineer for code review sessions",
      timeline: "Within 2 weeks",
      expectedImpact: "Improve technical skills and team integration"
    });
  }
  
  return recommendations;
}

/**
 * Fallback function (for backward compatibility)
 * This ensures your existing code that calls generateFallbackRecommendations still works
 */
function generateFallbackRecommendations(employeeData) {
  return generateOriginalRecommendations(employeeData);
}

  generateAIRecommendations,
  generateFallbackRecommendations


  generateAIRecommendations,
  generateFallbackRecommendations

module.exports = {
  generateAIRecommendations,
  generateFallbackRecommendations
};