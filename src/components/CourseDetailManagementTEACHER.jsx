import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopicsService from '../services/topics-service';
import TeacherSidebar from './TeacherSidebar';
import Swal from 'sweetalert2';
import withTeacherAuth from './withTeacherAuth';

const CourseDetailManagementTEACHER = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('list'); // 'list', 'edit', 'create'
    const [currentTopic, setCurrentTopic] = useState(null);
    const [formData, setFormData] = useState({
        TopicTitle: '',
    });

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const data = await TopicsService.getTopicsByCourseId(courseId);
            setTopics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopicById = async (topicId) => {
        try {
            const data = await TopicsService.getTopicById(topicId);
            setCurrentTopic(data);
            setFormData({
                TopicTitle: data.topicTitle || '',
            });
            setMode('edit');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteTopic = async (topicId) => {
        const result = await Swal.fire({
            title: 'Are you sure you want to delete this topic?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });

        if (result.isConfirmed) {
            try {
                await TopicsService.deleteTopic(topicId);
                setTopics(topics.filter(topic => topic.topicId !== topicId));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Topic deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                setError('Could not delete topic. Please try again later.');
            }
        }
    };

    const handleSubmitTopic = async (e) => {
        e.preventDefault();

        try {
            if (mode === 'edit') {
                await TopicsService.updateTopic(currentTopic.topicId, formData.TopicTitle); // Pass only the title
                Swal.fire({
                    title: 'Topic Updated Successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                const createdTopic = await TopicsService.createTopic(courseId, formData.TopicTitle); // Pass only the title
                setTopics([...topics, createdTopic]);
                Swal.fire({
                    title: 'Topic Created Successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            setMode('list');
            fetchTopics();
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            TopicTitle: '',
        });
        setCurrentTopic(null);
    };

    const handleViewStudents = (courseId) => {
        navigate(`/teacher/dashboard/course_students?courseId=${courseId}`);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Flex container */}
            <TeacherSidebar />
            <div className="col">
                <h1 className="text-center">Manage Topics for Course</h1>
                <div>
                    {mode === 'list' ? (
                        <div>
                            <button onClick={() => setMode('create')} className="btn btn-primary">Create New Topic</button>
                            <div className="mt-3">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Topic Title</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topics.map(topic => (
                                            <tr key={topic.topicId}>
                                                <td>{topic.topicTitle}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => fetchTopicById(topic.topicId)} 
                                                        className="btn btn-warning">
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteTopic(topic.topicId)} 
                                                        className="btn btn-danger ms-2">
                                                        Delete
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate(`/teacher/course/detail/${courseId}/topic/${topic.topicId}`)} 
                                                        className="btn btn-info ms-2">
                                                        Manage Lessons
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitTopic} className="mt-4">
                            <h2>{mode === 'edit' ? 'Edit Topic' : 'Create Topic'}</h2>
                            <div className="mb-3">
                                <label htmlFor="topicTitle" className="form-label">Topic Title</label>
                                <input
                                    type="text"
                                    id="topicTitle"
                                    name="TopicTitle"
                                    value={formData.TopicTitle}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">{mode === 'edit' ? 'Update' : 'Create'}</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => setMode('list')}>Cancel</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default withTeacherAuth(CourseDetailManagementTEACHER);
