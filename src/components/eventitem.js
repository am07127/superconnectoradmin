import React from "react";
// In your main styles or entry file (e.g., index.js, index.tsx, etc.)
import "@fortawesome/fontawesome-free/css/all.min.css";

const host = "http://localhost:3000";

const deleteEvent = async (id) => {
  const res = await fetch(`${host}/api/events/deleteevent/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  const data = await res.json();
  console.log(data);
};

const Eventitem = (props) => {
  const { Event, updateEvent } = props;
  return (
    <div className="card" style={{textOverflow:"ellipsis"}}>
      <div className="card-body text-center">
        <h5 className="card-title text-center fw-bold">{Event.name}</h5>
        <i
          className="far fa-trash-alt mx-2"
          onClick={() => {
            deleteEvent(Event._id);
          }}
        ></i>
        <i
          className="far fa-edit mx-2"
          onClick={() => {
            updateEvent(Event);
          }}
        ></i>
      </div>
    </div>
  );
};

export default Eventitem;
