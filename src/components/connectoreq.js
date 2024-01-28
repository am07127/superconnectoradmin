import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Connectoreq() {
  const [connectors, setConnectors] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const host = "https://super-connector.onrender.com";

  useEffect(() => {
    getConnectors();
  }, []);

  const getConnectors = async () => {
    const res = await fetch(`${host}/api/connectors/getconnectors?${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setConnectors(data);
    console.log(data);
  };

  const fetchmoreconnectors = async () => {
    setLoading(true);
    const res = await fetch(
      `${host}/api/connectors/getconnectors?page=${page + 1}`
    );
    setPage(page + 1);
    const data = await res.json();
    setConnectors([...connectors, ...data]);
    setLoading(false);
  };

  const deleteReq = async (id) => {
    console.log(id);
    try {
      const res = await fetch(`${host}/api/connectors/deleteconnector/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if(res.ok){
        alert("Deleted Successfully");
        window.location.reload();
      }
    }
    catch (error) {
      console.error("An error occurred", error);
    }
  }

  return (
    <div className="container my-3">
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              {/* Add more columns as needed */}
              <th scope="col">Event Name</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Company Name</th>
              <th scope="col">Email</th>
              <th scope="col">Contact Number</th>
              <th scope="col">Booking Type</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {connectors.map((connector) => (
              <tr key={connector._id}>
                <td>{connector.eventName}</td>
                <td>{connector.firstName}</td>
                <td>{connector.lastName}</td>
                <td>{connector.companyName}</td>
                <td>{connector.email}</td>
                <td>{connector.contactNum}</td>
                <td>{connector.bookingType}</td>
                <td><i
          className="far fa-trash-alt mx-2"
          onClick={() => {
            deleteReq(connector._id);
          }}
        ></i></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary"
          onClick={fetchmoreconnectors}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}

export default Connectoreq;
