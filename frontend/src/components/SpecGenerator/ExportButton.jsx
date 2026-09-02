import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { exportSpec } from '../../services/api';

const ExportButton = ({ specId }) => {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);

  const handleExport = async (format) => {
    if (format === 'pdf') setLoadingPdf(true);
    else setLoadingDocx(true);

    try {
      const response = await exportSpec(specId, format);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `specification_${specId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      alert(`Failed to export ${format.toUpperCase()}`);
    } finally {
      if (format === 'pdf') setLoadingPdf(false);
      else setLoadingDocx(false);
    }
  };

  if (!specId) return null;

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => handleExport('pdf')}
        disabled={loadingPdf || loadingDocx}
        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
      >
        {loadingPdf ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
        Download PDF
      </button>
      <button
        onClick={() => handleExport('docx')}
        disabled={loadingPdf || loadingDocx}
        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
      >
        {loadingDocx ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
        Download DOCX
      </button>
    </div>
  );
};

export default ExportButton;
