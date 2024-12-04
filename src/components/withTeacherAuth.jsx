import React from 'react';
import { Navigate } from 'react-router-dom';

const withTeacherAuth = (WrappedComponent) => {
    return (props) => {
        const role = localStorage.getItem('role'); // Fetch the user role from localStorage

        // Check if the role is not 'ADMIN'
        if (role !== 'TEACHER') {
            // Render a simple 403 error message if not an admin
            return (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>403 Forbidden</h1>
                    <p>You do not have permission to access this page.</p>
                </div>
            );
        }

        // Render the wrapped component if the user is an admin
        return <WrappedComponent {...props} />;
    };
};

export default withTeacherAuth;
