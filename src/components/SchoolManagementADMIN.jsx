import React, { useEffect, useState } from 'react';
import SchoolService from '../services/schools-service';
import AdminSidebar from './AdminSidebar';

const SchoolManagementADMIN = () => {
    const [schools, setSchools] = useState([]);
    const [newSchool, setNewSchool] = useState({
        schoolTitle: '',
        location: '',
        telephone: '',
    });
    const [selectedSchool, setSelectedSchool] = useState(null);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const data = await SchoolService.getAllSchools();
            setSchools(data);
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSchool((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreateSchool = async () => {
        try {
            await SchoolService.createSchool(newSchool);
            fetchSchools();
            setNewSchool({ schoolTitle: '', location: '', telephone: '' });
        } catch (error) {
            console.error('Error creating school:', error);
        }
    };

    const handleUpdateSchool = async () => {
        if (selectedSchool) {
            const updatedSchool = {
                ...newSchool,
                schoolId: selectedSchool.schoolId,
            };
    
            try {
                await SchoolService.updateSchool(selectedSchool.schoolId, updatedSchool); 
                fetchSchools();         
                setSelectedSchool(null);
                setNewSchool({ schoolTitle: '', location: '', telephone: '' });
                
            } catch (error) {
                console.error('Error updating school:', error);
            }
        }
    };
    

    const handleEditClick = (school) => {
        setSelectedSchool(school);
        setNewSchool({
            schoolTitle: school.schoolTitle,
            location: school.location,
            telephone: school.telephone,
        });
    };

    const handleDeleteSchool = async (schoolId) => {
        try {
            await SchoolService.deleteSchool(schoolId);
            fetchSchools();
        } catch (error) {
            console.error('Error deleting school:', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Wrap everything in a flex container */}
                <AdminSidebar />
                <div className="container mt-4" style={{ flex: 1 }}> {/* Add flex: 1 to allow it to grow */}
                    <h2>Schools Management</h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="schoolTitle"
                            placeholder="School Title"
                            value={newSchool.schoolTitle}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={newSchool.location}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            name="telephone"
                            placeholder="Telephone"
                            value={newSchool.telephone}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={selectedSchool ? handleUpdateSchool : handleCreateSchool}
                        >
                            {selectedSchool ? 'Update School' : 'Add School'}
                        </button>
                        {selectedSchool && (
                            <button
                                className="btn btn-secondary ml-2"
                                onClick={() => {
                                    setSelectedSchool(null);
                                    setNewSchool({ schoolTitle: '', location: '', telephone: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Telephone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schools.map((school) => (
                                <tr key={school.schoolId}>
                                    <td>{school.schoolTitle}</td>
                                    <td>{school.location}</td>
                                    <td>{school.telephone}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => handleEditClick(school)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm ml-2"
                                            onClick={() => handleDeleteSchool(school.schoolId)}
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

export default SchoolManagementADMIN;
