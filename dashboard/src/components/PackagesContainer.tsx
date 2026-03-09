import React, { useMemo, useState } from 'react'
import type { Filters } from '../types/filter';
import { PackagesTable } from './PackagesTable';
import { NavBar } from './NavBar';
import { useLocation } from 'react-router';
import RiskDistributionChart from './RiskDistributionChart';
import { ScoreGauge } from './ScoreGauge';
import { TrafficTwinChart } from './TrafficTwinChart';
import { EndpointSummaryTable } from './EndpointSummary';



export const PackagesContainer: React.FC = () => {

  const location = useLocation();
  const { data } = location.state || {};

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
        colors: [],
        outdated: false,
        action: "",
    });

  if (data?.packages && data?.timeseries) {
    //console.log(data);
    //console.log('lalalla');
    

    const filteredData = useMemo(() => {
      return data.packages.filter((item) => {
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
    }, [filters, data.packages]);

    
    return (
      <div className='flex flex-col gap-2'>
        <h2
          className="text-3xl font-black tracking-tight text-gray-900 leading-none mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Supply Chain & Network Traffic<span className="text-red-500"> Analysis</span>
        </h2>
        <RiskDistributionChart packages={filteredData}/>
        <NavBar onSearch={setQuery} filters={filters} setFilters={setFilters}/>
        <PackagesTable query={query} packages={filteredData}/>
        <TrafficTwinChart baseline={data.baseline} timeseries={data.timeseries}/>
        <EndpointSummaryTable endpoints={data.endpoints}/>
        <ScoreGauge score={data.audit_score} level={data.audit_level} breakdown={data.breakdown} />
    </div>
    );
  } else if (data?.packages) {
    //console.log(data);
    

    const filteredData = useMemo(() => {
      return data.packages.filter((item) => {
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
    }, [filters, data.packages]);

    
    return (
      <div className='flex flex-col gap-2'>
        <h2
          className="text-3xl font-black tracking-tight text-gray-900 leading-none mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Supply Chain<span className="text-red-500"> Analysis</span>
        </h2>
        <RiskDistributionChart packages={filteredData}/>
        <NavBar onSearch={setQuery} filters={filters} setFilters={setFilters}/>
        <PackagesTable query={query} packages={filteredData}/>
        <ScoreGauge score={data.audit_score} level={data.audit_level} breakdown={data.breakdown} />
      </div>
    );
  } else if (data?.timeseries) {
    //console.log('lalalla net');
    return (
      <div className='flex flex-col gap-2'>
        <h2
          className="text-3xl font-black tracking-tight text-gray-900 leading-none mb-4"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Network Traffic<span className="text-red-500"> Analysis</span>
        </h2>
        <TrafficTwinChart baseline={data.baseline} timeseries={data.timeseries}/>
        <EndpointSummaryTable endpoints={data.endpoints}/>
      </div>
    )
  } else {
    return (
      <div>No data available</div>
    )
  }
  // data.timeseries

  /*return (
    <div className='flex flex-col gap-2'>
        <RiskDistributionChart packages={filteredData}/>
        <NavBar onSearch={setQuery} filters={filters} setFilters={setFilters}/>
        <PackagesTable query={query} packages={filteredData}/>
        <ScoreGauge score={data.audit_score} level={data.audit_level} breakdown={data.breakdown} />
    </div>
  )*/
}