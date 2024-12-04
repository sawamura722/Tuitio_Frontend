import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationsService from '../services/registrations-service';
import CoursesService from '../services/courses-service';

const StudentCourses = () => {
    const [registeredCourses, setRegisteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRegisteredCourses = async (studentId) => {
        try {
            const registrations = await RegistrationsService.getRegistrationsByStudentId(studentId);
            const courseIds = registrations.map((registration) => registration.courseId);

            // Fetch course details for each registered courseId
            const coursePromises = courseIds.map((id) => CoursesService.getCourseById(id));
            const courses = await Promise.all(coursePromises);

            setRegisteredCourses(courses);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const studentId = parseInt(localStorage.getItem('userId'), 10);

        if (!studentId) {
            navigate('/login');
            return;
        }

        fetchRegisteredCourses(studentId);
    }, [navigate]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <h2>Your Registered Courses</h2>
            {registeredCourses.length > 0 ? (
                <div className="row">
                    {registeredCourses.map((course) => (
                        <div className="col-md-4 mb-4" key={course.courseId}>
                            <div className="card">
                                <img
                                    src={course.thumbnail ? `https://localhost:7245/uploads/thumbnails/${course.thumbnail}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'} 
                                    alt={course.courseTitle}
                                    className="card-img-top"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{course.courseTitle}</h5>
                                    <p className="card-text">{course.courseDescription}</p>
                                    <p><strong>Price:</strong> {course.price} Baht</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/courses/${course.courseId}/detail`)}
                                    >
                                        Go to Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">You have no registered courses.</div>
            )}
        </div>
    );
};

export default StudentCourses;
