import React, { useState } from 'react'
import type { PackageResult } from '../types'
import { getColor, getColorFromSeverity, getRiskFromLevel } from '../utils/colors'
import { ActionButton } from './ActionButton'
import { Pill } from './Pill';
import EducationalTooltip from './EducationalToolip';

interface TableProps {
    query: string;
    packages: PackageResult[],
}



export const PackagesTable: React.FC<TableProps> = ({ query, packages }) => {

  return (
    <div className='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-800'>
      <table className='table-auto border border-gray-500 rounded-lg border-separate border-spacing-0'>
        <thead className='font-light'>
          <tr className='text-base' >
            <th className='font-medium border-r border-gray-400 px-2 py-2'>Name</th>
            <th className='font-medium border-r border-gray-400 px-2 py-2'>Current Version</th>
            <th className='font-medium border-r border-gray-400 px-2 py-2'>Latest Version</th>
            <th className='font-medium border-r border-gray-400 px-2 py-2'>Days Since Update</th>
            
            <th className='font-medium border-r border-gray-400 px-2 py-2'>CVEs & CVSS Ratings</th>
            <th className='font-medium border-r border-gray-400 px-2 py-2'>Risk Level</th>
            <th className='font-medium border-gray-400 px-4 py-2'>pip command</th>
          </tr>
        </thead>
        <tbody>
          {packages.filter(p=>
            p.name.toLowerCase().includes(query)
          ).map((p, index) => {
            return (
            <tr key={index} className='text-sm border-b'>
              <td className='px-1 py-1.5 border-t border-gray-400'>{p.name}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>{p.current_version}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>{p.latest_version}</td>
              <td className='px-2 py-1.5 border-t border-gray-400'>
                {(p.days_since_update ?? 0) >= 180 ? (
                    <EducationalTooltip type="staleness" data={{ days: p.days_since_update, name: p.name }}>
                      {p.days_since_update}
                    </EducationalTooltip>
                  ) : (
                    p.days_since_update ?? '-'
                  )}
              </td>
              
              <td className='px-2 py-1.5 border-t border-gray-400 min-w-max'>
                <div className='flex flex-col gap-1'>
                {p.vulnerabilities.map((vuln, index) => {return (
                <div key={index} className='flex gap-1 justify-between'>
                  <p className='whitespace-nowrap'>{vuln.id}</p>
                  <EducationalTooltip
                    type="cve"
                    data={{ id: vuln.id, description: vuln.description, severity: vuln.severity, cvss_score: vuln.cvss_score, package: p.name, latest: p.latest_version }}>
                    <Pill bgcolor={getColorFromSeverity(vuln.severity)} label={(vuln.severity)}/>
                  </EducationalTooltip>
                </div>
                )})}
                </div>
                </td>
              <td className='px-2 py-1.5 border-t border-gray-400'><Pill bgcolor={getColor(p.risk_level)} label={getRiskFromLevel(p.risk_level)}/></td>
              <td className='px-2 py-1.5 border-t border-gray-400 flex justify-between'>{p.action} <ActionButton textToCopy={p.action}/></td>
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