import axios from 'axios';

class MatchingService {
  static BASE_URL = 'http://localhost:7070';

 
  static async getServiceMatches(serviceId, token) {
    const resp = await axios.get(
      `${this.BASE_URL}/api/matching/service/${serviceId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data; // [{ tender, matchScore, improvements, matchingExplanation }, ...]
  }

  static async getServiceMatches(serviceId, token) {
    const resp = await axios.get(
      `${this.BASE_URL}/api/matching/service/${serviceId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data; // { service: { id, name }, matches: [...] }
  }
  
}

export default MatchingService;
