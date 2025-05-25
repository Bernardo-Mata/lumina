import React, { useState } from 'react';

const questions = [
  { key: 'product_type', label: 'What type of product are you registering?', placeholder: 'e.g., Appetizer, Auto, Dessert, Beverage, etc.' },
  { key: 'sku', label: 'What is the SKU code or unique identifier for the product?', placeholder: 'e.g., AUTO001, DISH150, etc.' },
  { key: 'unit_price', label: 'What is the unit price of the product?', placeholder: 'Indicate the currency as well' },
  { key: 'units_available', label: 'How many units of this product are currently available?', placeholder: 'e.g., 35 units' },
  { key: 'units_sold', label: 'How many units of this product have been sold?', placeholder: 'e.g., 500 units' },
  { key: 'total_revenue', label: 'How much total revenue has this product generated?', placeholder: 'e.g., $120,000 MXN or INR' },
  { key: 'main_demographic', label: 'What is the main demographic group of customers buying this product?', placeholder: 'e.g., Men, Women, Non-binary, Unknown' },
  { key: 'stock', label: 'How many units are currently in inventory (stock)?', placeholder: '' },
  { key: 'lead_time', label: 'How many days does it normally take to receive this product from the supplier? (Lead time in days)', placeholder: '' },
  { key: 'units_per_order', label: 'How many units are usually ordered per order?', placeholder: '' },
  { key: 'shipping_days', label: 'How many days does shipping take from the supplier to the final destination?', placeholder: '' },
  { key: 'shipping_company', label: 'Which company transports/ships this product?', placeholder: 'e.g., DHL, India Post, Blue Dart, etc.' },
  { key: 'average_shipping_cost', label: 'What is the average shipping cost per order?', placeholder: '' },
  { key: 'supplier_name', label: 'What is the name of the supplier or manufacturer of this product?', placeholder: '' },
  { key: 'location', label: 'In which city or locality is the product or supplier located?', placeholder: 'e.g., Guadalajara, Mumbai, Delhi, etc.' },
  { key: 'total_delivery_days', label: 'How many days does it take to receive the products from order to arrival?', placeholder: '(May be same as lead time or different)' },
  { key: 'units_per_batch', label: 'How many units are normally produced per batch or order?', placeholder: '' },
  { key: 'manufacturing_days', label: 'How many days does it take to manufacture this product? (If applicable)', placeholder: '' },
  { key: 'manufacturing_cost', label: 'What is the manufacturing cost per unit or batch?', placeholder: '' },
  { key: 'last_quality_inspection', label: 'What was the result of the last quality inspection for this product?', placeholder: 'e.g., Approved, Failed, Pending' },
  { key: 'defective_percentage', label: 'What is the percentage of defective products detected?', placeholder: 'e.g., 2.5%' },
  { key: 'main_transport_mode', label: 'What is the main mode of transport used to distribute this product?', placeholder: 'e.g., Road, Rail, Air' },
  { key: 'main_route', label: 'By which route or channel is this product normally transported?', placeholder: 'e.g., Route A, B or specific route name' },
  { key: 'total_cost', label: 'What is the approximate total cost associated with this product (logistics, production, etc.)?', placeholder: '' },
];

const ProductForm = ({ onSubmit, onBack, onCsvCreated }) => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [csvFilename, setCsvFilename] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  // Genera el CSV y lo sube al endpoint de upload_document
  const handleCreateCsv = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setCsvFilename(null);
    try {
      // 1. Genera el CSV y obtiene el blob
      const res = await fetch('http://127.0.0.1:8000/api/generate-csv-from-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Error generating CSV from JSON');
      const csvBlob = await res.blob();

      // 2. Usa un nombre de archivo generado (puedes mejorarlo si backend lo soporta)
      const filename = `product_${Date.now()}.csv`;

      // 3. Sube el CSV generado al endpoint de upload_document
      const file = new File([csvBlob], filename, { type: 'text/csv' });
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await fetch('http://127.0.0.1:8000/api/upload-document', {
        method: 'POST',
        body: uploadFormData,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) throw new Error(uploadJson.error || 'Error uploading generated CSV');
      setCsvFilename(uploadJson.filename);
      if (onCsvCreated) onCsvCreated(uploadJson.filename);
    } catch (err) {
      setErrorMsg(err.message || 'Error processing the form.');
    }
    setLoading(false);
  };

  // Genera insights usando el CSV ya subido
  const handleGenerateInsights = async () => {
    if (!csvFilename) {
      setErrorMsg('First create and upload the CSV.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const [
        dashboardRes,
        alertsRes,
        suppliersRes,
        complianceRes,
        riskScoresRes
      ] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/dashboard?filename=${encodeURIComponent(csvFilename)}`),
        fetch(`http://127.0.0.1:8000/api/alerts?filename=${encodeURIComponent(csvFilename)}`),
        fetch(`http://127.0.0.1:8000/api/suppliers?filename=${encodeURIComponent(csvFilename)}`),
        fetch(`http://127.0.0.1:8000/api/compliance?filename=${encodeURIComponent(csvFilename)}`),
        fetch(`http://127.0.0.1:8000/api/risk-scores?filename=${encodeURIComponent(csvFilename)}`)
      ]);
      const dashboardJson = await dashboardRes.json();
      const alertsJson = await alertsRes.json();
      const suppliersJson = await suppliersRes.json();
      const complianceJson = await complianceRes.json();
      const riskScoresJson = await riskScoresRes.json();

      if (onSubmit) {
        onSubmit({
          filename: csvFilename,
          dashboard: dashboardJson,
          alerts: alertsJson,
          suppliers: suppliersJson,
          compliance: complianceJson,
          riskScores: riskScoresJson
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error generating insights.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="font-bold text-2xl text-gray-800 mb-4">Product Information Form</h2>
      <form className="space-y-4" onSubmit={handleCreateCsv}>
        {questions.map(q => (
          <div key={q.key} className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">{q.label}</label>
            <input
              type="text"
              className="border rounded px-3 py-2"
              placeholder={q.placeholder}
              value={form[q.key] || ''}
              onChange={e => handleChange(q.key, e.target.value)}
            />
          </div>
        ))}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition font-semibold"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Create CSV'}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </button>
        </div>
      </form>
      {csvFilename && (
        <div className="mt-4 text-green-700 font-semibold">
          CSV created and uploaded as <span className="font-mono">{csvFilename}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 text-red-600 font-semibold">{errorMsg}</div>
      )}
      {/* Botón para generar insights */}
      <div className="mt-6 flex justify-center">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition font-semibold"
          onClick={handleGenerateInsights}
          disabled={loading || !csvFilename}
        >
          {loading ? 'Processing...' : 'Generate Insights'}
        </button>
      </div>
    </div>
  );
};

export default ProductForm;