class UsersService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/User'; 
        this.token = localStorage.getItem('token');
    }

    async getAllUsers() {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.token, // Authorization for ADMIN role
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to fetch users');
        }

        return await response.json();
    }

    async getUserById(id) {
        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to fetch user');
        }

        return await response.json();
    }

    async updateUser(id, userData) {
        const formData = new FormData();

        // Append user data to FormData
        for (const key in userData) {
            formData.append(key, userData[key]);
        }

        const response = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': this.token, // Authorization for USER role
                // 'Content-Type': 'multipart/form-data', // Do not set this header; it is automatically set by the browser
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to update user');
        }

        return await response.json();
    }
}

export default new UsersService();
