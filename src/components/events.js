import React, { useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import _ from "lodash";

const Eventstab = () => {
  const [Events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [unapprovedEvents, setunapprovedEvents] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();

  const host = "http://localhost:3000";

  const fetchevents = async () => {
    const res = await fetch(`${host}/api/events/getevents?page=${page}`);
    const data = await res.json();
    setEvents(data.docs);
  };

  const onSearchText = async (selected) => {
    if (selected === "") {
      setPage(0);
      fetchevents();
      return;
    }
    setLoading(true);
    const res = await fetch(
      `${host}/api/events/search?text=${selected}&page=0&size=20`
    );
    const data = await res.json();
    setEvents(data.docs);
    setLoading(false);
  };

  const unapprovedevents = async () => {
    const res = await fetch(`${host}/api/events/unapprovedevents`);
    const data = await res.json();
    setunapprovedEvents(data);
  };

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

  useEffect(() => {
    fetchevents();
    unapprovedevents();
    inputRef.current = _.debounce(onSearchText, 500);

    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    const selected = e.target.value;
    setSelected(selected);
    inputRef.current(selected);
  };

  const fetchmoreevents = async () => {
    setLoading(true);
    const res = await fetch(`${host}/api/events/getevents?page=${page + 1}`);
    setPage(page + 1);
    const data = await res.json();
    setEvents((events) => [...events, ...data.docs]);
    setLoading(false);
  };

  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({
    id: "",
    image: "",
  });

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      description: currentNote.description,
    });
  };

  const approveEvent = async (id) => {
    try {
      const res = await fetch(`${host}/api/events/approveevent/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      console.log(data);
      alert("Event Approved");
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
    try {
      const res = await fetch(`${host}/api/events/updateevent/${note.id}`, {
        method: "PUT",
        body: formdata,
      });
      const data = await res.json();
      console.log(data);
      alert("Image added successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
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
                Edit Note
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
                    value={note.edescription}
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
          <Tab>All Events</Tab>
          <Tab>New Requests</Tab>
        </TabList>

        <TabPanel>
          <div className="container my-3">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by keyword..."
                      onChange={handleSearch}
                      value={selected}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered table-hover table-dark">
                <thead>
                  <tr>
                    <th scope="col">Event Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Delete</th>
                    <th scope="col">Edit</th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {Events.map((event) => (
                    <tr key={event._id}>
                      <td>{event.name}</td>
                      <td>{event.location}</td>
                      {/* Add more columns as needed */}
                      <td>
                        <i
                          className="far fa-trash-alt mx-2"
                          onClick={() => {
                            deleteEvent(event._id);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="far fa-edit mx-2"
                          onClick={() => {
                            updateNote(event);
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
                    onClick={fetchmoreevents}
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
                  {unapprovedEvents.map((event) => (
                    <tr key={event._id}>
                      <td>{event.name}</td>
                      <td>{event.location}</td>
                      {/* Add more columns as needed */}
                      <td>
                        <i
                          className="far fa-trash-alt mx-2"
                          onClick={() => {
                            deleteEvent(event._id);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="far fa-edit mx-2"
                          onClick={() => {
                            updateNote(event);
                          }}
                        ></i>
                      </td>
                      <td>
                        <i
                          className="fas fa-check mx-2"
                          onClick={() => {
                            approveEvent(event._id);
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
    </>
  );
};

export default Eventstab;
