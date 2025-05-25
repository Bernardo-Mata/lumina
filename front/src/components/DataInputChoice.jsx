import React from 'react';

const DataInputChoice = ({ onChoose, onGenerateInsights, uploadStatus }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <h3 className="font-bold text-lg text-gray-800 mb-4">How would you like to provide your company data?</h3>
    <div className="flex gap-6">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition font-semibold"
        onClick={() => onChoose('upload')}
      >
        Upload Database File
      </button>
      <button
        className={`px-6 py-3 rounded shadow font-semibold ${
          uploadStatus === 200
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        onClick={uploadStatus === 200 ? onGenerateInsights : undefined}
        disabled={uploadStatus !== 200}
      >
        Generate Insights
      </button>
      <button
        className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition font-semibold"
        onClick={() => onChoose('form')}
      >
        Fill Out Company Form
      </button>
    </div>
    {uploadStatus && uploadStatus !== 200 && (
      <div className="mt-4 text-red-600 font-semibold">
        Please upload a valid document before generating insights.
      </div>
    )}
  </div>
);

export default DataInputChoice;