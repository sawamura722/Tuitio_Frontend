import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './index.css';

// Wrap the App component with Router
ReactDOM.render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
