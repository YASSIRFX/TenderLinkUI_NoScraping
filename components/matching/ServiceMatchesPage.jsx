// src/frontend/components/ServiceMatchesPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MatchingService from '../../services/MatchingService';
import { useAuth } from '../../AuthContext';
import './ServiceMatchesPage.css';

const ServiceMatchesPage = () => {
  const { id: serviceId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [serviceName, setServiceName] = useState('');
  const [matches,    setMatches]     = useState([]);
  const [loading,    setLoading]     = useState(true);
  const [error,      setError]       = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    MatchingService
      .getServiceMatches(serviceId, token)
      .then(data => {
        setServiceName(data.serviceName);
        setMatches(data.matches);
      })
      .catch(err => {
        if (err.response?.status === 403) {
          navigate('/login', { replace: true });
        } else {
          setError(err.response?.data?.message || err.message);
        }
      })
      .finally(() => setLoading(false));
  }, [serviceId, token, navigate]);

  if (loading) return <p className="loading">Loading matches…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="management-container">
      <h1>Matches for Service: {serviceName}</h1>
      <p className="results-count">{matches.length} résultats affichés</p>

      {matches.length === 0
        ? <p>No matching tenders found.</p>
        : (
          <div className="items-grid">
            {matches.map(({ tender, matchScore, improvements, matchingExplanation }) => (
              <div className="item-card" key={tender.id}>
                {/* Priority badge, if you track it on the tender */}
                {tender?.priority && (
                  <span className={`badge badge-${tender.priority.toLowerCase()}`}>
                    {tender.priority}
                  </span>
                )}

                <h3>{tender.reference}</h3>
                <p><strong>Objet :</strong> {tender.objet}</p>

                <p><strong>Score:</strong> {(matchScore * 100).toFixed(1)}%</p>
                <p><strong>Date limite :</strong>{' '}
                  {tender.dateHeureLimiteRemisePlis
                    ? new Date(tender.dateHeureLimiteRemisePlis).toLocaleString()
                    : '—'
                  }
                </p>
                <p><strong>Estimation :</strong>{' '}
                  {tender.estimation ? `${tender.estimation} DH` : 'Non disponible'}
                </p>
                <p><strong>Caution :</strong>{' '}
                  {tender.cautionProvisoire ? `${tender.cautionProvisoire} DH` : '—'}
                </p>
                <p><strong>Domaine :</strong>{' '}
                  {tender.domain || tender.categorie || '—'}
                </p>
                <p><strong>Acheteur :</strong>{' '}
                  {tender.acheteurPublic || tender.acheteurDetail || '—'}
                </p>
                <p><strong>Lieu :</strong>{' '}
                  {tender.lieuExecution || '—'}
                </p>
                <p><strong>Procédure :</strong>{' '}
                  {tender.procedure || '—'}
                </p>

                <p>
                  <a
                    href={tender.detailUrl || tender.detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Voir détails
                  </a>
                </p>

                <p>
                  <strong>Improvements:</strong>{' '}
                  {improvements?.trim() || <em>No suggestions provided.</em>}
                </p>
                <p>
                  <strong>Explanation:</strong>{' '}
                  {matchingExplanation?.trim() || <em>No explanation provided.</em>}
                </p>

                
              </div>
            ))}
          </div>
        )
      }

      <Link to="/services" className="btn btn-secondary">
        Back to Services
      </Link>
    </div>
  );
};

export default ServiceMatchesPage;