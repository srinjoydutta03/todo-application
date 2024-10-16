import React, { useState } from 'react';
import axios from 'axios';

function TodoForm({ fetchTodos }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/private/todos', { title, description }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="todo-form">
      <input type="text" placeholder="Title" value={title}
        onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Description" value={description}
        onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
