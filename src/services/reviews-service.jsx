class ReviewsService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Review'; // Base API endpoint for reviews
    }

    // Get reviews for a specific course
    async getReviewsByCourseId(courseId) {
        return this.makeRequest(`${this.baseUrl}/course/${courseId}`, 'GET');
    }

    // Add a new review
    async addReview(reviewDto) {
        return this.makeRequest(this.baseUrl, 'POST', reviewDto);
    }

    // Delete a review by reviewId
    async deleteReview(reviewId) {
        return this.makeRequest(`${this.baseUrl}/${reviewId}`, 'DELETE');
    }

    async makeRequest(url, method, body = null) {
        const token = localStorage.getItem('token');
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
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

export default new ReviewsService();
