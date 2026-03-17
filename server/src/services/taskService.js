/**
 * Task Service - Manages catalog retrieval and filtering
 */

const initialTasks = require('../data/initialTasks');

class TaskService {
  constructor() {
    this.tasks = [...initialTasks];
  }

  getAll(filters = {}) {
    let result = [...this.tasks];

    if (filters.category && filters.category !== 'all') {
      result = result.filter(t => t.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.difficulty && filters.difficulty !== 'all') {
      result = result.filter(t => t.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }

    // Strip internal testSuite from public listings
    return result.map(({ testSuite, ...publicFields }) => publicFields);
  }

  getById(id) {
    const task = this.tasks.find(t => t.id.toLowerCase() === id.toLowerCase());
    if (!task) return null;
    const { testSuite, ...publicFields } = task;
    return publicFields;
  }

  getRawTask(id) {
    return this.tasks.find(t => t.id.toLowerCase() === id.toLowerCase()) || null;
  }
}

module.exports = new TaskService();
