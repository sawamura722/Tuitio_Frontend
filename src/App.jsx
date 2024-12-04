import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Cart from './components/cart';
import AlertWindow from './alert-window'; // Ensure this is in the correct path
import Header from './components/Header';
import Footer from './Footer';
import CourseList from './components/course-list';
import Contact from './Contact';
import Login from './components/Login';
import Register from './components/Register';
import RegisterTeacher from './components/Register-teacher';
import CourseManagementTEACHER from './components/CourseManagementTEACHER';
import Checkout from './components/Checkout';
import Order from './components/Order';
import UserProfile from './components/UserProfile';
import OrderManagementADMIN from './components/OrderManagementADMIN';
import coursesService from './services/courses-service'; // Import without instantiating
import Course from './components/Course';
import CourseTopics from './components/CourseTopics';
import Faq from './components/Faq';
import FAQManagementADMIN from './components/FAQManagementADMIN';
import LessonDetail from './components/LessonDetail';
import PaymentForm from './components/PaymentForm';
import Confirmation from './components/Confirmation';
import StudentCourses from './components/StudentCourses';
import CourseDetailManagementTEACHER from './components/CourseDetailManagementTEACHER';
import LessonManagementTEACHER from './components/LessonManagementTEACHER';
import TeacherDashboard from './components/TeacherDashboard';
import CourseStudents from './components/CourseStudents';
import AdminDashboard from './components/AdminDashboard';
import StudentSchedule from './components/StudentSchedule';
import Schools from './components/Schools';
import SchoolManagementADMIN from './components/SchoolManagementADMIN';
import CategoriesOfCourseManagementTEACHER from './components/CategoriesOfCourseManagementTEACHER';

// test key
const stripePromise = loadStripe('pk_test_51Q8Jjq04TnKm6c4jORMsEbytPOtFYg5AEscU8D7UzCAzWT2HmoTcxPmPGHBvk1BHrvFirMOMOUyAUQYmzFAW7jEZ0041psKOaF');

const App = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '{}'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const userId = parseInt(localStorage.getItem('userId'), 10);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await coursesService.getAllCourses(); // Call method directly
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const getTotalItemsInCart = () => {
        return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    };

    const handleCartClick = () => {
        setIsCartOpen(!isCartOpen);
    };

    const handleCheckoutClick = () => {
        // Navigate to the payment page with the cart data if needed
        navigate('/payment', { state: { cart } });
    };

    const handleCheckoutSuccess = () => {
        setCart({});
        localStorage.removeItem('cart'); // Clear cart from local storage
        navigate('/confirmation');
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="wrapper">
            <Header totalitem={getTotalItemsInCart()} onCartClick={handleCartClick} />
            <main className="main">
                <Routes>
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/courses/:courseId" element={<Course />} />
                    <Route path="/courses/:courseId/detail" element={<CourseTopics />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />                         
                    <Route path="/register/teacher" element={<RegisterTeacher />} />                         
                    <Route path="/teacher/:teacherId/courses" element={<CourseManagementTEACHER />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:id" element={<Order />} />
                    <Route path="/profile/:id" element={<UserProfile />} />
                    <Route path="/admin/orders" element={<OrderManagementADMIN />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/admin/faq" element={<FAQManagementADMIN />} />
                    <Route path="/courses/:courseId/detail/lesson/:lessonId" element={<LessonDetail />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/student/courses" element={<StudentCourses />} />
                    <Route path="/teacher/course/detail/:courseId" element={<CourseDetailManagementTEACHER />} />
                    <Route path="/teacher/course/detail/:courseId/topic/:topicId" element={<LessonManagementTEACHER />} />
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/dashboard/course_students/:courseId" element={<CourseStudents />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/student/schedule" element={<StudentSchedule />} />
                    <Route path="/schools" element={<Schools />} />
                    <Route path="/admin/schools" element={<SchoolManagementADMIN />} />
                    <Route path="/teacher/course/categories/:courseId" element={<CategoriesOfCourseManagementTEACHER />} />

                    {/* Wrap the PaymentForm in the Elements provider */}
                    <Route path="/payment" element={
                        <Elements stripe={stripePromise}>
                            <PaymentForm userId={userId} cart={cart} onCheckoutSuccess={handleCheckoutSuccess} />
                        </Elements>
                    } />
                </Routes>
            </main>
            <Footer />
            <AlertWindow message={alertMessage} onClose={() => setAlertMessage('')} />
            {isCartOpen && (
                <div className="cart-modal">
                    <Cart cart={cart} userId={userId} onCloseCart={handleCartClick} onCheckoutClick={handleCheckoutClick} />
                </div>
            )}
        </div>
    );
};

const Main = () => {
    return (
        <main className="container" style={{ paddingTop: '56px' }}>
            <Jumbotron />
            <CourseList limit={3} />
            <div className="d-flex justify-content-center">
                <Link to="/courses" className="btn btn-success">View All Courses</Link>
            </div>
            <br />
        </main>
    );
};

const Jumbotron = () => {
    return (
        <div className="jumbotron">
            <h1 className="display-4">Welcome to Tuitio</h1>
            <p className="lead">Tutoring School Courses</p>
            <hr className="my-4" />
            <p>Buy please</p>
        </div>
    );
};

export default App;
