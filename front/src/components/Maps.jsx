import React from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Maps = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <>
        <style>{`
          .maps-error {
            color: #ef4444;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 1rem;
            padding: 2rem;
            margin: 2rem auto;
            max-width: 500px;
            text-align: center;
            font-size: 1.1rem;
          }
        `}</style>
        <div className="maps-error">
          Google Maps API key is missing. Please set{" "}
          <b>REACT_APP_GOOGLE_MAPS_API_KEY</b> in your .env file.
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .maps-bg {
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
        }
        .maps-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .maps-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .maps-logo {
          width: 2.5rem;
          height: 2.5rem;
          background: #2563eb;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .maps-logo-icon {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .maps-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.01em;
        }
        .maps-card {
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px #0001;
          border: 1px solid #e5e7eb;
          padding: 2rem 1.5rem;
          margin-bottom: 2rem;
        }
        .maps-card-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2563eb;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .maps-iframe-container {
          width: 100%;
          height: 400px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px #0002;
        }
        @media (max-width: 768px) {
          .maps-container {
            padding: 0 0.5rem;
          }
          .maps-header {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          .maps-title {
            font-size: 1.3rem;
          }
          .maps-card {
            padding: 1rem;
          }
          .maps-iframe-container {
            height: 250px;
          }
        }
      `}</style>
      <div className="maps-bg">
        <div className="maps-container">
          <div className="maps-header">
            <div className="maps-logo">
              <span className="maps-logo-icon">🗺️</span>
            </div>
            <h1 className="maps-title">Maps</h1>
          </div>
          <div className="maps-card">
            <h2 className="maps-card-title">Ubicación de Operaciones</h2>
            <div className="maps-iframe-container">
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=19.432608,-99.133209&zoom=12&maptype=roadmap`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maps;
