import React, { useState } from "react";
import CategoryService from "../services/category.service";
import { ICategoryResponse, ICreateCategoryRequest } from "../types/dtos";
import useDataFetch from "../hooks/useDataFetch";
import Pagination from "../components/Pagination";
import Table, { Column } from "../components/Table"; // Table no longer has generic actions
import CategoryForm from "../components/CategoryForm"; // Import the new CategoryForm

const CategoriesPage: React.FC = () => {
  const {
    data: categories,
    paginationMeta,
    loading,
    error,
    page,
    handlePageChange,
    refetch, // Ensure refetch is available from useDataFetch
  } = useDataFetch<ICategoryResponse>(CategoryService.getCategories);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategoryResponse | null>(null);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: ICategoryResponse) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (category: ICategoryResponse) => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      try {
        await CategoryService.deleteCategory(category.id);
        refetch(); // Refetch data after deletion
      } catch (err: any) {
        alert(err.message || "Failed to delete category.");
      }
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    refetch(); // Refresh table data
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const categoryColumns: Column<ICategoryResponse>[] = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    {
      key: "createdAt",
      title: "Created At",
      render: (category) => new Date(category.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Actions",
      render: (category) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEditCategory(category)}
            className="font-medium text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteCategory(category)}
            className="font-medium text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center text-gray-600">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={handleAddCategory}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Category
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <CategoryForm
            currentCategory={editingCategory}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {categories.length === 0 && !showForm ? (
        <p className="text-center text-gray-600">No categories found.</p>
      ) : (
        <Table columns={categoryColumns} data={categories} />
      )}

      <Pagination
        pagination={paginationMeta}
        currentPage={page}
        onPageChange={handlePageChange}
        isLoading={loading}
      />
    </div>
  );
};

export default CategoriesPage;
