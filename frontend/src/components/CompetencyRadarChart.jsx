import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export const CompetencyRadarChart = ({ data }) => {
  const chartData = data || [
    { subject: 'Algorithms', value: 85, fullMark: 100 },
    { subject: 'System Design', value: 78, fullMark: 100 },
    { subject: 'Communication', value: 90, fullMark: 100 },
    { subject: 'Code Quality', value: 82, fullMark: 100 },
    { subject: 'STAR Behavioral', value: 88, fullMark: 100 },
    { subject: 'Problem Speed', value: 75, fullMark: 100 }
  ];

  return (
    <div className="w-full h-64 sm:h-72 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#CBD5E1" tick={false} />
          <Radar
            name="Candidate"
            dataKey="value"
            stroke="#E11D48"
            fill="#E11D48"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompetencyRadarChart;
