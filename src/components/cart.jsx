import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cartsService from '../services/carts-service';
import { useNavigate } from 'react-router-dom';
import PaymentForm from './PaymentForm'; // Import the PaymentForm component
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load your Stripe publishable key here
const stripePromise = loadStripe('pk_live_51Q8Jjq04TnKm6c4jUuzSYhdudUj6iePVJpisOVNzf07CzEmE8rtQW0WqhEIeqKvm7kEipn8bvhNofeN5r5bQnXOC0000M3gWRr');

const Cart = ({ userId, onCloseCart }) => {
    const [cartData, setCartData] = useState({ cartItems: [] }); // Initialize with an empty array
    const [totalCost, setTotalCost] = useState(0);
    const navigate = useNavigate();

    const fetchCartData = async () => {
        try {
            const cart = await cartsService.getCart(userId);
            if (cart && cart.cartItems) {
                setCartData(cart); // Make sure cart has cartItems
                setTotalCost(cart.cartItems.reduce((total, item) => total + item.price, 0));
            } else {
                // Fallback if cart is empty or undefined
                setCartData({ cartItems: [] });
                setTotalCost(0);
            }
        } catch (error) {
            console.error('Failed to fetch cart data:', error);
            setCartData({ cartItems: [] }); // Set to empty on error
            setTotalCost(0); // Reset total cost on error
        }
    };
    
    

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleRemoveFromCart = async (courseId) => {
        try {
            await cartsService.removeFromCart(userId, courseId);
            fetchCartData();
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    };

    const handleCheckoutClick = () => {
        // Navigate to the payment page with the cart data
        navigate('/payment', {
            state: {
                cart: cartData,
                totalAmount: totalCost, // Pass the total amount
            },
        });
    };

    return (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="cartLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="cartLabel">Your Cart</h5>
                        <button type="button" className="close" onClick={onCloseCart} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {cartData ? (
                            <div className="cart-product-list-container">
                                {cartData.cartItems.map((item) => (
                                    <div className="row align-items-center" key={item.cartItemId}>
                                        <div className="col-2">
                                            <img
                                                src={item.thumbnail ? `https://localhost:7245/uploads/thumbnails/${item.thumbnail}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'}
                                                alt={item.courseTitle}
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </div>
                                        <div className="col-5">
                                            <h5>{item.courseTitle}</h5>
                                            <p>{item.price} ฿</p>
                                        </div>
                                        <div className="col-3 d-flex justify-content-center">
                                            <button className="btn btn-danger" onClick={() => handleRemoveFromCart(item.courseId)}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Total Cost: {totalCost} ฿</h5>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleCheckoutClick} // Navigate to payment page
                                        disabled={cartData.cartItems.length === 0}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p>Loading cart data...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

Cart.propTypes = {
    userId: PropTypes.number.isRequired,
    onCloseCart: PropTypes.func.isRequired,
};

export default Cart;
