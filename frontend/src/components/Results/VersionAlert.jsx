import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

const VersionAlert = ({ status, latestAmendment }) => {
  if (status === 'CURRENT' && !latestAmendment) return null;

  if (status === 'SUPERSEDED') {
    return (
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              This standard has been superseded by a newer version.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'WITHDRAWN') {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Warning: This standard has been withdrawn and is no longer active.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (latestAmendment) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Note: This standard has amendments up to Amendment No. {latestAmendment}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VersionAlert;
