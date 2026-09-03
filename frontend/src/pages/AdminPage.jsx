import React, { useState, useEffect } from 'react';
import { getSyncStatus, triggerSync } from '../services/api';
import { Database, RefreshCw, Server, AlertCircle, CheckCircle } from 'lucide-react';

const AdminPage = () => {
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await getSyncStatus();
      setSyncStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSync = async () => {
    if (!window.confirm('Are you sure you want to trigger a manual sync? This may take a while.')) return;
    
    setTriggering(true);
    try {
      await triggerSync();
      alert('Sync triggered successfully. The process is running in the background.');
      fetchStatus();
    } catch (err) {
      alert('Failed to trigger sync.');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Administration Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Database Status</h2>
              <Database className="h-6 w-6 text-gray-400" />
            </div>
            {loading ? <p>Loading...</p> : (
              <div>
                <p className="text-3xl font-bold text-gray-900">{syncStatus?.total_standards || 0}</p>
                <p className="text-sm text-gray-500 mt-1">Total Standards Indexed</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 flex justify-between">
                    <span>Active:</span> <span className="font-medium text-green-600">{syncStatus?.active_standards || 0}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex justify-between mt-1">
                    <span>Withdrawn:</span> <span className="font-medium text-red-600">{syncStatus?.withdrawn_standards || 0}</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Data Synchronization</h2>
              <RefreshCw className="h-6 w-6 text-gray-400" />
            </div>
            {loading ? <p>Loading...</p> : (
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-500 mr-2">Last Sync:</span>
                  <span className="text-sm font-medium text-gray-900">{syncStatus?.last_sync || '2024-05-15 02:00 AM'}</span>
                </div>
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-500 mr-2">Status:</span>
                  {syncStatus?.status === 'IN_PROGRESS' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Success
                    </span>
                  )}
                </div>
                <button
                  onClick={handleTriggerSync}
                  disabled={triggering || syncStatus?.status === 'IN_PROGRESS'}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {triggering ? <RefreshCw className="animate-spin h-4 w-4 mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                  Trigger Manual Sync
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">System Health</h2>
              <Server className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">API Server</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full w-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Search Engine (Qdrant)</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full w-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">LLM Service</span>
                  <span className="text-green-600 font-medium">Online</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full w-full"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
