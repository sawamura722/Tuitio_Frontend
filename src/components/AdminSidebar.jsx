import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar" style={{ width: '200px', float: 'left', padding: '20px', backgroundColor: '#000000' }}>
            <h2 style={{ color: '#ffffff' }}>Admin Panel</h2>
            <ul className="list-unstyled">
                <li>
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                </li>
                <br />
                <li>
                    <Link to="/register/teacher">Register Teacher</Link>
                </li>
                <br/>
                <li>
                    <Link to="/admin/schools">Manage Schools info</Link>
                </li>
                <br/>
                <li>
                    <Link to="/admin/faq">Manage FAQs</Link>
                </li>
            </ul>
        </div>
    );
};

export default AdminSidebar;
