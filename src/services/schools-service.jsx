class SchoolService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/School'; // Replace with your actual API URL
    }

    async getAllSchools() {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching schools:', errorData);
            throw new Error('Failed to fetch schools');
        }

        return await response.json();
    }

    async getSchoolById(schoolId) {
        const response = await fetch(`${this.baseUrl}/${schoolId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching school:', errorData);
            throw new Error('Failed to fetch school');
        }

        return await response.json();
    }

    async createSchool(schoolData) {
        const token = localStorage.getItem('token');
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(schoolData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating school:', errorData);
            throw new Error('Failed to create school');
        }

        return await response.json();
    }

    async updateSchool(schoolId, schoolData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${schoolId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(schoolData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating school:', errorData);
            throw new Error('Failed to update school');
        }
        return await response.json();
    }

    async deleteSchool(schoolId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${schoolId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting school:', errorData);
            throw new Error('Failed to delete school');
        }
    }
}

export default new SchoolService();
