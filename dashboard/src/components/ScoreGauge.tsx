// src/components/ScoreGauge.tsx
import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { getColor, getColorFromNumber, getRiskFromLevel } from '../utils/colors';
import { BreakdownBadges } from './BreakdownBadges';

interface ScoreGaugeProps {
    score: number;
    level: string;
    breakdown: { V: number; M: number; N: number };
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, level, breakdown }) => {
    const data = [{ name: 'V', value: breakdown.V, fill: getColorFromNumber(breakdown.V) }, { name: 'M', value: breakdown.M, fill: getColorFromNumber(breakdown.M) }, { name: 'N', value: breakdown.N, fill: getColorFromNumber(breakdown.N) }];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center p-4 bg-white rounded-lg shadow">
            <div style={{ width: '200px', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                        innerRadius="40%" 
                        outerRadius="80%" 
                        data={data} 
                        startAngle={180} 
                        endAngle={-180}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 100]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                        />
                        <text
                            x="52%"
                            y="52%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-bold text-2xl pt-2"
                            fill={getColor(level)}
                        >
                            {score}%
                        </text>
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-400">
                    Risk Level: <span style={{ color: getColor(level) }}>{getRiskFromLevel(level)}</span>
                </h3>
                <BreakdownBadges breakdown={breakdown} />
            </div>
        </div>
    );
};
