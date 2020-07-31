import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';

const App = () => {
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3,
  });

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/sujeethjinesh/ckd9oal5j0eda1iten98lop2s'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    />
  );
};

export default App;
