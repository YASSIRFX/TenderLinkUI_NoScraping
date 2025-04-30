// CategoryForm.js (updated for routing)
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import { useAuth } from "../../AuthContext";
import "./CategoryForm.css";


const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const data = await CategoryService.getCategoryById(id);
      setCategoryName(data.name);
    } catch (error) {
      showMessage("Error loading category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      showMessage("Category name required");
      return;
    }

    try {
      if (id) {
        await CategoryService.updateCategory(id, { name: categoryName }, token);
        showMessage("Category updated");
      } else {
        await CategoryService.createCategory({ name: categoryName }, token);
        showMessage("Category created");
      }
      navigate("/admin/categories");
    } catch (error) {
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
        <h2>{id ? "Edit" : "Create"} Category</h2>
        {message && <div className="alert">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input
              className="form-input"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {id ? "Update" : "Create"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/categories")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;