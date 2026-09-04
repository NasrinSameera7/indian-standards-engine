import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import { generateSpec } from '../services/api';
import SpecPreview from '../components/SpecGenerator/SpecPreview';
import ExportButton from '../components/SpecGenerator/ExportButton';
import { FileText, ArrowLeft, Loader2, X, PlusCircle, ShoppingCart } from 'lucide-react';

const SpecGeneratorPage = () => {
  const { selectedStandards, setSelectedStandards, searchQuery } = useContext(SearchContext);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [tenderRef, setTenderRef] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [emdAmount, setEmdAmount] = useState('');
  const [bidDeadline, setBidDeadline] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [additionalReqs, setAdditionalReqs] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [generatedSpec, setGeneratedSpec] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (selectedStandards.length === 0) {
      alert("Please select at least one standard first.");
      return;
    }

    setIsGenerating(true);
    try {
      const standardIds = selectedStandards.map(s => s.id);
      const response = await generateSpec({
        title,
        standard_ids: standardIds,
        original_query: searchQuery,
        additional_requirements: additionalReqs,
        tender_reference: tenderRef,
        estimated_value: estimatedValue,
        emd_amount: emdAmount,
        bid_deadline: bidDeadline,
        delivery_location: deliveryLocation
      });
      setGeneratedSpec(response.data);
    } catch (error) {
      console.error("Error generating spec:", error);
      alert("Failed to generate specification. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishGeM = async () => {
    if (!window.confirm("Are you sure you want to push this draft to the Government e-Marketplace (GeM) portal?")) return;
    setIsPublishing(true);
    
    // Simulate API call to GeM
    setTimeout(() => {
      setIsPublishing(false);
      const gemId = "GEM/" + new Date().getFullYear() + "/B/" + Math.floor(Math.random() * 9000000 + 1000000);
      alert(`Success! Tender Draft has been pushed to GeM Integration Sandbox.\n\nGeM Bid Number: ${gemId}\n\nYou will now be redirected to the GeM portal to log in with your DSC and finalize the publication.`);
      
      // Redirect to actual GeM SSO login page in a new tab
      window.open("https://sso.gem.gov.in/ARXSSO/oauth/login", "_blank");
    }, 2000);
  };

  const removeStandard = (id) => {
    setSelectedStandards(selectedStandards.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/results')}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Results
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Selected Standards</h2>
              
              {selectedStandards.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-2">No standards selected.</p>
                  <button onClick={() => navigate('/search')} className="text-sm text-primary-600 hover:underline inline-flex items-center">
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Standards
                  </button>
                </div>
              ) : (
                <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {selectedStandards.map(std => (
                    <li key={std.id} className="flex justify-between items-start bg-gray-50 p-3 rounded text-sm">
                      <div>
                        <span className="font-semibold text-gray-900 block">{std.is_number}</span>
                        <span className="text-gray-500 text-xs line-clamp-1">{std.title}</span>
                      </div>
                      <button onClick={() => removeStandard(std.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={handleGenerate} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Govt Tender Details</h2>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tender Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. Procurement of Cement..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tender Ref No.</label>
                  <input type="text" value={tenderRef} onChange={(e) => setTenderRef(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. NIT/2026/01" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bid Deadline</label>
                  <input type="date" value={bidDeadline} onChange={(e) => setBidDeadline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estimated Value (₹)</label>
                  <input type="text" value={estimatedValue} onChange={(e) => setEstimatedValue(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 50,00,000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">EMD Amount (₹)</label>
                  <input type="text" value={emdAmount} onChange={(e) => setEmdAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. 1,00,000" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Location / Consignee</label>
                <input type="text" value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g. CPWD HQ, New Delhi" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Additional Tech Requirements</label>
                <textarea value={additionalReqs} onChange={(e) => setAdditionalReqs(e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Any specific clauses..." />
              </div>

              <button type="submit" disabled={isGenerating || selectedStandards.length === 0} className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
                {isGenerating ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
                Generate Draft SBD
              </button>
            </form>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-screen">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-lg font-medium text-gray-900">Document Preview</h2>
                
                {generatedSpec && (
                  <div className="flex space-x-3">
                    <button 
                      onClick={handlePublishGeM}
                      disabled={isPublishing}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:bg-orange-400"
                    >
                      {isPublishing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                      Publish to GeM
                    </button>
                    <ExportButton specId={generatedSpec.id} />
                  </div>
                )}
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                  <Loader2 className="animate-spin h-12 w-12 text-primary-500 mb-4" />
                  <p>Drafting Standard Bidding Document (SBD)...</p>
                  <p className="text-sm mt-2">This may take 30-60 seconds.</p>
                </div>
              ) : generatedSpec ? (
                <SpecPreview spec={generatedSpec} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FileText className="h-16 w-16 mb-4 text-gray-300" />
                  <p>Configure Govt Details and generate to see preview here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecGeneratorPage;
