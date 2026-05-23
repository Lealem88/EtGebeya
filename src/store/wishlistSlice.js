import { createSlice } from '@reduxjs/toolkit';

/**
 * Wishlist Slice
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace with API calls to:
 * - GET /api/wishlist
 * - POST /api/wishlist (add item)
 * - DELETE /api/wishlist/:productId (remove item)
 * - GET /api/favorites
 * - POST /api/favorites (add item)
 * - DELETE /api/favorites/:productId (remove item)
 */

const storedWishlist = localStorage.getItem('wishlist');
const storedFavorites = localStorage.getItem('favorites');

const initialState = {
  wishlistIds: storedWishlist ? JSON.parse(storedWishlist) : [],
  favoriteIds: storedFavorites ? JSON.parse(storedFavorites) : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const productId = action.payload;
      const index = state.wishlistIds.indexOf(productId);
      if (index === -1) {
        state.wishlistIds.push(productId);
      } else {
        state.wishlistIds.splice(index, 1);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistIds));
    },
    toggleFavorite(state, action) {
      const productId = action.payload;
      const index = state.favoriteIds.indexOf(productId);
      if (index === -1) {
        state.favoriteIds.push(productId);
      } else {
        state.favoriteIds.splice(index, 1);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favoriteIds));
    },
    clearWishlist(state) {
      state.wishlistIds = [];
      localStorage.removeItem('wishlist');
    },
    clearFavorites(state) {
      state.favoriteIds = [];
      localStorage.removeItem('favorites');
    },
  },
});

export const { toggleWishlist, toggleFavorite, clearWishlist, clearFavorites } = wishlistSlice.actions;

export default wishlistSlice.reducer;
