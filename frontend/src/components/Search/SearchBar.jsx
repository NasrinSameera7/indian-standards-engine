import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Mic, MicOff } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { SearchContext } from '../../context/SearchContext';
import { searchByText } from '../../services/api';

const SearchBar = () => {
  const [localQuery, setLocalQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [includeAllied, setIncludeAllied] = useState(true);
  const [topK, setTopK] = useState(10);
  const [isListening, setIsListening] = useState(false);
  
  const { setSearchResults, setSearchQuery, setIsLoading, isLoading, setDetectedLanguage } = useContext(SearchContext);
  const navigate = useNavigate();

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    // Hint speech recognition with the selected language if available
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setLocalQuery((prev) => prev ? prev + ' ' + transcript : transcript);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

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
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto space-y-4 bg-white/40 p-6 rounded-2xl shadow-lg border border-white/60 backdrop-blur-md">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-12 py-4 border border-white/80 rounded-xl leading-5 bg-white/60 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner backdrop-blur-sm font-medium text-gray-900 sm:text-lg transition-all"
          placeholder="Describe the product or try voice typing..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-indigo-600'}`}
          title="Voice Search"
        >
          {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-1/3">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
        
        <div className="flex items-center space-x-6 w-full sm:w-auto bg-white/40 px-4 py-2 rounded-xl border border-white/50 backdrop-blur-sm">
          <label className="flex items-center space-x-2 text-sm font-bold text-gray-700">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              checked={includeAllied}
              onChange={(e) => setIncludeAllied(e.target.checked)}
            />
            <span>Include Allied Standards</span>
          </label>
          
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-700 border-l border-white/40 pl-4">
            <span>Top Results: {topK}</span>
            <input
              type="range"
              min="5"
              max="20"
              step="5"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-24 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !localQuery.trim()}
          className="w-full sm:w-auto flex justify-center items-center py-2.5 px-8 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-all hover:-translate-y-0.5"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
