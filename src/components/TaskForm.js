import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const taskListRef = useRef(null); // Ref to the task list container

  useEffect(() => {
    // Fetch tasks from the backend with error handling
    fetch('http://localhost:4001/api/tasks')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (taskListRef.current) {
      taskListRef.current.scrollTop = taskListRef.current.scrollHeight;
    }
  }, [tasks]);

  const handleAddTask = () => {
    // Validate form input
    if (!taskName.trim() || !taskDescription.trim()) {
      setError('Both task name and description are required');
      return;
    }

    const newTask = { name: taskName, description: taskDescription };

    fetch('http://localhost:4001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add task');
        }
        return res.json();
      })
      .then((task) => {
        setTasks([task, ...tasks]); // Add the new task
        setTaskName(''); // Clear task name field
        setTaskDescription(''); // Clear task description field
        setError(''); // Clear error message
      })
      .catch((err) => setError(err.message));
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:4001/api/tasks/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete task');
        }
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="app">
      <div className="task-list" ref={taskListRef}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="task-item">
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>
      <div className="task-form">
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
}

export default App;
