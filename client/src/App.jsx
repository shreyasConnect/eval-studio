import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MetricsDashboard from './components/MetricsDashboard';
import TaskList from './components/TaskList';
import CodeSubmissionForm from './components/CodeSubmissionForm';
import RunHistoryTable from './components/RunHistoryTable';
import { fetchTasks, submitCodeRun, fetchRunHistory, fetchStats } from './services/api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const loadData = async () => {
    try {
      const [tasksRes, statsRes, histRes] = await Promise.all([
        fetchTasks({ search: searchTerm, category: categoryFilter, difficulty: difficultyFilter }),
        fetchStats(),
        fetchRunHistory()
      ]);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setHistory(histRes.data);
      if (!selectedTask && tasksRes.data.length > 0) {
        setSelectedTask(tasksRes.data[0]);
      }
    } catch (err) {
      console.error('Failed to load EvalStudio state:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, categoryFilter, difficultyFilter]);

  const handleSubmit = async (taskId, code) => {
    setIsSubmitting(true);
    setLastResult(null);
    try {
      const res = await submitCodeRun(taskId, code);
      setLastResult(res.data);
      // Reload stats and history
      const [statsRes, histRes] = await Promise.all([fetchStats(), fetchRunHistory()]);
      setStats(statsRes.data);
      setHistory(histRes.data);
    } catch (err) {
      setLastResult({
        passed: false,
        score: 0.0,
        durationMs: 0,
        message: 'Submission error: ' + err.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <MetricsDashboard stats={stats} />
      <div className="main-layout">
        <TaskList
          tasks={tasks}
          selectedTask={selectedTask}
          onSelectTask={setSelectedTask}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          difficultyFilter={difficultyFilter}
          setDifficultyFilter={setDifficultyFilter}
        />
        <CodeSubmissionForm
          task={selectedTask}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          lastResult={lastResult}
        />
      </div>
      <RunHistoryTable history={history} />
    </div>
  );
}
