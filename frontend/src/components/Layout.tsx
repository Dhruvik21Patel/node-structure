// frontend/src/components/Layout.tsx
import React from "react";
import { Outlet, Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Layout: React.FC = () => {
  const isAuthenticated = AuthService.isAuthenticated();

  const handleLogout = () => {
    AuthService.logout();
    // Redirect to login page or home page after logout
    window.location.href = "/login"; // Simple redirect for now
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Gemini App
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-gray-300">
                  Profile
                </Link>
                <Link to="/user" className="hover:text-gray-300">
                  Users
                </Link>
                <Link to="/categories" className="hover:text-gray-300">
                  Categories
                </Link>
                <Link to="/products" className="hover:text-gray-300">
                  Products
                </Link>
                <button onClick={handleLogout} className="hover:text-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link to="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container mx-auto mt-8 p-4">
        <Outlet /> {/* This is where the routed components will be rendered */}
      </main>
    </div>
  );
};

export default Layout;
