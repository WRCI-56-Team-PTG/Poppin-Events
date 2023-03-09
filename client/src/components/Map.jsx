import '../stylesheets/App.css';
import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

import axios from 'axios';
import MarkerCreator from './MarkerCreator';
import { UserContext } from './UserContext';
import EventList from './EventList.jsx';
import EventInfo from './EventInfo.jsx';

function Map() {
  // state for map center positioning
  const [mapPos, setMapPos] = useState({
    lat: 37.772,
    lng: -122.431,
  });

  // state for the data for marker from the database
  const [markerData, setMarkerData] = useState([]);

  // state for event data that user is attending
  const [userEventList, setUserEventList] = useState([10]);

  // state to display the event data to the page after clicking a marker
  const [eventData, setEventData] = useState(null);

  // get the userID from the context
  // userID is used to determine if the user is the creator of the event
  const { user } = useContext(UserContext);
  const [updating, setUpdating] = useState(false);
  // in-the-works refactor to clarify userID vs eventID from .id
  const userID = user === null ? null : user.id;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load the script for google maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    // we don't think this is actually used, but removing it breaks EVERYTHING?!
    libraries: ['places'],
  });

  // get all marker data from database on mount
  useEffect(() => {
    try {
      // Get all events and throw into state
      const getEvents = async () => {
        const response = await axios.get('/api/events');
        const { data } = response;
        setMarkerData(data);
      } 
      getEvents()
    } catch (e) {
      console.log('error in getEvents: ', e.message);
    }

      // get all events that user is attending and throw into state
    try {
      const getUserEventData = async (userId) => {
        const response = await axios.get(`/api/userEventData/${userId}`);
        const { data } = response;
        setUserEventList(data);
      };
      getUserEventData(user.id);
    } catch (e) {
      console.log('error in getUserEventData: ', e.message);
    }

    // get current user location and set the center of the map to that location
    if (navigator.geolocation) {
      // native browser geolocation functionality
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // change map center positioning state
        setMapPos(pos);
      });
    }
  }, []);

  // change google map position to current user location on button click
  const currPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // change map center positioning state
        setMapPos(pos);
      });
    }
  };

  // handle click on update button
  const handleUpdate = () => {
    setUpdating(true);
  };

  // handle click on delete button
  const handleDelete = async (eID, uID) => {
    // create the object for the db query on backend
    const deleteReq = {
      eventID: eID,
      userID: uID,
    };
    // send object to the server to delete the event
    const response = await axios.delete('/api/events/', {
      // yeah, not restful, oh well sowee >.<
      data: { deleteReq },
    });
    // filter the removed event from the marker data array
    setMarkerData((prevMarkerData) => {
      return prevMarkerData.filter((event) => {
        return event.id !== eID;
      });
    });
    setEventData(null);
  };

  const openCreateModal = () => {
    //set isCreateModalOpen to true
    setIsCreateModalOpen(true);
    setEventData(null);
  };

  // ensures that a div exists for the map even when the map API key is not loaded successfully. DO NOT DELETE
  if (!isLoaded) return <div>Loading... 🥺</div>;
  // <GoogleMap><GoogleMap /> component imported from @react-google-maps/api used to render google maps
  // https://react-google-maps-api-docs.netlify.app/#googlemap

  // yes ... we know that this could be refactored into multiple components but .... time
  return (
    <div className="map-section">
      <div className="left-section">
        {user && (
          <EventList
            userEventList={userEventList}
            markerData={markerData}
            setEventData={setEventData}
            user={user}
          />
        )}
        <button className="map__create-event-btn" onClick={openCreateModal}>
          Create Own Event
        </button>
      </div>
      <GoogleMap
        zoom={12}
        center={mapPos}
        mapContainerClassName="map-container box-shadow-1"
      >
        <button
          className="current-location-button"
          onClick={() => currPosition()}
        >
          Go to current location
        </button>
        {/* If markerData is changed, places corresponding Markers in the map */}
        {/* <MarkerF/> component imported from @react-google-maps/api renders markers on the map */}
        {markerData.length > 0 &&
          markerData.map((event) => (
            <MarkerF
              key={event.id}
              title={event.name}
              position={event.location[0]}
              onClick={() => {
                setEventData(event);
                setIsCreateModalOpen(false);
              }}
            />
          ))}
      </GoogleMap>
      {/* If a Marker is being added, call MarkerCreator and if updated, call MarkerUpdator */}
      <div className="right-section">
        {!updating && isCreateModalOpen && !eventData && (
          <MarkerCreator
            setMarkerData={setMarkerData}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        )}
        {/* {updating && (
          <MarkerUpdator
            eventData={eventData}
            setEventData={setEventData}
            setUpdating={setUpdating}
            setMarkerData={setMarkerData}
          />
        )} */}
        {/* If eventData and user are not null, display the event data */}
        {eventData && user && (
          <EventInfo
            handleUpdate={handleUpdate}
            eventData={eventData}
            user={user}
            userEventList={userEventList}
            setUserEventList={setUserEventList}
            setEventData={setEventData}
            setUpdating={setUpdating}
            setMarkerData={setMarkerData}
            updating={updating}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default Map;
