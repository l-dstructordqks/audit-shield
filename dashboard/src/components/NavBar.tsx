import React, { useState } from 'react'
import { getColor, getRiskFromLevel } from '../utils/colors';
import type { Action, Color, Filters } from '../types/filter';
import { Pill } from './Pill';

const COLORS: Color[] = ["GREEN", "YELLOW", "RED"];
const action: Action = "not required";

interface FilterProps {
    onSearch: (value: string) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}


export const NavBar: React.FC<FilterProps> = ({ onSearch, filters, setFilters }) => {

    const toggleArrayFilter = <T,>(
        key: "colors" | "outdated" | "action",
        value: T
    ) => {
        setFilters((prev) => {
        const currentArray = prev[key] as T[];

        const updatedArray = currentArray.includes(value)
            ? currentArray.filter((v) => v !== value)
            : [...currentArray, value];

        return { ...prev, [key]: updatedArray };
        });
    };
    const toggleOutdated = () => {
        setFilters((prev) => ({
        ...prev,
        outdated: !prev.outdated,
        }));
    };

    const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
      <div className='flex flex-col'>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
            </div>
            <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5" placeholder="Search packages..." onChange={(e) => onSearch(e.target.value)}/>
          </div>

          <div className="relative w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            
            <button type="button" className="flex items-center justify-center text-white bg-gray-900 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2" onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"></path></svg>
              Filtros
            </button>

            {isOpen && (
              <div className='absolute text-black top-full right-0 border-solid flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-bold'>
                {COLORS.map((c) => (
                <button
                    className='hover:bg-gray-100'
                    key={c}
                    onClick={() => toggleArrayFilter("colors", c)}
                >
                    {getRiskFromLevel(c)}
                </button>
                ))}

                <button 
                    className='hover:bg-gray-100'
                    onClick={() => toggleArrayFilter("action", action)}
                >
                    ACTION REQUIRED
                </button>
                
                <button className='hover:bg-gray-100'
                    onClick={toggleOutdated}
                >
                    OUTDATED
                </button>
            </div>
            )}
          </div>
          
        </div>
        <div className='flex gap-2 px-4 pb-3'>
            {filters.colors.map((c) => (
                <Pill
                key={c}
                label={c}
                bgcolor={getColor(c)}
                onRemove={() => toggleArrayFilter("colors", c)}
                />
            
            ))}

            {filters.action.length > 0 && (
            <Pill
                label="ACTION REQUIRED"
                onRemove={() => toggleArrayFilter("action", action)}
            />
            )}

            {filters.outdated && (
            <Pill label="OUTDATED" onRemove={toggleOutdated} />
            )}
        </div>
      </div>
    </div>

  )
}
