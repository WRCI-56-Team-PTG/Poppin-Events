import React from 'react';
import axios from 'axios';

function RSVPButton(props) {
  let buttonText;
  let deleteRSVP = false;

  // If the event shown is already on the user's event list, show option to cancel
  if (props.userEventList.includes(props.eventData.id)) {
    buttonText = 'CANCEL RSVP';
    deleteRSVP = true;
  } else buttonText = 'RSVP';

  async function handleClick(e) {
    const messageBody = { eventId: props.eventData.id };
    let response;
    try {
      if (deleteRSVP) {
        response = await axios.delete(
          `/api/attendees/${props.user.id}`,
          messageBody
        );
      } else {
        response = await axios.post(
          `/api/attendees/${props.user.id}`,
          messageBody
        );
      }
      props.setUserEventList(response.data);
    } catch (err) {
      console.log('error in post: ', err.message);
    }
  }

  return (
    <button className="rsvp-button" onClick={handleClick}>
      {buttonText}
    </button>
  );
}

export default RSVPButton;