import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CoursesService from '../services/courses-service';
import RegistrationsService from '../services/registrations-service';
import TeacherSidebar from './TeacherSidebar';

const CourseStudents = () => {
    const [students, setStudents] = useState([]);
    const [courseName, setCourseName] = useState('');
    const { courseId } = useParams(); // Extract courseId from the URL path

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
            fetchStudents();
        }
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            const course = await CoursesService.getCourseById(courseId);
            setCourseName(course.courseTitle);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const studentsData = await RegistrationsService.getStudentsByCourseId(courseId);
            setStudents(studentsData);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    return (
        <>
            <TeacherSidebar />
            <div className="container">
                <h1>Students of {courseName}</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Registration Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map(student => (
                                <tr key={student.registrationId}>
                                    <td>{student.student?.username || 'N/A'}</td>
                                    <td>{student.student?.fullName || 'N/A'}</td>
                                    <td>{student.student?.email || 'N/A'}</td>
                                    <td>{new Date(student.registrationDate).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No students found for this course.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CourseStudents;
