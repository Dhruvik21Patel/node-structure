import React, { useEffect, useState } from "react";
import CategoryService from "../services/category.service";
import { IPaginationMeta } from "../types/api.d"; // Corrected import
import { ICategoryResponse } from "../types/dtos";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const [pagination, setPagination] = useState<IPaginationMeta | null>(null); // Corrected type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Assuming a default page size

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await CategoryService.getCategories(
          currentPage,
          pageSize,
        );
        if (response.success && response.data) {
          setCategories(response.data.items);
          setPagination(response.data.pagination);
        } else {
          setError(response.message || "Failed to fetch categories.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
    return (
      <div className="text-center text-gray-600">Loading categories...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>
      {categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li
              key={category.id}
              className="py-4 flex justify-between items-center"
            >
              <span className="text-lg font-medium">{category.name}</span>
              <span className="text-sm text-gray-500">
                Created: {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
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

export default CategoriesPage;
