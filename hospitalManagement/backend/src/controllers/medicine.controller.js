const { getMedicinePrices } = require('../services/scraperService');
const apiResponse = require('../utils/apiResponse');

// @desc    Compare medicine prices
// @route   GET /api/medicines/compare
exports.compareMedicines = async (req, res, next) => {
  try {
    const { medicineName } = req.query;

    if (!medicineName) {
      return apiResponse(res, 400, 'Medicine name is required');
    }

    const prices = await getMedicinePrices(medicineName);

    apiResponse(res, 200, 'Prices fetched', prices);
  } catch (error) {
    next(error);
  }
};