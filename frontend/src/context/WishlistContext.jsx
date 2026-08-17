import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showInfo, showError } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistBookIds, setWishlistBookIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistBookIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const items = await wishlistApi.getWishlist();
      const safeItems = Array.isArray(items) ? items : [];
      setWishlist(safeItems);
      const ids = new Set(safeItems.map((item) => item.book_id || item.id || item));
      setWishlistBookIds(ids);
    } catch (err) {
      console.warn('Could not fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (bookId) => (bookId ? wishlistBookIds.has(bookId) : false),
    [wishlistBookIds]
  );

  const isWishlisted = isInWishlist;

  const toggleWishlist = async (bookId, bookTitle = 'Textbook') => {
    if (!isAuthenticated) {
      showInfo('Please log in to save books to your wishlist.');
      return false;
    }

    if (!bookId) return false;
    const wasWishlisted = wishlistBookIds.has(bookId);

    // Optimistic UI update
    setWishlistBookIds((prev) => {
      const next = new Set(prev);
      if (wasWishlisted) {
        next.delete(bookId);
      } else {
        next.add(bookId);
      }
      return next;
    });

    try {
      if (wasWishlisted) {
        await wishlistApi.removeFromWishlist(bookId);
        showInfo(`Removed "${bookTitle}" from your wishlist.`);
      } else {
        await wishlistApi.addToWishlist(bookId);
        showSuccess(`Saved "${bookTitle}" to your wishlist!`);
      }
      fetchWishlist();
      return true;
    } catch (err) {
      // Rollback
      setWishlistBookIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) {
          next.add(bookId);
        } else {
          next.delete(bookId);
        }
        return next;
      });
      showError('Failed to update wishlist.');
      return false;
    }
  };

  const value = {
    wishlist,
    wishlistBookIds,
    wishlistCount: wishlist.length || wishlistBookIds.size || 0,
    isInWishlist,
    isWishlisted,
    toggleWishlist,
    fetchWishlist,
    refreshWishlist: fetchWishlist,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
