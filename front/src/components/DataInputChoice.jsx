import React from 'react';

const DataInputChoice = ({ onChoose }) => (
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
        className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition font-semibold"
        onClick={() => onChoose('form')}
      >
        Fill Out Company Form
      </button>
    </div>
  </div>
);

export default DataInputChoice;