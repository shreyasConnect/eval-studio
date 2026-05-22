import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({
  tasks,
  selectedTask,
  onSelectTask,
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  difficultyFilter,
  setDifficultyFilter
}) {
  return (
    <div>
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, id, or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="bugfix">Bug Fix</option>
          <option value="feature">Feature</option>
          <option value="refactor">Refactor</option>
          <option value="performance">Performance</option>
        </select>
        <select
          className="select-filter"
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedTask && selectedTask.id === task.id}
            onSelect={onSelectTask}
          />
        ))}
        {tasks.length === 0 && (
          <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
            No benchmark tasks found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
}
