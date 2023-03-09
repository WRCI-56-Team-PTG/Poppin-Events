import React from 'react';
import ReactDOM from 'react-dom';

import RSVPButton from './RSVPButton';
import MarkerUpdator from './MarkerUpdator';

import '../stylesheets/EventInfo.css';

const EventInfo = function ({
  handleUpdate,
  eventData,
  user,
  userEventList,
  setUserEventList,
  setEventData,
  setUpdating,
  setMarkerData,
  updating,
  handleDelete,
}) {
  const closeEditInfoHandler = () => {
    setEventData(null);
    setUpdating(false);
  };

  return ReactDOM.createPortal(
    <div className="event-info-n-marker-updator__modal-container">
      <div className="event-info__modal-container box-shadow-1">
        <div className="info-container ">
          <h2 className="event-title">{eventData.name}</h2>
          <p className="event-description"> {eventData.description}</p>
          <ul className="info-list">
            <li className="info-list-item">Organizer: {eventData.organizer}</li>
            <li className="info-list-item">Location: {eventData.address}</li>
            <li className="info-list-item">
              Date: {new Date(eventData.date).toLocaleString()}
            </li>
            <li className="info-list-item">RSVP: {eventData.email}</li>
          </ul>
          {/* If the user is the creator of the event, display the edit and delete buttons */}
          {eventData.email === user.email && (
            <div className="event-buttons-container">
              <button
                className="edit-button "
                type="button"
                onClick={handleUpdate}
              >
                {' '}
                Edit{' '}
              </button>
              <button
                className="delete-button"
                type="button"
                onClick={() => handleDelete(eventData.id, user.id)}
              >
                {' '}
                Delete{' '}
              </button>
              <button
                className="event-info__close-btn delete-button"
                onClick={closeEditInfoHandler}
              >
                Close
              </button>
            </div>
          )}
          {/* Otherwise, display the RSVP component */}
          {eventData.email !== user.email && (
            <>
              <RSVPButton
                eventData={eventData}
                user={user}
                userEventList={userEventList}
                setUserEventList={setUserEventList}
              />
              <button
                className="event-info__close-btn--rsvp"
                onClick={closeEditInfoHandler}
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
      {updating && (
        <MarkerUpdator
          eventData={eventData}
          setEventData={setEventData}
          setUpdating={setUpdating}
          setMarkerData={setMarkerData}
        />
      )}
    </div>,
    document.getElementById('modal')
  );
};

export default EventInfo;
