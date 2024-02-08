import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import _ from "lodash";

const Conferencestab = () => {
  const [Conferences, setConferences] = useState([]);
  const [page, setPage] = useState(0);
  const [unapprovedConferences, setunapprovedConferences] = useState([]);
  const [loading, setLoading] = useState(false);


  const host = "https://super-connector.onrender.com";

  const fetchconferences = async () => {
    try {
      const res = await fetch(`${host}/api/conferences/getconferences?page=${page}`);
      const data = await res.json();
      console.log("Raw data of conferences", data);
      setConferences(data);
    }
    catch (err) {
      console.error(err);
    }
  };

  const unapprovedconferences = async () => {
    try {
      console.log("Fetching unapproved conferences")
      const res = await fetch(`${host}/api/conferences/unapprovedconferences`);
        const data = await res.json();
        console.log("Raw data of unapproved conferences", data);
        setunapprovedConferences(data);
        console.log("Unapproved conferences", unapprovedConferences);
    }catch (err) {
      console.error(err);
    };
  };

  const deleteConference = async (id) => {
    console.log(id);
    try {
      const res = await fetch(`${host}/api/conferences/deleteconference/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        alert("Conference Deleted");
        window.location.reload();
      } else {
        console.error("Failed to delete Conference:", res.status, res.statusText);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchconferences();
    unapprovedconferences();

    // eslint-disable-next-line
  }, []);


  const fetchmoreconferences = async () => {
    setLoading(true);
    const res = await fetch(`${host}/api/conferences/getconferences?page=${page + 1}`);
    setPage(page + 1);
    const data = await res.json();
    setConferences([...Conferences, ...data.docs]);
    setLoading(false);
  };

  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({
    id: "",
    eventName: "",
    website: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    organizer: "",
    description: "",
    contactNum: "",
    location:"",
    date: "",
    isApproved: ""
    });

  const updateConference = (event) => {
    ref.current.click();
    setNote({
        id: event._id,
        eventName: event.eventName,
        website: event.website,
        facebook: event.facebook,
        linkedin: event.linkedin,
        instagram: event.instagram,
        organizer: event.organizer,
        description: event.description,
        contactNum: event.contactNum,
        location: event.location,
        date: event.date,
        isApproved: event.isApproved
    });
    };

  const approveconference = async (id) => {
    try {
      const res = await fetch(`${host}/api/conferences/approveconference/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      console.log(data);
      alert("Conference Approved");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handlefile = (e) => {
    setNote({
      ...note,
      image: e.target.files[0],
    });
  };

  const handleClick = (e) => {
    console.log("updating the note", note);
    editNote();
    refClose.current.click();
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const editNote = async () => {
    const formdata = new FormData();
    formdata.append("description", note.description);
    formdata.append("image", note.image);
    formdata.append("eventName", note.eventName);
    formdata.append("website", note.website);
    formdata.append("facebook", note.facebook);
    formdata.append("linkedin", note.linkedin);
    formdata.append("instagram", note.instagram);
    formdata.append("organizer", note.organizer);
    formdata.append("contactNum", note.contactNum);
    formdata.append("location", note.location);
    formdata.append("date", note.date);

    

    try {
      const res = await fetch(`${host}/api/conferences/updateconference/${note.id}`, {
        method: "PUT",
        body: formdata,
      });
      const data = await res.json();
      console.log(data);
      alert("Conference Updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container my-3">
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Conference
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    name="description"
                    value={note.description}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">
                    Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept=".jpeg, .jpg, .png, .webp,"
                    onChange={handlefile}
                  />
                </div>
                <div className="mb-3">
                    <label htmlFor="eventName" className="form-label">
                        Event Name
                    </label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="eventName"
                        name="eventName"
                        value={note.eventName}
                        onChange={onChange}
                        
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="website" className="form-label">
                        Website
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="website"
                        name="website"
                        value={note.website}
                        onChange={onChange}
                      
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="facebook" className="form-label">
                        Facebook
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="facebook"
                        name="facebook"
                        value={note.facebook}
                        onChange={onChange}
                        
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="linkedin" className="form-label">
                        Linkedin
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="linkedin"
                        name="linkedin"
                        value={note.linkedin}
                        onChange={onChange}
                       
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="instagram" className="form-label">
                        Instagram
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="instagram"
                        name="instagram"
                        value={note.instagram}
                        onChange={onChange}
                        
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="organizer" className="form-label">
                        Organizer
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="organizer"
                        name="organizer"
                        value={note.organizer}
                        onChange={onChange}
                        
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="contactNum" className="form-label">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="contactNum"
                        name="contactNum"
                        value={note.contactNum}
                        onChange={onChange}
                       
                    />
                </div>
                <div className="mb-3">  
                    <label htmlFor="location" className="form-label">
                        Location
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        name="location"
                        value={note.location}
                        onChange={onChange}
                      
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                        Date
                    </label>
                    <input
                        type="date"
                        className="form-control"
                        id="date"
                        name="date"
                        value={note.date}
                        onChange={onChange}
                    />
                </div>
                
              </form>
            </div>
            <div className="modal-footer">
              <button
                ref={refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                onClick={handleClick}
                type="button"
                className="btn btn-primary"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>All conferences</Tab>
          <Tab>New Requests</Tab>
        </TabList>

        <TabPanel>
          <div className="container my-3">
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-dark">
                <thead>
                  <tr>
                    <th scope="col">Conference Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Delete</th>
                    <th scope="col">Edit</th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {Conferences.map((event) => (
                    <tr key={event._id}>
                      <td>{event.eventName}</td>
                      <td>{event.location}</td>
                      {/* Add more columns as needed */}
                      <td>
                        <i
                          className="far fa-trash-alt mx-2"
                          onClick={() => {
                            deleteConference(event._id);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="far fa-edit mx-2"
                          onClick={() => {
                            updateConference(event);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center">
                <button
                    className="btn btn-primary"
                    onClick={fetchmoreconferences}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Load More"}
                </button>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="container my-3">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th scope="col">Event Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Delete</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Approve</th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {unapprovedConferences.map((event) => (
                    <tr key={event._id}>
                      <td>{event.eventName}</td>
                      <td>{event.location}</td>
                      {/* Add more columns as needed */}
                      <td>
                        <i
                          className="far fa-trash-alt mx-2"
                          onClick={() => {
                            deleteConference(event._id);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="far fa-edit mx-2"
                          onClick={() => {
                            updateConference(event);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="fas fa-check mx-2"
                          onClick={() => {
                            approveconference(event._id);
                          }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Conferencestab;
