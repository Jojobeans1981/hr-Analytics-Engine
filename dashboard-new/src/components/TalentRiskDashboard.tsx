import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Users, TrendingUp, TrendingDown, Plus, X, AlertTriangle, Briefcase, Smile, Gauge, Edit,
    Zap, Calendar, Clock, BarChart3, ChevronDown, ChevronUp, ScrollText, Code, Database
} from 'lucide-react';

// --- API CONFIGURATION ---
// Automatically detects environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
        ? 'https://your-railway-backend.com/api' 
        : 'http://localhost:5000/api');

// --- API SERVICE FUNCTIONS ---
const apiService = {
    async getEmployees() {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching employees:', error);
            return [];
        }
    },

    async getHighRiskEmployees(threshold = 70) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/high-risk?threshold=${threshold}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching high-risk employees:', error);
            return [];
        }
    },

    async getRiskMetrics() {
        try {
            const response = await fetch(`${API_BASE_URL}/risk/dashboard-metrics`, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching metrics:', error);
            return null;
        }
    },

    async createEmployee(employeeData: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    },

    async updateEmployee(employeeId: string, employeeData: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    },

    async deleteEmployee(employeeId: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }
};

// --- RISK CALCULATION UTILITIES ---
const calculateRiskScore = (performance: number, engagement: number, tenure: number, assessmentScore: number) => {
    let score = 0;
    score += (5 - performance) * 7.5; 
    score += (5 - engagement) * 7.5; 
    
    if (tenure < 1) {
        score += 20;
    } else if (tenure >= 1 && tenure <= 3) {
        score += 10;
    }
    
    score += (100 - assessmentScore) * 0.2; 
    return Math.min(Math.max(Math.round(score), 0), 100);
};

const getRiskLevel = (score: number) => {
    if (score > 60) return 'High';
    if (score > 30) return 'Medium';
    return 'Low';
};

