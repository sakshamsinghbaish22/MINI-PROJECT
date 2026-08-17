import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import MagicalLibraryBackground from './components/MagicalLibraryBackground';
import { ProtectedRoute } from './components/ProtectedRoute';

// Futuristic Marketplace Pages
import Home from './pages/Home';
import BrowseBooks from './pages/BrowseBooks';
import BookDetails from './pages/BookDetails';
import SellBook from './pages/SellBook';
import Exchange from './pages/Exchange';
import Wishlist from './pages/Wishlist';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SellerProfile from './pages/SellerProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <>
      <MagicalLibraryBackground />
      <CustomCursor />
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 200px)', position: 'relative', zIndex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseBooks />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/sellers/:id" element={<SellerProfile />} />
          <Route path="/users/:id" element={<SellerProfile />} />
          <Route path="/exchange" element={<Exchange />} />
          <Route path="/sell" element={<SellBook />} />
          <Route path="/create-listing" element={<SellBook />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Authenticated Routes */}
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Backoffice */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
