import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Globe, Cpu } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-saffron/10 via-white to-india_green/10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6">
            <span className="block">AI-Powered</span>
            <span className="block text-primary-600">Indian Standards Engine</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Instantly find the right BIS standards for your procurement specifications. Upload your documents or search by product description to get AI-curated standard recommendations.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
            <button
              onClick={() => navigate('/search')}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Start Searching
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border border-gray-100">
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-saffron">30,000+</p>
            <p className="mt-1 text-sm text-gray-500 uppercase tracking-wide font-medium">Standards Indexed</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-navy">15</p>
            <p className="mt-1 text-sm text-gray-500 uppercase tracking-wide font-medium">Divisions Covered</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-india_green">9</p>
            <p className="mt-1 text-sm text-gray-500 uppercase tracking-wide font-medium">Languages Supported</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Search or Upload</h3>
              <p className="text-gray-500">Enter a product description in any supported language or upload technical specifications.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-saffron/20 text-saffron mb-4">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. AI Analyzes</h3>
              <p className="text-gray-500">Our semantic engine analyzes your intent and cross-references against the BIS database.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-india_green/20 text-india_green mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Generate Specs</h3>
              <p className="text-gray-500">Select relevant standards and automatically generate a compliant procurement specification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
