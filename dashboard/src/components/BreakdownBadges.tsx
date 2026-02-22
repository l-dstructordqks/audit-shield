import React from 'react';
import { getColorFromNumber } from '../utils/colors';

interface BreakdownProps {
    breakdown: {
        V?: number;
        M?: number;
        N?: number;
    };
}

export const BreakdownBadges: React.FC<BreakdownProps> = ({ breakdown }) => {
    const badges = [
        { label: 'V', value: breakdown.V || 0, color: getColorFromNumber(breakdown.V) },
        { label: 'M', value: breakdown.M || 0, color: getColorFromNumber(breakdown.M) },
        { label: 'N', value: breakdown.N || 0, color: getColorFromNumber(breakdown.N) },
    ];
    return (
        <div className="flex gap-2 justify-center mt-2">
            {badges.map((b) => (
                <span 
                    key={b.label}
                    className="px-2 py-1 rounded-full text-white text-xs font-bold"
                    style={{ backgroundColor: b.color }}
                >
                    {b.label}: {b.value}
                </span>
            ))}
        </div>
  )
}