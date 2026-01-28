import React, { useState } from "react";
import UserService from "../services/user.service";
import { IUserResponse } from "../types/dtos";
import useDataFetch from "../hooks/useDataFetch";
import Pagination from "../components/Pagination";
import Table, { Column } from "../components/Table";
import UserForm from "../components/UserForm";

const UsersPage: React.FC = () => {
  const {
    data: users,
    paginationMeta,
    loading,
    error,
    page,
    handlePageChange,
    refetch,
  } = useDataFetch<IUserResponse>(UserService.getUsers);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserResponse | null>(null);

  const handleEditUser = (user: IUserResponse) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (user: IUserResponse) => {
    if (window.confirm(`Are you sure you want to delete user "${user.first_name} ${user.last_name}"?`)) {
      try {
        await UserService.deleteUser(user.id);
        refetch(); // Refetch data after deletion
      } catch (err: any) {
        alert(err.message || "Failed to delete user.");
      }
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    refetch(); // Refresh table data
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const userColumns: Column<IUserResponse>[] = [
    { key: "id", title: "ID" },
    { key: "email", title: "Email" },
    { key: "first_name", title: "First Name" },
    { key: "last_name", title: "Last Name" },
    {
      key: "status",
      title: "Status",
      render: (user) => (user.status ? "Active" : "Inactive"),
    },
    {
      key: "createdAt",
      title: "Created At",
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: "updatedAt",
      title: "Updated At",
      render: (user) => new Date(user.updatedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Actions",
      render: (user) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEditUser(user)}
            className="font-medium text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user)}
            className="font-medium text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="text-center text-gray-600">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        {/* No "Add New User" button as UserService does not have createUser method */}
      </div>

      {showForm && editingUser && ( // Only show form if editing and editingUser is set
        <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit User</h3>
          <UserForm
            currentUser={editingUser}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {users.length === 0 && !showForm ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <Table columns={userColumns} data={users} />
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

export default UsersPage;
