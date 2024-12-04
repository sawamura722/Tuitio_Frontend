class OrdersService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Orders'; // Replace with your actual API URL
    }

    async getAllOrders() {
        const token = localStorage.getItem('token');
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return await response.json();
    }

    async getOrdersByStudentId(studentId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/student/${studentId}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders for the student');
        }

        return await response.json();
    }

    async deleteOrder(orderId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }
    }
}

export default new OrdersService();
