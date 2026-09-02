import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText } from 'lucide-react';

const AlliedStandardsTree = ({ allied }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!allied || allied.length === 0) return null;

  // Group by type
  const grouped = allied.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {});

  return (
    <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-700 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Allied Standards ({allied.length})
        </span>
        {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-white">
          {Object.entries(grouped).map(([type, standards]) => (
            <div key={type} className="mb-4 last:mb-0">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase">{type}</h4>
              <ul className="space-y-2">
                {standards.map(std => (
                  <li key={std.id} className="text-sm p-2 hover:bg-gray-50 rounded flex justify-between items-start">
                    <div>
                      <span className="font-medium text-primary-600 hover:underline cursor-pointer">{std.is_number}</span>
                      <p className="text-gray-500 text-xs mt-0.5">{std.title}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{std.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlliedStandardsTree;
