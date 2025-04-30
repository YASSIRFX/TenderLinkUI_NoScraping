import axios from 'axios';

class CategoryService {
  static BASE_URL = 'http://localhost:7070';

  static async createCategory(categoryData, token) {
    try {
      const response = await axios.post(`${this.BASE_URL}/api/categories/add`, categoryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllCategories() {
    try {
      const response = await axios.get(`${this.BASE_URL}/api/categories/all`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getCategoryById(id) {
    try {
      const response = await axios.get(`${this.BASE_URL}/api/categories/${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateCategory(id, categoryData, token) {
    try {
      const response = await axios.put(`${this.BASE_URL}/api/categories/update/${id}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteCategory(id, token) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/api/categories/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export default CategoryService;