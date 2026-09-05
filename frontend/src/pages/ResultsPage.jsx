import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import StandardCard from '../components/Results/StandardCard';
import { FileText, ArrowLeft, RefreshCw, Columns } from 'lucide-react';
import CompareModal from '../components/Standards/CompareModal';

const ResultsPage = () => {
  const { searchResults, searchQuery, detectedLanguage, selectedStandards, isLoading } = useContext(SearchContext);
  const navigate = useNavigate();
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing query and searching standard database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/search')}
            className="flex items-center text-sm font-semibold text-gray-700 hover:text-indigo-700 bg-white/40 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search
          </button>
          
          <div className="flex space-x-3">
            {selectedStandards.length === 2 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-colors font-bold"
              >
                <Columns className="h-4 w-4 mr-2" />
                Compare Standards
              </button>
            )}
            {selectedStandards.length > 0 && (
              <button
                onClick={() => navigate('/spec-generator')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 transition-colors font-bold"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Spec ({selectedStandards.length})
              </button>
            )}
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 drop-shadow-sm">Search Results</h2>
          <div className="mt-2 text-sm text-gray-700 font-medium">
            <p>Query: <span className="font-bold text-gray-900">"{searchQuery}"</span></p>
            {detectedLanguage && detectedLanguage !== 'en' && (
              <p>Detected Language: <span className="font-bold text-indigo-700">{detectedLanguage}</span></p>
            )}
            <p>Found <span className="font-bold text-gray-900">{searchResults.length}</span> standards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters (Placeholder for future implementation) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Filter By</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 mb-2">Status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700"><input type="checkbox" className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked /> Current</label>
                    <label className="flex items-center text-sm font-medium text-gray-700"><input type="checkbox" className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /> Superseded</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 border-dashed">
                <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-gray-900">No results found</h3>
                <p className="text-gray-700 mt-1 font-medium">Try adjusting your search terms or using broader keywords.</p>
              </div>
            ) : (
              searchResults.map((result) => (
                <StandardCard key={result.id} standard={result} />
              ))
            )}
          </div>
        </div>
        
        <CompareModal 
          isOpen={isCompareOpen} 
          onClose={() => setIsCompareOpen(false)} 
          standardIds={selectedStandards.map(s => s.id)} 
        />
      </div>
    </div>
  );
};

export default ResultsPage;
