import React, { useState, useEffect } from 'react';
import { Columns, X, Loader2, Check } from 'lucide-react';
import axios from 'axios';

const CompareModal = ({ isOpen, onClose, standardIds }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && standardIds.length === 2) {
      setIsLoading(true);
      axios.get(`https://indian-standards-api.onrender.com/api/v1/standards/compare/two?id1=${standardIds[0]}&id2=${standardIds[1]}`)
        .then(res => {
          setData(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [isOpen, standardIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                  <Columns className="h-6 w-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    AI Standards Comparison
                  </h3>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="animate-spin h-12 w-12 text-purple-500 mb-4" />
                <p>AI is analyzing and comparing the technical clauses...</p>
              </div>
            ) : data ? (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-1/4">Feature</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-purple-800 bg-purple-50 w-3/8 border-l border-gray-200">
                        {data.standard1.is_number}
                        <div className="text-xs font-normal text-gray-500 mt-1">{data.standard1.title}</div>
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-800 bg-blue-50 w-3/8 border-l border-gray-200">
                        {data.standard2.is_number}
                        <div className="text-xs font-normal text-gray-500 mt-1">{data.standard2.title}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.comparison.map((row, idx) => (
                      <tr key={idx}>
                        <td className="whitespace-normal py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 bg-gray-50">{row.aspect}</td>
                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-700 border-l border-gray-200">{row.std1}</td>
                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-700 border-l border-gray-200">{row.std2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-red-500">Failed to load comparison.</p>
            )}
          </div>
          
          <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
