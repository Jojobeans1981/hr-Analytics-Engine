        <div className="summary-card intervention">
          <h3>Ìª°Ô∏è Preventive Measures</h3>
          <div className="recommendations-preview">
            <p><strong>{departmentAnalysis.reduce((sum, dept) => sum + dept.suggestedInterventions.length, 0)} interventions recommended</strong></p>
            {departmentAnalysis.slice(0, 2).map(dept => (
              dept.suggestedInterventions.length > 0 && (
                <div key={dept.name} className="dept-recommendations">
                  <p><strong>{dept.name}:</strong> {dept.suggestedInterventions[0]}</p>
                </div>
              )
            ))}
          </div>
          <p className="impact-note">Estimated retention impact: 23-40% improvement potential</p>
        </div>
