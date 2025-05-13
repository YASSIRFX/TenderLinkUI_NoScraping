import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceService from "../../services/ServiceService";
import CategoryService from "../../services/CategoryService";
import { useAuth } from "../../AuthContext";
import "./ServicesForm.css";

const ServicesForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // State variables for service fields
  const [serviceName, setServiceName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [capabilities, setCapabilities] = useState(""); // comma-separated text
  const [constraints, setConstraints] = useState("");
  const [cost, setCost] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [message, setMessage] = useState("");

  // For populating the category dropdown
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchService();
    }
  }, [id, fetchCategories, fetchService]);

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      showMessage("Error loading categories");
    }
  };

  const fetchService = async () => {
    try {
      const data = await ServiceService.getServiceById(id);
      setServiceName(data.name);
      setSelectedCategory(data.category ? data.category.id : "");
      setSubCategory(data.subCategory || "");
      setCapabilities(data.capabilities ? data.capabilities.join(", ") : "");
      setConstraints(data.constraints || "");
      setCost(data.cost || "");
      setDeliveryTime(data.deliveryTime || "");
    } catch (error) {
      showMessage("Error loading service");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceName) {
      showMessage("Service name is required");
      return;
    }
    if (!selectedCategory) {
      showMessage("Please select a category");
      return;
    }
    // Build the service object
    const serviceData = {
      name: serviceName,
      category: { id: selectedCategory },
      subCategory,
      capabilities: capabilities
        .split(",")
        .map((cap) => cap.trim())
        .filter(Boolean),
      constraints,
      cost: parseFloat(cost),
      deliveryTime,
    };

    try {
      if (id) {
        await ServiceService.updateService(id, serviceData, token);
        // No error means update succeeded: navigate immediately
        navigate("/admin/services");
      } else {
        await ServiceService.createService(serviceData, token);
        navigate("/admin/services");
      }
    } catch (error) {
      console.error("Update error:", error);
      showMessage(error.response?.data?.message || "Operation failed");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="management-container">
      <div className="form-container">
        <h2>{id ? "Edit" : "Create"} Service</h2>
        {message && <div className="alert">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              className="form-input"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sub-Category</label>
            <input
              type="text"
              className="form-input"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Capabilities (comma separated)
            </label>
            <input
              type="text"
              className="form-input"
              value={capabilities}
              onChange={(e) => setCapabilities(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Constraints</label>
            <input
              type="text"
              className="form-input"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cost</label>
            <input
              type="number"
              className="form-input"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Time</label>
            <input
              type="date"
              className="form-input"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {id ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/services")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesForm;