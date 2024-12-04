import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import CategoriesService from '../services/categories-service';
import withTeacherAuth from './withTeacherAuth';

const CategoriesOfCourseManagementTEACHER = () => {
    const { courseId } = useParams();
    const [categories, setCategories] = useState([]);
    const [courseCategories, setCourseCategories] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAllCategories = async () => {
        try {
            const data = await CategoriesService.getAllCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch all categories.');
        }
    };

    const fetchCourseCategories = async () => {
        try {
            const data = await CategoriesService.getCategoriesByCourseId(courseId);
            setCourseCategories(data);
        } catch (err) {
            setError('Failed to fetch course categories.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (categoryId) => {
        try {
            await CategoriesService.addCategoryToCourse(courseId, categoryId);
            setSuccess('Category added to the course.');
            fetchCourseCategories(); // Refresh the course categories after adding
        } catch (err) {
            setError('Failed to add category to course.');
        }
    };

    const handleRemoveCategory = async (categoryId) => {
        try {
            await CategoriesService.removeCategoryFromCourse(courseId, categoryId);
            setSuccess('Category removed from the course.');
            fetchCourseCategories(); // Refresh the course categories after removal
        } catch (err) {
            setError('Failed to remove category from course.');
        }
    };

    useEffect(() => {
        fetchAllCategories();
        fetchCourseCategories();
    }, [courseId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <h3 className="my-4">Manage Categories for Course</h3>
            {success && <div className="alert alert-success">{success}</div>}

            <h5>Current Categories:</h5>
            {courseCategories.length > 0 ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseCategories.map((category) => (
                            <tr key={category.categoryId}>
                                <td>{category.categoryName}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveCategory(category.categoryId)}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No categories assigned to this course.</p>
            )}

            <h5>Add New Category:</h5>
            {categories.filter((cat) => !courseCategories.some((cc) => cc.categoryId === cat.categoryId)).length > 0 ? (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories
                            .filter((cat) => !courseCategories.some((cc) => cc.categoryId === cat.categoryId))
                            .map((category) => (
                                <tr key={category.categoryId}>
                                    <td>{category.categoryName}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAddCategory(category.categoryId)}
                                        >
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <p>All categories have been assigned to this course.</p>
            )}
        </div>

    );
};

CategoriesOfCourseManagementTEACHER.propTypes = {
    courseId: PropTypes.number.isRequired,
};

export default withTeacherAuth(CategoriesOfCourseManagementTEACHER);
