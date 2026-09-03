import React from 'react';

const SpecPreview = ({ spec }) => {
  if (!spec) return null;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 max-w-4xl mx-auto my-8">
      <div 
        className="prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none"
        contentEditable
        suppressContentEditableWarning
      >
        <h1 className="text-center text-2xl font-bold uppercase mb-8 border-b-2 border-black pb-4">
          {spec.title || 'TECHNICAL SPECIFICATION'}
        </h1>
        
        {spec.sections && spec.sections.length > 0 ? (
          spec.sections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{section.heading}</h2>
              <div className="whitespace-pre-line text-gray-700">
                {section.content}
              </div>
            </div>
          ))
        ) : spec.content ? (
          <div dangerouslySetInnerHTML={{ __html: spec.content }} />
        ) : (
          <p>No content generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default SpecPreview;
