import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
    const { state } = useLocation();
    const cart = state?.cart || {}; // Get the cart from the location state
    const totalCost = cart.cartItems
        ? cart.cartItems.reduce((total, item) => total + item.price, 0)
        : 0;

    return (
        <div className="container" style={{ paddingTop: '56px' }}>
            <h2>Purchase Successfully!</h2>
            <hr />
            <h4>Please check your email to see the receipt.</h4>
        </div>
    );
};

Confirmation.propTypes = {
    // Define any props if needed
};

export default Confirmation;
