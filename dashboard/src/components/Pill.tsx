import React from 'react'

interface PillProps {
    label: string;
    value?: number;
    bgcolor?: string;
    onRemove?: () => void;
}

export const Pill: React.FC<PillProps> = ({
  label,
  value,
  bgcolor,
  onRemove,
}) => {
  return (
  <div className='px-3! py-1! rounded-full text-white text-xs font-bold bg-gray-600' style={{ backgroundColor: bgcolor }}>
    {!value ? label : label+ ' : '+ value}
    
    {onRemove && (
      <button className='py-0! pr-0! ml-2' onClick={onRemove}>
        ✕
      </button>
    )}
  </div>
  )
 };