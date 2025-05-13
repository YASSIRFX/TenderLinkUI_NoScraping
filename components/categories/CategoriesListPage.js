import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../services/CategoryService";
import { useAuth } from "../../AuthContext";
import "./CategoriesListPage.css";

const CategoriesListPage = () => {
  const { token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // new state for search term

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching categories"
        );
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      try {
        await CategoryService.deleteCategory(id, token);
        setCategories(categories.filter((cat) => cat.id !== id));
        showMessage("Category deleted successfully");
      } catch (error) {
        showMessage(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingCategoryId(null);
    setCategoryName("");
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  // Filter categories based on the search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-container">
      {message && <div className="alert">{message}</div>}

      <div className="list-header">
        <h1>Categories Management</h1>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/categories/new")}
          >
            + New Category
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="search-bar">
          <input
            type="text"
            className="form-input"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="items-grid">
        {filteredCategories.map((category) => (
          <div className="item-card" key={category.id}>
            <h3>{category.name}</h3>
            {isAdmin && (
              <div className="item-actions">
                <button
                  className="btn btn-edit"
                  onClick={() =>
                    navigate(`/admin/categories/edit/${category.id}`)
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesListPage;
