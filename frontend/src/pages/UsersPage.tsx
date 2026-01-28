import React, { useState } from "react";
import UserService, { UserQueryParams } from "../services/user.service";
import { IUserResponse } from "../types/dtos";
import useDataFetch from "../hooks/useDataFetch";
import Pagination from "../components/Pagination";
import Table, { Column } from "../components/Table";
import useDebounce from "../hooks/useDebounce";

const UsersPage: React.FC = () => {
  const [searchName, setSearchName] = useState("");
  const debouncedSearch = useDebounce(searchName, 500);

  const queryParams = React.useMemo(
    () => ({
      email: debouncedSearch,
      status: true,
    }),
    [debouncedSearch],
  );

  const {
    data: users,
    paginationMeta,
    loading,
    error,
    page,
    handlePageChange,
  } = useDataFetch<IUserResponse, UserQueryParams>(
    UserService.getUsers,
    queryParams,
  );

  React.useEffect(() => {
    handlePageChange(1);
  }, [debouncedSearch]);

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

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
      </div>

      {users.length === 0 ? (
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
