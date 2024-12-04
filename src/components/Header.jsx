import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import cartsService from '../services/carts-service';
import Swal from 'sweetalert2';

const Header = ({ onCartClick }) => {
    const [totalItems, setTotalItems] = useState(0);
    const [userRole, setUserRole] = useState(null); 

    const userId = localStorage.getItem('userId'); 
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            const userId = parseInt(localStorage.getItem('userId'), 10); 

            if (!token || isNaN(userId)) return;

            try {
                const cart = await cartsService.getCart(userId);
                const total = cart.cartItems.length; // Calculate the total number of items based on the cartItems array length
                setTotalItems(total);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        // Check the user's role
        const fetchUserRole = () => {
            const role = localStorage.getItem('role');
            setUserRole(role);
        };

        fetchCartItems();
        fetchUserRole();
    }, [location.pathname]); // Re-fetch cart items when the location changes

    const handleLogout = () => {
        localStorage.clear();
        Swal.fire({
            title: 'Logout successfully',
            text: 'Goodbye!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false 
        }).then(() => {
            navigate('/');          
        });
    };

    return (
        <header className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <Link className="navbar-brand" to="/">Tuitio</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Home<span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/courses">Courses</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contacts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/schools">Schools</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/faq">FAQ</Link>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center ms-auto">
                        <a className="nav-link openCartLink" onClick={onCartClick}>
                            <i className="fas fa-shopping-cart"></i>
                            Cart<span id="cart-badge" className="badge bg-dark">{totalItems > 0 ? totalItems : ''}</span>
                        </a>
                        <div className="dropdown ms-3">
                            <a 
                                className="nav-link dropdown-toggle" 
                                href="#" 
                                id="userDropdown" 
                                role="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <i className="fas fa-user"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                {userId ? (
                                    <>
                                        {userRole === 'USER' && (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to={`/profile/${userId}`}>
                                                        Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to={`/order/${userId}`}>
                                                        Your Orders
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to={`/student/courses`}>
                                                        Your Courses
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link className="dropdown-item" to={`/student/schedule`}>
                                                        Lecture Schedule
                                                    </Link>
                                                </li>
                                                
                                            </>
                                        )}

                                        {userRole === 'TEACHER' && (
                                            <>
                                                <li>
                                                    <Link className="dropdown-item" to={`/profile/${userId}`}>
                                                        Profile
                                                    </Link>
                                                </li>                                        
                                                <li>
                                                    <Link className="dropdown-item" to={`/teacher/dashboard`}>
                                                        Teacher Control Panel
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                        
                                        {userRole === 'ADMIN' && (
                                            <li>
                                                <Link className="dropdown-item" to="/admin/dashboard">
                                                    Admin Control Panel
                                                </Link>
                                            </li>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <a className="dropdown-item" href="#" onClick={handleLogout}>
                                                Logout
                                            </a>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link className="dropdown-item" to="/login">
                                            Login
                                        </Link>
                                    </li>
                                )}
                            </ul>

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

Header.propTypes = {
    onCartClick: PropTypes.func.isRequired,
};

export default Header;
