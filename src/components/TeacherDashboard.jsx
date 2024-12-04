import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CoursesService from '../services/courses-service';
import RegistrationsService from '../services/registrations-service';
import OrdersService from '../services/orders-service';
import TeacherSidebar from './TeacherSidebar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import withTeacherAuth from './withTeacherAuth';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import './dashboard.css';

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [studentsByCourse, setStudentsByCourse] = useState({});
    const [revenueByCourse, setRevenueByCourse] = useState({});
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [events, setEvents] = useState([]);
    const [dailyRevenues, setDailyRevenues] = useState([]);

    const userId = parseInt(localStorage.getItem('userId'));
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
        fetchLast7DaysRevenue();
    }, []);

    const fetchCourses = async () => {
        try {
            const allCourses = await CoursesService.getAllCourses();
            const teacherCourses = allCourses.filter(course => course.teacherId === userId);
            setCourses(teacherCourses);

            // Fetch students and revenue for each course
            teacherCourses.forEach(course => {
                fetchStudentsByCourse(course.courseId);
                fetchRevenueByCourse(course.courseId);
            });

            // Generate events for FullCalendar
            const calendarEvents = teacherCourses.flatMap(course => {
                const startDate = new Date(course.startDateAt);
                const endDate = new Date(course.endDateAt);
                const events = [];

                for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const day = d.getDay();

                    if (
                        (day === 0 && course.sunday) ||
                        (day === 1 && course.monday) ||
                        (day === 2 && course.tuesday) ||
                        (day === 3 && course.wednesday) ||
                        (day === 4 && course.thursday) ||
                        (day === 5 && course.friday) ||
                        (day === 6 && course.saturday)
                    ) {
                        const start = new Date(d);
                        const end = new Date(d);
                        const [startHours, startMinutes] = course.startTimeAt.split(':').map(Number);
                        const [endHours, endMinutes] = course.endTimeAt.split(':').map(Number);

                        start.setHours(startHours + 7, startMinutes); // Adjusting for time zone
                        end.setHours(endHours + 7, endMinutes);

                        events.push({
                            title: course.courseTitle,
                            start: start,
                            end: end,
                            allDay: false,
                        });
                    }
                }

                return events;
            });
            setEvents(calendarEvents);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchStudentsByCourse = async (courseId) => {
        try {
            const students = await RegistrationsService.getStudentsByCourseId(courseId);
            setStudentsByCourse(prev => ({
                ...prev,
                [courseId]: students.length,
            }));
        } catch (error) {
            console.error(`Error fetching students for course ${courseId}:`, error);
        }
    };

    const fetchRevenueByCourse = async (courseId) => {
        try {
            const orders = await OrdersService.getAllOrders();
            const recentOrders = orders.filter(order => 
                order.orderDetails.some(detail => detail.courseId === courseId)
            );

            const revenue = recentOrders.reduce((acc, order) => {
                const courseDetail = order.orderDetails.find(detail => detail.courseId === courseId);
                return acc + (courseDetail ? courseDetail.price : 0);
            }, 0);

            setRevenueByCourse(prev => ({
                ...prev,
                [courseId]: revenue,
            }));

            setTotalRevenue(prev => prev + revenue);
        } catch (error) {
            console.error(`Error fetching revenue for course ${courseId}:`, error);
        }
    };

    const fetchLast7DaysRevenue = async () => {
        try {
            const teacherCourses = await CoursesService.getCoursesByTeacherId(userId);
            const courseIds = teacherCourses.map(course => course.courseId);
    
            const orders = await OrdersService.getAllOrders();
            console.log('Orders:', orders);
    
            const last7Days = Array(7).fill(0);
            const todayDate = new Date();
    
            orders.forEach(order => {
                const orderDate = new Date(order.createdAt);
                const daysDifference = Math.floor((todayDate - orderDate) / (1000 * 3600 * 24));
    
                if (daysDifference >= 0 && daysDifference < 7) {
                    const relevantOrderDetails = order.orderDetails.filter(detail =>
                        courseIds.includes(detail.courseId)
                    );
    
                    if (relevantOrderDetails.length > 0) {
                        last7Days[6 - daysDifference] += order.totalPrice;
                    }
                }
            });
    
            setDailyRevenues(last7Days);
            console.log('Final Daily Revenues:', last7Days);
        } catch (error) {
            console.error('Error fetching last 7 days revenue:', error);
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

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
                <TeacherSidebar />
                <div className="container" style={{ flex: 1 }}>
                    <h1>Teacher Dashboard</h1>

                    <h2>Total Revenue</h2>
                    <p>${totalRevenue.toFixed(2)}</p>

                    <h2 className="my-4">Revenue Chart (Last 7 Days)</h2>
                    <div style={{ height: '50vh', width: '100%' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>

                    {/* Other components, like schedule and courses list */}
                    <h2>Your Teaching Schedule</h2>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin]}
                        initialView="timeGridWeek"
                        events={events}
                        timeZone="UTC"
                        allDaySlot={false}
                        minTime="08:00:00"
                        maxTime="18:00:00"
                        slotDuration="00:30:00"
                        headerToolbar={{
                            left: 'prev,next',
                            center: 'title',
                            right: 'timeGridWeek,dayGridMonth',
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default withTeacherAuth(TeacherDashboard);
