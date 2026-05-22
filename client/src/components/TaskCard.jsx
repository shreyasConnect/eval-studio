import React from 'react';

export default function TaskCard({ task, isSelected, onSelect }) {
  const getDifficultyClass = (diff) => {
    switch (diff.toLowerCase()) {
      case 'easy': return 'badge-easy';
      case 'medium': return 'badge-medium';
      case 'hard': return 'badge-hard';
      default: return '';
    }
  };

  return (
    <div
      className={`task-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(task)}
    >
      <div className="task-header">
        <span className="task-id">{task.id}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="badge badge-category">{task.category}</span>
          <span className={`badge ${getDifficultyClass(task.difficulty)}`}>
            {task.difficulty}
          </span>
        </div>
      </div>
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
    </div>
  );
}
