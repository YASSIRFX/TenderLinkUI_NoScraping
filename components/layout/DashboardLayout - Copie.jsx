import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import './DashboardLayout.css';
import '../../App.css';

const DashboardLayout = () => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="dashboard-content">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;