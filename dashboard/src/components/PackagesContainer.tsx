import React, { useMemo, useState } from 'react'
import type { PackageResult } from '../types';
import type { Filters } from '../types/filter';
import { PackagesTable } from './PackagesTable';
import { NavBar } from './NavBar';

const test_data: PackageResult[] = [
    {
      name: "lodash",
      days_since_update: 10,
      is_outdated: false,
      vulnerabilities: [],
      risk_level: 'GREEN',
      action: 'not required'
    },
    {
      name: "podash",
      days_since_update: 10,
      is_outdated: true,
      vulnerabilities: [],
      risk_level: 'GREEN',
      action: 'update fds dfsdf fs  s'
    },
    {
      name: "podash",
      days_since_update: 10,
      is_outdated: true,
      vulnerabilities: [],
      risk_level: 'YELLOW',
      action: 'update fds dfsdf fs  s'
    },
    {
      name: "podash",
      days_since_update: 10,
      is_outdated: false,
      vulnerabilities: [],
      risk_level: 'RED',
      action: 'not required'
    }
];

export const PackagesContainer: React.FC = () => {

    const [filters, setFilters] = useState<Filters>({
        colors: [],
        outdated: false,
        action: "",
    });

    const filteredData = useMemo(() => {
        return test_data.filter((item) => {
          const colorMatch =
            filters.colors.length === 0 ||
            filters.colors.includes(item.risk_level);
        
          const outdatedMatch =
            !filters.outdated || item.is_outdated === true;
            
          const actionMatch =
            filters.action.length === 0 ||
            !filters.action.includes(item.action);
    
          return colorMatch && outdatedMatch && actionMatch;
        });
      }, [filters]);
      const [query, setQuery] = useState("");

  return (
    <div className='flex flex-col gap-2'>
        <NavBar onSearch={setQuery} filters={filters} setFilters={setFilters}/>
        <PackagesTable query={query} packages={filteredData}/>
    </div>
  )
}