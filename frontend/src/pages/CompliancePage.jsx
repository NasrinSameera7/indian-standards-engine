import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const CompliancePage = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("https://indian-standards-api.onrender.com/api/v1/compliance/analyze", formData);
      setReport(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Make sure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legacy Compliance Checker</h1>
        <p className="text-gray-600 mb-8">Upload an old procurement document (PDF/Word). Our AI will scan it against the latest BIS standards database and flag outdated references.</p>

        {!report && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-6">
              <Upload className="h-12 w-12 text-blue-600" />
            </div>
            
            <label className="block mb-6 cursor-pointer">
              <span className="sr-only">Choose file</span>
              <input type="file" className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 mx-auto max-w-xs"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </label>

            {file && <p className="text-sm font-medium text-gray-900 mb-6">Selected: {file.name}</p>}

            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isAnalyzing ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
              {isAnalyzing ? 'Scanning Document...' : 'Run Compliance Scan'}
            </button>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            <div className={`bg-white rounded-lg shadow-sm border p-6 flex items-start ${report.overall_status === 'COMPLIANT' ? 'border-green-200' : 'border-gray-200'}`}>
              <div className="flex-shrink-0 pt-1">
                {report.overall_status === 'COMPLIANT' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">Scan Complete: {report.filename}</h3>
                <p className={`mt-1 text-sm font-medium ${report.overall_status === 'COMPLIANT' ? 'text-green-700' : 'text-amber-700'}`}>
                  {report.overall_status === 'COMPLIANT' ? 'STATUS: PERFECTLY COMPLIANT' : 'STATUS: ' + report.overall_status.replace('_', ' ')}
                </p>
                <p className="mt-2 text-sm text-gray-500">{report.summary}</p>
                
                <button onClick={() => setReport(null)} className="mt-4 text-sm text-blue-600 hover:underline">
                  Scan another document
                </button>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900">Findings ({report.findings.length})</h3>
            
            <div className="space-y-4">
              {report.findings.map((finding, idx) => {
                const isPositive = report.overall_status === 'COMPLIANT';
                
                return (
                  <div key={idx} className={`bg-white rounded-lg shadow-sm border overflow-hidden ${isPositive ? 'border-green-200' : 'border-gray-200'}`}>
                    <div className={`${isPositive ? 'bg-green-50' : 'bg-amber-50'} px-4 py-3 border-b border-gray-200 flex justify-between items-center`}>
                      <span className={`font-semibold ${isPositive ? 'text-green-800' : 'text-amber-800'}`}>{finding.clause}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {finding.issue}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${isPositive ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-200'} p-3 rounded border`}>
                          <p className={`text-xs font-medium mb-1 ${isPositive ? 'text-green-700' : 'text-gray-500'}`}>Found in Document:</p>
                          <p className={`text-sm ${isPositive ? 'text-green-900' : 'text-gray-800 line-through opacity-70'}`}>"{finding.extracted_text}"</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-gray-400 hidden md:flex" style={{ width: '20px', margin: '0 auto' }}>
                          <ArrowRight />
                        </div>
                        <div className={`${isPositive ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'} p-3 rounded border`}>
                          <p className={`text-xs font-medium mb-1 ${isPositive ? 'text-green-700' : 'text-blue-600'}`}>AI Verification:</p>
                          <p className={`text-sm ${isPositive ? 'text-green-900' : 'text-blue-900'}`}>{finding.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompliancePage;
