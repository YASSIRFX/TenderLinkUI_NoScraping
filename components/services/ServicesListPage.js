// ServicesListPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import ServiceService from "../../services/ServiceService";
import "./ServicesListPage.css";

const ServicesListPage = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  // 1) Named fetch function
  const fetchServices = useCallback(async () => {
    try {
      const data = await ServiceService.getAllServices();
      setServices(data);
    } catch (err) {
      showMessage(err.response?.data?.message || "Error fetching services");
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // Filter logic
  const filtered = services.filter((service) => {
    const term = searchTerm.toLowerCase();
    return (
      service.name?.toLowerCase().includes(term) ||
      service.subCategory?.toLowerCase().includes(term) ||
      service.category?.name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="list-container">
      {message && <div className="toast">{message}</div>}

      <header className="header">
        <h1 className="page-title">Services Management</h1>
        <div className="actions-group">
          <div className="search-wrapper">
            <div className="search-input-group">
              <span className="icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <span
                  className="clear-btn"
                  onClick={() => setSearchTerm("")}
                >
                  ✖
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <button
              className="btn btn-primary new-service-btn"
              onClick={() => navigate("/admin/services/new")}
            >
              <span className="btn-icon">✚</span> New Service
            </button>
          )}
        </div>
        <p className="results-count">{filtered.length} services</p>
      </header>

      <div className="items-grid">
        {filtered.map((service) => (
          <div className="item-card" key={service.id}>
            <h3>{service.name}</h3>
            <p>Category: {service.category?.name || "N/A"}</p>
            <p>Sub-category: {service.subCategory}</p>
            {service.capabilities?.length > 0 && (
              <p>Capabilities: {service.capabilities.join(", ")}</p>
            )}
            {service.constraints && (
              <p>Constraints: {service.constraints}</p>
            )}
            <p>Cost: {service.cost}</p>
            <p>Delivery Time: {service.deliveryTime}</p>

            <div className="item-actions">
              {isAdmin && (
                <>
                  <button
                    className="btn btn-edit"
                    onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                  >
                    <span className="btn-icon">✏️</span> Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setSelectedService(service)}
                  >
                    <span className="btn-icon">🗑️</span> Delete
                  </button>
                </>
              )}
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/services/${service.id}/matches`)}
              >
                <span className="btn-icon">👁️</span> View Matches
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmation de suppression */}
      {selectedService && (
        <div className="modal-backdrop">
          <div className="confirmation-modal">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer le service "{selectedService.name}" ?</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setSelectedService(null)}>
                Annuler
              </button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  try {
                    await ServiceService.deleteService(selectedService.id, token);
                    setServices(services.filter((s) => s.id !== selectedService.id));
                    showMessage("Service deleted successfully");
                  } catch (error) {
                    showMessage(error.response?.data?.message || "Error deleting service");
                  }
                  setSelectedService(null);
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesListPage;
