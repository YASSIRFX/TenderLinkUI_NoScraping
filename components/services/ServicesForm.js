// ServicesForm.jsx
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

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    subCategory: "",
    capabilities: "",
    constraints: "",
    cost: "",
    deliveryTime: ""
  });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch categories
    CategoryService.getAllCategories()
      .then(setCategories)
      .catch(() => showMessage("Error loading categories"));

    // If editing, load service
    if (id) {
      ServiceService.getServiceById(id)
        .then((svc) => {
          setFormData({
            name: svc.name || "",
            categoryId: svc.category?.id || "",
            subCategory: svc.subCategory || "",
            capabilities: svc.capabilities?.join(", ") || "",
            constraints: svc.constraints || "",
            cost: svc.cost || "",
            deliveryTime: svc.deliveryTime || ""
          });
        })
        .catch(() => showMessage("Error loading service"));
    }
  }, [id]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId) return showMessage("Please fill required fields");

    const payload = {
      name: formData.name,
      category: { id: formData.categoryId },
      subCategory: formData.subCategory,
      capabilities: formData.capabilities.split(",").map((c) => c.trim()).filter(Boolean),
      constraints: formData.constraints,
      cost: parseFloat(formData.cost) || 0,
      deliveryTime: formData.deliveryTime
    };

    try {
      if (id) await ServiceService.updateService(id, payload, token);
      else await ServiceService.createService(payload, token);
      navigate("/admin/services");
    } catch (err) {
      showMessage(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-header">
        <h2>{id ? "Edit" : "Create"} Service</h2>
      </div>
      {message && <div className="toast">{message}</div>}
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Service Name *</label>
          <input
            name="name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter service name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select
            name="categoryId"
            className="form-input"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sub-category</label>
          <input name="subCategory" type="text" className="form-input"
              value={formData.subCategory} onChange={handleChange}
              placeholder="Optional" />
        </div>

        <div className="form-group">
          <label className="form-label">Capabilities</label>
          <input name="capabilities" type="text" className="form-input"
              value={formData.capabilities} onChange={handleChange}
              placeholder="Comma-separated list" />
        </div>

        <div className="form-group">
          <label className="form-label">Constraints</label>
          <input name="constraints" type="text" className="form-input"
              value={formData.constraints} onChange={handleChange}
              placeholder="Any constraints" />
        </div>

        <div className="form-group">
          <label className="form-label">Cost</label>
          <input name="cost" type="number" className="form-input"
              value={formData.cost} onChange={handleChange}
              step="0.01" placeholder="0.00" />
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Time</label>
          <input name="deliveryTime" type="date" className="form-input"
              value={formData.deliveryTime} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? "Update" : "Create"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/services")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default ServicesForm;
