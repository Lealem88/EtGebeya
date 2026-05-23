/**
 * Wishlist Service — Mock API calls
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace with:
 * - GET /api/wishlist       → wishlistService.getAll()
 * - POST /api/wishlist      → wishlistService.add(productId)
 * - DELETE /api/wishlist/:id → wishlistService.remove(productId)
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const wishlistService = {
  async getAll() {
    await delay(400);
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  },

  async add(productId) {
    await delay(200);
    return { success: true, productId };
  },

  async remove(productId) {
    await delay(200);
    return { success: true, productId };
  },
};

export default wishlistService;
