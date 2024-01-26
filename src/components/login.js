import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });

    const navigate = useNavigate();

    const host = 'http://localhost:3000';

    const handlesubmit = async (e) => {
        e.preventDefault();

        // Create a new FormData object
        const loginData = new FormData();
        loginData.append('Email', formData.Email);
        loginData.append('Password', formData.Password);

        try {
            // Make API request to verify login and get the web token
            const response = await fetch(`${host}/api/user/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Email: formData.Email,
                    Password: formData.Password
                    })
              });

            if (response.ok) {
                const { token } = await response.json();

                // Store the web token in local storage
                localStorage.setItem('token', token);
                alert('Login successful');

                // Redirect to the events page
                navigate('/events');
            } else {
                // Handle login error
                console.error('Login failed');
                alert('Invalid Credentials')
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">Sign In</h1>
                <form>
                    <input
                        type="email"
                        placeholder="Email or phone number"
                        value={formData.Emailmail}
                        onChange={(e) =>
                            setFormData({ ...formData, Email: e.target.value })
                        }
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, Password: e.target.value })
                        }
                    />
                    <button type="submit" className="login-button" onClick={handlesubmit}>
                        Sign In
                    </button>
                </form>
                <p className="forgot-password">Forgot password?</p>
                <div className="signup-link">
                    New to Netflix? <span className="signup-text">Sign up now</span>
                </div>
            </div>
        </div>
    );
};

export default Login;