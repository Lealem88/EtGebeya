/**
 * Report Service — Mock API calls for product reporting
 * 
 * BACKEND INTEGRATION NOTE:
 * Replace with:
 * - POST /api/reports → reportService.create(reportData)
 * - GET /api/reports  → reportService.getAll()
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const reportService = {
  async create(reportData) {
    await delay(800);
    return {
      success: true,
      message: 'Report submitted successfully. Our team will review it shortly.',
      report: {
        id: Date.now(),
        ...reportData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    };
  },

  async getAll() {
    await delay(400);
    return [];
  },
};

export default reportService;
