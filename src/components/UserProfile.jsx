import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilesService from '../services/profiles-service';
import Swal from 'sweetalert2';

const UserProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [updatedProfile, setUpdatedProfile] = useState({
        username: '',
        email: '',
        fullName: '',
        Image: null // Updated to match DTO property
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await ProfilesService.getUserById(id);
                setProfile(userProfile);
                setUpdatedProfile({
                    username: userProfile.username,
                    email: userProfile.email,
                    fullName: userProfile.fullName,
                    Image: null
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load user profile');
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setUpdatedProfile((prevProfile) => ({
            ...prevProfile,
            Image: e.target.files[0] // Update to match DTO property
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            const formData = new FormData();
            formData.append('Username', updatedProfile.username);
            formData.append('Email', updatedProfile.email);
            formData.append('FullName', updatedProfile.fullName);
            if (updatedProfile.Image) {
                formData.append('Image', updatedProfile.Image); // Updated to match DTO property
            }

            const updatedData = await ProfilesService.updateUser(id, formData);
            setProfile(updatedData);

            Swal.fire({
                title: 'Profile Updated!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error('Update Profile Error:', err);
            setError('Failed to update profile');
        }        
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;

    return (
        <div className="container">
            <h2>User Profile</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div>
                <h5>Username: {profile.username}</h5>
                <h5>Email: {profile.email}</h5>
                <h5>Full Name: {profile.fullName || 'N/A'}</h5>
                {profile.profileImage && (
                    <img src={`https://localhost:7245/Uploads/ProfileImages/${profile.profileImage}`} alt="Profile" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
                )}
                <form className="mt-4">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={updatedProfile.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={updatedProfile.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fullName"
                            value={updatedProfile.fullName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Profile Image</label>
                        <input
                            type="file"
                            className="form-control"
                            name="Image" // Updated to match DTO property
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="button" className="btn btn-warning mt-3" onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
