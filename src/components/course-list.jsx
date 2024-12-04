import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import CartsService from '../services/carts-service';
import CoursesService from '../services/courses-service';
import CategoriesService from '../services/categories-service';
import RegistrationsService from '../services/registrations-service';

const CourseList = ({ limit }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const navigate = useNavigate();
    const [success, setSuccess] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();
    const [registrations, setRegistrations] = useState([]);

    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);

    const [showCategories, setShowCategories] = useState(false);

    const fetchCourses = async (categoryIds = []) => {
        try {
            const data = categoryIds.length 
                ? await CoursesService.getCoursesWithCategories(categoryIds) // Fetch courses filtered by categories
                : await CoursesService.getAllCourses(); // Fetch all courses if no category is selected
            // Filter courses to only include active ones
            const activeCourses = data.filter(course => course.isActive);
            setCourses(limit ? activeCourses.slice(0, limit) : activeCourses);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await CategoriesService.getAllCategories();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchRegistrations = async () => {
        const studentId = parseInt(localStorage.getItem('userId'), 10);
        try {
            const registeredCourses = await RegistrationsService.getRegistrationsByStudentId(studentId);
            setRegistrations(registeredCourses);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchRegistrations();
    }, []);

    useEffect(() => {
        fetchCourses(selectedCategories);
    }, [selectedCategories, limit]);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(categoryId)
                ? prevSelected.filter((id) => id !== categoryId)
                : [...prevSelected, categoryId]
        );
    };

    const filteredCourses = courses.filter(course =>
        course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    

    const handleAddToCart = async (courseId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const studentId = parseInt(localStorage.getItem('userId'), 10);

        try {
            await CartsService.addToCart(studentId, courseId);
            setSuccess('Added to cart.');
            fetchCourses(selectedCategories); // Refresh courses after adding to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const isCourseRegistered = (courseId) => {
        return registrations.some((registration) => registration.courseId === courseId);
    };

    const toggleCategories = () => {
        setShowCategories(prevShow => !prevShow); // Toggle function
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container">
            <h2 className="my-4">Courses</h2>

            {location.pathname === '/courses' && (
                <>
                    <div className="input-group mb-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search for courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-secondary mb-4" onClick={toggleCategories}>
                        {showCategories ? 'Hide' : 'Search By Categories'}
                    </button>

                    {/* Category filter */}
                    {showCategories && (
                        <div className="mb-4">
                            <h5>Select Categories</h5>
                            {categories.map((category) => (
                                <div key={category.categoryId} className="form-check form-check-inline">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`category-${category.categoryId}`}
                                        checked={selectedCategories.includes(category.categoryId)}
                                        onChange={() => handleCategoryChange(category.categoryId)}
                                    />
                                    <label className="form-check-label" htmlFor={`category-${category.categoryId}`}>
                                        {category.categoryName}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div className="row">
                {currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                        <div key={course.courseId} className="col-md-4 mb-3">
                            <div className="card shadow" onClick={() => handleCourseClick(course.courseId)} style={{ cursor: 'pointer' }}>
                                <img
                                    src={course.thumbnail ? `https://localhost:7245/uploads/thumbnails/${course.thumbnail}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'}
                                    className="card-img-top"
                                    alt={course.courseTitle}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{course.courseTitle}</h5>
                                    <p className="card-text">{course.courseDescription || 'No description available'}</p>
                                    <p className="card-text">{course.price} ฿</p>
                                    {isCourseRegistered(course.courseId) ? (
                                        <span className="badge bg-success">Registered</span>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(course.courseId);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info">No courses found</div>
                    </div>
                )}
            </div>

            {location.pathname === '/courses' && (
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};

CourseList.propTypes = {
    limit: PropTypes.number,
};

export default CourseList;
