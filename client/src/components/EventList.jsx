import React, { useState, useEffect, useContext } from 'react';

function EventList(props) {
  const userId = props.user.id;
  const events = [];
  // Compare entire event data array to the user's list of events and create
  // a list element for each one


  props.markerData.forEach((event) => {
    props.userEventList.forEach((eventID) => {
      if (event.id === eventID) {
        // Reformat date
        let formattedDate = new Date(event.date);
        formattedDate = formattedDate.toLocaleDateString('en-us', {
          day: 'numeric',
          year: 'numeric',
          month: 'short',
        });
        events.push(
          <div
            key={event.id}
            id={event.id}
            className="event-list-item"
            onClick={() => props.setEventData(event)}
          >
            <div className="event-list-item-data">
              <p className="small-titles">Event</p>
              <p className="small-text">{event.name}</p>
            </div>
            <div className="event-list-item-data">
              <p className="small-titles">Location</p>
              <p className="small-text">{event.locname}</p>
            </div>
            <div className="event-list-item-data">
              <p className="small-titles">Date</p>
              <p className="small-text">{formattedDate}</p>
            </div>
          </div>
        );
      }
    });
  });

  // get a list of user's hosted events
  const hosting = [];
  console.log('props.markerData is', props.markerData);
  console.log('user is', props.user);
  props.markerData.forEach(event => {
    // if the event organizer's name is the same as the user's name, add to hosting array
    if (event.organizer === props.user.name) {
      //reformat the date
      let formattedDate = new Date(event.date);
      formattedDate = formattedDate.toLocaleDateString('en-us', {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
      });
      hosting.push(
        <div
          key={'hosting' + event.id}
          id={'hosting' + event.id}
          className="event-list-item"
          onClick={() => props.setEventData(event)}
        >
          <div className="event-list-item-data">
            <p className="small-titles">Event</p>
            <p className="small-text">{event.name}</p>
          </div>
          <div className="event-list-item-data">
            <p className="small-titles">Location</p>
            <p className="small-text">{event.locname}</p>
          </div>
          <div className="event-list-item-data">
            <p className="small-titles">Location</p>
            <p className="small-text">{formattedDate}</p>
          </div>
        </div>
      );
    }

  });



  return (
    <div className="event-list-cont create-event-container box-shadow-1">
      <h4>Your Events</h4>
      <h6 className="subEventList">Hosting</h6>
      {hosting}
      <h6 className="subEventList">Attending</h6>
      {events}
    </div>
  );
}

export default EventList;
