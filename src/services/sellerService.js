import sellersData from '../data/sellers.json';
import productsData from '../data/products.json';

/**
 * Seller Service — Mock API calls for seller profiles
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace with actual Axios calls:
 * - GET /api/sellers/:id          → sellerService.getById(id)
 * - GET /api/sellers/:id/products → sellerService.getProducts(id)
 * - GET /api/sellers/:id/reviews  → sellerService.getReviews(id)
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const sellerService = {
  async getById(id) {
    await delay(400);
    const seller = sellersData.find(s => s.id === Number(id));
    if (!seller) throw new Error('Seller not found');
    return seller;
  },

  async getProducts(sellerId) {
    await delay(500);
    return productsData.filter(p => p.sellerId === Number(sellerId));
  },

  async getReviews(sellerId) {
    await delay(400);
    // Mock reviews
    return [
      { id: 1, rating: 5, comment: "Great seller! Fast shipping and exactly as described.", author: "Alex R.", date: "2026-05-20" },
      { id: 2, rating: 4, comment: "Good condition item. Communication could be faster.", author: "Maria K.", date: "2026-05-18" },
      { id: 3, rating: 5, comment: "Excellent experience! Would buy again.", author: "James L.", date: "2026-05-15" },
      { id: 4, rating: 5, comment: "Professional seller. Packed very carefully.", author: "Nina P.", date: "2026-05-12" },
    ];
  },
};

export default sellerService;
