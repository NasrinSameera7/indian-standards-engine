import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../services/api';
import AuditTable from '../components/AuditLog/AuditTable';
import { Download, Filter, Loader2, Calendar } from 'lucide-react';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  
  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      const response = await getAuditLogs(params);
      setLogs(response.data.logs || response.data || []);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Audit Log</h1>
            <p className="mt-2 text-sm text-gray-700">Detailed record of all system activities, queries, and document generations.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Filter className="h-4 w-4 mr-1" /> Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">All Actions</option>
              <option value="SEARCH">Search Query</option>
              <option value="DOCUMENT_UPLOAD">Document Upload</option>
              <option value="GENERATE_SPEC">Generate Specification</option>
              <option value="EXPORT_SPEC">Export Specification</option>
              <option value="SYNC_BIS_DATA">Sync BIS Data</option>
            </select>
          </div>
          
          <div className="w-full sm:w-64">
             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="h-4 w-4 mr-1" /> Date Range (mock)
            </label>
            <input type="date" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading audit records...</p>
          </div>
        ) : (
          <AuditTable logs={logs} />
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
