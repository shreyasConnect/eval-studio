/**
 * Task Controller - Handles task catalog queries
 */

const taskService = require('../services/taskService');

exports.getTasks = (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    const tasks = taskService.getAll({ category, difficulty, search });
    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getTaskById = (req, res) => {
  try {
    const task = taskService.getById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
