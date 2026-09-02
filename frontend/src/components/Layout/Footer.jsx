import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">Indian Standards Recommendation Engine &copy; 2024</p>
            <p className="text-xs text-gray-400">Powered by BIS Data</p>
          </div>
          <div>
            <p className="text-sm">Contact: support@standardsengine.gov.in</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
