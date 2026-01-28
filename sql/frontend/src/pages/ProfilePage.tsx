import React, { useEffect, useState } from "react";
import UserService from "../services/user.service";
import { IUserResponse } from "../types/dtos.d";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await UserService.getMyProfile();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to fetch profile.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600">No user data available.</div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
      <div className="space-y-4">
        <div>
          <span className="font-semibold">ID:</span> {user.id}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">First Name:</span> {user.first_name}
        </div>
        <div>
          <span className="font-semibold">Last Name:</span>{" "}
          {user.last_name || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Status:</span>{" "}
          {user.status ? "Active" : "Inactive"}
        </div>
        <div>
          <span className="font-semibold">Created At:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Updated At:</span>{" "}
          {new Date(user.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
