import productsData from '../data/products.json';

/**
 * Product Service — Mock API calls for products
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace these mock functions with actual Axios calls:
 * - GET /api/products          → productService.getAll(filters)
 * - GET /api/products/:id      → productService.getById(id)
 * - POST /api/products         → productService.create(productData)
 * - PUT /api/products/:id      → productService.update(id, data)
 * - DELETE /api/products/:id   → productService.delete(id)
 * - GET /api/products/featured → productService.getFeatured()
 * - GET /api/products/search   → productService.search(query)
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const productService = {
  async getAll(filters = {}) {
    await delay(600);
    let results = [...productsData];

    if (filters.category) {
      results = results.filter(p => p.category === filters.category);
    }
    if (filters.brand) {
      results = results.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    if (filters.condition) {
      results = results.filter(p => p.condition === filters.condition);
    }
    if (filters.priceMin) {
      results = results.filter(p => p.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      results = results.filter(p => p.price <= Number(filters.priceMax));
    }

    return results;
  },

  async getById(id) {
    await delay(400);
    const product = productsData.find(p => p.id === Number(id));
    if (!product) throw new Error('Product not found');
    return product;
  },

  async getFeatured() {
    await delay(500);
    return productsData.filter(p => p.isFeatured);
  },

  async getRecent() {
    await delay(500);
    return [...productsData]
      .sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
      .slice(0, 8);
  },

  async search(query) {
    await delay(300);
    const q = query.toLowerCase();
    return productsData.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  },

  async create(productData) {
    await delay(1000);
    return {
      id: Date.now(),
      ...productData,
      postedAt: new Date().toISOString(),
      views: 0,
      isFeatured: false,
    };
  },

  async getSimilar(productId) {
    await delay(400);
    const product = productsData.find(p => p.id === Number(productId));
    if (!product) return [];
    return productsData
      .filter(p => p.id !== product.id && p.category === product.category)
      .slice(0, 4);
  },
};

export default productService;
