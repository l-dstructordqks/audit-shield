import React from 'react';
import { getColorFromNumber } from '../utils/colors';
import { Pill } from './Pill';

interface BreakdownProps {
    breakdown: {
        V?: number;
        M?: number;
        N?: number;
    };
}

export const BreakdownBadges: React.FC<BreakdownProps> = ({ breakdown }) => {
    return (
        <div className="flex gap-2 justify-center mt-2">
            {Object.entries(breakdown).map(([key, value], index) => (
                <Pill key={index} label={key} value={value} bgcolor={getColorFromNumber(value)}/>
                )
            )}
        </div>
  )
}