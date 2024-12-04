import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LessonsService from '../services/lessons-service';
import TopicsService from '../services/topics-service';

const LessonDetail = () => {
    const { lessonId, courseId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [lessonsByTopic, setLessonsByTopic] = useState({});
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedTopics, setExpandedTopics] = useState({}); // Track expanded topics

    const fetchLessonData = async () => {
        try {
            // Fetch topics for the course first
            const topicsData = await TopicsService.getTopicsByCourseId(courseId);
            setTopics(topicsData);

            // Fetch the current lesson
            const lessonData = await LessonsService.getLessonByLessonId(lessonId);
            setLesson(lessonData);

            // Fetch lessons for all topics
            const lessonsByTopicData = {};

            for (const topic of topicsData) {
                const lessonsData = await LessonsService.getLessonsByTopicId(topic.topicId);
                lessonsByTopicData[topic.topicId] = lessonsData; // Group lessons by topic ID
            }

            // Set the lessons by topic
            setLessonsByTopic(lessonsByTopicData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLessonData();
    }, [lessonId, courseId]);

    // Function to toggle the visibility of lessons
    const toggleTopic = (topicId) => {
        setExpandedTopics((prev) => ({
            ...prev,
            [topicId]: !prev[topicId], // Toggle the visibility for the topic
        }));
    };

    // Function to format duration as "X hours Y minutes"
    const formatDuration = (duration) => {
        // Check if duration is a valid string
        if (!duration || typeof duration !== 'string') {
            return 'Duration not available';
        }
    
        console.log(duration); // Log the raw duration
    
        // Split the duration by ":" (expected format: "hh:mm:ss.fraction")
        const [hours, minutes, secondsWithFraction] = duration.split(':');
        console.log(hours); // Log hours
        console.log(minutes); // Log minutes
        console.log(secondsWithFraction); // Log seconds with fraction
    
        // Parse hours and minutes as integers
        const parsedHours = parseInt(hours, 10);
        const parsedMinutes = parseInt(minutes, 10);
        
        // Parse seconds to extract whole seconds
        const parsedSeconds = Math.floor(parseFloat(secondsWithFraction)); // Convert to float and take only the whole number part
    
        // Check if the parsed values are valid numbers
        if (isNaN(parsedHours) || isNaN(parsedMinutes) || isNaN(parsedSeconds)) {
            return 'Duration not available';
        }
    
        // Display hours, minutes, and seconds as a formatted string
        return `${parsedHours} hour${parsedHours !== 1 ? 's' : ''} ${parsedMinutes} minute${parsedMinutes !== 1 ? 's' : ''}`;
    };
    
       
    
    
    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Main Video Section */}
                <div className="col-md-8">
                    {lesson && (
                        <div>
                            <video
                                src={`https://localhost:7245/uploads/videos/${lesson.videoUrl}`}
                                controls
                                className="w-100 mb-3"
                                style={{ maxHeight: '500px' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                            <h2>{lesson.lessonTitle}</h2>
                            <p>{lesson.lessonContent}</p>
                        </div>
                    )}
                </div>

                {/* Topics and Videos Section */}
                <div className="col-md-4">
                    <h4>Topics</h4>
                    <div className="list-group">
                        {topics.map((topic) => (
                            <div 
                                key={topic.topicId} 
                                className={`list-group-item ${lesson && topic.topicId === lesson.topicId ? 'bg-light' : ''}`} // Grey background for current topic
                            >
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{topic.topicTitle}</h5>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setExpandedTopics(prev => ({ ...prev, [topic.topicId]: !prev[topic.topicId] }))}
                                    >
                                        {expandedTopics[topic.topicId] ? 'Hide' : 'Show'}
                                    </button>
                                </div>

                                {expandedTopics[topic.topicId] && (
                                    <div className={`list-group-item ${lesson && topic.topicId === lesson.topicId ? 'bg-light text-muted' : ''}`}>
                                        {lessonsByTopic[topic.topicId] && lessonsByTopic[topic.topicId].length > 0 ? (
                                            lessonsByTopic[topic.topicId].map((video) => (
                                                <a
                                                    key={video.lessonId}
                                                    href={`/courses/${courseId}/detail/lesson/${video.lessonId}`}
                                                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${video.lessonId === lesson.lessonId ? 'bg-secondary text-white' : ''}`} // Grey background for current lesson
                                                >
                                                    <span>{video.lessonTitle}</span>
                                                    <span>{formatDuration(video.duration)}</span> {/* Duration displayed on the right */}
                                                </a>
                                            ))
                                        ) : (
                                            <p>No lessons available for this topic.</p>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;
