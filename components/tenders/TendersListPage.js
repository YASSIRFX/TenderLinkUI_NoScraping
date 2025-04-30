import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TenderService from '../../services/TenderService';
import { useAuth } from '../../AuthContext';
import './TendersListPage.css';
import '../../App.css';

const TendersListPage = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadTenders = async () => {
    try {
      const data = await TenderService.getAllTenders();
      setTenders(data);
    } catch {
      showMessage('Erreur lors du chargement des appels d’offres.');
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    showMessage('Extraction en cours… merci de patienter.');
    try {
      const response = await fetch(
        `${TenderService.BASE_URL}/api/tenders/scrape`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error('Échec de l’extraction');
      const data = await response.json();
      setTenders(data);
      showMessage(`✅ ${data.length} appels d’offres extraits.`);
    } catch (error) {
      showMessage(`❌ Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  useEffect(() => {
    loadTenders();
  }, []);

  return (
    <div className="list-container">
      <header className="header">
        <h1 className="page-title"> Liste des Appels d’Offres📄</h1>
        {isAdmin && (
          <button
            className="btn btn-primary director"
            onClick={handleScrape}
            disabled={loading}
          >
            {loading && <span className="button-spinner" />} Lancer l’extraction
          </button>
        )}
      </header>

      {message && <div className="alert">📢 {message}</div>}

      {loading && (
        <div className="loader-overlay">
          <div className="spinner" />
        </div>
      )}

      <p className="results-count">{tenders.length} résultats affichés</p>

      <div className="items-grid">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div className="skeleton-card" key={i} />
            ))
          : tenders.map((t) => (
              <div className="item-card" key={t.id}>
                <span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                <h3>{t.reference}</h3>
                <p><strong>Objet :</strong> {t.objet}</p>
                <p><strong>Date limite :</strong> {new Date(t.dateHeureLimiteRemisePlis).toLocaleString()}</p>
                <p><strong>Estimation :</strong> {t.estimation} DH</p>
                <p><strong>Caution :</strong> {t.cautionProvisoire} DH</p>
                <p><strong>Domaine :</strong> {t.domain}</p>
                <p><strong>Acheteur :</strong> {t.acheteurPublic}</p>
                <p><strong>Lieu :</strong> {t.lieuExecution}</p>
                <p><strong>Procédure :</strong> {t.procedure}</p>
                <p><strong>Priority :</strong> {t.priority}</p>

                <p>
                  <a href={t.detailUrl} target="_blank" rel="noopener noreferrer">
                    Voir détails
                  </a>
                </p>
                {isAdmin && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/admin/tenders/edit/${t.id}`)}
                  >
                    Modifier priorité
                  </button>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default TendersListPage;