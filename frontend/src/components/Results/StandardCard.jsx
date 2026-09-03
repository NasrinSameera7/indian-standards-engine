import React, { useState, useContext } from 'react';
import CertificationBadge from './CertificationBadge';
import VersionAlert from './VersionAlert';
import AlliedStandardsTree from './AlliedStandardsTree';
import { SearchContext } from '../../context/SearchContext';
import { CheckCircle } from 'lucide-react';

const StandardCard = ({ standard: result }) => {
  const [expanded, setExpanded] = useState(false);
  const { selectedStandards, setSelectedStandards } = useContext(SearchContext);
  
  // Extract data from the nested API response
  const standardInfo = result.standard || result; // Fallback in case it's already flat
  const score = result.score || result.relevance_score;
  const status = standardInfo.status || 'CURRENT';
  
  const isSelected = selectedStandards.some(s => s.id === standardInfo.id);
  
  const handleSelect = () => {
    if (isSelected) {
      setSelectedStandards(selectedStandards.filter(s => s.id !== standardInfo.id));
    } else {
      setSelectedStandards([...selectedStandards, standardInfo]);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'CURRENT') return 'bg-green-100 text-green-800';
    if (status === 'SUPERSEDED') return 'bg-amber-100 text-amber-800';
    if (status === 'WITHDRAWN') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    if (score >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 0.7) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-5 mb-4 transition-all
      ${isSelected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-gray-200 hover:shadow-md'}`}>
      
      <VersionAlert status={status} latestAmendment={standardInfo.latest_amendment} />
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{standardInfo.is_number}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
            {score !== undefined && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getScoreColor(score)}`}>
                {(score * 100).toFixed(0)}% match
              </span>
            )}
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">{standardInfo.title}</h4>
        </div>
        
        <button 
          onClick={handleSelect}
          className={`flex items-center justify-center p-2 rounded-md transition-colors ${
            isSelected ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
          title={isSelected ? "Remove from Specification" : "Add to Specification"}
        >
          <CheckCircle className={`h-6 w-6 ${isSelected ? 'fill-primary-100' : ''}`} />
          <span className="sr-only">Select</span>
        </button>
      </div>

      <div className="mb-4">
        <p className={`text-sm text-gray-600 ${!expanded ? 'line-clamp-2' : ''}`}>
          {standardInfo.scope || 'No scope information available for this standard.'}
        </p>
        {standardInfo.scope && standardInfo.scope.length > 150 && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-primary-600 text-sm font-medium mt-1 hover:underline"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        <CertificationBadge certification={result.certification_info || standardInfo.certification} />
      </div>

      {(result.allied_standards || standardInfo.allied_standards)?.length > 0 && (
        <AlliedStandardsTree allied={result.allied_standards || standardInfo.allied_standards} />
      )}
    </div>
  );
};

export default StandardCard;
