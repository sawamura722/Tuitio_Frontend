class CartsService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Cart'; // Base API endpoint
    }

    async getCart(studentId) {
        return this.makeRequest(`${this.baseUrl}/${studentId}`, 'GET');
    }

    async addToCart(studentId, courseId) {
        return this.makeRequest(`${this.baseUrl}/${studentId}/add/${courseId}`, 'POST');
    }

    async removeFromCart(studentId, courseId) {
        return this.makeRequest(`${this.baseUrl}/${studentId}/remove/${courseId}`, 'DELETE');
    }

    async clearCart(studentId) {
        return this.makeRequest(`${this.baseUrl}/${studentId}/clear`, 'DELETE');
    }

    async checkout(studentId, paymentMethodId, returnUrl, receiptEmail) {
        console.log(`Checkout Params: studentId: ${studentId}, paymentMethodId: ${paymentMethodId}, returnUrl: ${returnUrl}, receiptEmail: ${receiptEmail}`);
        const url = `${this.baseUrl}/${studentId}/checkout?paymentMethodId=${paymentMethodId}&returnUrl=${encodeURIComponent(returnUrl)}&receiptEmail=${encodeURIComponent(receiptEmail)}`;
        console.log('Checkout URL:', url); // Log the URL
    
        return this.makeRequest(url, 'POST');
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

export default new CartsService();
