import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import TenderService from '../../services/TenderService';
import { useAuth } from '../../AuthContext';
import './TenderForm.css';

const TenderPriorityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  const [priority, setPriority] = useState('MEDIUM');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPriority = async () => {
      try {
        const data = await TenderService.getTenderById(id);
        setPriority(data.priority);
      } catch {
        setMessage('Erreur de chargement');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    fetchPriority();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await TenderService.updatePriority(id, priority, token);
      // Navigate back with same search params
      navigate(`/admin/tenders${location.search}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Échec de la mise à jour');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="form-container">
      <h2>Modifier Priorité</h2>
      {message && <div className="alert">{message}</div>}
      <form onSubmit={handleSubmit}>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <div className="form-actions">
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => navigate(`/admin/tenders${location.search}`)}>Annuler</button>
        </div>
      </form>
    </div>
  );
};

export default TenderPriorityForm;
