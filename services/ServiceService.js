import axios from 'axios';

class ServiceService {
  static BASE_URL = 'http://localhost:7070';

  static async createService(serviceData, token) {
    try {
      const response = await axios.post(`${this.BASE_URL}/api/services/add`, serviceData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getAllServices() {
    try {
      const response = await axios.get(`${this.BASE_URL}/api/services/all`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async getServiceById(id) {
    try {
      const response = await axios.get(`${this.BASE_URL}/api/services/${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async updateService(id, serviceData, token) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/api/services/update/${id}`,
        serviceData,
        {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: status => (status >= 200 && status < 300) || status === 204,
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async deleteService(id, token) {
    try {
      const response = await axios.delete(`${this.BASE_URL}/api/services/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  static async searchServices(query) {
    try {
      const response = await axios.get(`${this.BASE_URL}/api/services/search`, {
        params: { query }
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export default ServiceService;
