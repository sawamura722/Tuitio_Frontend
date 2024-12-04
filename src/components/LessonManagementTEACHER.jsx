import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LessonsService from '../services/lessons-service';
import CoursesService from '../services/courses-service';
import withTeacherAuth from './withTeacherAuth';
import TeacherSidebar from './TeacherSidebar';
import Swal from 'sweetalert2';

const LessonManagementTEACHER = () => {
    const { topicId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [online, setOnline] = useState(false);
    const [lessonForm, setLessonForm] = useState({
        lessonId: null,
        lessonTitle: '',
        lessonContent: '',
        image: null,
        video: null,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        fetchLessons();
    }, [topicId]);

    const fetchLessons = async () => {
        try {
            const data = await LessonsService.getLessonsByTopicId(topicId);
            setLessons(data);
        } catch (error) {
            console.error('Error fetching lessons:', error);
            Swal.fire('Error', 'Failed to fetch lessons. Please try again later.', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLessonForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setLessonForm((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (lessonForm.lessonId) formData.append('lessonId', lessonForm.lessonId);
        formData.append('lessonTitle', lessonForm.lessonTitle);
        formData.append('lessonContent', lessonForm.lessonContent);
        formData.append('topicId', topicId);
        if (lessonForm.image) formData.append('image', lessonForm.image);
        if (lessonForm.video) formData.append('video', lessonForm.video);

        try {
            if (isEditing) {
                await LessonsService.updateLesson(lessonForm.lessonId, formData);
                Swal.fire('Success', 'Lesson updated successfully!', 'success');
            } else {
                await LessonsService.createLesson(formData);
                Swal.fire('Success', 'Lesson created successfully!', 'success');
            }
            await fetchLessons();
            resetForm();
        } catch (error) {
            console.error('Error submitting lesson:', error);
            Swal.fire('Error', 'Failed to submit lesson. Please try again.', 'error');
        }
    };

    const handleEdit = (lesson) => {
        setIsEditing(true);
        setLessonForm({
            lessonId: lesson.lessonId,
            lessonTitle: lesson.lessonTitle,
            lessonContent: lesson.lessonContent,
            image: null,
            video: null,
        });
        setIsFormVisible(true);
    };

    const handleDelete = async (lessonId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the lesson.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                await LessonsService.deleteLesson(lessonId);
                Swal.fire('Deleted!', 'Lesson has been deleted.', 'success');
                fetchLessons();
            } catch (error) {
                console.error('Error deleting lesson:', error);
                Swal.fire('Error', 'Failed to delete lesson. Please try again.', 'error');
            }
        }
    };

    const resetForm = () => {
        setLessonForm({
            lessonId: null,
            lessonTitle: '',
            lessonContent: '',
            image: null,
            video: null,
        });
        setIsEditing(false);
        setIsFormVisible(false);
    };

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Flex container */}
                <TeacherSidebar />
                <div className="container mt-5">
                
                <h2 className="mb-4">Lesson Management</h2>
                <button 
                    onClick={() => setIsFormVisible((prev) => !prev)} 
                    className="btn btn-secondary mb-4"
                >
                    {isFormVisible ? 'Hide Form' : 'Add Lesson'}
                </button>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-3">
                            <label htmlFor="lessonTitle" className="form-label">Lesson Title:</label>
                            <input
                                type="text"
                                id="lessonTitle"
                                name="lessonTitle"
                                value={lessonForm.lessonTitle}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lessonContent" className="form-label">Lesson Content:</label>
                            <textarea
                                id="lessonContent"
                                name="lessonContent"
                                value={lessonForm.lessonContent}
                                onChange={handleInputChange}
                                className="form-control"
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image:</label>
                            <input 
                                type="file" 
                                id="image" 
                                name="image" 
                                onChange={handleFileChange} 
                                className="form-control" 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="video" className="form-label">Video:</label>
                            <input 
                                type="file" 
                                id="video" 
                                name="video" 
                                onChange={handleFileChange} 
                                className="form-control" 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">
                            {isEditing ? 'Update Lesson' : 'Create Lesson'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancel
                            </button>
                        )}
                    </form>
                )}

                <h3 className="mb-3">Lessons</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Thumbnail</th>
                            <th>Video</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessons.map((lesson) => (
                            <tr key={lesson.lessonId}>
                                <td>{lesson.lessonTitle}</td>
                                <td>{lesson.lessonContent}</td>
                                <td>
                                    {lesson.thumbnail && (
                                        <img 
                                            src={lesson.thumbnail ? `https://localhost:7245/uploads/thumbnails/${lesson.thumbnail}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'} 
                                            alt={lesson.lessonTitle} 
                                            width="300" 
                                            className="img-thumbnail mb-2" 
                                        />
                                    )}
                                </td>
                                <td>
                                    {lesson.videoUrl && (
                                        <video controls width="300" className="mb-2">
                                            <source src={lesson.videoUrl ? `https://localhost:7245/uploads/videos/${lesson.videoUrl}` : 'https://via.placeholder.com/241x121?text=No+Image+Available'} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(lesson)} 
                                        className="btn btn-warning me-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(lesson.lessonId)} 
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
        
    );
};

export default withTeacherAuth(LessonManagementTEACHER);
