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

function App() {
  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/spec-generator" element={<SpecGeneratorPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}

export default App;
