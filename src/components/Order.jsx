import React, { useEffect, useState } from 'react';
import OrdersService from '../services/orders-service'; // Adjust the import path
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const studentId = localStorage.getItem('userId'); // Adjust as per your setup

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await OrdersService.getOrdersByStudentId(studentId);
      // Sort orders by createdAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const renderOrderItems = (orderDetails) => {
    if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
      return <p>No items found for this order.</p>;
    }

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((item) => (
            <tr key={item.orderDetailId}>
              <td>{item.courseTitle}</td>
              <td>${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total Price</th>
              <th>Order Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice}</td>
                <td>{renderOrderItems(order.orderDetails)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;