const getRiskColor = (level: string) => {
    switch (level) {
        case 'High': return 'bg-red-500/20 text-red-400 border-red-500';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
        case 'Low': return 'bg-teal-500/20 text-teal-400 border-teal-500';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
};

const getSuggestions = (employee: any) => {
    const suggestions = [];
    
    if (employee.performance <= 2) {
        suggestions.push("Structured coaching: Implement a 90-day performance improvement plan.");
    }
    
    if (employee.engagement <= 2) {
        suggestions.push("Stay Interview: Schedule a dedicated discussion to understand challenges and aspirations.");
    }

    if (employee.assessmentScore < 70) {
        suggestions.push(`Targeted Training: Enroll in programs to improve competencies (${employee.assessmentScore}%).`);
    }

    if (employee.tenure < 1) {
        suggestions.push("Onboarding Review: Re-evaluate onboarding and assign senior mentor.");
    }

    if (employee.riskScore > 80) {
        suggestions.push("Leadership Review: Flag for urgent review by departmental leadership.");
    }

    if (suggestions.length === 0) {
        suggestions.push("Maintain current development plan and check in quarterly.");
    }

    return suggestions;
};

// --- SKILL TAG INPUT COMPONENT ---
const SkillTagInput = ({ skills, setSkills }: { skills: string[]; setSkills: (skills: string[]) => void }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (['Enter', ',', 'Tab'].includes(e.key)) {
            e.preventDefault();
            const newSkill = inputValue.trim();
            if (newSkill && !skills.includes(newSkill)) {
                setSkills([...skills, newSkill]);
                setInputValue('');
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                {skills.map((skill, index) => (
                    <div 
                        key={index} 
                        className="flex items-center bg-teal-600 text-white text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer hover:bg-teal-500 transition duration-150"
                        onClick={() => removeSkill(skill)}
                    >
                        {skill}
                        <X size={12} className="ml-1" />
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add skills, press Enter"
                    className="flex-grow min-w-[100px] bg-transparent outline-none text-sm placeholder-gray-400"
                />
            </div>
        </div>
    );
};

// --- ADD/EDIT EMPLOYEE MODAL ---
const AddEmployeeModal = ({ isVisible, onClose, onSave, initialData = null }: any) => {
    const isEdit = !!initialData;
    
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        role: initialData?.role || '',
        tenure: initialData?.tenure || 1,
        performance: initialData?.performance || 3,
        engagement: initialData?.engagement || 3,
        assessmentScore: initialData?.assessmentScore || 75,
    });
    
    const [skills, setSkills] = useState(initialData?.skills || []);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setFormData({
                name: initialData?.name || '',
                role: initialData?.role || '',
                tenure: initialData?.tenure || 1,
                performance: initialData?.performance || 3,
                engagement: initialData?.engagement || 3,
                assessmentScore: initialData?.assessmentScore || 75,
            });
            setSkills(initialData?.skills || []);
            setError(null);
        }
    }, [isVisible, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const { name, role, tenure, performance, engagement, assessmentScore } = formData;

            if (!name || !role || performance < 1 || performance > 5 || engagement < 1 || engagement > 5 || 
                tenure < 0 || assessmentScore < 0 || assessmentScore > 100) {
                setError("Please fill all fields correctly.");
                setSaving(false);
                return;
            }

            const riskScore = calculateRiskScore(
                parseInt(String(performance)), 
                parseInt(String(engagement)), 
                parseFloat(String(tenure)), 
                parseInt(String(assessmentScore))
            );

            const employeeData = {
                ...formData,
                skills: skills.map(s => s.trim()).filter(s => s.length > 0),
                riskScore,
                riskLevel: getRiskLevel(riskScore),
            };

            await onSave(employeeData, isEdit ? initialData._id : null);
            onClose();
        } catch (err) {
            setError((err as Error).message || 'Failed to save employee');
        } finally {
            setSaving(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-teal-600">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                    <h2 className="text-2xl font-bold text-teal-300">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>
                
                {error && <p className="text-red-400 mb-4 bg-red-900/50 p-2 rounded-lg">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <input type="text" name="role" value={formData.role} onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" required />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tenure (Years)</label>
                            <input type="number" name="tenure" value={formData.tenure} onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" min="0" step="0.1" required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Assessment Score (0-100%)</label>
                            <input type="number" name="assessmentScore" value={formData.assessmentScore} onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" min="0" max="100" required />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Performance (1-5)</label>
                            <input type="number" name="performance" value={formData.performance} onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" min="1" max="5" required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Engagement (1-5)</label>
                            <input type="number" name="engagement" value={formData.engagement} onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white" min="1" max="5" required />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                            <Code size={16} className="mr-1 text-teal-400" /> Key Skills
                        </label>
                        <SkillTagInput skills={skills} setSkills={setSkills} />
                    </div>

                    <button type="submit" disabled={saving}
                        className="w-full py-2 px-4 rounded-lg text-white font-semibold bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 transition">
                        {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Employee')}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, icon: Icon, colorClass, description }: any) => (
    <div className={`p-4 rounded-xl shadow-lg border ${colorClass} bg-gray-800/50`}>
        <div className="flex items-center justify-between">
            <Icon size={32} className="text-current" />
            <span className="text-3xl font-extrabold">{value}</span>
        </div>
        <h3 className="text-lg font-semibold mt-2 text-gray-200">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
);

// --- RISK INDICATOR COMPONENT ---
const RiskIndicator = ({ score, level }: any) => (
    <div className={`flex items-center justify-center p-1 rounded-full border text-sm font-medium w-24 ${getRiskColor(level)}`}>
        <Gauge size={14} className="mr-1" />
        {level}
    </div>
);

// --- HIGH RISK LIST COMPONENT ---
const HighRiskList = ({ highRiskEmployees, onEdit }: any) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-red-700/50">
            <h3 className="text-xl font-bold text-red-400 flex items-center mb-4">
                <AlertTriangle size={20} className="mr-2" />
                High Risk Employees ({highRiskEmployees.length})
            </h3>
            <div className="space-y-4">
                {highRiskEmployees.length > 0 ? (
                    highRiskEmployees.map((emp: any) => (
                        <div key={emp._id} className="p-4 bg-gray-900 rounded-lg border border-red-600/30">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-lg font-semibold text-white">{emp.name}</p>
                                    <p className="text-sm text-gray-400">{emp.role}</p>
                                </div>
                                <button onClick={() => onEdit(emp)} 
                                    className="text-teal-400 hover:text-teal-300 p-1 rounded hover:bg-gray-700 transition">
                                    <Edit size={16} />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-300 mb-3">
                                <span className="flex items-center"><Clock size={12} className="mr-1 text-teal-400" /> {emp.tenure} Yrs</span>
                                <span className="flex items-center"><BarChart3 size={12} className="mr-1 text-teal-400" /> Perf: {emp.performance}</span>
                                <span className="flex items-center"><Smile size={12} className="mr-1 text-teal-400" /> Eng: {emp.engagement}</span>
                                <span className="flex items-center"><ScrollText size={12} className="mr-1 text-teal-400" /> Assess: {emp.assessmentScore}%</span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1 mb-3">
                                {emp.skills && emp.skills.map((skill: string, index: number) => (
                                    <span key={index} className="px-2 py-0.5 text-xs font-medium bg-teal-800/50 text-teal-300 rounded-full border border-teal-700/50">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <RiskIndicator score={emp.riskScore} level={emp.riskLevel} />

                            <p className="font-semibold text-red-300 mt-3 mb-2 flex items-center">
                                <Zap size={16} className="mr-1" />
                                Actions:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                                {getSuggestions(emp).map((suggestion: string, index: number) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No high-risk employees. Excellent!</p>
                )}
            </div>
        </div>
    );
};

// --- MAIN APPLICATION COMPONENT ---
export const TalentRiskDashboard = () => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<any>(null);
    const [metrics, setMetrics] = useState<any>(null);
    const [sortBy, setSortBy] = useState('riskScore');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Initial data fetch
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [employeesData, metricsData] = await Promise.all([
                    apiService.getEmployees(),
                    apiService.getRiskMetrics()
                ]);

                // Process employees data
                const processedEmployees = (Array.isArray(employeesData) ? employeesData : employeesData.data || []).map((emp: any) => {
                    let riskScore = emp.riskScore;
                    if (!riskScore && emp.balancedRiskScore) {
                        riskScore = Math.round(emp.balancedRiskScore * 100);
                    }
                    if (!riskScore) {
                        riskScore = calculateRiskScore(emp.performance || 3, emp.engagement || 3, emp.tenure || 1, emp.assessmentScore || 75);
                    }
                    
                    return {
                        ...emp,
                        riskScore: riskScore,
                        riskLevel: emp.riskLevel || getRiskLevel(riskScore),
                        skills: emp.skills || [],
                        performance: emp.performance || 3,
                        engagement: emp.engagement || 3,
                        tenure: emp.tenure || 1,
                        assessmentScore: emp.assessmentScore || 75,
                    };
                });

                setEmployees(processedEmployees);
                setMetrics(metricsData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Calculate derived metrics
    const { totalEmployees, avgRiskScore, highRiskCount, highRiskEmployees } = useMemo(() => {
        const total = employees.length;
        if (total === 0) return { totalEmployees: 0, avgRiskScore: 0, highRiskCount: 0, highRiskEmployees: [] };

        const totalRisk = employees.reduce((sum, emp) => sum + (emp.riskScore || 0), 0);
        const avgRisk = Math.round(totalRisk / total);
        
        const highRiskList = employees
            .filter(emp => emp.riskLevel === 'High')
            .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

        return {
            totalEmployees: total,
            avgRiskScore: avgRisk,
            highRiskCount: highRiskList.length,
            highRiskEmployees: highRiskList,
        };
    }, [employees]);

    // Sorting logic
    const sortedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            const multiplier = sortOrder === 'desc' ? -1 : 1;
            return ((aValue || 0) - (bValue || 0)) * multiplier;
        });
    }, [employees, sortBy, sortOrder]);

    // Save employee handler
    const handleSaveEmployee = async (employeeData: any, employeeId?: string) => {
        try {
            if (employeeId) {
                await apiService.updateEmployee(employeeId, employeeData);
            } else {
                await apiService.createEmployee(employeeData);
            }
            
            // Refresh data
            const updatedEmployees = await apiService.getEmployees();
            const processedEmployees = (Array.isArray(updatedEmployees) ? updatedEmployees : updatedEmployees.data || []).map((emp: any) => ({
                ...emp,
                riskScore: emp.riskScore || calculateRiskScore(emp.performance || 3, emp.engagement || 3, emp.tenure || 1, emp.assessmentScore || 75),
                riskLevel: emp.riskLevel || getRiskLevel(emp.riskScore || 0),
                skills: emp.skills || [],
            }));
            setEmployees(processedEmployees);
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Failed to save employee');
        }
    };

    const handleEditEmployee = (employee: any) => {
        setEditingEmployee(employee);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEmployee(null);
    };

    if (loading) {
        return (
            <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-teal-400 text-xl">Loading talent risk data...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 flex items-center">
                        <Users size={40} className="mr-3 text-teal-400" />
                        Talent Risk Dashboard
                    </h1>
                    <p className="text-gray-400">Real-time talent risk assessment powered by MongoDB</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Total Employees"
                        value={totalEmployees}
                        icon={Users}
                        colorClass="border-teal-600/50 text-teal-400"
                        description="Active workforce"
                    />
                    <StatCard
                        title="Average Risk"
                        value={`${avgRiskScore}%`}
                        icon={Gauge}
                        colorClass="border-blue-600/50 text-blue-400"
                        description="Organization-wide"
                    />
                    <StatCard
                        title="High Risk"
                        value={highRiskCount}
                        icon={AlertTriangle}
                        colorClass="border-red-600/50 text-red-400"
                        description="Require attention"
                    />
                    <StatCard
                        title="API Status"
                        value="Live"
                        icon={Database}
                        colorClass="border-green-600/50 text-green-400"
                        description={`Connected to ${API_BASE_URL}`}
                    />
                </div>

                {/* High Risk Section */}
                <div className="mb-8">
                    <HighRiskList highRiskEmployees={highRiskEmployees} onEdit={handleEditEmployee} />
                </div>

                {/* All Employees Section */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-teal-600/30">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
                        <h3 className="text-xl font-bold text-teal-300">All Employees</h3>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition"
                        >
                            <Plus size={18} className="mr-1" /> Add Employee
                        </button>
                    </div>

                    {/* Sorting Controls */}
                    <div className="mb-4 flex gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        >
                            <option value="riskScore">Risk Score</option>
                            <option value="name">Name</option>
                            <option value="tenure">Tenure</option>
                            <option value="performance">Performance</option>
                            <option value="engagement">Engagement</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white text-sm transition"
                        >
                            {sortOrder === 'desc' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                    </div>

                    {/* Employees Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-4 text-gray-300">Name</th>
                                    <th className="text-left py-3 px-4 text-gray-300">Role</th>
                                    <th className="text-center py-3 px-4 text-gray-300">Tenure</th>
                                    <th className="text-center py-3 px-4 text-gray-300">Perf/Eng</th>
                                    <th className="text-center py-3 px-4 text-gray-300">Assessment</th>
                                    <th className="text-center py-3 px-4 text-gray-300">Risk</th>
                                    <th className="text-center py-3 px-4 text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedEmployees.map((emp: any) => (
                                    <tr key={emp._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                                        <td className="py-3 px-4">{emp.name}</td>
                                        <td className="py-3 px-4 text-gray-400">{emp.role}</td>
                                        <td className="py-3 px-4 text-center">{emp.tenure} yrs</td>
                                        <td className="py-3 px-4 text-center">{emp.performance}/{emp.engagement}</td>
                                        <td className="py-3 px-4 text-center">{emp.assessmentScore}%</td>
                                        <td className="py-3 px-4 text-center">
                                            <RiskIndicator score={emp.riskScore} level={emp.riskLevel} />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => handleEditEmployee(emp)}
                                                className="text-teal-400 hover:text-teal-300 transition"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                <AddEmployeeModal
                    isVisible={showModal}
                    onClose={handleCloseModal}
                    onSave={handleSaveEmployee}
                    initialData={editingEmployee}
                />
            </div>
        </div>
    );
};

export default TalentRiskDashboard;
