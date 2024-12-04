class TopicsService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Topic';
        this.token = localStorage.getItem('token');
    }

    async getTopicsByCourseId(courseId) {
        try {
            const response = await fetch(`${this.baseUrl}/course/${courseId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to fetch topics');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getTopicById(topicId) {
        try {
            const response = await fetch(`${this.baseUrl}/${topicId}`, {
                method: 'GET',
                headers: {
                    'Authorization': this.token,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to fetch topic');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async createTopic(courseId, topicTitle) {
        try {
            const response = await fetch(`${this.baseUrl}/course/${courseId}`, {
                method: 'POST',
                headers: {
                    'Authorization': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseId, topicTitle }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to create topic');
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async updateTopic(topicId, topicTitle) {
        try {
            const response = await fetch(`${this.baseUrl}/${topicId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topicTitle }), // Only send topicTitle for update
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to update topic');
            }

        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async deleteTopic(topicId) {
        try {
            const response = await fetch(`${this.baseUrl}/${topicId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': this.token,
                },
            });
    
            // Check if the response status is OK
            if (!response.ok) {
                // Attempt to read the error response as JSON
                const errorData = await response.json();
                console.error('Error details:', errorData);
                throw new Error('Failed to delete topic');
            }
    
            // If the response status is 204 No Content, do not attempt to parse JSON
            if (response.status === 204) {
                return null; // No content to return
            }
    
            // If the response has a body (not expected for DELETE), parse it
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async getTopicDuration(topicId) {
        try {
            const response = await fetch(`${this.baseUrl}/${topicId}/duration`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching topic duration:', errorData);
                throw new Error('Failed to fetch topic duration');
            }

            return await response.json(); // Assuming the API returns the duration as JSON
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
    
}

export default new TopicsService();
