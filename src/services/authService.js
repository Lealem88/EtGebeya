import sellersData from '../data/sellers.json';

/**
 * Auth Service — Mock API calls for authentication
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace these mock functions with actual Axios calls:
 * - POST /api/login      → authService.login(email, password)
 * - POST /api/register   → authService.register(userData)
 * - POST /api/forgot-password → authService.forgotPassword(email)
 * - GET /api/user/profile → authService.getProfile()
 * - PUT /api/user/profile → authService.updateProfile(data)
 */

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const authService = {
  /**
   * Login with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User data with token
   */
  async login(email, password) {
    await delay(800);
    
    // Mock: find user by email
    const user = sellersData.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Mock: any password works for demo
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phone: user.phone,
      location: user.location,
      joinDate: user.joinDate,
      bio: user.bio,
      trustScore: user.trustScore,
      isVerified: user.isVerified,
      token: 'mock_jwt_token_' + user.id,
    };
  },

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, phone, location }
   * @returns {Promise<Object>} User data with token
   */
  async register(userData) {
    await delay(1000);
    
    // Mock: check if email exists
    const existing = sellersData.find(u => u.email === userData.email);
    if (existing) {
      throw new Error('Email already registered');
    }
    
    return {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`,
      phone: userData.phone || '',
      location: userData.location || '',
      joinDate: new Date().toISOString().split('T')[0],
      bio: '',
      trustScore: 5.0,
      isVerified: false,
      token: 'mock_jwt_token_new_' + Date.now(),
    };
  },

  /**
   * Request password reset
   * @param {string} email 
   * @returns {Promise<Object>} Success message
   */
  async forgotPassword(email) {
    await delay(800);
    
    return {
      message: 'Password reset link sent to your email address.',
    };
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    await delay(500);
    const user = localStorage.getItem('user');
    if (!user) throw new Error('Not authenticated');
    return JSON.parse(user);
  },

  /**
   * Update user profile
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(data) {
    await delay(600);
    const user = JSON.parse(localStorage.getItem('user'));
    const updated = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },
};

export default authService;
