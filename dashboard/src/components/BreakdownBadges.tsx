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
            {Object.entries(breakdown).map(([key, value]) => (
                <Pill label={key} value={value} bgcolor={getColorFromNumber(value)}/>
                )
            )}
        </div>
  )
}