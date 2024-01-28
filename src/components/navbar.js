import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const authToken = localStorage.getItem('authToken');

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">Super Admin</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/" disabled={!authToken}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/connectors" disabled={!authToken}>Connectors</Link>
                    </li>
                </ul>
            </div>
        </div>
        </nav>
    );
}

export default Navbar;
