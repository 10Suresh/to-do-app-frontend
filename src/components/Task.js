// Task.js
import React from 'react';

const Task = ({ task, deleteTask }) => {
  return (
    <li>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    </li>
  );
};

export default Task;
