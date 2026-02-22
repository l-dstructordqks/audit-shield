// src/utils/colors.ts
const colors = {
    GREEN: '#2D9B2B',
    YELLOW: '#FFD700',
    RED: '#B81D13'
}
export const getColorFromNumber = (score: number|undefined): string => {
    if (score >= 70) {
        return colors.RED;
    } else if (score >= 40) {
        return colors.YELLOW;
    } else if (score >= 0) {
        return colors.GREEN;
    } else {
        return '#7F8C8D';
    }
};

export const getColor = (level: string): string => {
    switch (level.toUpperCase()) {
        case 'GREEN': return colors.GREEN;
        case 'YELLOW': return colors.YELLOW;
        case 'RED': return colors.RED;
        default: return '#7F8C8D'; // UNKNOWN
    }
};


export const getRiskFromLevel = (level: string): string => {
    switch (level.toUpperCase()) {
        case 'GREEN': return 'NORMAL';
        case 'YELLOW': return 'WARNING';
        case 'RED': return 'CRITICAL ';
        default: return 'UNKNOWN'; // UNKNOWN
    }
};

