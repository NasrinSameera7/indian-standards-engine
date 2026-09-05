import React, { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import FileUpload from '../components/Search/FileUpload';

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">Find Indian Standards</h1>
          <p className="text-gray-700 font-medium">Search by description or upload a document to get intelligent recommendations.</p>
        </div>

        <div className="bg-white/40 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-2xl mb-8 border border-white/60">
          <div className="border-b border-white/40">
            <nav className="-mb-px flex justify-center" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('text')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'text' 
                    ? 'border-indigo-500 text-indigo-700' 
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
              >
                Text Search
              </button>
              <button
                onClick={() => setActiveTab('document')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'document' 
                    ? 'border-indigo-500 text-indigo-700' 
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'}`}
              >
                Document Upload
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'text' ? <SearchBar /> : <FileUpload />}
          </div>
        </div>

        {activeTab === 'text' && (
          <div className="mt-8 bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Examples</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white/60 shadow-inner border border-white text-gray-800 text-sm rounded-full cursor-pointer hover:bg-white/80 transition-colors">Packaged drinking water</span>
              <span className="px-3 py-1 bg-white/60 shadow-inner border border-white text-gray-800 text-sm rounded-full cursor-pointer hover:bg-white/80 transition-colors">Lithium-ion batteries for electric vehicles</span>
              <span className="px-3 py-1 bg-white/60 shadow-inner border border-white text-gray-800 text-sm rounded-full cursor-pointer hover:bg-white/80 transition-colors">Cement for coastal construction</span>
              <span className="px-3 py-1 bg-white/60 shadow-inner border border-white text-gray-800 text-sm rounded-full cursor-pointer hover:bg-white/80 transition-colors">सौर पैनल (Solar panels)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
