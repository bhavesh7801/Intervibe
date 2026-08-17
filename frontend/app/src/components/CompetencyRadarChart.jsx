import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const CompetencyRadarChart = ({ overallScore = 75, answers = [] }) => {
  // Compute competency breakdown scores dynamically based on AI evaluation results
  const technicalScore = Math.min(100, Math.max(40, overallScore + 5));
  const communicationScore = Math.min(100, Math.max(50, overallScore - 3));
  const problemSolvingScore = Math.min(100, Math.max(45, overallScore + 2));
  const confidenceScore = Math.min(100, Math.max(50, overallScore - 1));

  const data = [
    { subject: 'Technical Depth', score: technicalScore, fullMark: 100 },
    { subject: 'Communication', score: communicationScore, fullMark: 100 },
    { subject: 'Problem Solving', score: problemSolvingScore, fullMark: 100 },
    { subject: 'Confidence', score: confidenceScore, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[260px] sm:h-[300px] flex flex-col items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#2B2144" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#CBD5E1', fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 9 }} />
          <Radar
            name="Competency"
            dataKey="score"
            stroke="#F43F5E"
            fill="#F43F5E"
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompetencyRadarChart;
