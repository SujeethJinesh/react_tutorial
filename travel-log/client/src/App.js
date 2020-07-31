import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState([]);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3,
  });

  // hook to make a request to our backend
  // if we see a cors issue, it means that on the backend we need to allow
  // http calls from the correct port, ie 3000 in this instance
  useEffect(() => {
    // since we can't make async requests in useEffect
    // (cause of race conditions), we need to use iife
    // iife is immediately invoked function expression

    // essentially this is an async function that is being run immediately
    (async () => {
      const logEntries = await listLogEntries();
      setLogEntries(logEntries);
      console.log(logEntries);
    })();
  }, []); // throw any dependencies in here, so technically setLogEntries

  const showAddMarkerPopup = (event) => {
    console.log(event);
  };

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/sujeethjinesh/ckd9oal5j0eda1iten98lop2s'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => {
        // if you want to just return jsx,
        // use () without return instead of {} with return
        return (
          <>
            <Marker
              key={entry._id}
              latitude={entry.latitude}
              longitude={entry.longitude}
            >
              <div
                onClick={() =>
                  setShowPopup({
                    [entry._id]: true,
                  })
                }
              >
                <img
                  className='marker'
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  src='https://i.imgur.com/y0G5YTX.png'
                  alt='marker'
                ></img>
              </div>
            </Marker>
            {showPopup[entry._id] ? (
              <Popup
                latitude={entry.latitude}
                longitude={entry.longitude}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup({})}
                anchor='top'
                dynamicPosition={true}
              >
                <div className='popup'>
                  <h3>{entry.title}</h3>
                  <p>{entry.comments}</p>
                  <small>
                    Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                  </small>
                </div>
              </Popup>
            ) : null}
          </>
        );
      })}
    </ReactMapGL>
  );
};

export default App;
