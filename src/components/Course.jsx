import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoursesService from '../services/courses-service';
import UsersService from '../services/users-service';
import CartsService from '../services/carts-service';
import TopicsService from '../services/topics-service';
import LessonsService from '../services/lessons-service';
import RegistrationsService from '../services/registrations-service';
import ReviewsService from '../services/reviews-service';
import CategoriesService from '../services/categories-service';

const Course = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [teacher, setTeacher] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [lessonsByTopic, setLessonsByTopic] = useState({});
    const [isRegistered, setIsRegistered] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState(''); 
    const [enrollmentCount, setEnrollmentCount] = useState(0); 
    const [selectedRating, setSelectedRating] = useState(5); 
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
    const [categories, setCategories] = useState([]);

    const fetchCourseDetail = async () => {
        try {
            const data = await CoursesService.getCourseById(courseId);
            setCourse(data);

            if (data.teacherId) {
                const teacherData = await UsersService.getUserById(data.teacherId);
                setTeacher(teacherData);
            }

            const durationData = await CoursesService.getCourseDuration(courseId);
            const [hours, minutes] = durationData.split(':').map(Number); // Extract and convert hours and minutes
            setDuration({ hours, minutes }); // Set hours and minutes as an object in the state


            const topicsData = await TopicsService.getTopicsByCourseId(courseId);
            setTopics(topicsData);

            const studentsData = await RegistrationsService.getStudentsByCourseId(courseId);
            setEnrollmentCount(studentsData.length);

            const cat = await CategoriesService.getCategoriesByCourseId(courseId);
            setCategories(cat);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async (topicId) => {
        try {
            const lessonsData = await LessonsService.getLessonsByTopicId(topicId);
            setLessonsByTopic((prevLessons) => ({
                ...prevLessons,
                [topicId]: lessonsData,
            }));
        } catch (err) {
            console.error('Error fetching lessons:', err);
        }
    };

    const fetchRegistrationStatus = async (studentId) => {
        try {
            const registrations = await RegistrationsService.getRegistrationsByStudentId(studentId);
            const registeredCourse = registrations.some(
                (registration) => registration.courseId === Number(courseId)
            );

            setIsRegistered(registeredCourse);
        } catch (error) {
            console.error('Error checking registration status:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const reviewsData = await ReviewsService.getReviewsByCourseId(courseId);
            setReviews(reviewsData);

            const studentId = parseInt(localStorage.getItem('userId'), 10);
            const userReview = reviewsData.find(review => review.studentId === studentId);

            setUserHasReviewed(!!userReview); // Update the state if a review exists
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0; // No reviews, average is 0
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (totalRating / reviews.length).toFixed(1); // Return average rounded to one decimal place
    };
    

    useEffect(() => {
        const studentId = parseInt(localStorage.getItem('userId'), 10);
        fetchCourseDetail();
        fetchRegistrationStatus(studentId);
        fetchReviews(); // Fetch reviews when the component mounts
    }, [courseId]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        const studentId = parseInt(localStorage.getItem('userId'), 10);

        try {
            await CartsService.addToCart(studentId, courseId);
            alert('Added to cart.');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const toggleLessons = (topicId) => {
        if (lessonsByTopic[topicId]) {
            setLessonsByTopic((prevLessons) => ({
                ...prevLessons,
                [topicId]: null, // Collapse the lessons if already loaded
            }));
        } else {
            fetchLessons(topicId); // Fetch lessons if not loaded yet
        }
    };

    const handleAddReview = async () => {
        const studentId = parseInt(localStorage.getItem('userId'), 10);
        const reviewDto = {
            studentId,
            courseId: parseInt(courseId, 10), // Ensure courseId is an integer
            comment: reviewText,
            rating: selectedRating 
        };
        
    
        try {
            const newReview = await ReviewsService.addReview(reviewDto);
            setReviews((prevReviews) => [...prevReviews, newReview]);
            setReviewText(''); // Clear the review text
            setSelectedRating(5); // Reset the rating to default (optional)
            fetchReviews();
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };
    

    const handleDeleteReview = async (reviewId) => {
        try {
            await ReviewsService.deleteReview(reviewId);
            setReviews((prevReviews) => prevReviews.filter(review => review.reviewId !== reviewId));
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };
    

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    const averageRating = calculateAverageRating(); 

    return (
        <div className="container mt-5">
            {course && (
                <div className="row">
                    <div className="col-md-8">
                        <h2 className="mb-3">{course.courseTitle}</h2>
                        <p className="lead">{course.courseDescription}</p>
                        <p className="lead">{formatDate(course.createdAt)}</p>
                        <p><strong>Course Type: </strong>{course.isOnline ? "Online" : "Onsite"}</p>
                        {categories?.length > 0 ? (
                            <>
                                <p><strong>Categories:</strong></p>
                                <ul>
                                {categories.map((category, index) => (
                                    <li key={index}>{category.categoryName}</li>
                                ))}
                                </ul>
                            </>
                            ) : (
                                <p>No categories available.</p>
                            )}
                        
                        <h3>Topics</h3>
                        <ul className="list-group">
                            {topics.map((topic) => (
                                <li key={topic.topicId} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <p className="mb-0">{topic.topicTitle}</p>
                                        <button 
                                            className="btn btn-secondary"
                                            onClick={() => toggleLessons(topic.topicId)}
                                        >
                                            {lessonsByTopic[topic.topicId] ? '^' : 'v'}
                                        </button>
                                    </div>
                                    {lessonsByTopic[topic.topicId] && (
                                        <ul className="list-group mt-2">
                                            {lessonsByTopic[topic.topicId].map((lesson) => (
                                                <li key={lesson.lessonId} className="list-group-item">
                                                    {lesson.lessonTitle}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Reviews Section */}
                        <div className="mt-4">
                            <h3>Reviews</h3>
                            {reviews.length === 0 ? (
                                <p>No reviews</p>
                            ) : (
                                <ul className="list-group mb-3">
                                    {reviews.map((review) => (
                                        <li key={review.reviewId} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div>
                                                <strong>{review.student ? review.student.fullName || review.student.username : 'Anonymous'}</strong>: {review.comment}
                                                <br />
                                                <small>Rating: {review.rating || 'N/A'} ⭐</small>
                                            </div>
                                            {review.studentId === parseInt(localStorage.getItem('userId'), 10) && (
                                                <button 
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteReview(review.reviewId)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                            {isRegistered && !userHasReviewed && (
                                <div>
                                    <div className="input-group mb-2">
                                        <textarea
                                            className="form-control"
                                            placeholder="Write your review here..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            rows="3"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <strong>Rating:</strong>
                                        <div className="rating">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <span 
                                                    key={rating}
                                                    className={`star ${selectedRating >= rating ? 'selected' : ''}`}
                                                    onClick={() => setSelectedRating(rating)}
                                                    style={{ cursor: 'pointer', fontSize: '1.5rem', color: selectedRating >= rating ? '#FFD700' : '#ddd' }} // Yellow for selected, light gray for unselected
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={handleAddReview}
                                        disabled={!reviewText.trim()}
                                    >
                                        Add Review
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>

                    <div className="col-md-4 d-flex flex-column">
                        <div className="card mb-3 flex-fill">
                            <div className="card-body">
                                <img
                                    src={course.thumbnail ? `https://localhost:7245/uploads/thumbnails/${course.thumbnail}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'} 
                                    alt={course.courseTitle}
                                    className="img-fluid mb-3"
                                    style={{ borderRadius: '10px' }}
                                />
                                <h5 className="card-title">{course.courseTitle}</h5>
                                {course.isOnline && (duration.hours > 0 || duration.minutes > 0) && (
                                    <p>
                                        <strong>Duration:</strong>{" "}
                                        {`${duration.hours > 0 ? `${duration.hours} hr${duration.hours !== 1 ? 's' : ''} ` : ''}`}
                                        {`${duration.minutes > 0 ? `${duration.minutes} min${duration.minutes !== 1 ? 's' : ''}` : ''}`}
                                    </p>
                                )}


                                <p><strong>Rating:</strong> {averageRating} ⭐</p>
                                <p><strong>Enrollment:</strong> {enrollmentCount || 'N/A'} person enrolled</p>
                                {course.limit && (
                                    <p><strong>Limit:</strong> {course.limit} person</p>
                                )}
                                <h3><strong style={{ color: 'red' }}>{course.price} Baht</strong></h3>
                            </div>
                            {(!isRegistered && (course.limit === null || enrollmentCount < course.limit)) ? (
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </button>
                            ) : (course.limit !== null && enrollmentCount >= course.limit) ? (
                                <span className="badge bg-danger">Max</span> // Display Max badge if enrollmentCount reaches the limit
                            ) : (
                                <span className="badge bg-success">Registered</span>
                            )}
                        </div>
                        <div className="card mb-3 flex-fill">
                            <div className="card-body">
                                <h5 className="card-title">Instructor</h5>
                                <div className="d-flex align-items-center">
                                    <img
                                        src={teacher.profileImage ? `https://localhost:7245/uploads/profileimages/${teacher.profileImage}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'}
                                        alt={teacher.fullName || 'Instructor'}
                                        className="rounded-circle me-3"
                                        style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h6 className="card-subtitle mb-2">{teacher.fullName || 'No name available'}</h6>
                                        <p className="card-text">{teacher.bio || 'No bio available'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Course;
