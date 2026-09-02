import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { SearchContext } from '../../context/SearchContext';
import { searchByText } from '../../services/api';

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [includeAllied, setIncludeAllied] = useState(true);
  const [topK, setTopK] = useState(10);
  
  const { setSearchResults, setSearchQuery, setIsLoading, isLoading, setDetectedLanguage } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!localQuery.trim()) return;

    setIsLoading(true);
    setSearchQuery(localQuery);

    try {
      const response = await searchByText({
        query: localQuery,
        top_k: topK,
        include_allied: includeAllied,
        language_hint: language || null,
      });
      setSearchResults(response.data.results || []);
      setDetectedLanguage(response.data.detected_language || null);
      navigate('/results');
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-lg"
          placeholder="Describe the product or paste technical specifications..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/3">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        
        <div className="flex items-center space-x-6 w-full sm:w-auto">
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
              checked={includeAllied}
              onChange={(e) => setIncludeAllied(e.target.checked)}
            />
            <span>Include Allied Standards</span>
          </label>
          
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <span>Top Results: {topK}</span>
            <input
              type="range"
              min="5"
              max="20"
              step="5"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-24 accent-primary-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !localQuery.trim()}
          className="w-full sm:w-auto flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
