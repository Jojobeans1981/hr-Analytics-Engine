// dataEnhancer.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

class DataEnhancer {
    constructor() {
        this.client = new MongoClient(process.env.MONGODB_URI);
        this.skillsList = {
            technical: [
                'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript', 
                'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL',
                'Machine Learning', 'Data Analysis', 'DevOps', 'CI/CD', 'Git',
                'HTML/CSS', 'REST APIs', 'Microservices', 'Cloud Architecture'
            ],
            soft: [
                'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
                'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
                'Conflict Resolution', 'Presentation Skills', 'Strategic Thinking'
            ]
        };
    }

    async enhanceEmployeeData() {
        await this.client.connect();
        const db = this.client.db();
        const employeesCollection = db.collection('employees');
        
        const employees = await employeesCollection.find().toArray();
        console.log(`🔄 Enhancing data for ${employees.length} employees...\n`);

        let skillsCreated = 0;
        let promotionsFixed = 0;

        for (const employee of employees) {
            // 1. Generate realistic skills data for employees missing it
            await this.generateSkillsData(employee);
            skillsCreated++;

            // 2. Fix missing promotion dates with realistic estimates
            if (!employee.lastPromotion) {
                await this.estimateLastPromotion(employee);
                promotionsFixed++;
            }

            // Update every 10 employees to show progress
            if (skillsCreated % 10 === 0) {
                console.log(`✅ Enhanced ${skillsCreated} employees...`);
            }
        }

        console.log(`\n🎉 DATA ENHANCEMENT COMPLETE:`);
        console.log(`   📚 Skills data created for: ${skillsCreated} employees`);
        console.log(`   📅 Promotion dates estimated for: ${promotionsFixed} employees`);

        await this.client.close();
    }

    async generateSkillsData(employee) {
        const db = this.client.db();
        const skillsCollection = db.collection(' Skills Inventory');

        // Check if skills data already exists
        const existingSkills = await skillsCollection.findOne({ 
            $or: [
                { employeeId: employee.employeeId },
                { employeeId: employee.email },
                { 'employee.email': employee.email }
            ]
        });

        if (existingSkills) {
            return; // Skills already exist
        }

        // Generate realistic skills based on role and department
        const technicalSkills = this.generateTechnicalSkills(employee.role, employee.department);
        const softSkills = this.generateSoftSkills(employee.role);

        const skillsDocument = {
            employeeId: employee.employeeId || employee.email,
            employeeName: employee.name,
            employeeEmail: employee.email,
            technicalSkills: technicalSkills,
            softSkills: softSkills,
            certifications: this.generateCertifications(employee.role),
            lastUpdated: new Date(),
            skillsVersion: '1.0'
        };

        await skillsCollection.insertOne(skillsDocument);
    }

    generateTechnicalSkills(role, department) {
        const skills = [];
        const roleSkills = this.getRoleBasedSkills(role, department);
        
        // Select 4-8 skills based on role
        const skillCount = 4 + Math.floor(Math.random() * 4);
        const selectedSkills = this.shuffleArray(roleSkills).slice(0, skillCount);
        
        selectedSkills.forEach(skill => {
            const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            const level = levels[Math.floor(Math.random() * levels.length)];
            const lastUsed = new Date();
            lastUsed.setMonth(lastUsed.getMonth() - Math.floor(Math.random() * 24));
            
            skills.push({
                skill: skill,
                level: level,
                lastUsed: lastUsed,
                yearsOfExperience: (1 + Math.random() * 5).toFixed(1)
            });
        });

        return skills;
    }

    getRoleBasedSkills(role, department) {
        const roleMap = {
            'Engineering': ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Git', 'SQL', 'REST APIs'],
            'Sales': ['CRM', 'Salesforce', 'Negotiation', 'Presentation Skills', 'Market Analysis', 'Client Management'],
            'Marketing': ['SEO', 'Google Analytics', 'Content Strategy', 'Social Media', 'AB Testing', 'Marketing Automation'],
            'HR': ['Recruitment', 'Employee Relations', 'HRIS', 'Performance Management', 'Training & Development'],
            'Finance': ['Financial Analysis', 'Excel', 'Accounting', 'Budgeting', 'Financial Modeling', 'Risk Management']
        };

        // Default to department-based skills if role not specific
        return roleMap[department] || roleMap['Engineering'];
    }

    generateSoftSkills(role) {
        const skills = [];
        const allSoftSkills = this.shuffleArray([...this.skillsList.soft]);
        
        // Select 3-5 soft skills
        const skillCount = 3 + Math.floor(Math.random() * 2);
        const selectedSkills = allSoftSkills.slice(0, skillCount);
        
        selectedSkills.forEach(skill => {
            const levels = ['Developing', 'Proficient', 'Advanced', 'Expert'];
            const level = levels[Math.floor(Math.random() * levels.length)];
            
            skills.push({
                skill: skill,
                level: level
            });
        });

        return skills;
    }

    generateCertifications(role) {
        const certs = [];
        const possibleCerts = [
            'AWS Certified Solutions Architect',
            'Google Cloud Professional',
            'Scrum Master Certified',
            'PMP Certification',
            'Salesforce Certified',
            'Microsoft Certified: Azure Fundamentals'
        ];

        // 30% chance of having a certification
        if (Math.random() < 0.3) {
            const cert = possibleCerts[Math.floor(Math.random() * possibleCerts.length)];
            certs.push({
                name: cert,
                dateObtained: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Within last year
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Next year
            });
        }

        return certs;
    }

    async estimateLastPromotion(employee) {
        const db = this.client.db();
        const employeesCollection = db.collection('employees');

        // Estimate promotion date based on tenure and performance
        const tenure = employee.tenure || 2;
        const performance = employee.performanceScore || 3.5;
        
        // High performers get promoted more frequently
        let monthsSincePromotion;
        if (performance >= 4.5) {
            monthsSincePromotion = 6 + Math.random() * 12; // 6-18 months ago
        } else if (performance >= 4.0) {
            monthsSincePromotion = 12 + Math.random() * 12; // 12-24 months ago
        } else {
            monthsSincePromotion = 18 + Math.random() * 18; // 18-36 months ago
        }

        const lastPromotion = new Date();
        lastPromotion.setMonth(lastPromotion.getMonth() - monthsSincePromotion);

        await employeesCollection.updateOne(
            { _id: employee._id },
            { $set: { lastPromotion: lastPromotion } }
        );
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Run the data enhancement
async function main() {
    console.log('🚀 STARTING DATA ENHANCEMENT...\n');
    console.log('This will generate realistic skills and promotion data');
    console.log('for employees missing this information.\n');
    
    const enhancer = new DataEnhancer();
    await enhancer.enhanceEmployeeData();
    
    console.log('\n✅ Data enhancement complete!');
    console.log('Run the balanced risk scorer next: node balancedRiskScorer.js');
}

main().catch(console.error);