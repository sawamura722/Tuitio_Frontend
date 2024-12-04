import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartService from '../services/carts-service'; // Ensure this is correctly pointing to your cart service
import Swal from 'sweetalert2';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartData: initialCartData } = location.state || { cartData: [] };
    const [cartData, setCartData] = useState(initialCartData);
    const [totalCost, setTotalCost] = useState(0);

    const fetchCartData = async () => {
        const userId = parseInt(localStorage.getItem('userId'), 10);
        const token = localStorage.getItem('token');

        if (!token || isNaN(userId)) return;

        const cartService = new CartService();

        try {
            const cart = await cartService.getCart(userId); // Fetch cart using your API
            setCartData(cart.cartItems); // Adjust based on CartDTO structure
            const total = cart.cartItems.reduce((acc, item) => acc + item.course.price, 0); // Calculate total cost
            setTotalCost(total);
        } catch (error) {
            console.error('Failed to fetch cart data:', error);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const handleCheckout = async () => {
        const userId = parseInt(localStorage.getItem('userId'), 10);
        const cartService = new CartService();

        try {
            await cartService.checkout(userId); // Call the checkout API

            await Swal.fire({
                title: 'Checkout Successful!',
                text: 'Your cart has been checked out successfully.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            navigate('/success'); // Redirect to a success page or home
        } catch (error) {
            console.error('Checkout failed:', error);
            await Swal.fire({
                title: 'Checkout Failed',
                text: error.response?.data || 'Something went wrong!',
                icon: 'error',
            });
        }
    };

    return (
        <div>
            <h1>Checkout</h1>
            <h2>Total: ${totalCost}</h2>
            <ul>
                {cartData.map(item => (
                    <li key={item.courseId}>
                        {item.course.title} - ${item.course.price}
                    </li>
                ))}
            </ul>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Checkout;
