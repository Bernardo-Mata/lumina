import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import Alerts from './Alerts';
import Suppliers from './Suppliers';
import Compilance from './Compilance';
import RiskScores from './RiskScores';
import ProductForm from './ProductForm';
import DataInputChoice from './DataInputChoice';
import Dashboard from './Dashboard';

// Función para obtener N elementos aleatorios de un array
function getRandomItems(arr, n) {
  if (!Array.isArray(arr)) return [];
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const Summary = (props) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [inputMode, setInputMode] = useState(null);
  const [csvFilename, setCsvFilename] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Subir documento
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload-document', {
        method: 'POST',
        body: formData,
      });
      setUploadStatus(res.status);
      const json = await res.json();
      setUploadResult(json);
      if (json.success) setCsvFilename(json.filename);
    } catch (err) {
      setUploadResult({ success: false, error: 'Error uploading the file.' });
    }
    setUploading(false);
  };

  // Cuando el formulario genera y sube el CSV
  const handleCsvCreated = (filename) => {
    setCsvFilename(filename);
    setUploadStatus(200);
    setInputMode(null); // Regresa al menú principal para poder presionar Generate Insights
  };

  // Render principal
  if (!inputMode) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Map className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Summary</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <DataInputChoice
            onChoose={setInputMode}
            onGenerateInsights={() => alert('Aquí iría la lógica para generar insights usando el archivo subido o generado.')}
            uploadStatus={uploadStatus}
          />
        </div>
      </div>
    );
  }

  if (inputMode === 'upload') {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Map className="text-blue-500 mr-2" size={28} />
          <h2 className="font-bold text-2xl text-gray-800">Summary</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">Upload a Document</h3>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setInputMode(null)}
            >
              Back
            </button>
          </div>
          <form onSubmit={handleFileUpload} className="flex flex-col gap-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.csv,.doc,.docx,.json,.txt"
              className="border rounded p-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </form>
          {uploadResult && (
            <div className="mt-4">
              {uploadResult.success ? (
                <div className="text-green-600 font-semibold">
                  {uploadResult.message}
                </div>
              ) : (
                <div className="text-red-500">{uploadResult.error}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (inputMode === 'form') {
    return (
      <ProductForm
        onBack={() => setInputMode(null)}
        onCsvCreated={handleCsvCreated}
      />
    );
  }

  return null;
};

export default Summary;