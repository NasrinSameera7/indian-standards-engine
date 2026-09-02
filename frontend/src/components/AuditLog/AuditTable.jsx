import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AuditTable = ({ logs }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!logs || logs.length === 0) {
    return <div className="text-center py-8 text-gray-500">No audit logs found.</div>;
  }

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Timestamp</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Action</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Entity Type</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Session</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Details</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {logs.map((log) => (
            <React.Fragment key={log.id}>
              <tr className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                  {log.action}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {log.session_id ? `${log.session_id.substring(0, 8)}...` : '-'}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                    className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                  >
                    Details
                    {expandedRow === log.id ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </button>
                </td>
              </tr>
              {expandedRow === log.id && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm">
                      <h4 className="font-semibold text-gray-700 mb-2">Details JSON:</h4>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
