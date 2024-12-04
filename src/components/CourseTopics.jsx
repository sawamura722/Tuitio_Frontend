import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import CoursesService from '../services/courses-service';
import TopicsService from '../services/topics-service';
import LessonsService from '../services/lessons-service';
import RegistrationsService from '../services/registrations-service';

const CourseTopics = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [topics, setTopics] = useState([]);
    const [lessons, setLessons] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const fetchCourseData = async () => {
        try {
            const courseData = await CoursesService.getCourseById(courseId);
            setCourse(courseData);

            const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage

            // Fetch registrations for the current student
            const registrations = await RegistrationsService.getRegistrationsByStudentId(userId);

            // Check if any registration matches the current courseId
            const registrationExists = registrations.some(reg => reg.courseId === parseInt(courseId));
            setIsRegistered(registrationExists);

            const topicsData = await TopicsService.getTopicsByCourseId(courseId);
            setTopics(topicsData);

            // Fetch lessons for each topic
            const lessonsData = {};
            for (const topic of topicsData) {
                const lessons = await LessonsService.getLessonsByTopicId(topic.topicId);
                lessonsData[topic.topicId] = lessons;
            }
            setLessons(lessonsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    // Redirect if not registered
    if (!isRegistered) {
        return <Navigate to="/403" replace />; // Redirect to a 403 page or any other page
    }

    return (
        <div className="container mt-5">
            {course && (
                <div>
                    <h2>{course.courseTitle}</h2>
                    <p>{course.courseDescription}</p>
                    <p><strong>Location:</strong> {course.location}</p>
                    <h3>Topics</h3>
                    {topics.map((topic) => (
                        <div key={topic.topicId} className="mb-4">
                            <h4>{topic.topicTitle}</h4>
                            <div className="row">
                                {lessons[topic.topicId] && lessons[topic.topicId].map((lesson) => (
                                    <div key={lesson.lessonId} className="col-md-4 mb-3">
                                        <div className="card">
                                            <img
                                                src={lesson.thumbnail ? 
                                                    `https://localhost:7245/uploads/thumbnails/${lesson.thumbnail}` : 
                                                    'https://via.placeholder.com/320x180?text=No+Thumbnail'
                                                }
                                                className="card-img-top"
                                                alt={lesson.lessonTitle}
                                                style={{ height: '180px', objectFit: 'cover' }}
                                            />
                                            <div className="card-body">
                                                <h5 className="card-title">{lesson.lessonTitle}</h5>
                                                {course.isOnline && (
                                                    <>
                                                        <p className="card-text text-truncate">{lesson.lessonContent}</p>
                                                        <a href={`/courses/${courseId}/detail/lesson/${lesson.lessonId}`} className="btn btn-primary">
                                                            Watch Video
                                                        </a>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseTopics;
