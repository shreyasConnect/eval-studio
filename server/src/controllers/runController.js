/**
 * Run Controller - Handles code evaluation submissions and run history
 */

const verifierService = require('../services/verifierService');

exports.submitRun = async (req, res) => {
  try {
    const { taskId, code } = req.body;
    if (!taskId || typeof code !== 'string') {
      return res.status(400).json({ success: false, error: 'taskId and code are required' });
    }

    const result = await verifierService.verifySubmission(taskId, code);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getHistory = (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const history = verifierService.getHistory(limit);
    res.json({ success: true, count: history.length, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
