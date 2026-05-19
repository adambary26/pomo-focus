'use client';

import { useState } from 'react';
import { useTimerStore } from '../timer/timer-engine';

export function TasksPanel() {
  const tasks = useTimerStore((s) => s.stats);
  const [tasksList, setTasksList] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (!input.trim()) return;
    setTasksList((prev) => [...prev, { id: Date.now().toString(), text: input.trim(), done: false }]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasksList((prev) => {
      const task = prev.find((t) => t.id === id);
      const wasDone = task?.done;
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));

      if (task && !wasDone) {
        const today = new Date().toISOString().split('T')[0];
        const dailyData = JSON.parse(localStorage.getItem('pomo_daily_tracking') || '{}');
        if (!dailyData[today]) {
          dailyData[today] = { pomodoros: 0, focusMinutes: 0, tasks: 0 };
        }
        dailyData[today].tasks += 1;
        localStorage.setItem('pomo_daily_tracking', JSON.stringify(dailyData));
      }

      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasksList((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="card-title">Tasks</div>
      <div className="task-input-wrap">
        <input
          type="text"
          placeholder="Add task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={addTask}>+</button>
      </div>
      <ul className="task-list">
        {tasksList.length === 0 ? (
          <li className="empty-state">No tasks yet</li>
        ) : (
          tasksList.map((task) => (
            <li key={task.id} className="task-item">
              <span
                className={`task-check${task.done ? ' done' : ''}`}
                onClick={() => toggleTask(task.id)}
              />
              <span className={`task-text${task.done ? ' done' : ''}`}>{task.text}</span>
              <button className="task-del" onClick={() => deleteTask(task.id)}>✕</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
