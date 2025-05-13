import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TenderService from '../../services/TenderService';
import { useAuth } from '../../AuthContext';
import './TendersListPage.css';

const CATEGORIES = [
  { value: '', label: 'Toutes catégories' },
  { value: 'ConseilAudit', label: 'Conseil & Audit' },
  { value: 'FormationPersonnel', label: 'Formation Personnel' },
  { value: 'ServicesIT', label: 'Services IT' },
];

const TendersListPage = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tenders, setTenders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadTenders = useCallback(async () => {
    try {
      const data = await TenderService.getAllTenders();
      setTenders(data);
    } catch {
      setMessage('Erreur de chargement');
    }
  }, []);

  const applyFilters = useCallback(() => {
    let res = [...tenders];
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(
        t =>
          t.reference.toLowerCase().includes(q) ||
          t.objet.toLowerCase().includes(q) ||
          t.categorie?.toLowerCase().includes(q)
      );
    }
    if (category) {
      res = res.filter(t => t.categorie === category);
    }
    setFiltered(res);
  }, [tenders, query, category]);

  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
  }, [query, category, setSearchParams]);

  useEffect(() => { loadTenders(); }, [loadTenders]);
  useEffect(() => { applyFilters(); }, [tenders, applyFilters]);

  const handleScrape = async () => {
    setLoading(true);
    setMessage('Extraction en cours...');
    try {
      const res = await fetch(
        `${TenderService.BASE_URL}/api/tenders/scrape`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTenders(data);
      setMessage(`✅ ${data.length} appels récupérés.`);
    } catch {
      setMessage('❌ Extraction échouée');
    } finally {
      setLoading(false);
    }
  };

  const goToEdit = (id) => {
    const qs = searchParams.toString();
    navigate(`/admin/tenders/edit/${id}${qs ? `?${qs}` : ''}`);
  };

  return (
    <div className="list-container">
      <header className="header">
        <h1 className="page-title">Appels d’Offres</h1>
        <div className="search-wrapper">
          <div className="search-input-group">
            <span className="icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Rechercher référence, objet ou catégorie..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <span className="clear-btn" onClick={() => setQuery('')}>✖</span>}
          </div>
          <div className="select-wrapper">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <span className="arrow">▼</span>
          </div>
          {isAdmin && (
            <button className="btn-scrape" onClick={handleScrape} disabled={loading}>
              {loading ? '⏳' : '⟳'} Scraper
            </button>
          )}
        </div>
      </header>

      {message && <div className="toast">{message}</div>}

      <p className="results-count">{filtered.length} résultats</p>

      <div className="grid">
        {filtered.map(t => (
          <div key={t.id} className="card">
            <div className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</div>
            <h3>{t.reference}</h3>
            <p><strong>Objet :</strong> {t.objet}</p>
            <p><strong>Date limite :</strong> {new Date(t.dateHeureLimiteRemisePlis).toLocaleDateString()} {new Date(t.dateHeureLimiteRemisePlis).toLocaleTimeString()}</p>
            <p><strong>Estimation :</strong> {t.estimation} DH</p>
            <p><strong>Caution :</strong> {t.cautionProvisoire} DH</p>
            <p><strong>Catégorie :</strong> {t.categorie}</p>
            <p><strong>Acheteur :</strong> {t.acheteurPublic}</p>
            <p><strong>Lieu :</strong> {t.lieuExecution}</p>
            <p><strong>Procédure :</strong> {t.procedure}</p>
            <p><a href={t.detailUrl} target="_blank" rel="noopener noreferrer">Voir détails</a></p>
            {isAdmin && <button className="btn btn-secondary" onClick={() => goToEdit(t.id)}>Modifier priorité</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TendersListPage;