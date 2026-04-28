/**
 * Stats Controller - Serves real-time platform metrics and pass rates
 */

const verifierService = require('../services/verifierService');

exports.getStats = (req, res) => {
  try {
    const stats = verifierService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
