import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CoursesService from '../services/courses-service'; 
import TeacherSidebar from './TeacherSidebar';
import Swal from 'sweetalert2';
import withTeacherAuth from './withTeacherAuth';

const CourseManagementTEACHER = () => {
    const navigate = useNavigate();
    const { teacherId } = useParams(); 
    const { id } = useParams(); 

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('list'); // 'list', 'edit', 'create'
    const [currentCourse, setCurrentCourse] = useState(null);
    const [formData, setFormData] = useState({
        CourseTitle: '',
        CourseDescription: '',
        Price: '',
        IsOnline: false,
        TeacherId: parseInt(localStorage.getItem('userId')),
        IsActive: true,
        Location: '',
        Limit: '',
        StartTimeAt: null,
        EndTimeAt: null,
        StartDateAt: null,
        EndDateAt: null,
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false,
    });
    const [imageFile, setImageFile] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalCourses, setTotalCourses] = useState(0);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const data = await CoursesService.getCoursesByTeacherId(teacherId);
            setCourses(data);
            setTotalCourses(data.length);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [teacherId, id]);

    const filteredCourses = courses.filter(course =>
        course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchCourseById = async (courseId) => {
        try {
            const data = await CoursesService.getCourseById(courseId);
            setCurrentCourse(data);
            setFormData({
                CourseId: courseId,
                CourseTitle: data.courseTitle || '',
                CourseDescription: data.courseDescription || '',
                Price: data.price || '',
                IsOnline: data.isOnline || false,
                TeacherId: data.teacherId,
                IsActive: data.isActive || true,
                Location: data.location || '',
                Limit: data.limit || '',
                StartTimeAt: data.startTimeAt || null,
                EndTimeAt: data.endTimeAt || null,
                StartDateAt: data.startDateAt || null,
                EndDateAt: data.endDateAt || null,
                Thumbnail: data.thumbnail || null,
                Monday: data.monday || false,
                Tuesday: data.tuesday || false,
                Wednesday: data.wednesday || false,
                Thursday: data.thursday || false,
                Friday: data.friday || false,
                Saturday: data.saturday || false,
                Sunday: data.sunday || false,
            });
            
            setMode('edit');
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCourseById(id);
        }
    }, [id]);

    const handleAddCategoryToCourse = async () => {

    }

    const handleDeleteCourse = async (courseId) => {
        const result = await Swal.fire({
            title: 'Are you sure you want to delete this course?',
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
                await CoursesService.deleteCourse(courseId);
                setCourses(courses.filter(course => course.courseId !== courseId));
                setTotalCourses(totalCourses - 1);
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Course deleted successfully!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                setError('Could not delete course. Please try again later.');
            }
        }
    };

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        
        const form = new FormData();
        
        // Append only fields with non-empty values
        for (const [key, value] of Object.entries(formData)) {
            if (value !== '' && value !== null) {
                form.append(key, value);
            }
        }
        
        // Append image file if it exists
        if (imageFile) {
            form.append('Image', imageFile);
        }
        
        console.log([...form]); // Log FormData entries for debugging
        
        try {
            if (mode === 'edit') {
                const response = await CoursesService.updateCourse(currentCourse.courseId, form);
                console.log('Update Response:', response);
                Swal.fire({
                    title: 'Course Updated Successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                const createdCourse = await CoursesService.createCourse(form);
                setCourses([...courses, createdCourse]);
                setTotalCourses(totalCourses + 1);
                Swal.fire({
                    title: 'Course Created Successfully',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            setMode('list');
            resetForm();
            fetchCourses();
        } catch (err) {
            console.error(err); // Log the error for further inspection
        
            // Show a generic failure message
            Swal.fire({
                title: 'Error',
                text: 'Cannot create or update course which is overlap your exist courses.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }        
    };    
    
    const resetForm = () => {
        setFormData({
            CourseTitle: '',
            CourseDescription: '',
            Price: '',
            IsOnline: false,
            TeacherId: parseInt(localStorage.getItem('userId')),
            IsActive: true,
            Location: '',
            Limit: '',
            StartTimeAt: null,
            EndTimeAt: null,
            StartDateAt: null,
            EndDateAt: null,
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            Sunday: false,
        });
        setImageFile(null);
    };
    
    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
    
        if (type === 'checkbox') {
            // Handle checkbox input
            setFormData(prevData => ({ ...prevData, [name]: checked }));  // Set to true or false
        } else {
            // Handle other inputs
            if (name === 'IsOnline' || name === 'IsActive') {
                // Set to boolean based on string comparison
                setFormData(prevData => ({ ...prevData, [name]: value === 'true' }));
            } else {
                setFormData(prevData => ({ ...prevData, [name]: value }));
            }
        }
    };          
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCourses.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Flex container */}
            <TeacherSidebar />
            <div className="col">
                <h1 className="text-center">Course Management</h1>
                <div>
                    {mode === 'list' ? (
                        <div>
                            <button onClick={() => setMode('create')} className="btn btn-primary">Create New Course</button>
                            <div className="mb-3 mt-3">
                                <input
                                    type="text"
                                    placeholder="Search Courses..."
                                    className="form-control"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mt-3">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Course Image</th>
                                            <th>Course Title</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCourses.map(course => (
                                            <tr key={course.courseId}>
                                                <td>
                                                    <img 
                                                        src={course.thumbnail ? `https://localhost:7245/uploads/thumbnails/${course.thumbnail}` : '/path/to/placeholder-image.jpg'} 
                                                        style={{ width: '50px', height: 'auto' }} 
                                                        alt={course.courseTitle}
                                                    />
                                                </td>
                                                <td>{course.courseTitle}</td>
                                                <td>{course.courseDescription}</td>
                                                <td>{course.price}</td>
                                                <td>
                                                    <button onClick={() => { setCurrentCourse(course); fetchCourseById(course.courseId) }} className="btn btn-warning">Edit</button>
                                                    <button onClick={() => handleDeleteCourse(course.courseId)} className="btn btn-danger">Delete</button>
                                                    <button 
                                                        onClick={() => navigate(`/teacher/course/detail/${course.courseId}`)} 
                                                        className="btn btn-info ms-2">
                                                        Manage Topics
                                                    </button>
                                                    <button 
                                                        onClick={() => navigate(`/teacher/course/categories/${course.courseId}`)} 
                                                        className="btn btn-info ms-2">
                                                        Manage Categories of Course
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <nav>
                                    <ul className="pagination">
                                        {pageNumbers.map(number => (
                                            <li key={number} className="page-item">
                                                <button onClick={() => handlePageChange(number)} className="page-link">{number}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitCourse} className="mt-4">
                            <h2>{mode === 'edit' ? 'Edit Course' : 'Create Course'}</h2>
                            
                            <div className="mb-3">
                                <label htmlFor="courseTitle" className="form-label">Course Title</label>
                                <input
                                    type="text"
                                    id="courseTitle"
                                    name="CourseTitle"
                                    value={formData.CourseTitle}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="courseDescription" className="form-label">Course Description</label>
                                <textarea
                                    id="courseDescription"
                                    name="CourseDescription"
                                    value={formData.CourseDescription}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="Price"
                                    value={formData.Price}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Is Online?</label>
                                <select 
                                    name="IsOnline" 
                                    onChange={handleInputChange} 
                                    value={formData.IsOnline} 
                                    className="form-select" 
                                    required
                                >
                                    <option value={false}>No</option>
                                    <option value={true}>Yes</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Is Active?</label>
                                <select 
                                    name="IsActive" 
                                    onChange={handleInputChange} 
                                    value={formData.IsActive} 
                                    className="form-select" 
                                    required
                                >
                                    <option value={true}>Yes</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>

                            {!formData.IsOnline && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="Location"
                                            value={formData.Location}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Limit</label>
                                        <input
                                            type="number"
                                            name="Limit"
                                            value={formData.Limit}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Start Time</label>
                                        <input
                                            type="time"
                                            name="StartTimeAt"
                                            value={formData.StartTimeAt || ''}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">End Time</label>
                                        <input
                                            type="time"
                                            name="EndTimeAt"
                                            value={formData.EndTimeAt || ''}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            name="StartDateAt"
                                            value={formData.StartDateAt || ''}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            name="EndDateAt"
                                            value={formData.EndDateAt || ''}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Select Days</label>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="monday"
                                                name="Monday"
                                                checked={formData.Monday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="monday" className="form-check-label">Monday</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="tuesday"
                                                name="Tuesday"
                                                checked={formData.Tuesday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="tuesday" className="form-check-label">Tuesday</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="wednesday"
                                                name="Wednesday"
                                                checked={formData.Wednesday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="wednesday" className="form-check-label">Wednesday</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="thursday"
                                                name="Thursday"
                                                checked={formData.Thursday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="thursday" className="form-check-label">Thursday</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="friday"
                                                name="Friday"
                                                checked={formData.Friday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="friday" className="form-check-label">Friday</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="saturday"
                                                name="saturday"
                                                checked={formData.Saturday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="saturday" className="form-check-label">Saturday</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="sunday"
                                                name="Sunday"
                                                checked={formData.Sunday}
                                                onChange={handleInputChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="sunday" className="form-check-label">Sunday</label>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="Image" className="form-label">Product Image</label>
                                        
                                        {/* Display the current image if editing and imageUrl exists */}
                                        {formData.Thumbnail && (
                                            <div className="mb-3">
                                                <img 
                                                    src={`https://localhost:7245/uploads/thumbnails/${formData.Thumbnail}`} 
                                                    alt="Current Thumbnail Image" 
                                                    style={{ width: '100px', height: 'auto' }} 
                                                    className="img-thumbnail"
                                                />
                                            </div>
                                        )}
                                        
                                        {/* File input for uploading a new image */}
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            onChange={(e) => setImageFile(e.target.files[0])} 
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" className="btn btn-primary">{mode === 'edit' ? 'Update Course' : 'Create Course'}</button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => setMode('list')}>Cancel</button>
                        </form>

                    )}
                </div>
            </div>
        </div>
    );
};

export default withTeacherAuth(CourseManagementTEACHER);
