import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import StandardCard from '../components/Results/StandardCard';
import { FileText, ArrowLeft, RefreshCw } from 'lucide-react';

const ResultsPage = () => {
  const { searchResults, searchQuery, detectedLanguage, selectedStandards, isLoading } = useContext(SearchContext);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => navigate('/search')}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search
          </button>
          
          {selectedStandards.length > 0 && (
            <button
              onClick={() => navigate('/spec-generator')}
              className="flex items-center px-4 py-2 bg-saffron text-white rounded-md shadow hover:bg-orange-500 transition-colors font-medium"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Spec ({selectedStandards.length})
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900">Search Results</h2>
          <div className="mt-2 text-sm text-gray-500">
            <p>Query: <span className="font-medium text-gray-800">"{searchQuery}"</span></p>
            {detectedLanguage && detectedLanguage !== 'en' && (
              <p>Detected Language: <span className="font-medium text-primary-600">{detectedLanguage}</span></p>
            )}
            <p>Found <span className="font-medium text-gray-800">{searchResults.length}</span> standards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters (Placeholder for future implementation) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filter By</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm text-gray-600"><input type="checkbox" className="mr-2" defaultChecked /> Current</label>
                    <label className="flex items-center text-sm text-gray-600"><input type="checkbox" className="mr-2" /> Superseded</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search terms or using broader keywords.</p>
              </div>
            ) : (
              searchResults.map((result) => (
                <StandardCard key={result.id} standard={result} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
