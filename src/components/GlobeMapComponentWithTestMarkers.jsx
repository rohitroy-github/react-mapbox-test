import React, {useRef, useEffect, useState} from "react";
import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";

import testMarkers from "../assets/india-test-points.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW5vbWljMzAiLCJhIjoiY2tydnFkcTgyMDk5bjJ1bzJhOGRwdHdyYSJ9.sdeq4wN8AvZxrehZ12pazQ";

const Marker = ({onClick, children, feature}) => {
  const _onClick = () => {
    onClick(feature.properties.description);
  };

  return (
    <button onClick={_onClick} className="marker">
      {children}
    </button>
  );
};

const GlobeMapComponentWithTestMarkers = () => {
  const mapContainerRef = useRef(null);

  // settingCenter=India
  const [lng, setLng] = useState(78.8718);
  const [lat, setLat] = useState(21.7679);
  const [zoom, setZoom] = useState(1.5);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    // Render custom marker components
    testMarkers.features.forEach((feature) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement("div");
      // Render a Marker Component on our new DOM node
      ReactDOM.render(
        <Marker onClick={markerClicked} feature={feature} />,
        ref.current
      );

      // Create a Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const markerClicked = (title) => {
    window.alert(title);
  };

  return (
    <div>
      <div className="sidebar">
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};
export default GlobeMapComponentWithTestMarkers;
