import React, { useState } from 'react';
import SearchBar from '../components/Search/SearchBar';
import FileUpload from '../components/Search/FileUpload';

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Find Indian Standards</h1>
          <p className="text-gray-600">Search by description or upload a document to get intelligent recommendations.</p>
        </div>

        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex justify-center" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('text')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'text' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Text Search
              </button>
              <button
                onClick={() => setActiveTab('document')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors
                  ${activeTab === 'document' 
                    ? 'border-primary-500 text-primary-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
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
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Examples</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200">Packaged drinking water</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200">Lithium-ion batteries for electric vehicles</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200">Cement for coastal construction</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full cursor-pointer hover:bg-gray-200">सौर ऊर्जा पैनल (Solar panels)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
