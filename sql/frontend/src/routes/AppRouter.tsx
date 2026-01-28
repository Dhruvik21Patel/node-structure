// frontend/src/routes/AppRouter.tsx
import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Import Layout (will be created in Subtask 7)
import Layout from '../components/Layout';

// Import Pages (will be created in Subtask 8)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import CategoriesPage from '../pages/CategoriesPage';
import ProductsPage from '../pages/ProductsPage';
import AuthService from '../services/auth.service'; // For AuthGuard

// Placeholder for AuthGuard (will be properly implemented in Subtask 9)
const AuthGuard: React.FC = () => {
  const isAuthenticated = AuthService.isAuthenticated(); // Using the service directly for now

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>

        {/* Catch all - 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
