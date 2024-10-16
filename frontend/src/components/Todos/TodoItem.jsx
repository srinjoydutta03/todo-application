import React, { useState } from 'react';
import axios from 'axios';

function TodoItem({ todo, fetchTodos }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);

  const token = localStorage.getItem('token');

  const handleComplete = async () => {
    try {
      await axios.patch(`/api/private/todos/${todo._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/private/todos/${todo._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/private/todos/${todo._id}`, { title, description }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item">
        <form onSubmit={handleEdit}>
          <input type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} required />
          <input type="text" value={description}
            onChange={(e) => setDescription(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div>
        <h3>{todo.title}</h3>
        <p>{todo.description}</p>
      </div>
      <div className="todo-actions">
        {!todo.completed && <button onClick={handleComplete}>Complete</button>}
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}

export default TodoItem;
