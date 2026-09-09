import React from 'react';
import QuizAttempt from './pages/QuizAttempt';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';

import AdminDashboard from './pages/AdminDashboard';
import AdminVerification from './pages/AdminVerification';

import { HomePage, BrowsePage } from './pages/Placeholders';

import ArticleDetails from './pages/ArticleDetails';
import WriteArticle from './pages/WriteArticle';
import ArticleConfirmation from './pages/ArticleConfirmation';

import DiscussionPage from './pages/DiscussionPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900 selection:bg-[#1A382B] selection:text-white">
          <Navbar />

          <main className="flex-1">
            <Routes>

              {/* ================================================= */}
              {/* PUBLIC ROUTES */}
              {/* ================================================= */}

              <Route
                path="/"
                element={<HomePage />}
              />

              <Route
                path="/browse"
                element={<BrowsePage />}
              />

              {/* Article details */}
              <Route
                path="/browse/:id"
                element={<ArticleDetails />}
              />

              {/* Discussions */}
              <Route
                path="/discussions"
                element={<DiscussionPage />}
              />

              {/* Login */}
              <Route
                path="/login"
                element={<Login />}
              />

              {/* Register */}
              <Route
                path="/register"
                element={<Register />}
              />


              {/* ================================================= */}
              {/* LOGGED-IN USER PROFILE */}
              {/* ================================================= */}

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />


              {/* ================================================= */}
              {/* PUBLIC USER PROFILE */}
              {/* Example: /profile/64f123abc... */}
              {/* ================================================= */}

              <Route
                path="/profile/:id"
                element={<PublicProfile />}
              />


              {/* ================================================= */}
              {/* PROTECTED QUIZ ROUTES */}
              {/* ================================================= */}

              <Route
                path="/quiz"
                element={
                  <ProtectedRoute>
                    <QuizAttempt />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute>
                    <QuizAttempt />
                  </ProtectedRoute>
                }
              />


              {/* ================================================= */}
              {/* WRITE ARTICLE */}
              {/* ================================================= */}

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


              {/* ================================================= */}
              {/* ARTICLE CONFIRMATION */}
              {/* ================================================= */}

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


              {/* ================================================= */}
              {/* ADMIN DASHBOARD */}
              {/* ================================================= */}

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


              {/* ================================================= */}
              {/* ADMIN VERIFICATION */}
              {/* ================================================= */}

              <Route
                path="/admin/verification"
                element={
                  <ProtectedRoute>
                    <RoleRoute allowedRoles={['admin']}>
                      <AdminVerification />
                    </RoleRoute>
                  </ProtectedRoute>
                }
              />


              {/* ================================================= */}
              {/* FALLBACK */}
              {/* ================================================= */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
