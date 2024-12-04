import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import AdminSidebar from './AdminSidebar';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://localhost:7245/api/Auth/register/teacher', {
                
                method: 'POST',
                headers: {
                    'Authorization': token, 
                    'Content-Type': 'application/json',
                    
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (!response.ok) throw new Error('Failed to register.');

            Swal.fire({
                title: 'Register Successfully!',
                text: 'Teacher Registration Successful!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false 
            }).then(() => {          
                navigate(`/admin/dashboard`);
            });
        } catch (err) {
            setError(err.message || 'Failed to register.');
        }
    };

    return (
        <>
            <div style={{ display: 'flex' }}> {/* Add this div */}
                <AdminSidebar />
                <div className="container d-flex justify-content-center align-items-center vh-100"> {/* Change vh-50 to vh-100 */}
                    <div className="card p-4" style={{ width: '400px' }}>
                        <h2 className="text-center">Register Teacher</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
    
};

export default Register;
