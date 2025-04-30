import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TenderService from '../../services/TenderService';
import { useAuth } from '../../AuthContext';
import './TenderForm.css'; // You can reuse the same CSS

const TenderPriorityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) fetchPriority();
  }, [id]);

  const fetchPriority = async () => {
    try {
      const data = await TenderService.getTenderById(id);
      setPriority(data.priority);
    } catch {
      showMessage('Error loading tender priority');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await TenderService.updatePriority(id, priority, token);
      navigate('/admin/tenders');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update priority');
    }
  };

  const showMessage = msg => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="form-container">
      <h2>Update Tender Priority</h2>
      {message && <div className="alert">{message}</div>}
      <form onSubmit={handleSubmit}>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate('/admin/tenders')}>Cancel</button>
      </form>
    </div>
  );
};

export default TenderPriorityForm;
