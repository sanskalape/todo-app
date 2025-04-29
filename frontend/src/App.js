import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const handleAdd = () => {
    fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(task => setTasks([...tasks, task]));
    setTitle('');
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;