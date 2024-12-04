class LessonsService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Lesson'; // Replace with your actual API URL
    }

    async getLessonsByTopicId(topicId) {
        const response = await fetch(`${this.baseUrl}/topic/${topicId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching lessons:', errorData);
            throw new Error('Failed to fetch lessons');
        }

        return await response.json();
    }

    async getLessonByLessonId(lessonId) {
        const response = await fetch(`${this.baseUrl}/${lessonId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching lesson:', errorData);
            throw new Error('Failed to fetch lesson');
        }

        return await response.json();
    }

    async createLesson(formData) {
        const token = localStorage.getItem('token');
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Accept': 'application/json'
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating lesson:', errorData);
            throw new Error('Failed to create lesson');
        }

        return await response.json();
    }

    async updateLesson(lessonId, formData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${lessonId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Accept': 'application/json'
            },
            body: formData,
        });
    
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (error) {
                console.error('Error parsing error response:', error);
            }
            console.error('Error updating lesson:', errorData);
            throw new Error('Failed to update lesson');
        }
    
        try {
            // Only attempt to parse JSON if there's a content length or content type header indicating JSON.
            return response.status !== 204 && response.headers.get('Content-Length') !== '0'
                ? await response.json()
                : {};
        } catch (error) {
            console.error('Error parsing response JSON:', error);
            return {};
        }
    }
    

    async deleteLesson(lessonId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${lessonId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting lesson:', errorData);
            throw new Error('Failed to delete lesson');
        }
    }
}

export default new LessonsService();
