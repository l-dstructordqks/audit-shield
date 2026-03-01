import React, { useState } from 'react'
import type { EndpointSummary } from '../types'
import { getColor } from '../utils/colors'
import { Pill } from './Pill';

interface EndpointSummaryProps {
    endpoints: EndpointSummary[],
}
/* Sample data
const endpointData: EndpointSummary[] = [
  { ip: "192.168.1.15", total_bytes: 45200, request_count: 120, is_suspicious: 0 },
  { ip: "45.79.102.33", total_bytes: 890400, request_count: 5400, is_suspicious: 1 },
  { ip: "10.0.0.5", total_bytes: 1240, request_count: 12, is_suspicious: 0 },
  { ip: "185.220.101.42", total_bytes: 256000, request_count: 890, is_suspicious: 1 },
  { ip: "172.16.254.1", total_bytes: 15670, request_count: 45, is_suspicious: 0 },
  { ip: "8.8.8.8", total_bytes: 3200, request_count: 8, is_suspicious: 0 },
  { ip: "103.21.244.0", total_bytes: 1250000, request_count: 12400, is_suspicious: 1 }
];
*/


export const EndpointSummaryTable: React.FC<EndpointSummaryProps> = ({ endpoints }) => {

  return (
    <div className='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-800'>
      <table className='table-auto border border-gray-500 rounded-lg border-separate border-spacing-0'>
        <thead className='font-light'>
          <tr className='text-base' >
            <th className='font-medium border-r border-gray-400 px-4 py-2'>Ip</th>
            <th className='font-medium border-r border-gray-400 px-4 py-2'>Protocol</th>
            <th className='font-medium border-r border-gray-400 px-4 py-2'>Total Bytes</th>
            <th className='font-medium border-r border-gray-400 px-4 py-2'>Requests</th>
            <th className='font-medium border-r border-gray-400 px-4 py-2'>Is Suspicious</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((e) => {
            return (
            <tr className='text-sm border-b'>
              <td className='px-2 py-1.5 border-t border-gray-400'>{e.ip}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>{e.protocol}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>{e.total_bytes}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>{e.request_count}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>
                <Pill 
                    bgcolor={(() =>{
                        if (e.is_suspicious) {
                            return getColor('RED');
                        }
                        return getColor('UNKNOWN')
                        })()} 
                    label={(() =>{
                        if (e.is_suspicious) {
                            return "SUSPICIOUS";
                        }
                        return "KNOWN CDN"
                    })()}
                />
              </td>
              
            </tr>
            )
          })}
          <tr>

          </tr>
        </tbody>
      </table>
    </div>
  )
}