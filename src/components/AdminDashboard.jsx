import React, { useEffect, useState } from 'react';
import UsersService from '../services/users-service';
import OrdersService from '../services/orders-service';
import CoursesService from '../services/courses-service';
import AdminSidebar from './AdminSidebar';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminDashboard = () => {
    const [studentCount, setStudentCount] = useState(0);
    const [teacherCount, setTeacherCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [teacherRevenue, setTeacherRevenue] = useState([]); // State to hold teacher revenue data
    const [dailyRevenues, setDailyRevenues] = useState([]);

    // Function to fetch student and teacher counts
    const fetchUserCounts = async () => {
        try {
            const users = await UsersService.getAllUsers();
            const students = users.filter(user => user.role.roleName === 'USER');
            const teachers = users.filter(user => user.role.roleName === 'TEACHER');
            setStudentCount(students.length);
            setTeacherCount(teachers.length);
            // Fetch teacher revenue data after getting the counts
            fetchTeacherRevenue(teachers);
        } catch (error) {
            console.error('Error fetching user counts:', error);
        }
    };

    const fetchLast7DaysRevenue = async () => {
        try {
            const orders = await OrdersService.getAllOrders();
            console.log('Orders:', orders); // Check if orders are fetched correctly
    
            // Initialize an array to keep track of revenue for the last 7 days
            const last7Days = Array(7).fill(0);
            const todayDate = new Date();
    
            // Iterate over each order
            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const daysDifference = Math.floor((todayDate - orderDate) / (1000 * 3600 * 24));
    
                // Check if the order is within the last 7 days
                if (daysDifference >= 0 && daysDifference < 7) {
                    last7Days[6 - daysDifference] += order.totalPrice; // Accumulate revenue
                }
            });
    
            setDailyRevenues(last7Days); // Set the daily revenues for the chart
            console.log('Final Daily Revenues:', last7Days); // Confirm final array
        } catch (error) {
            console.error('Error fetching last 7 days revenue:', error);
        }
    };
    
    // Function to fetch total revenue
    const fetchTotalRevenue = async () => {
        try {
            const orders = await OrdersService.getAllOrders();
            const revenue = orders.reduce((acc, order) => {
                const orderRevenue = order.orderDetails.reduce((orderAcc, detail) => {
                    return orderAcc + (detail.price || 0); // Assume price is part of order detail
                }, 0);
                return acc + orderRevenue;
            }, 0);
            setTotalRevenue(revenue);
        } catch (error) {
            console.error('Error fetching total revenue:', error);
        }
    };
    

    // Function to fetch revenue for each teacher
    const fetchTeacherRevenue = async (teachers) => {
        try {
            const orders = await OrdersService.getAllOrders(); // Fetch all orders
            
            // Create a revenue object to hold total revenue for each teacher
            const revenueByTeacher = {};
            teachers.forEach(teacher => {
                revenueByTeacher[teacher.userId] = {
                    teacherName: teacher.username,
                    revenue: 0 // Initialize revenue
                };
            });

            // Iterate over each order and calculate revenue
            for (const order of orders) {
                for (const detail of order.orderDetails) {
                    const course = await CoursesService.getCourseById(detail.courseId); // Fetch course details

                    if (course && course.teacherId) { // Ensure course and teacherId exist
                        revenueByTeacher[course.teacherId].revenue += detail.price || 0; // Add to the teacher's revenue
                    }
                }
            }

            // Convert the revenueByTeacher object to an array for easier rendering
            const revenueArray = Object.values(revenueByTeacher); 

            // Sort the array in descending order based on revenue
            revenueArray.sort((a, b) => b.revenue - a.revenue);

            // Set the sorted revenue data to state
            setTeacherRevenue(revenueArray); 
        } catch (error) {
            console.error('Error fetching teacher revenue:', error);
        }
    };

    const chartData = {
        labels: ['Day 7', 'Day 6', 'Day 5', 'Day 4', 'Day 3', 'Day 2', 'Today'],
        datasets: [
            {
                label: 'Revenue (Last 7 Days)',
                data: dailyRevenues,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        fetchUserCounts();
        fetchTotalRevenue();
        fetchLast7DaysRevenue();
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Flex container */}
            <AdminSidebar />
            <div className="admin-dashboard" style={{ flex: 1, padding: '20px' }}> {/* Main content area */}
                <h1>Admin Dashboard</h1>
                <div className="stats">
                    <h2>Statistics</h2>
                    <p>Total Students: {studentCount}</p>
                    <p>Total Teachers: {teacherCount}</p>
                    <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
                </div>

                <h2 className="my-4">Teacher Revenue</h2>
                {teacherRevenue.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacherRevenue.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.teacherName}</td>
                                    <td>${item.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No teacher revenue data available.</div>
                )}
                <div className="row mb-5">
                    <div className="col-12 shadow-sm border">
                        <h2 className="p-3">Revenue Chart (Last 7 Days)</h2>
                        <div style={{ height: '50vh', width: '100%' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
