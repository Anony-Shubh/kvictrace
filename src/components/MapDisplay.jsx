import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const MapDisplay = ({ latitude, longitude, address }) => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-surface" aria-label="Location details">
        <div className="map-pin-wrap">
          <MapPin size={20} strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div className="map-text map-text-one">Location</div>
        <div className="map-text map-text-two">{address}</div>
      </div>
    );
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapCenter = {
    lat: latitude,
    lng: longitude,
  };

  const mapOptions = {
    zoom: 14,
    center: mapCenter,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  };

  if (loadError) {
    return (
      <div className="map-error">
        <p>Map failed to load.</p>
        <p className="map-address">{address}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={mapCenter}
      zoom={mapOptions.zoom}
      options={mapOptions}
    >
      <MarkerF
        position={mapCenter}
        title={address}
        icon={{
          path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
          fillColor: "#D32F2F",
          fillOpacity: 1,
          scale: 2,
          strokeColor: "#fff",
          strokeWeight: 2,
        }}
      />
    </GoogleMap>
  );
};

export default MapDisplay;
