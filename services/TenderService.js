import axios from 'axios';

class TenderService {
  static BASE_URL = 'http://localhost:7070';

  static async createTender(tenderData, token) {
    const response = await axios.post(
      `${this.BASE_URL}/api/tenders`,
      tenderData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  static async getAllTenders() {
    const response = await axios.get(
      `${this.BASE_URL}/api/tenders`
    );
    return response.data;
  }
  static async getTenderById(id) {
    const response = await axios.get(`${this.BASE_URL}/api/tenders/${id}`);
    return response.data;
  }

    /** GET /api/tenders/by-priority?priority=… */
    static async getByPriority(priority) {
        const { data } = await axios.get(
          `${this.BASE_URL}/api/tenders/by-priority`,
          { params: { priority } }
        );
        return data;
      }
    
      /** GET /api/tenders/by-domain?domain=… */
      
      static async getByCategorie(categorie) {
        const { data } = await axios.get(
          `${this.BASE_URL}/api/tenders/by-categorie`,
          { params: { categorie } }
        );
        return data;
      }
    
      /**
       * GET /api/tenders/by-deadline?start=…&end=…
       * `start` and `end` should be ISO‑strings, e.g. new Date().toISOString()
       */
      static async getByDeadline(startIso, endIso) {
        const { data } = await axios.get(
          `${this.BASE_URL}/api/tenders/by-deadline`,
          { params: { start: startIso, end: endIso } }
        );
        return data;
      }

  static async updatePriority(id, priority, token) {
    const response = await axios.patch(
      `${this.BASE_URL}/api/tenders/${id}/priority`,
      null,
      {
        params: { priority },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
}

export default TenderService;