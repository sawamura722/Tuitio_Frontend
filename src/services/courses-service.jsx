class CoursesService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Course'; // Replace with your actual API URL
    }

    async getAllCourses() {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching courses:', errorData);
            throw new Error('Failed to fetch courses');
        }

        return await response.json();
    }

    async getCourseById(courseId) {
        const response = await fetch(`${this.baseUrl}/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching course:', errorData);
            throw new Error('Failed to fetch course');
        }

        return await response.json();
    }

    async getCoursesByTeacherId(teacherId) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${this.baseUrl}/teacher/${teacherId}`, {
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching courses by teacher ID:', errorData);
                throw new Error('Failed to fetch courses by teacher ID');
            }
    
            return await response.json(); // Assuming the API returns the courses as JSON
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
    

    async createCourse(formData) {
        const token = localStorage.getItem('token');
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating course:', errorData);
            throw new Error('Failed to create course');
        }

        return await response.json();
    }

    async updateCourse(courseId, formData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${courseId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating course:', errorData);
            throw new Error('Failed to update course');
        }
        return await response.json();
    }

    async deleteCourse(courseId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting course:', errorData);
            throw new Error('Failed to delete course');
        }
    }

    async getCoursesWithCategories(categoryIds) {
        try {
            // Join the category IDs into a query string
            const queryParams = categoryIds.map(id => `categoryIds=${encodeURIComponent(id)}`).join('&');
            const response = await fetch(`${this.baseUrl}/WithCategories?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching courses with categories:', errorData);
                throw new Error('Failed to fetch courses with categories');
            }
    
            return await response.json(); // Assuming the API returns the courses as JSON
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }    

    async getCourseDuration(courseId) {
        try {
            const response = await fetch(`${this.baseUrl}/${courseId}/duration`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching course duration:', errorData);
                throw new Error('Failed to fetch course duration');
            }

            return await response.json(); // Assuming the API returns the duration as JSON
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
}

export default new CoursesService();
