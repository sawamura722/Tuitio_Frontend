import React, { useEffect, useState } from 'react';
import SchoolService from '../services/schools-service'; // Adjust the path as needed
import { Table, Container } from 'react-bootstrap'; // If using Bootstrap for styling

const Schools = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const data = await SchoolService.getAllSchools();
                setSchools(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching schools:', error);
                setError('Failed to load schools');
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <h2 className="my-4">School List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Telephone</th>
                    </tr>
                </thead>
                <tbody>
                    {schools.map((school) => (
                        <tr key={school.schoolId}>
                            <td>{school.schoolTitle}</td>
                            <td>{school.location}</td>
                            <td>{school.telephone}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Schools;
