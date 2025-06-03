import React from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;


const Maps = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ color: "red", padding: "2rem" }}>
        Google Maps API key is missing. Please set{" "}
        <b>REACT_APP_GOOGLE_MAPS_API_KEY</b> in your .env file.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 12px #0002",
      }}
    >
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
  );
};

export default Maps;