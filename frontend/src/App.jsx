import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import SpecGeneratorPage from './pages/SpecGeneratorPage';
import AuditLogPage from './pages/AuditLogPage';
import AdminPage from './pages/AdminPage';
import CompliancePage from './pages/CompliancePage';

import ChatPage from './pages/ChatPage';

function App() {
  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-purple-100">
        {/* Global Decorative background blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-400/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-32 left-1/2 w-[500px] h-[500px] bg-indigo-400/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/spec-generator" element={<SpecGeneratorPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </SearchProvider>
  );
}

export default App;
