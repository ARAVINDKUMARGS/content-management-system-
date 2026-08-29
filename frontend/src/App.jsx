import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { HomePage, BrowsePage } from './pages/Placeholders';
import WriteArticle from './pages/WriteArticle';
import ArticleConfirmation from './pages/ArticleConfirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-[#1A382B] selection:text-white">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Profile Route */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Role Restricted Routes */}
              <Route
                path="/write"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['author', 'admin']}>
                      <WriteArticle />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/write/:id"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['author', 'admin']}>
                      <WriteArticle />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/article-confirmation"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['author', 'admin']}>
                      <ArticleConfirmation />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
