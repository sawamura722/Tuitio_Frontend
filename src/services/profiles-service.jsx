class ProfileService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/User'; 
    }

    async getUserById(userId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    }

    async updateUser(userId, userData) {
        const token = localStorage.getItem('token');


        const response = await fetch(`${this.baseUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                // 'Content-Type': 'multipart/form-data', // Do not set this header; it is automatically set by the browser
            },
            body: userData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to update user profile');
        }

        return await response.json();
    }
}

export default new ProfileService();
