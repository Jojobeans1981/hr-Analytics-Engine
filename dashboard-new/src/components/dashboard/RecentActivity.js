"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const getRiskColor = (score) => {
    if (score > 7)
        return 'error';
    if (score > 4)
        return 'warning';
    return 'success';
};
const RecentActivity = ({ activities }) => {
    if (!activities || activities.length === 0) {
        return (<material_1.Typography variant="body1" color="textSecondary">
        No recent activities found
      </material_1.Typography>);
    }
    return (<material_1.TableContainer component={material_1.Paper}>
      <material_1.Table size="small">
        <material_1.TableHead>
          <material_1.TableRow>
            <material_1.TableCell>Employee</material_1.TableCell>
            <material_1.TableCell>Date</material_1.TableCell>
            <material_1.TableCell align="right">Risk</material_1.TableCell>
            <material_1.TableCell>Status</material_1.TableCell>
          </material_1.TableRow>
        </material_1.TableHead>
        <material_1.TableBody>
          {activities.map((activity) => (<material_1.TableRow key={activity._id}>
              <material_1.TableCell>{activity.employee?.name || 'Unknown'}</material_1.TableCell>
              <material_1.TableCell>
                {new Date(activity.assessmentDate).toLocaleDateString()}
              </material_1.TableCell>
              <material_1.TableCell align="right">
                <material_1.Chip label={activity.riskScore.toFixed(1)} color={getRiskColor(activity.riskScore)} size="small"/>
              </material_1.TableCell>
              <material_1.TableCell>
                <material_1.Chip label={activity.status} color={activity.status === 'completed' ? 'success' : 'warning'} size="small"/>
              </material_1.TableCell>
            </material_1.TableRow>))}
        </material_1.TableBody>
      </material_1.Table>
    </material_1.TableContainer>);
};
exports.default = RecentActivity;
