import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Globe, Cpu } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
            <span className="block drop-shadow-sm">Welcome to</span>
            <span className="block text-indigo-700 drop-shadow-sm">INSPIRE</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-800 font-medium sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Instantly find the right BIS standards for your procurement specifications. Upload your documents or search by product description to get AI-curated standard recommendations.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center gap-4">
            <button
              onClick={() => navigate('/search')}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent shadow-lg text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all"
            >
              Start Searching
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border border-white/60">
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-orange-500 drop-shadow-sm">30,000+</p>
            <p className="mt-1 text-sm text-gray-700 uppercase tracking-wide font-semibold">Standards Indexed</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-indigo-700 drop-shadow-sm">15</p>
            <p className="mt-1 text-sm text-gray-700 uppercase tracking-wide font-semibold">Divisions Covered</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-4xl font-bold text-green-600 drop-shadow-sm">9</p>
            <p className="mt-1 text-sm text-gray-700 uppercase tracking-wide font-semibold">Languages Supported</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/30 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100/80 text-indigo-600 mb-4 shadow-inner">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">1. Search or Upload</h3>
              <p className="text-gray-700 font-medium">Enter a product description in any supported language or upload technical specifications.</p>
            </div>
            <div className="text-center bg-white/30 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100/80 text-orange-500 mb-4 shadow-inner">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">2. AI Analyzes</h3>
              <p className="text-gray-700 font-medium">Our semantic engine analyzes your intent and cross-references against the BIS database.</p>
            </div>
            <div className="text-center bg-white/30 backdrop-blur-sm p-8 rounded-2xl border border-white/50 shadow-sm transition-transform hover:-translate-y-1">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100/80 text-green-600 mb-4 shadow-inner">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">3. Generate Specs</h3>
              <p className="text-gray-700 font-medium">Select relevant standards and automatically generate a compliant procurement specification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
