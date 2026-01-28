import React, { useEffect, useState } from "react";
import ProductService from "../services/product.service";
import { IPaginationMeta } from "../types/api.d"; // Corrected import
import { IProductResponse } from "../types/dtos";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [pagination, setPagination] = useState<IPaginationMeta | null>(null); // Corrected type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Assuming a default page size

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProducts(
          currentPage,
          pageSize,
        );
        if (response.success && response.data) {
          setProducts(response.data.items);
          setPagination(response.data.pagination);
        } else {
          setError(response.message || "Failed to fetch products.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, pageSize]);

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Products</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-2">
                {product.description || "No description"}
              </p>
              <p className="text-blue-600 font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Category: {product.category.name}
              </p>
              <p className="text-sm text-gray-500">
                Created: {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.totalPages}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
