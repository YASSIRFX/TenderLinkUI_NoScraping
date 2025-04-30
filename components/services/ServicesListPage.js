import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceService from "../../services/ServiceService";
import { useAuth } from "../../AuthContext";
import "./ServicesListPage.css";

const ServicesListPage = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await ServiceService.getAllServices();
        setServices(data);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching services"
        );
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this service?")) {
      try {
        await ServiceService.deleteService(id, token);
        setServices(services.filter((service) => service.id !== id));
        showMessage("Service deleted successfully");
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error deleting service"
        );
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const filteredServices = services.filter((service) => {
    const serviceName = service.name ? service.name.toLowerCase() : "";
    const subCategory = service.subCategory ? service.subCategory.toLowerCase() : "";
    const categoryName = service.category?.name?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return (
      serviceName.includes(term) ||
      subCategory.includes(term) ||
      categoryName.includes(term)
    );
  });

  return (
    <div className="management-container">
      {message && <div className="alert">{message}</div>}

      <div className="list-header">
        <h1>Services Management</h1>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/services/new")}
          >
            + New Service
          </button>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="items-grid">
        {filteredServices.map((service) => (
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
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </button>
                </>
              )}

              {/* New View Matches button */}
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/services/${service.id}/matches`)}
              >
                View Matches
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesListPage;
