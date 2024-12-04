import React from 'react';
import { Link } from 'react-router-dom';

const TeacherSidebar = () => {
    const teacherId = localStorage.getItem('userId');
    return (
        <div className="admin-sidebar" style={{ width: '200px', float: 'left', padding: '20px', backgroundColor: '#000000' }}>
            <h2 style={{ color: '#ffffff' }}>Admin Panel</h2>
            <ul className="list-unstyled">
                <li>
                    <Link to="/teacher/dashboard">Dashboard</Link>
                </li>
                <br />
                <li>
                    <Link to={`/teacher/${teacherId}/courses`}>Manage Courses</Link>
                </li>

            </ul>
        </div>
    );
};

export default TeacherSidebar;
