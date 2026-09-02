import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  const value = {
    searchResults,
    setSearchResults,
    searchQuery,
    setSearchQuery,
    selectedStandards,
    setSelectedStandards,
    isLoading,
    setIsLoading,
    detectedLanguage,
    setDetectedLanguage,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
