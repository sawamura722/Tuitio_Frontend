class RegistrationsService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Registration'; // Base API endpoint for registration
    }

    // Get all registrations (admin or teacher access)
    async getAllRegistrations() {
        return this.makeRequest(`${this.baseUrl}/allregistrations`, 'GET');
    }

    // Get registrations for a specific student
    async getRegistrationsByStudentId(studentId) {
        return this.makeRequest(`${this.baseUrl}/student/${studentId}`, 'GET');
    }

    // Register a student in a course
    async registerStudentInCourse(studentId, courseId) {
        const url = `${this.baseUrl}/register?studentId=${studentId}&courseId=${courseId}`;
        return this.makeRequest(url, 'POST');
    }

    // Unregister a student from a course
    async unregisterStudentFromCourse(studentId, courseId) {
        const url = `${this.baseUrl}/unregister?studentId=${studentId}&courseId=${courseId}`;
        return this.makeRequest(url, 'DELETE');
    }

    // Get students registered for a specific course (teacher or admin access)
    async getStudentsByCourseId(courseId) {
        return this.makeRequest(`${this.baseUrl}/course/${courseId}`, 'GET');
    }

    async makeRequest(url, method) {
        const token = localStorage.getItem('token');
        const options = {
            method,
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        };

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error(`${method} request to ${url} failed:`, error);
            throw error;
        }
    }
}

export default new RegistrationsService();
