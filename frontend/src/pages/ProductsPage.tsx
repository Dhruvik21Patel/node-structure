import React, { useState } from "react";
import ProductService from "../services/product.service";
import { IProductResponse } from "../types/dtos";
import useDataFetch from "../hooks/useDataFetch";
import Pagination from "../components/Pagination";
import Table, { Column } from "../components/Table";
import ProductForm from "../components/ProductForm";

const ProductsPage: React.FC = () => {
  const {
    data: products,
    paginationMeta,
    loading,
    error,
    page,
    handlePageChange,
    refetch,
  } = useDataFetch<IProductResponse>(ProductService.getProducts);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProductResponse | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: IProductResponse) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (product: IProductResponse) => {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      try {
        await ProductService.deleteProduct(product.id);
        refetch(); // Refetch data after deletion
      } catch (err: any) {
        alert(err.message || "Failed to delete product.");
      }
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    refetch(); // Refresh table data
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const productColumns: Column<IProductResponse>[] = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "description", title: "Description", render: (product) => product.description || "N/A" },
    { key: "price", title: "Price", render: (product) => `$${product.price.toFixed(2)}` },
    { key: "category", title: "Category", render: (product) => product.category.name },
    {
      key: "createdAt",
      title: "Created At",
      render: (product) => new Date(product.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Actions",
      render: (product) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEditProduct(product)}
            className="font-medium text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(product)}
            className="font-medium text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Product
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h3>
          <ProductForm
            currentProduct={editingProduct}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {products.length === 0 && !showForm ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <Table columns={productColumns} data={products} />
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

export default ProductsPage;
