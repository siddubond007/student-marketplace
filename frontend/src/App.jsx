import PostJobPage from './pages/PostJobPage';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ClientDashboard from './pages/ClientDashboard';
import OrderWorkspacePage from './pages/OrderWorkspacePage';
import CategoryHubPage from './pages/CategoryHubPage';
import HireCategoryPage from './pages/HireCategoryPage';
import UserProfilePage from './pages/UserProfilePage';
import SkillSearchPage from './pages/SkillSearchPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientProjectDetailsPage from './pages/ClientProjectDetailsPage';
import ClientProposalsPage from './pages/ClientProposalsPage';
import API from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => setCurrentUser(res.data.user))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500 selection:text-white w-full">
        
        {/* Ambient Glowing Mesh */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[160px]" />
          <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-violet-600/15 rounded-full blur-[160px]" />
          <div className="absolute bottom-10 left-1/3 w-[700px] h-[700px] bg-emerald-600/10 rounded-full blur-[180px]" />
        </div>

        {/* Global Navbar */}
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-6 sm:px-8 lg:px-10 py-8 z-10">
          <Routes>
        <Route path="/post-job" element={<PostJobPage currentUser={currentUser} />} />
            <Route path="/" element={<HomePage currentUser={currentUser} />} />
            
            {/* 1. Dedicated Admin Console */}
            <Route path="/admin" element={<AdminDashboard currentUser={currentUser} />} />
            
            {/* 2. Dedicated Skill Search Directory */}
            <Route path="/skills" element={<SkillSearchPage currentUser={currentUser} />} />
            <Route path="/browse-skills" element={<SkillSearchPage currentUser={currentUser} />} />
            <Route path="/talent-search" element={<SkillSearchPage currentUser={currentUser} />} />
            
            {/* 3. Direct Category URLs */}
            <Route path="/webdeveloper" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/web-development" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/editing" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/video-editing" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/graphic-design" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/python-scripting" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/mobile-apps" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/3d-artists" element={<CategoryHubPage currentUser={currentUser} />} />
            
            <Route path="/hire/:categorySlug" element={<HireCategoryPage currentUser={currentUser} />} />
            <Route path="/category/:categorySlug" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/jobs" element={<CategoryHubPage currentUser={currentUser} />} />
            <Route path="/gigs" element={<CategoryHubPage currentUser={currentUser} />} />
            
            {/* User Profiles */}
            <Route path="/u/:username" element={<UserProfilePage currentUser={currentUser} />} />
            <Route path="/profile/:username" element={<UserProfilePage currentUser={currentUser} />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage onLoginSuccess={setCurrentUser} />} />
            <Route path="/register" element={<RegisterPage onLoginSuccess={setCurrentUser} />} />
            
            {/* Workspaces */}
            <Route path="/student/portal" element={<StudentDashboard currentUser={currentUser} />} />
            <Route path="/client/portal" element={<ClientDashboard currentUser={currentUser} />} />
            <Route path="/my-projects/:projectId" element={<ClientProjectDetailsPage />} />
            <Route path="/my-projects/:projectId/proposals" element={<ClientProposalsPage />} />
            <Route path="/orders/:orderId" element={<OrderWorkspacePage currentUser={currentUser} />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
