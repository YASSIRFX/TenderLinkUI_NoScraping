import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';

import ServicesListPage from './components/services/ServicesListPage';
import ServicesForm from './components/services/ServicesForm';

import CategoriesListPage from './components/categories/CategoriesListPage';
import CategoryForm from './components/categories/CategoryForm';

import TenderPriorityForm from './components/tenders/TenderPriorityForm';
import TendersListPage from './components/tenders/TendersListPage';

import ServiceMatchesPage from './components/matching/ServiceMatchesPage';

import DashboardLayout from './components/layout/DashboardLayout';
import { AuthProvider, AuthContext } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
          <HeaderComponent />
          <div className="content pt-16">
            <AppRoutes />
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function HeaderComponent() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Sidebar /> : <Navbar />;
}

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/profile" replace/> : <LoginPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/profile" replace/> : <LoginPage />}
      />
     

     {/* Authenticated dashboard layout */}
     {isAuthenticated && (
        <Route element={<DashboardLayout />}>
          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
      {/* Admin routes */}
      {isAdmin && (
        <>
          
          {/* user Management */}
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/admin/user-management" element={<UserManagementPage />} />
          <Route path="/update-user/:userId" element={<UpdateUser />} />
        
          {/* Service Management */}
        
          <Route path="/admin/services" element={<ServicesListPage />} />
          <Route path="/admin/services/new" element={<ServicesForm />} />
          <Route path="/admin/services/edit/:id" element={<ServicesForm />} />
          <Route path="/services" element={<ServicesListPage />} />


          {/* Category Management */}
        
          <Route path="/admin/categories" element={<CategoriesListPage />} />
          <Route path="/admin/categories/new" element={<CategoryForm />} />
          <Route path="/admin/categories/edit/:id" element={<CategoryForm />} />

          <>
          {/* Tender Management */}
          <Route path="/admin/tenders/scrape" element={<TendersListPage />} />
          <Route path="/admin/tenders" element={<TendersListPage />} />
          <Route path="/admin/tenders/edit/:id" element={<TenderPriorityForm />} />
          <Route path="/tenders" element={<TendersListPage />} />
          </>
          <Route path="/services/:id/matches" element={<ServiceMatchesPage />} />


        </>
      )}

      {/* Public routes */}
      
      <Route path="/services" element={<ServicesListPage />} />
          <Route path="/tenders" element={<TendersListPage />} />
        </Route>
      )}
    
      
      

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace/>} />
    </Routes>
  );
}

export default App;

