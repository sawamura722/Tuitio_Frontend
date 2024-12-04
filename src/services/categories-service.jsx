// src/services/CategoriesService.jsx

class CategoriesService {
    constructor() {
        this.baseUrl = 'https://localhost:7245/api/Category'; // Replace with your actual API base URL
    }

    async getAllCategories() {
        const token = localStorage.getItem('token');
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }

        return await response.json();
    }

    async getCategoryById(categoryId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${categoryId}`, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch category');
        }

        return await response.json();
    }

    async getCategoriesByCourseId(courseId) {
        const response = await fetch(`${this.baseUrl}/courses/${courseId}/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching categories for course:', errorData);
            throw new Error('Failed to fetch course categories');
        }

        return await response.json();
    }

    async createCategory(categoryData) {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (const key in categoryData) {
            if (categoryData[key] !== undefined) {
                formData.append(key, categoryData[key]);
            }
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error creating category:', errorData);
            throw new Error('Failed to create category');
        }

        return await response.json();
    }

    async updateCategory(categoryId, categoryData) {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (const key in categoryData) {
            if (categoryData[key] !== undefined) {
                formData.append(key, categoryData[key]);
            }
        }

        const response = await fetch(`${this.baseUrl}/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error updating category:', errorData);
            throw new Error('Failed to update category');
        }
    }

    async deleteCategory(categoryId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete category');
        }
    }

    async addCategoryToCourse(courseId, categoryId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${categoryId}/courses/${courseId}`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding category to course:', errorData);
            throw new Error('Failed to add category to course');
        }

        return await response.json();
    }

    async removeCategoryFromCourse(courseId, categoryId) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.baseUrl}/${categoryId}/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error removing category from course:', errorData);
            throw new Error('Failed to remove category from course');
        }

        return await response.json();
    }
}

export default new CategoriesService();
