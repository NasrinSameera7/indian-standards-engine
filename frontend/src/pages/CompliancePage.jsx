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
    <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">Legacy Compliance Checker</h1>
        <p className="text-gray-700 font-medium mb-8">Upload an old procurement document (PDF/Word). Our AI will scan it against the latest BIS standards database and flag outdated references.</p>

        {!report && (
          <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-white/60 shadow-inner mb-6">
              <Upload className="h-12 w-12 text-indigo-600" />
            </div>
            
            <label className="block mb-6 cursor-pointer">
              <span className="sr-only">Choose file</span>
              <input type="file" className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2.5 file:px-6
                file:rounded-xl file:border-0
                file:text-sm file:font-bold
                file:bg-indigo-50 file:text-indigo-700
                file:shadow-sm file:cursor-pointer
                hover:file:bg-indigo-100 mx-auto max-w-xs transition-all"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </label>

            {file && <p className="text-sm font-bold text-gray-900 mb-6 bg-white/50 inline-block px-4 py-2 rounded-xl border border-white/80 shadow-sm">{file.name}</p>}
            <br />
            <button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="inline-flex justify-center items-center py-3 px-8 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:shadow-none transition-all"
            >
              {isAnalyzing ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
              {isAnalyzing ? 'Scanning Document...' : 'Run Compliance Scan'}
            </button>
          </div>
        )}

        {report && (
          <div className="space-y-6">
            <div className={`bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border p-6 flex items-start ${report.overall_status === 'COMPLIANT' ? 'border-green-200' : 'border-white/60'}`}>
              <div className="flex-shrink-0 pt-1">
                {report.overall_status === 'COMPLIANT' ? (
                  <CheckCircle className="h-8 w-8 text-green-500 drop-shadow-sm" />
                ) : (
                  <AlertTriangle className="h-8 w-8 text-orange-500 drop-shadow-sm" />
                )}
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900">Scan Complete: {report.filename}</h3>
                <p className={`mt-1 text-sm font-bold ${report.overall_status === 'COMPLIANT' ? 'text-green-700' : 'text-orange-600'}`}>
                  {report.overall_status === 'COMPLIANT' ? 'STATUS: PERFECTLY COMPLIANT' : 'STATUS: ' + report.overall_status.replace('_', ' ')}
                </p>
                <p className="mt-2 text-sm text-gray-700 font-medium">{report.summary}</p>
                
                <button onClick={() => setReport(null)} className="mt-4 text-sm font-bold text-indigo-700 hover:underline bg-white/40 px-3 py-1.5 rounded-lg border border-white/50 backdrop-blur-sm shadow-sm transition-colors">
                  Scan another document
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">Findings ({report.findings.length})</h3>
            
            <div className="space-y-4">
              {report.findings.map((finding, idx) => {
                const isPositive = report.overall_status === 'COMPLIANT';
                
                return (
                  <div key={idx} className={`bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border overflow-hidden ${isPositive ? 'border-green-200' : 'border-white/60'}`}>
                    <div className={`${isPositive ? 'bg-green-100/50' : 'bg-orange-100/50'} px-4 py-3 border-b border-white/40 flex justify-between items-center backdrop-blur-md`}>
                      <span className={`font-bold ${isPositive ? 'text-green-800' : 'text-orange-800'}`}>{finding.clause}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-white/50 ${isPositive ? 'bg-green-100/80 text-green-800' : 'bg-orange-100/80 text-orange-800'}`}>
                        {finding.issue}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`${isPositive ? 'bg-green-50/50' : 'bg-white/50'} p-3 rounded-xl border border-white/80 shadow-inner backdrop-blur-sm`}>
                          <p className={`text-xs font-bold mb-1 ${isPositive ? 'text-green-700' : 'text-gray-600'}`}>Found in Document:</p>
                          <p className={`text-sm font-medium ${isPositive ? 'text-green-900' : 'text-gray-800 line-through opacity-70'}`}>"{finding.extracted_text}"</p>
                        </div>
                        <div className="flex flex-col justify-center items-center text-gray-400 hidden md:flex" style={{ width: '20px', margin: '0 auto' }}>
                          <ArrowRight />
                        </div>
                        <div className={`${isPositive ? 'bg-green-100/50' : 'bg-indigo-50/50'} p-3 rounded-xl border border-white/80 shadow-inner backdrop-blur-sm`}>
                          <p className={`text-xs font-bold mb-1 ${isPositive ? 'text-green-700' : 'text-indigo-700'}`}>AI Verification:</p>
                          <p className={`text-sm font-medium ${isPositive ? 'text-green-900' : 'text-indigo-900'}`}>{finding.recommendation}</p>
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
