import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import './PaymentForm.css'; // Ensure you have this CSS file for styles
import CartsService from '../services/carts-service';

const PaymentForm = ({ userId, onCheckoutSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const location = useLocation();
    const cart = location.state?.cart || {}; // Get cart from location state
    const totalAmount = location.state?.totalAmount || 0; // Get totalAmount from location state

    const returnUrl = 'http://localhost:3000/confirmation';

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
            return;
        }
    
        setLoading(true);
        const cardElement = elements.getElement(CardElement);
    
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
                email: email,
            },
        });
    
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setError(null);
            const paymentMethodId = paymentMethod.id;
    
            try {
                await CartsService.checkout(userId, paymentMethodId, returnUrl, email);
                onCheckoutSuccess();
            } catch (error) {
                console.error('Checkout error:', error);
                setError('Checkout failed. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };
    

    return (
        <div className="payment-container">
            <div className="cart-summary">
                <h3>Your Cart</h3>
                {cart.cartItems && cart.cartItems.map(item => (
                    <div key={item.cartItemId} className="cart-item">
                        <h5>{item.courseTitle}</h5>
                        <p>{item.price} ฿</p>
                    </div>
                ))}
                <h4>Total: {totalAmount} ฿</h4>
            </div>
            <div className="payment-form">
                <h3>Payment Information</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="card">Card Information</label>
                        <CardElement options={{ style: {
                            base: {
                                color: '#32325d',
                                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                                fontSmoothing: 'antialiased',
                                fontSize: '16px',
                                lineHeight: '24px',
                                padding: '10px',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#fa755a',
                                iconColor: '#fa755a',
                            },
                        }}} />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button type="submit" className="btn btn-primary" disabled={!stripe || loading}>
                        {loading ? 'Processing...' : 'Pay'}
                    </button>
                </form>
            </div>
        </div>
    );
};

PaymentForm.propTypes = {
    userId: PropTypes.number.isRequired,
    onCheckoutSuccess: PropTypes.func.isRequired,
};

export default PaymentForm;
