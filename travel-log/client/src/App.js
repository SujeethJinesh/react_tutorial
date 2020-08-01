import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { ReactComponent as MapPinRed } from './icons/map-pin-red.svg';
import { ReactComponent as MapPinYellow } from './icons/map-pin-yellow.svg';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState([]);
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.665,
    zoom: 3,
  });

  const getEntries = async () => {
    // since we can't make async requests in useEffect
    // (cause of race conditions), we need to use iife
    // iife is immediately invoked function expression

    // essentially this is an async function that is being run immediately
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
    console.log(logEntries);
  };

  // hook to make a request to our backend
  // if we see a cors issue, it means that on the backend we need to allow
  // http calls from the correct port, ie 3000 in this instance
  useEffect(() => {
    getEntries();
  }, []); // throw any dependencies in here, so technically setLogEntries

  const showAddMarkerPopup = (event) => {
    console.log(event);

    const [longitude, latitude] = event.lngLat;

    setAddEntryLocation({
      latitude,
      longitude,
    });
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
          <React.Fragment key={entry._id}>
            <Marker latitude={entry.latitude} longitude={entry.longitude}>
              <div
                onClick={() =>
                  setShowPopup({
                    [entry._id]: true,
                  })
                }
              >
                <MapPinYellow
                  className='marker'
                  style={{
                    height: `${6 * viewport.zoom}px`,
                    width: `${6 * viewport.zoom}px`,
                  }}
                  alt='marker'
                />
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
                  {!!entry.image ? (
                    <img src={entry.image} alt={entry.title}></img>
                  ) : null}
                </div>
              </Popup>
            ) : null}
          </React.Fragment>
        );
      })}
      {addEntryLocation ? (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <MapPinRed
                className='marker'
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                alt='marker'
              />
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor='top'
          >
            <div className='popup'>
              <LogEntryForm
                location={addEntryLocation}
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </ReactMapGL>
  );
};

export default App;
