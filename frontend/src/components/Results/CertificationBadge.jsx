import React from 'react';
import { Shield } from 'lucide-react';

const CertificationBadge = ({ certification }) => {
  if (!certification) return null;

  const { type, isMandatory } = certification;
  
  let bgClass, textClass, label;
  
  switch(type) {
    case 'BIS_ISI':
      bgClass = 'bg-blue-100';
      textClass = 'text-blue-800 border-blue-200';
      label = 'ISI Mark';
      break;
    case 'CRS':
      bgClass = 'bg-orange-100';
      textClass = 'text-orange-800 border-orange-200';
      label = 'CRS Registration';
      break;
    case 'HALLMARK':
      bgClass = 'bg-yellow-100';
      textClass = 'text-yellow-800 border-yellow-200';
      label = 'Hallmark';
      break;
    default:
      bgClass = 'bg-gray-100';
      textClass = 'text-gray-800 border-gray-200';
      label = type;
  }

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgClass} ${textClass}`}>
      <Shield className="h-3 w-3 mr-1" />
      {label} {isMandatory ? '(Mandatory)' : '(Voluntary)'}
    </div>
  );
};

export default CertificationBadge;
