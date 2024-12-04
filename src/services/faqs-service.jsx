class FAQsService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Faq'; 
    }

    async getAllFAQs() {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch FAQs');
        }

        return await response.json();
    }

    async getFAQById(faqId) {
        const response = await fetch(`${this.baseUrl}/${faqId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch FAQ');
        }

        return await response.json();
    }

    async createFAQ(faqData) {
        const token = localStorage.getItem('token');
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(faqData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to create FAQ');
        }

        return await response.json();
    }

    async updateFAQ(faqId, faqData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${faqId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(faqData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error details:', errorData);
            throw new Error('Failed to update FAQ');
        }
    }

    async deleteFAQ(faqId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${faqId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete FAQ');
        }
    }
}

export default new FAQsService();
